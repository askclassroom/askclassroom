'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';

const PING_INTERVAL = 60000; // 1 minute
const IDLE_TIMEOUT = 120000; // 2 minutes

export function ActivityTracker() {
    const { userId } = useAuth();

    const lastActiveRef = useRef(Date.now());
    const isIdleRef = useRef(false);
    const isHiddenRef = useRef(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!userId) return;

        // --- 1. Tracking Active Time via Pings ---
        const sendPing = async () => {
            if (isIdleRef.current || isHiddenRef.current) return;
            try {
                await fetch('/api/tracking/ping', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                });
            } catch (e) {
                console.error('Failed to send activity ping', e);
            }
        };

        sendPing();
        intervalRef.current = setInterval(sendPing, PING_INTERVAL);

        // --- 2. Idle Detection ---
        const resetIdle = () => {
            lastActiveRef.current = Date.now();
            if (isIdleRef.current) isIdleRef.current = false;
        };

        const checkIdle = setInterval(() => {
            if (Date.now() - lastActiveRef.current > IDLE_TIMEOUT) {
                isIdleRef.current = true;
            }
        }, 10000);

        const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        activityEvents.forEach(event => document.addEventListener(event, resetIdle));

        // --- 3. Distraction / Exit Detection ---
        const pendingTabSwitchRef = { current: null as NodeJS.Timeout | null };

        const logExit = (exitType: string, isImmediate: boolean = false) => {
            const url = '/api/tracking/exit';
            const data = JSON.stringify({ userId, exitType, path: window.location.pathname, isImmediate });

            if (navigator.sendBeacon) {
                navigator.sendBeacon(url, data);
            } else {
                fetch(url, { method: 'POST', body: data, keepalive: true }).catch(() => { });
            }
        };

        const maybeClearReloadExit = () => { };
        maybeClearReloadExit();

        const handleVisibilityChange = () => {
            if (document.hidden) {
                isHiddenRef.current = true;
                pendingTabSwitchRef.current = setTimeout(() => {
                    if (isHiddenRef.current) {
                        logExit('tab_switch_or_hide', false);
                    }
                }, 30000);
            } else {
                isHiddenRef.current = false;
                if (pendingTabSwitchRef.current) {
                    clearTimeout(pendingTabSwitchRef.current);
                    pendingTabSwitchRef.current = null;
                }
                resetIdle();
            }
        };

        const handlePageHide = () => {
            // Unload/reload. We must send immediately and let the server 
            // wait 30s to see if they reconnect (ping).
            logExit('tab_close_or_navigate', true);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pagehide', handlePageHide);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (pendingTabSwitchRef.current) clearTimeout(pendingTabSwitchRef.current);
            clearInterval(checkIdle);
            activityEvents.forEach(event => document.removeEventListener(event, resetIdle));
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pagehide', handlePageHide);
        };
    }, [userId]);

    return null;
}
