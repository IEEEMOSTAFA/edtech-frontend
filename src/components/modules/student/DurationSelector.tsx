import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";

const DURATION_OPTIONS = [
  { label: "30 min", value: 30, sublabel: "Quick" },
  { label: "1 hr", value: 60, sublabel: "Standard" },
  { label: "1.5 hr", value: 90, sublabel: "Extended" },
  { label: "2 hr", value: 120, sublabel: "Deep Dive" },
] as const;

interface DurationSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function DurationSelector({ value, onChange }: DurationSelectorProps) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
        Duration
      </Label>
      <div className="grid grid-cols-4 gap-2">
        {DURATION_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`relative flex flex-col items-center justify-center h-14 rounded-xl border text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]"
                  : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <span className="font-semibold leading-tight">{opt.label}</span>
              <span
                className={`text-[10px] font-normal leading-tight mt-0.5 ${
                  isSelected ? "text-primary-foreground/70" : "text-muted-foreground/60"
                }`}
              >
                {opt.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}