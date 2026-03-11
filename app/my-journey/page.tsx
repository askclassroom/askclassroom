import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getUserCompanions,
  getUserSessionsWithTranscripts,
} from "@/lib/actions/companion.actions";
import Image from "next/image";
import CompanionsList from "@/components/CompanionsList";
import { SessionsList } from "@/components/SessionsList";
import { getUserQuizzes } from "@/lib/actions/quiz.actions";
import { QuizzesList } from "@/components/QuizzesList";
import { getUserProfile } from "@/lib/actions/user.actions";
import EditProfileDialog from "@/components/EditProfileDialog";

// ── Stat pill ────────────────────────────────────────────────────────────────
const StatPill = ({
  icon,
  label,
  value,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  gradient: string;
}) => (
  <div
    className="flex flex-col items-center gap-1.5 rounded-2xl p-4 text-white min-w-[110px]"
    style={{
      background: gradient,
      boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
    }}
  >
    <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
      {icon}
    </div>
    <p className="text-2xl font-extrabold tracking-tight leading-none">{value}</p>
    <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80 text-center">{label}</p>
  </div>
);

// ── Glass accordion wrapper ──────────────────────────────────────────────────
const GlassAccordionItem = ({
  value,
  trigger,
  children,
}: {
  value: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
}) => (
  <AccordionItem
    value={value}
    className="mb-3 rounded-2xl overflow-hidden border-0"
    style={{
      background: "rgba(255,255,255,0.70)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      border: "1px solid rgba(255,255,255,0.85)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    }}
  >
    <AccordionTrigger className="px-5 py-4 text-lg font-bold text-gray-800 hover:no-underline hover:bg-white/40 transition-colors rounded-2xl">
      {trigger}
    </AccordionTrigger>
    <AccordionContent className="px-5 pb-5">
      {children}
    </AccordionContent>
  </AccordionItem>
);

// ── Page ─────────────────────────────────────────────────────────────────────
const Profile = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const [companions, rawSessions, userQuizzes, userProfile] = await Promise.all([
    getUserCompanions(user.id),
    getUserSessionsWithTranscripts(user.id, 30),
    getUserQuizzes(user.id, 10),
    getUserProfile(),
  ]);

  // Only sessions with actual transcript content
  const sessionsWithTranscripts = rawSessions.filter(
    (s) => Array.isArray(s.transcript) && s.transcript.length > 0
  );

  return (
    <main
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg,#F0FBFA 0%,#EBF7FF 60%,#F4F0FF 100%)",
      }}
    >
      {/* Ambient blobs */}
      <div
        className="pointer-events-none fixed -top-32 -left-32 w-[400px] h-[400px] opacity-30 rounded-full"
        style={{ background: "radial-gradient(circle,#02AAA040,transparent 70%)", zIndex: 0 }}
      />
      <div
        className="pointer-events-none fixed -bottom-32 -right-16 w-[380px] h-[380px] opacity-25 rounded-full"
        style={{ background: "radial-gradient(circle,#818cf840,transparent 70%)", zIndex: 0 }}
      />

      <div
        className="relative mx-auto max-w-4xl px-6 sm:px-10 pt-10 pb-20 flex flex-col gap-8"
        style={{ zIndex: 1 }}
      >

        {/* ── Profile Header ── */}
        <div
          className="flex flex-col sm:flex-row items-center sm:items-start gap-5 rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.85)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Image
              src={user.imageUrl}
              alt={user.firstName!}
              width={96}
              height={96}
              className="rounded-2xl object-cover shadow-md"
            />
            <div
              className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg,#02AAA0,#0284c7)" }}
            >
              ✓
            </div>
          </div>

          {/* Name / email */}
          <div className="flex-1 text-center sm:text-left flex flex-col justify-center sm:justify-start items-center sm:items-start gap-2">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">
                {userProfile?.name || `${user.firstName} ${user.lastName}`}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {user.emailAddresses[0].emailAddress}
              </p>
            </div>
            <EditProfileDialog initialData={userProfile} />
          </div>

          {/* Stat pills */}
          <div className="flex gap-3 flex-wrap justify-center">
            <StatPill
              gradient="linear-gradient(135deg,#6366f1,#8b5cf6)"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                </svg>
              }
              label="Lessons"
              value={sessionsWithTranscripts.length}
            />
            <StatPill
              gradient="linear-gradient(135deg,#02AAA0,#0284c7)"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
              label="Companions"
              value={companions.length}
            />
          </div>
        </div>

        {/* ── Accordion Sections ── */}
        <Accordion type="multiple" defaultValue={["sessions"]}>
          <GlassAccordionItem
            value="sessions"
            trigger={
              <span className="flex items-center gap-2">
                <span
                  className="inline-flex h-6 w-6 rounded-lg items-center justify-center text-white text-xs"
                  style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                >
                  {sessionsWithTranscripts.length}
                </span>
                Recent Sessions with Transcripts
              </span>
            }
          >
            <SessionsList sessions={sessionsWithTranscripts} />
          </GlassAccordionItem>

          <GlassAccordionItem
            value="companions"
            trigger={
              <span className="flex items-center gap-2">
                <span
                  className="inline-flex h-6 w-6 rounded-lg items-center justify-center text-white text-xs"
                  style={{ background: "linear-gradient(135deg,#02AAA0,#0284c7)" }}
                >
                  {companions.length}
                </span>
                My Companions
              </span>
            }
          >
            <CompanionsList title="My Companions" companions={companions} />
          </GlassAccordionItem>

          <GlassAccordionItem
            value="quizzes"
            trigger={
              <span className="flex items-center gap-2">
                <span
                  className="inline-flex h-6 w-6 rounded-lg items-center justify-center text-white text-xs"
                  style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)" }}
                >
                  {userQuizzes.length}
                </span>
                My Quiz Results
              </span>
            }
          >
            <QuizzesList quizzes={userQuizzes} />
          </GlassAccordionItem>
        </Accordion>
      </div>
    </main>
  );
};

export default Profile;