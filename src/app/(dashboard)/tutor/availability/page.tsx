"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { AvailabilitySlot } from "@/types/tutor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS = [
  { label: "Sunday", short: "Sun", value: 0 },
  { label: "Monday", short: "Mon", value: 1 },
  { label: "Tuesday", short: "Tue", value: 2 },
  { label: "Wednesday", short: "Wed", value: 3 },
  { label: "Thursday", short: "Thu", value: 4 },
  { label: "Friday", short: "Fri", value: 5 },
  { label: "Saturday", short: "Sat", value: 6 },
];

const DEFAULT_SLOT: Omit<AvailabilitySlot, "id"> = {
  dayOfWeek: 1,
  startTime: "09:00",
  endTime: "17:00",
  isAvailable: true,
};

// ─── Types ────────────────────────────────────────────────────────────────────

// Local slot with a temp id for React key management
type LocalSlot = AvailabilitySlot & { _tempId: string };

type Toast = { type: "success" | "error"; message: string } | null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeTempId() {
  return Math.random().toString(36).slice(2);
}

function toLocal(slot: AvailabilitySlot): LocalSlot {
  return { ...slot, _tempId: slot.id ?? makeTempId() };
}

function toDuration(start: string, end: string): string {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins <= 0) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return [h && `${h}h`, m && `${m}m`].filter(Boolean).join(" ");
}

// ─── SlotRow ─────────────────────────────────────────────────────────────────

