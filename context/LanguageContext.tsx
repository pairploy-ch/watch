"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import th from "../locales/th.json";
import en from "../locales/en.json";

type Locale = "th" | "en";

// Recursive type สำหรับ nested JSON
type Translations = {
  [key: string]: string | Translations;
};

const translations: Record<Locale, Translations> = { th, en };

interface LanguageContextProps {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>("en");

  const t = (key: string): string => {
    const parts = key.split(".");
    let result: any = translations[locale];

    for (const p of parts) {
      if (result && typeof result === "object") {
        result = result[p];
      } else {
        return key;
      }
    }

    return typeof result === "string" ? result : key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
};
