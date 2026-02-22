"use client";

import type { DashboardBooking, BookingStatus } from "@/types/tutor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CalendarDays, TrendingUp, ChevronRight } from "lucide-react";
import { BookingRow } from "./Bookingrow";
import { isUpcoming } from "./Helpers";
// import { BookingRow } from "./BookingRow";
// import { isUpcoming } from "./helpers";

type SessionsPanelProps = {
  bookings: DashboardBooking[];
  onComplete: (id: string) => void;
};

export function SessionsPanel({ bookings, onComplete }: SessionsPanelProps) {
  const upcoming = bookings.filter(isUpcoming);
  const past = bookings.filter((b) => !isUpcoming(b));

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
      <CardHeader className="px-5 pb-0 pt-5">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <TrendingUp className="h-4 w-4 text-primary" />
          Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-3">
        <Tabs defaultValue="upcoming">
          <TabsList className="mx-3 mb-2 h-9">
            <TabsTrigger value="upcoming" className="gap-1.5 text-xs">
              Upcoming
              <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                {upcoming.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="past" className="gap-1.5 text-xs">
              Past
              <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                {past.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* ── Upcoming Tab ── */}
          <TabsContent value="upcoming" className="mt-0">
            {upcoming.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-14 text-muted-foreground">
                <CalendarDays className="h-8 w-8 opacity-30" />
                <p className="text-sm">No upcoming sessions</p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {upcoming.slice(0, 8).map((b) => (
                  <BookingRow key={b.id} booking={b} onComplete={onComplete} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Past Tab ── */}
          <TabsContent value="past" className="mt-0">
            {past.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-14 text-muted-foreground">
                <BookOpen className="h-8 w-8 opacity-30" />
                <p className="text-sm">No past sessions yet</p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {past.slice(0, 8).map((b) => (
                  <BookingRow key={b.id} booking={b} onComplete={onComplete} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {(upcoming.length > 8 || past.length > 8) && (
          <>
            <Separator className="mt-2" />
            <div className="px-4 py-2.5">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary"
                asChild
              >
                <a href="/tutor/sessions">
                  View all sessions
                  <ChevronRight className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}