import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CalendarCheck,
  BookOpen,
  Clock,
} from "lucide-react";
import type { StudentDashboard } from "@/types/student";

interface Props {
  data: StudentDashboard;
}

export default function StudentDashboardUI({ data }: Props) {
  const upcoming =
    data.totalBookings - data.completedBookings;

  const completionRate =
    data.totalBookings === 0
      ? 0
      : Math.round(
          (data.completedBookings / data.totalBookings) * 100
        );

  return (
    <div className="container mx-auto space-y-10 px-4 py-10">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Student Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track your sessions and learning progress
        </p>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Bookings"
          value={data.totalBookings}
          icon={BookOpen}
          badge="All time"
        />

        <StatCard
          title="Completed Sessions"
          value={data.completedBookings}
          icon={CalendarCheck}
          badge="Done"
        />

        <StatCard
          title="Upcoming Sessions"
          value={upcoming}
          icon={Clock}
          badge="Pending"
        />
      </div>

      {/* ================= PROGRESS ================= */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Learning Progress
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Completion rate
            </span>
            <span className="font-medium">
              {completionRate}%
            </span>
          </div>

          <Progress value={completionRate} />

          <p className="text-xs text-muted-foreground">
            Based on completed vs total sessions
          </p>
        </CardContent>
      </Card>

      {/* ================= FUTURE SECTION ================= */}
      <Card className="border-dashed">
        <CardContent className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          Recent sessions, tutors, and analytics will appear here.
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= SUB COMPONENT ================= */

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  badge: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  badge,
}: StatCardProps) {
  return (
    <Card className="transition hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold">{value}</div>
          <Badge variant="secondary">{badge}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}