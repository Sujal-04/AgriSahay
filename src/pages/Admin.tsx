import { useLanguage } from "@/contexts/LanguageContext";
import { schemes } from "@/data/schemes";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, TrendingUp, FileText } from "lucide-react";

export default function Admin() {
  const { t, language } = useLanguage();

  const stats = [
    { icon: FileText, label: t.admin.totalSchemes, value: schemes.length, color: "bg-primary/10 text-primary" },
    { icon: Users, label: t.admin.totalFarmers, value: "1,247", color: "bg-secondary/10 text-secondary" },
    { icon: TrendingUp, label: t.admin.avgConfidence, value: "78%", color: "bg-success/10 text-success" },
  ];

  return (
    <main className="container px-4 py-10">
      <h1 className="text-3xl font-heading font-bold text-foreground mb-2">{t.admin.title}</h1>
      <p className="text-muted-foreground mb-8">{t.admin.subtitle}</p>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="card-scheme border-border bg-card flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.color}`}>
              <s.icon className="h-7 w-7" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Scheme table */}
      <h2 className="text-xl font-heading font-bold text-foreground mb-4">{t.admin.schemeManagement}</h2>
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full text-left">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">ID</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Name</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Ministry</th>
              <th className="px-4 py-3 text-sm font-semibold text-foreground">Docs Required</th>
            </tr>
          </thead>
          <tbody>
            {schemes.map((s) => (
              <tr key={s.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{s.id}</td>
                <td className="px-4 py-3 font-semibold text-foreground">{s.name[language]}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{s.ministry}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {s.documents.slice(0, 2).map((d) => (
                      <Badge key={d} variant="outline" className="text-xs">{d}</Badge>
                    ))}
                    {s.documents.length > 2 && (
                      <Badge variant="outline" className="text-xs">+{s.documents.length - 2}</Badge>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
