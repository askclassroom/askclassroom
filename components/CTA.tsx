import Link from "next/link";

const Cta = () => {
    return (
        <div
            className="relative overflow-hidden rounded-3xl flex-shrink-0 w-full lg:w-80"
            style={{
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow:
                    "0 8px 32px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
        >
            {/* inner shine */}
            <div
                className="pointer-events-none absolute inset-0 rounded-3xl"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)",
                }}
            />

            {/* top accent strip */}
            <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                style={{
                    background: "linear-gradient(90deg,#02AAA0,#6366f1,#8b5cf6)",
                }}
            />

            <div className="relative p-7 pt-9 flex flex-col h-full">
                {/* badge */}
                <div className="mb-5">
                    <span
                        className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                        style={{
                            background: "rgba(2,170,160,0.12)",
                            color: "#02AAA0",
                        }}
                    >
                        Start learning your way
                    </span>
                </div>

                {/* heading */}
                <h2
                    className="text-xl font-black tracking-tight leading-snug mb-3"
                    style={{
                        background:
                            "linear-gradient(135deg,#1e1b4b 0%,#4338ca 50%,#02AAA0 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    Build &amp; Personalize Your Learning Companion
                </h2>

                {/* description */}
                <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
                    Pick a name, subject, voice &amp; personality — and start learning
                    through voice conversations that feel natural and fun.
                </p>

                {/* decorative icon blob */}
                <div
                    className="absolute right-6 top-12 w-20 h-20 rounded-2xl flex items-center justify-center opacity-30 pointer-events-none"
                    style={{ background: "rgba(99,102,241,0.10)" }}
                >
                    <svg
                        className="w-10 h-10"
                        style={{ color: "#6366f1" }}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                </div>

                {/* CTA button */}
                <Link
                    href="/companions/new"
                    className="group relative overflow-hidden inline-flex items-center gap-2 w-full justify-center font-semibold text-sm px-6 py-3 rounded-xl text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    style={{
                        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    }}
                >
                    {/* shimmer on hover */}
                    <span className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </span>
                    <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Build a New Companion
                </Link>
            </div>
        </div>
    );
};

export default Cta;