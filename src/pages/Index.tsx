import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Sprout, Brain, Languages, WifiOff, Accessibility, ArrowRight, MessageCircle } from "lucide-react";
import heroImage from "@/assets/hero-farm.jpg";

const Index = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Brain, title: t.features.aiPowered, desc: t.features.aiDesc },
    { icon: Languages, title: t.features.multiLang, desc: t.features.multiLangDesc },
    { icon: WifiOff, title: t.features.offline, desc: t.features.offlineDesc },
    { icon: Accessibility, title: t.features.accessible, desc: t.features.accessibleDesc },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <img src={heroImage} alt="Indian farmlands" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-gradient absolute inset-0" />
        <div className="container relative z-10 px-4 py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Sprout className="h-12 w-12 text-secondary" />
              <h1 className="text-5xl md:text-6xl font-bold font-heading text-primary-foreground">
                {t.appName}
              </h1>
            </div>
            <p className="text-2xl md:text-3xl font-heading font-bold text-secondary mb-4">
              {t.tagline}
            </p>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/profile">
                <Button className="btn-rural bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg">
                  {t.getStarted}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/schemes">
                <Button className="btn-rural bg-primary-foreground/20 text-primary-foreground border-2 border-primary-foreground/50 hover:bg-primary-foreground/30 text-lg backdrop-blur-sm">
                  {t.viewSchemes}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-8">
        <div className="container px-4 grid grid-cols-3 gap-4 text-center">
          {[
            { val: "8+", label: t.stats.schemesAvailable },
            { val: "10K+", label: t.stats.farmersHelped },
            { val: "28", label: t.stats.statesCovered },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-bold text-secondary">{s.val}</div>
              <div className="text-sm text-primary-foreground/70">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="card-scheme border-border bg-card p-8 text-center shadow-sm animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/5">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-4">{t.tagline}</h2>
          <Link to="/profile">
            <Button className="btn-rural bg-primary text-primary-foreground hover:bg-primary/90 text-lg">
              {t.getStarted}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Floating Chat Button */}
      <Link to="/chat">
        <Button
          size="lg"
          className="fixed bottom-6 right-6 rounded-full shadow-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 h-14 w-14 p-0 z-50"
          title={t.nav.chat}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </Link>
    </main>
  );
};

export default Index;
