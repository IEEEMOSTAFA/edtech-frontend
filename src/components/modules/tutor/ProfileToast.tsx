import { CheckCircle2, AlertCircle } from "lucide-react";

export type Toast = { type: "success" | "error"; message: string } | null;

export function ProfileToast({ toast }: { toast: Toast }) {
  if (!toast) return null;

  return (
    <div
      className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
        toast.type === "success"
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
  );
}