import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { FarmerProfile } from "@/types/farmer";
import { RecommendationService } from "@/services/RecommendationService";
import { ProfileService } from "@/services/ProfileService";
import { SchemeCard } from "@/components/SchemeCard";
import { SyncIndicator } from "@/components/SyncIndicator";
import { Button } from "@/components/ui/button";
import { UserCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function Recommendations() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [showRejected, setShowRejected] = useState(false);

  const profile = useMemo(() => ProfileService.get(), []);

  const allRecommendations = useMemo(
    () => (profile ? RecommendationService.getAll(profile) : []),
    [profile]
  );

  const top3 = allRecommendations.slice(0, 3);
  const rejected = allRecommendations.filter(r => !r.eligible);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!profile) {
    return (
      <main className="container px-4 py-20 text-center">
        <UserCircle className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
          {t.recommendations.noProfile}
        </h1>
        <Link to="/profile">
          <Button className="btn-rural bg-primary text-primary-foreground hover:bg-primary/90 mt-4">
            {t.recommendations.goToProfile}
          </Button>
        </Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="container px-4 py-20 text-center">
        <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-semibold">Analyzing eligibility...</p>
      </main>
    );
  }

  return (
    <main className="container px-4 py-10 max-w-3xl">
      <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          {t.recommendations.title}
        </h1>
        <SyncIndicator />
      </div>
      <p className="text-muted-foreground mb-8">{t.recommendations.subtitle}</p>

      {/* Top 3 */}
      <div className="space-y-6">
        {top3.map((rec, i) => (
          <SchemeCard key={rec.scheme.id} recommendation={rec} rank={i} />
        ))}
      </div>

      {/* Why Not Eligible section */}
      {rejected.length > 0 && (
        <div className="mt-10">
          <button
            onClick={() => setShowRejected(!showRejected)}
            className="text-lg font-heading font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            {showRejected ? "▾" : "▸"} Why Not Eligible? ({rejected.length} schemes)
          </button>
          {showRejected && (
            <div className="space-y-6 mt-4">
              {rejected.map((rec, i) => (
                <SchemeCard key={rec.scheme.id} recommendation={rec} rank={i + 3} />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
