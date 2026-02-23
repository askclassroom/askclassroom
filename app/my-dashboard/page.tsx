import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getStudentDashboardData } from "@/lib/actions/dashboard.actions";
import StudentDashboardClient from "@/components/StudentDashboardClient";

const StudentDashboardPage = async () => {
    const user = await currentUser();

    if (!user) redirect("/sign-in");

    const dashboardData = await getStudentDashboardData();

    return (
        <main className="px-4 md:px-14 py-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">My Learning Dashboard</h1>
                    <p className="text-lg text-muted-foreground">
                        Track your progress and learning journey
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-4xl border border-black px-4 py-2">
                    <div className="w-10 h-10 rounded-full bg-cta-gold flex items-center justify-center text-black font-bold text-xl">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <div>
                        <p className="font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-muted-foreground">Student</p>
                    </div>
                </div>
            </div>

            <StudentDashboardClient data={dashboardData} />
        </main>
    );
};

export default StudentDashboardPage;