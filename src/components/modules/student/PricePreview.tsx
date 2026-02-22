import { DollarSign, TrendingUp } from "lucide-react";

interface PricePreviewProps {
  price: string;
  duration: number;
  hourlyRate: number;
}

export function PricePreview({ price, duration, hourlyRate }: PricePreviewProps) {
  const hours = duration / 60;
  const breakdown = `${hours % 1 === 0 ? hours : hours.toFixed(1)} hr${hours !== 1 ? "s" : ""} × $${hourlyRate}/hr`;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary/8 via-primary/5 to-transparent border border-primary/15 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-[10px] font-semibold text-primary/70 uppercase tracking-widest mb-0.5">
            Estimated Total
          </p>
          <div className="flex items-end gap-1.5">
            <span className="text-4xl font-black tracking-tighter text-foreground">${price}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{breakdown}</p>
        </div>

        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
            <DollarSign className="w-7 h-7 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-2.5 h-2.5 text-white" />
          </div>
        </div>
      </div>

      {/* Progress bar showing duration */}
      <div className="px-5 pb-4">
        <div className="flex gap-1">
          {[30, 60, 90, 120].map((step) => (
            <div
              key={step}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                duration >= step ? "bg-primary" : "bg-primary/15"
              }`}
            />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-right">{duration} min session</p>
      </div>
    </div>
  );
}