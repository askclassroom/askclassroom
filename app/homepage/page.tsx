export const dynamic = 'force-dynamic';

import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  getHomepageStats,
  getLastAccessedCompanionByUser,
  getUserSessionsWithTranscripts,
} from '@/lib/actions/companion.actions';
import { SessionsList } from '@/components/SessionsList';
import { getSubjectColor } from '@/lib/utils';
import Cta from '@/components/CTA';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(name: string) {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${name}`;
  if (h < 17) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

function formatStreak(n: number) {
  if (n === 0) return '–';
  return `${n} day${n === 1 ? '' : 's'}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

const StatCard = ({
  icon,
  label,
  value,
  gradient,
  iconBg,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  gradient: string;
  iconBg: string;
  delay?: number;
}) => (
  <div
    className="relative overflow-hidden rounded-3xl p-6 flex flex-col gap-4 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group animate-fade-in-up"
    style={{
      background: gradient,
      animationDelay: `${delay}ms`,
      animationFillMode: 'both',
    }}
  >
    {/* Animated background blobs */}
    <div className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/20 animate-pulse-slow" />
    <div className="pointer-events-none absolute -bottom-6 right-10 w-20 h-20 rounded-full bg-white/10 animate-pulse-slower" />
    <div className="pointer-events-none absolute top-1/2 left-1/2 w-40 h-40 rounded-full bg-white/5 blur-3xl -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000" />

    <div
      className="relative h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
      style={{ background: iconBg }}
    >
      {icon}
    </div>
    <div className="relative">
      <p className="text-4xl font-black tracking-tight leading-none mb-1">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-widest opacity-80 flex items-center gap-1">
        {label}
        <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
        </svg>
      </p>
    </div>
  </div>
);

const QuickActionCard = ({
  href,
  icon,
  title,
  description,
  gradient,
  iconBg,
  delay = 0,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
  delay?: number;
}) => (
  <Link
    href={href}
    className="group relative overflow-hidden rounded-2xl p-5 text-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 block animate-fade-in-up"
    style={{
      background: gradient,
      animationDelay: `${delay}ms`,
      animationFillMode: 'both',
    }}
  >
    {/* Animated background */}
    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    <div className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-700" />
    <div className="pointer-events-none absolute -bottom-8 right-8 w-24 h-24 rounded-full bg-white/5 group-hover:scale-150 transition-transform duration-700 delay-100" />

    <div className="relative flex items-center gap-4">
      <div
        className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-bold text-base">{title}</p>
        <p className="text-xs opacity-80">{description}</p>
      </div>
      <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </Link>
);

const ContinueLearningCard = ({
  companion,
  lastAccessed,
  companionId,
}: {
  companion: any;
  lastAccessed: any;
  companionId: string;
}) => (
  <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-2xl group animate-fade-in-up"
    style={{
      background: 'linear-gradient(135deg,#4f46e5,#7c3aed,#c026d3)',
      animationDelay: '200ms',
      animationFillMode: 'both',
    }}
  >
    {/* Animated background elements */}
    <div className="absolute inset-0">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
    </div>

    {/* Content */}
    <div className="relative">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse-slow">
          <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-purple-200 uppercase tracking-widest">Continue Learning</span>
      </div>

      {companion ? (
        <>
          <h2 className="text-2xl font-bold mb-2 group-hover:translate-x-1 transition-transform">{companion.name}</h2>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-semibold">
              {companion.subject}
            </span>
            <span className="text-sm text-purple-100">·</span>
            <p className="text-sm text-purple-100 font-medium">{companion.topic}</p>
          </div>
          {companion.description && (
            <p className="text-sm text-purple-100 italic mb-6 line-clamp-2 border-l-2 border-white/30 pl-3">
              "{companion.description}"
            </p>
          )}

          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-purple-200">Session progress</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full">{lastAccessed?.transcriptLength ?? 0} messages</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${Math.min(100, ((lastAccessed?.transcriptLength ?? 0) / 40) * 100)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>
            <Link
              href={`/companions/${companionId}`}
              className="group/btn inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>Resume</span>
              <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-3">Ready to start learning?</h2>
          <p className="text-purple-100 mb-6">Pick a companion and begin your journey!</p>
          <Link
            href="/companions"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
          >
            Browse Companions
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  </div>
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-indigo-50 to-purple-50">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Main content - Full width */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-[1920px] mx-auto">
          {/* Header */}
          <div className="mb-10 animate-fade-in-down">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3">
              <span className="bg-gradient-to-r from-gray-900 via-indigo-800 to-teal-700 bg-clip-text text-transparent">
                {greeting}
              </span>
              <span className="ml-4 inline-block animate-wave">{emoji}</span>
            </h1>
            <p className="text-lg text-gray-600 font-medium flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-teal-500 rounded-full" />
              Ready to continue your learning journey?
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              gradient="linear-gradient(135deg,#f97316,#ef4444,#f97316)"
              iconBg="rgba(255,255,255,0.3)"
              label="Learning Streak"
              value={formatStreak(stats.learningStreak)}
              delay={100}
              icon={
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path d="M12 6v6l4 2" />
                </svg>
              }
            />
            <StatCard
              gradient="linear-gradient(135deg,#6366f1,#8b5cf6,#d946ef)"
              iconBg="rgba(255,255,255,0.25)"
              label="All-Time Learning"
              value={`${stats.allTimeSessions} session${stats.allTimeSessions === 1 ? '' : 's'}`}
              delay={200}
              icon={
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 7v14" />
                  <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                </svg>
              }
            />
            <StatCard
              gradient="linear-gradient(135deg,#02AAA0,#0284c7,#6366f1)"
              iconBg="rgba(255,255,255,0.25)"
              label="Companions Created"
              value={stats.companionsCreated}
              delay={300}
              icon={
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
            />
          </div>

          {/* Main Grid - Full width layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Continue Learning - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <ContinueLearningCard
                companion={companion}
                lastAccessed={lastAccessed}
                companionId={companionId}
              />
            </div>

            {/* Quick Actions - Right column */}
            <div className="flex flex-col gap-4">
              <QuickActionCard
                href="/ask-doubt"
                icon={
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                  </svg>
                }
                title="Ask a Doubt"
                description="Get instant help with homework"
                gradient="linear-gradient(135deg,#f59e0b,#f97316,#ef4444)"
                iconBg="rgba(255,255,255,0.25)"
                delay={400}
              />
              <QuickActionCard
                href="/practise"
                icon={
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                  </svg>
                }
                title="Quiz & Practice"
                description="Test your knowledge with quizzes"
                gradient="linear-gradient(135deg,#14b8a6,#10b981,#06b6d4)"
                iconBg="rgba(255,255,255,0.25)"
                delay={500}
              />
              {/* <QuickActionCard
                href="/create"
                icon={
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                }
                title="Create Companion"
                description="Design your own learning partner"
                gradient="linear-gradient(135deg,#8b5cf6,#d946ef,#ec4899)"
                iconBg="rgba(255,255,255,0.25)"
                delay={600}
              /> */}
            </div>
          </div>

          {/* Recent Sessions Section */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 flex items-center justify-center text-white shadow-lg">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Recent Learning Sessions</h2>
              {recentSessions.length > 0 && (
                <div className="ml-auto flex items-center gap-3">
                  <span className="text-sm text-gray-500">Total: {recentSessions.length}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span className="text-sm font-medium text-indigo-600">View all →</span>
                </div>
              )}
            </div>

            {/* Sessions List + CTA side by side */}
            <div className="flex gap-6 items-start w-full max-lg:flex-col-reverse max-lg:items-center">
              <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/50 p-6 flex-1 max-lg:w-full">
                <SessionsList sessions={recentSessions} />
              </div>
              <Cta />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;