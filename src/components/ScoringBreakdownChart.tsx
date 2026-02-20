import { ScoringBreakdown } from "@/types/farmer";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  scoring: ScoringBreakdown[];
}

export function ScoringBreakdownChart({ scoring }: Props) {
  return (
    <div className="space-y-2">
      {scoring.map((s) => (
        <div key={s.criterion} className="flex items-center gap-3">
          <div className="w-24 text-xs font-semibold text-muted-foreground truncate">{s.criterion}</div>
          <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.round(s.score * 100)}%`,
                background: s.met
                  ? "hsl(var(--success))"
                  : s.score > 0.5
                  ? "hsl(var(--warning))"
                  : "hsl(var(--destructive))",
              }}
            />
          </div>
          <div className="w-10 text-xs font-bold text-right text-foreground">
            {Math.round(s.score * 100)}%
          </div>
        </div>
      ))}
    </div>
  );
}
