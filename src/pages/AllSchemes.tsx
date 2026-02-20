import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { schemes } from "@/data/schemes";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { indianStates } from "@/data/translations";
import { Search, ExternalLink, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AllSchemes() {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    return schemes.filter((s) => {
      if (!s.active) return false;
      const name = s.name[language].toLowerCase();
      const desc = s.description[language].toLowerCase();
      const q = search.toLowerCase();
      if (q && !name.includes(q) && !desc.includes(q) && !s.id.includes(q)) return false;

      if (filterState !== "all" && s.eligibility.states && s.eligibility.states.length > 0) {
        if (!s.eligibility.states.includes(filterState)) return false;
      }

      if (filterCategory !== "all" && s.eligibility.categories && s.eligibility.categories.length > 0) {
        if (!s.eligibility.categories.includes(filterCategory)) return false;
      }

      return true;
    });
  }, [search, filterState, filterCategory, language]);

  return (
    <main className="container px-4 py-10">
      <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
        {language === "hi" ? "सभी योजनाएँ" : language === "mr" ? "सर्व योजना" : "All Government Schemes"}
      </h1>
      <p className="text-muted-foreground mb-6">
        {language === "hi"
          ? `${schemes.length} योजनाएँ उपलब्ध`
          : language === "mr"
          ? `${schemes.length} योजना उपलब्ध`
          : `${schemes.length} schemes available`}
      </p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={language === "hi" ? "योजना खोजें..." : language === "mr" ? "योजना शोधा..." : "Search schemes..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-14 text-lg bg-card"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="h-14 w-full sm:w-44 bg-card">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t.selectCategory} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{language === "hi" ? "सभी श्रेणी" : language === "mr" ? "सर्व प्रवर्ग" : "All Categories"}</SelectItem>
            {(["general", "sc", "st", "obc", "minority"] as const).map((c) => (
              <SelectItem key={c} value={c}>{t.categories[c]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cards grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((scheme, i) => (
          <div
            key={scheme.id}
            className="card-scheme border-border bg-card shadow-sm hover:shadow-md animate-fade-up flex flex-col"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <h3 className="text-lg font-bold font-heading text-foreground mb-1">
              {scheme.name[language]}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">{scheme.ministry}</p>
            <p className="text-sm text-foreground mb-4 flex-1 line-clamp-3">
              {scheme.description[language]}
            </p>

            <div className="bg-success/10 rounded-lg p-3 mb-4">
              <p className="text-sm font-semibold text-success">{scheme.benefits[language]}</p>
            </div>

            {/* Eligibility summary */}
            <div className="flex flex-wrap gap-1 mb-4">
              {scheme.eligibility.landSize && (
                <Badge variant="outline" className="text-xs">
                  {scheme.eligibility.landSize.min ?? 0}–{scheme.eligibility.landSize.max ?? "∞"} acres
                </Badge>
              )}
              {scheme.eligibility.income && (
                <Badge variant="outline" className="text-xs">
                  ≤₹{scheme.eligibility.income.max.toLocaleString()}
                </Badge>
              )}
              {scheme.eligibility.categories && (
                <Badge variant="outline" className="text-xs">
                  {scheme.eligibility.categories.map(c => c.toUpperCase()).join(", ")}
                </Badge>
              )}
              {scheme.eligibility.requiresBankAccount && (
                <Badge variant="outline" className="text-xs">Bank A/C</Badge>
              )}
            </div>

            <Button
              className="btn-rural w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => window.open(scheme.applicationUrl, "_blank")}
            >
              {t.recommendations.apply}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-semibold">
            {language === "hi" ? "कोई योजना नहीं मिली" : language === "mr" ? "कोणतीही योजना सापडली नाही" : "No schemes found"}
          </p>
        </div>
      )}
    </main>
  );
}