function SlotRow({
  slot,
  onChange,
  onRemove,
}: {
  slot: LocalSlot;
  onChange: (updated: LocalSlot) => void;
  onRemove: () => void;
}) {
  const day = DAYS.find((d) => d.value === slot.dayOfWeek);
  const duration = toDuration(slot.startTime, slot.endTime);
  const isAvailable = slot.isAvailable !== false;

  return (
    <div
      className={`group relative flex flex-col gap-3 rounded-xl border p-4 transition-all sm:flex-row sm:items-center sm:gap-4 ${isAvailable
          ? "border-border/50 bg-card/60"
          : "border-border/30 bg-muted/20 opacity-60"
        }`}
    >
      {/* Day selector */}
      <div className="flex items-center gap-2 sm:w-36">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary">
          {day?.short ?? "?"}
        </div>
        <select
          value={slot.dayOfWeek}
          onChange={(e) => onChange({ ...slot, dayOfWeek: Number(e.target.value) })}
          className="flex-1 rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {DAYS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {/* Times */}
      <div className="flex flex-1 items-center gap-2">
        <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Input
          type="time"
          value={slot.startTime}
          onChange={(e) => onChange({ ...slot, startTime: e.target.value })}
          className="h-8 w-28 text-sm"
        />
        <span className="text-xs text-muted-foreground">to</span>
        <Input
          type="time"
          value={slot.endTime}
          onChange={(e) => onChange({ ...slot, endTime: e.target.value })}
          className="h-8 w-28 text-sm"
        />
        {duration !== "—" && (
          <Badge variant="secondary" className="ml-1 text-xs shrink-0">
            {duration}
          </Badge>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange({ ...slot, isAvailable: !isAvailable })}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          title={isAvailable ? "Mark unavailable" : "Mark available"}
        >
          {isAvailable ? (
            <ToggleRight className="h-4 w-4 text-emerald-500" />
          ) : (
            <ToggleLeft className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{isAvailable ? "Active" : "Off"}</span>
        </button>

        <button
          type="button"
          onClick={onRemove}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-rose-500/10 hover:text-rose-500"
          title="Remove slot"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Weekly Summary ───────────────────────────────────────────────────────────

function WeeklySummary({ slots }: { slots: LocalSlot[] }) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {DAYS.map((day) => {
        const daySlots = slots.filter(
          (s) => s.dayOfWeek === day.value && s.isAvailable !== false
        );
        return (
          <div key={day.value} className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {day.short}
            </span>
            <div
              className={`h-2 w-full rounded-full transition-colors ${daySlots.length > 0 ? "bg-primary" : "bg-muted"
                }`}
            />
            {daySlots.length > 0 && (
              <span className="text-[10px] text-muted-foreground">{daySlots.length}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<LocalSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  // ── Load existing availability ──
  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch<{ data: AvailabilitySlot[] }>("/api/tutors/availability");
        setSlots((res.data ?? []).map(toLocal));
      } catch {
        // Start with empty if load fails — not a hard error
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Auto-dismiss toast ──
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
  }

  // ── Slot CRUD ──
  function addSlot() {
    setSlots((prev) => [
      ...prev,
      { ...DEFAULT_SLOT, id: "", _tempId: makeTempId() },
    ]);
  }

  function updateSlot(tempId: string, updated: LocalSlot) {
    setSlots((prev) => prev.map((s) => (s._tempId === tempId ? updated : s)));
  }

  function removeSlot(tempId: string) {
    setSlots((prev) => prev.filter((s) => s._tempId !== tempId));
  }

  // ── Save ──
  async function handleSubmit() {
    setSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const payload = slots.map(({ _tempId, ...rest }) => rest);
      await apiFetch("/api/tutors/availability", {
        method: "PUT",
        body: JSON.stringify({ slots: payload }),
      });
      showToast("success", "Availability saved successfully!");
    } catch {
      showToast("error", "Failed to save availability. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const activeSlots = slots.filter((s) => s.isAvailable !== false);

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm tracking-wide">Loading availability…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">

        {/* ── Toast ── */}
        {toast && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${toast.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-rose-500/30 bg-rose-500/10 text-rose-400"
              }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            {toast.message}
          </div>
        )}

        {/* ── Header ── */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Tutor Settings
            </p>
            <h1 className="mt-1.5 text-3xl font-black tracking-tight">Availability</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Set the days and times when students can book sessions with you.
            </p>
          </div>
          <Button onClick={addSlot} variant="outline" size="sm" className="shrink-0 gap-2">
            <Plus className="h-4 w-4" />
            Add Slot
          </Button>
        </div>

        <div className="space-y-5">

          {/* ── Weekly summary ── */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-3 pt-5">
              <CardTitle className="flex items-center justify-between gap-2 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  Weekly Overview
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {activeSlots.length} active slot{activeSlots.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5 pb-5">
              <WeeklySummary slots={slots} />
              {slots.length === 0 && (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  No slots added yet. Click <Button>Add Slot</Button> to get started.
                </p>
              )}
            </CardContent>
          </Card>

          {/* ── Slots list ── */}
          {slots.length > 0 && (
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-3 pt-5">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  Time Slots
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="space-y-2.5 pt-5 pb-5">
                {slots.map((slot) => (
                  <SlotRow
                    key={slot._tempId}
                    slot={slot}
                    onChange={(updated) => updateSlot(slot._tempId, updated)}
                    onRemove={() => removeSlot(slot._tempId)}
                  />
                ))}

                {/* Inline add button */}
                <button
                  type="button"
                  onClick={addSlot}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground transition hover:border-primary/50 hover:text-primary"
                >
                  <Plus className="h-4 w-4" />
                  Add another slot
                </button>
              </CardContent>
            </Card>
          )}

          {/* ── Quick-fill presets ── */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-3 pt-5">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Quick Presets
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 pb-5">
              <p className="mb-3 text-xs text-muted-foreground">
                Quickly fill a common weekly schedule:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    label: "Weekdays 9–5",
                    slots: [1, 2, 3, 4, 5].map((d) => ({
                      dayOfWeek: d, startTime: "09:00", endTime: "17:00", isAvailable: true, id: "", _tempId: makeTempId(),
                    })),
                  },
                  {
                    label: "Evenings (M–F)",
                    slots: [1, 2, 3, 4, 5].map((d) => ({
                      dayOfWeek: d, startTime: "18:00", endTime: "21:00", isAvailable: true, id: "", _tempId: makeTempId(),
                    })),
                  },
                  {
                    label: "Weekends",
                    slots: [0, 6].map((d) => ({
                      dayOfWeek: d, startTime: "10:00", endTime: "15:00", isAvailable: true, id: "", _tempId: makeTempId(),
                    })),
                  },
                ].map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setSlots(preset.slots)}
                  >
                    {preset.label}
                  </Button>
                ))}
                {slots.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-rose-500 hover:bg-rose-500/10 hover:text-rose-500"
                    onClick={() => setSlots([])}
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ── Save ── */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              Students will see your availability when booking a session.
            </p>
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="min-w-[130px] gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}