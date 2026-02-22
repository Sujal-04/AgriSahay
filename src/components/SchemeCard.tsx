import { SchemeRecommendation } from "@/types/farmer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoringBreakdownChart } from "@/components/ScoringBreakdownChart";
import { CheckCircle2, AlertCircle, ExternalLink, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface SchemeCardProps {
  recommendation: SchemeRecommendation;
  rank?: number;
  compact?: boolean;
}

export function SchemeCard({ recommendation, rank = 0, compact = false }: SchemeCardProps) {
  const { language, t } = useLanguage();
  const { scheme, totalScore, confidenceScore, scoring, reasons, missingCriteria, eligible } = recommendation;
  const isTop = rank === 0;
  const [expanded, setExpanded] = useState(isTop && !compact);

  if (compact) {
    return (
      <div className="card-scheme border-border bg-card p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="text-sm font-bold font-heading text-foreground">
              {scheme.name[language]}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">{scheme.description[language]}</p>
          </div>
          <div className="text-right ml-2">
            <div className="text-lg font-bold text-primary">{totalScore}%</div>
          </div>
        </div>
        <Button
          size="sm"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
          onClick={() => window.open(scheme.applicationUrl, "_blank")}
        >
          {t.recommendations.apply}
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`card-scheme animate-fade-up ${
        isTop
          ? "border-secondary bg-secondary/5 shadow-lg"
          : "border-border bg-card"
      }`}
      style={{ animationDelay: `${rank * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {isTop && (
              <Badge className="bg-secondary text-secondary-foreground">
                <Star className="h-3 w-3 mr-1" />
                {t.recommendations.topMatch}
              </Badge>
            )}
            <Badge
              variant={eligible ? "default" : "outline"}
              className={eligible ? "bg-success text-success-foreground" : "text-warning border-warning"}
            >
              {eligible ? t.recommendations.eligible : t.recommendations.partiallyEligible}
            </Badge>
          </div>
          <h3 className="text-xl font-bold font-heading text-foreground">
            {scheme.name[language]}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{scheme.ministry}</p>
        </div>
        <div className="text-right ml-4">
          <div className="text-3xl font-bold text-primary">{totalScore}%</div>
          <div className="text-xs text-muted-foreground">{t.recommendations.confidence}: {confidenceScore}%</div>
        </div>
      </div>

      {/* Score bar */}
      <div className="w-full bg-muted rounded-full h-3 mb-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${totalScore}%`,
            background: totalScore >= 80
              ? "hsl(var(--success))"
              : totalScore >= 50
              ? "hsl(var(--warning))"
              : "hsl(var(--destructive))",
          }}
        />
      </div>

      <p className="text-foreground mb-4">{scheme.description[language]}</p>

      {/* Benefits */}
      <div className="bg-success/10 rounded-xl p-4 mb-4">
        <h4 className="font-bold text-sm text-success mb-1">{t.recommendations.benefits}</h4>
        <p className="text-sm text-foreground">{scheme.benefits[language]}</p>
      </div>

      {/* Expandable scoring breakdown */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-semibold text-primary mb-3 hover:underline"
      >
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        Scoring Breakdown
      </button>

      {expanded && (
        <div className="space-y-4 mb-4 animate-scale-in">
          <ScoringBreakdownChart scoring={scoring} />

          {reasons.length > 0 && (
            <div>
              <h4 className="font-bold text-sm text-foreground mb-2">{t.recommendations.whyEligible}</h4>
              <ul className="space-y-1">
                {reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {missingCriteria.length > 0 && (
            <div>
              <h4 className="font-bold text-sm text-foreground mb-2">{t.recommendations.missing}</h4>
              <ul className="space-y-1">
                {missingCriteria.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Documents */}
      <div className="mb-4">
        <h4 className="font-bold text-sm text-foreground mb-2">{t.recommendations.documents}</h4>
        <div className="flex flex-wrap gap-2">
          {scheme.documents.map((doc) => (
            <Badge key={doc} variant="outline" className="text-xs">{doc}</Badge>
          ))}
        </div>
      </div>

      <Button
        className="btn-rural w-full bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={() => window.open(scheme.applicationUrl, "_blank")}
      >
        {t.recommendations.apply}
        <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
