export const dynamic = 'force-dynamic';

import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  getHomepageStats,
  getLastAccessedCompanionByUser,
  getUserSessionsWithTranscripts,
} from '@/lib/actions/companion.actions';
import { SessionsList } from '@/components/SessionsList';
import Cta from '@/components/CTA';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(name: string) {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${name}`;
  if (h < 17) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

function formatStreak(n: number) {
  if (n === 0) return '0';
  return `${n}`;
}

// ── Glass card primitive ──────────────────────────────────────────────────────

const Glass = ({
  children,
  className = '',
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={`relative overflow-hidden rounded-3xl ${className}`}
    style={{
      background: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.75)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)',
      ...style,
    }}
  >
    {/* subtle inner shine */}
    <div
      className="pointer-events-none absolute inset-0 rounded-3xl"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)',
      }}
    />
    {children}
  </div>
);

// ── Stat Card (glass) ─────────────────────────────────────────────────────────

const StatCard = ({
  icon,
  label,
  value,
  accent,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: string;   // a single accent colour used for the icon badge & value text
  delay?: number;
}) => (
  <Glass
    className="p-6 flex items-center gap-5 group cursor-default hp-fade-up"
    style={{ animationDelay: `${delay}ms` } as React.CSSProperties}
  >
    {/* icon badge */}
    <div
      className="h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
      style={{ background: `${accent}18` }}
    >
      <div style={{ color: accent }}>{icon}</div>
    </div>

    <div>
      <p className="text-3xl font-black tracking-tight" style={{ color: accent }}>
        {value}
      </p>
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mt-0.5">
        {label}
      </p>
    </div>

    {/* accent corner dot */}
    <div
      className="pointer-events-none absolute top-4 right-4 w-2 h-2 rounded-full opacity-50"
      style={{ background: accent }}
    />
  </Glass>
);

// ── Quick Action Card (glass) ────────────────────────────────────────────────

const QuickActionCard = ({
  href,
  icon,
  title,
  description,
  accent,
  delay = 0,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
  delay?: number;
}) => (
  <Link href={href} className="hp-fade-up block" style={{ animationDelay: `${delay}ms` } as React.CSSProperties}>
    <Glass className="p-5 group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* shimmer on hover */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      <div className="relative flex items-center gap-4">
        <div
          className="h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{ background: `${accent}18` }}
        >
          <div style={{ color: accent }}>{icon}</div>
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-800">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
        <svg
          className="w-4 h-4 text-gray-300 -translate-x-1 group-hover:translate-x-0 group-hover:text-gray-500 transition-all duration-300"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Glass>
  </Link>
);

// ── Continue Learning Card (glass with accent strip) ─────────────────────────

const ContinueLearningCard = ({
  companion,
  lastAccessed,
  companionId,
}: {
  companion: any;
  lastAccessed: any;
  companionId: string;
}) => (
  <Glass className="p-7 group hp-fade-up" style={{ animationDelay: '200ms' } as React.CSSProperties}>
    {/* top accent strip */}
    <div
      className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
      style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#02AAA0)' }}
    />

    <div className="relative pt-2">
      {/* label */}
      <div className="flex items-center gap-2 mb-5">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.12)' }}
        >
          <svg className="h-4 w-4" style={{ color: '#6366f1' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
          </svg>
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">
          Continue Learning
        </span>
      </div>

      {companion ? (
        <>
          <h2 className="text-2xl font-black text-gray-800 mb-2 group-hover:translate-x-1 transition-transform duration-300">
            {companion.name}
          </h2>

          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full capitalize"
              style={{
                background: 'rgba(99,102,241,0.10)',
                color: '#6366f1',
              }}
            >
              {companion.subject}
            </span>
            <span className="text-gray-300">·</span>
            <p className="text-sm text-gray-500 font-medium truncate">{companion.topic}</p>
          </div>

          {companion.description && (
            <p className="text-sm text-gray-400 italic mb-6 line-clamp-2 border-l-2 pl-3" style={{ borderColor: '#6366f130' }}>
              &ldquo;{companion.description}&rdquo;
            </p>
          )}

          <div className="flex items-center gap-4 mt-2">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-medium mb-2 text-gray-400">
                <span>Session progress</span>
                <span>{lastAccessed?.transcriptLength ?? 0} messages</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out relative"
                  style={{
                    width: `${Math.min(100, ((lastAccessed?.transcriptLength ?? 0) / 40) * 100)}%`,
                    background: 'linear-gradient(90deg,#6366f1,#02AAA0)',
                  }}
                />
              </div>
            </div>
            <Link
              href={`/companions/${companionId}`}
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-2.5 rounded-xl text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
            >
              Resume
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <div className="h-16 w-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.08)' }}>
            <svg className="h-8 w-8 text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Ready to start learning?</h2>
          <p className="text-gray-400 text-sm mb-6">Pick a companion and begin your journey!</p>
          <Link
            href="/companions"
            className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-2.5 rounded-xl text-white"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
          >
            Browse Companions
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  </Glass>
);

// ── Main Page ────────────────────────────────────────────────────────────────

const HomePage = async () => {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const firstName = user.firstName ?? 'Learner';
  const greeting = getGreeting(firstName);
  const currentHour = new Date().getHours();
  const emoji = currentHour < 12 ? '☀️' : currentHour < 17 ? '👋' : '🌙';

  const [stats, lastAccessed, rawSessions] = await Promise.all([
    getHomepageStats(user.id),
    getLastAccessedCompanionByUser(user.id),
    getUserSessionsWithTranscripts(user.id, 20),
  ]);

  const recentSessions = rawSessions
    .filter((s) => Array.isArray(s.transcript) && s.transcript.length > 0)
    .slice(0, 10);

  const companion = lastAccessed?.companion as any;
  const companionId = companion?.id;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#f0fdfb 0%,#eef2ff 50%,#faf5ff 100%)' }}>

      {/* ── Ambient background blobs ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 hp-blob"
          style={{ background: 'radial-gradient(circle,#02AAA0,transparent 70%)' }} />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20 hp-blob hp-blob-delay-2"
          style={{ background: 'radial-gradient(circle,#8b5cf6,transparent 70%)' }} />
        <div className="absolute top-1/3 left-1/2 w-72 h-72 rounded-full opacity-15 hp-blob hp-blob-delay-4"
          style={{ background: 'radial-gradient(circle,#6366f1,transparent 70%)' }} />
        {/* grid dot overlay */}
        <div className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(rgba(99,102,241,0.12) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative w-full max-w-6xl mx-auto px-6 sm:px-10 py-10 pb-20">

        {/* ── Greeting ── */}
        <div className="mb-10 hp-fade-down">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-2">
            <span
              style={{
                background: 'linear-gradient(135deg,#1e1b4b 0%,#4338ca 50%,#02AAA0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {greeting}
            </span>
            {' '}
            <span className="inline-block hp-wave">{emoji}</span>
          </h1>
          <p className="text-base text-gray-500 font-medium flex items-center gap-2">
            <span className="inline-block w-6 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg,#6366f1,#02AAA0)' }} />
            Ready to continue your learning journey?
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Learning Streak"
            value={`${formatStreak(stats.learningStreak)} day${stats.learningStreak === 1 ? '' : 's'}`}
            accent="#f97316"
            delay={100}
            icon={
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            }
          />
          <StatCard
            label="All-Time Sessions"
            value={stats.allTimeSessions}
            accent="#6366f1"
            delay={200}
            icon={
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
              </svg>
            }
          />
          <StatCard
            label="Companions Created"
            value={stats.companionsCreated}
            accent="#02AAA0"
            delay={300}
            icon={
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
        </div>

        {/* ── Feature Grid : Continue Learning + Quick Actions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Continue Learning — 2 cols */}
          <div className="lg:col-span-2">
            <ContinueLearningCard
              companion={companion}
              lastAccessed={lastAccessed}
              companionId={companionId}
            />
          </div>

          {/* Quick Actions — 1 col */}
          <div className="flex flex-col gap-4">
            <QuickActionCard
              href="/ask-doubt"
              title="Ask a Doubt"
              description="Get instant help with homework"
              accent="#f97316"
              delay={400}
              icon={
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
              }
            />
            <QuickActionCard
              href="/practise"
              title="Quiz & Practice"
              description="Test your knowledge with quizzes"
              accent="#02AAA0"
              delay={500}
              icon={
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                </svg>
              }
            />
          </div>
        </div>

        {/* ── Recent Sessions + CTA ── */}
        <div className="hp-fade-up flex gap-6 items-start w-full max-lg:flex-col max-lg:items-stretch" style={{ animationDelay: '600ms' }}>
          {/* Sessions list */}
          <Glass className="flex-1 p-6">
            {/* section header */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(99,102,241,0.10)' }}
              >
                <svg className="h-4 w-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Recent Sessions</h2>
              {recentSessions.length > 0 && (
                <span
                  className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(99,102,241,0.10)', color: '#6366f1' }}
                >
                  {recentSessions.length}
                </span>
              )}
            </div>
            <SessionsList sessions={recentSessions} />
          </Glass>

          {/* CTA */}
          <Cta />
        </div>

      </div>
    </div>
  );
};

export default HomePage;