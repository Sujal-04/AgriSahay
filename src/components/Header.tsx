import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X, Eye, Volume2, Sprout } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const langLabels = { en: "EN", hi: "हिं", mr: "मरा" } as const;

export function Header() {
  const { language, setLanguage, t, highContrast, setHighContrast } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/profile", label: t.nav.profile },
    { to: "/recommendations", label: t.nav.recommendations },
    { to: "/schemes", label: t.viewSchemes },
    { to: "/documents", label: t.nav.documents },
    { to: "/admin", label: t.nav.admin },
  ];

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-primary">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-primary-foreground">
          <Sprout className="h-7 w-7" />
          <span className="text-xl font-bold font-heading">{t.appName}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === l.to
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div className="flex rounded-lg border border-primary-foreground/30 overflow-hidden">
            {(Object.keys(langLabels) as Array<keyof typeof langLabels>).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 text-xs font-bold transition-colors ${
                  language === lang
                    ? "bg-secondary text-secondary-foreground"
                    : "text-primary-foreground/70 hover:bg-primary-foreground/10"
                }`}
              >
                {langLabels[lang]}
              </button>
            ))}
          </div>

          {/* High contrast */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setHighContrast(!highContrast)}
            className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8"
            title={t.accessibility.highContrast}
          >
            <Eye className="h-4 w-4" />
          </Button>

          {/* TTS */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => speak(document.querySelector("main")?.textContent?.slice(0, 500) || "")}
            className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8"
            title={t.accessibility.textToSpeech}
          >
            <Volume2 className="h-4 w-4" />
          </Button>

          {/* Mobile menu */}
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden text-primary-foreground h-8 w-8"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-primary-foreground/20 bg-primary pb-4">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-6 py-3 text-base font-semibold ${
                location.pathname === l.to
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "text-primary-foreground/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
