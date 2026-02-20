import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { FarmerProfile } from "@/types/farmer";
import { getRecommendations } from "@/lib/matchingEngine";
import { SchemeCard } from "@/components/SchemeCard";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

export default function Recommendations() {
  const { t } = useLanguage();

  const profile: FarmerProfile | null = useMemo(() => {
    const saved = localStorage.getItem("krishi-profile");
    if (!saved) return null;
    const p = JSON.parse(saved) as FarmerProfile;
    return p.name ? p : null;
  }, []);

  const recommendations = useMemo(
    () => (profile ? getRecommendations(profile) : []),
    [profile]
  );

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

  return (
    <main className="container px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
        {t.recommendations.title}
      </h1>
      <p className="text-muted-foreground mb-8">{t.recommendations.subtitle}</p>

      <div className="space-y-6">
        {recommendations.map((rec, i) => (
          <SchemeCard key={rec.scheme.id} recommendation={rec} rank={i} />
        ))}
      </div>
    </main>
  );
}
