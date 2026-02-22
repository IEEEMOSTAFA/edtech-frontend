"use client";

// ================= PRESET ICONS =================
const presetIcons = [
  { label: "Math",             icon: "➗" },
  { label: "Physics",          icon: "⚛️" },
  { label: "Machine Learning", icon: "🤖" },
  { label: "AI",               icon: "🧠" },
  { label: "Robotics",         icon: "🦾" },
  { label: "VR",               icon: "🥽" },
  { label: "AWS",              icon: "☁️" },
  { label: "Docker",           icon: "🐳" },
  { label: "JavaScript",       icon: "🟨" },
];

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="space-y-3">

      {/* Preset icon buttons */}
      <div className="flex flex-wrap gap-2">
        {presetIcons.map(({ label, icon }) => (
          <button
            key={label}
            type="button"
            title={label}
            onClick={() => onChange(icon)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border text-sm transition-all cursor-pointer
              ${value === icon
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border bg-muted/40 hover:border-primary/50 hover:bg-muted"
              }`}
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-[10px] text-muted-foreground leading-none">{label}</span>
          </button>
        ))}
      </div>

      {/* Manual input + live preview + clear */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Or paste / type any emoji here... 🎯"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {/* Live preview */}
        {value && (
          <div className="flex items-center justify-center w-10 h-10 rounded-lg border bg-muted text-2xl shrink-0">
            {value}
          </div>
        )}

        {/* Clear */}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-muted-foreground hover:text-destructive underline shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Click a preset or paste any emoji (Windows:{" "}
        <kbd className="px-1 py-0.5 rounded bg-muted border text-xs">Win + .</kbd> / Mac:{" "}
        <kbd className="px-1 py-0.5 rounded bg-muted border text-xs">Ctrl + Cmd + Space</kbd>)
      </p>
    </div>
  );
}