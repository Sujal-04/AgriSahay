import { createContext, useContext, useState, ReactNode } from "react";
import { Language } from "@/types/farmer";
import { translations } from "@/data/translations";

type Translations = typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem("krishi-lang") as Language) || "en"
  );
  const [highContrast, setHighContrast] = useState(
    () => localStorage.getItem("krishi-hc") === "true"
  );

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("krishi-lang", lang);
  };

  const handleSetHighContrast = (v: boolean) => {
    setHighContrast(v);
    localStorage.setItem("krishi-hc", String(v));
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t: translations[language] as Translations,
        highContrast,
        setHighContrast: handleSetHighContrast,
      }}
    >
      <div className={highContrast ? "high-contrast" : ""}>{children}</div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
