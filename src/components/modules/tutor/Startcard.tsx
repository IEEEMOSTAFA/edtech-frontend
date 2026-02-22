import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
  iconClass: string;
};

export function StatCard({ label, value, icon: Icon, sub, iconClass }: StatCardProps) {
  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
      <CardContent className="pb-5 pt-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {label}
            </p>
            <p className="text-3xl font-black tracking-tight">{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className={`rounded-xl p-2.5 ${iconClass}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}