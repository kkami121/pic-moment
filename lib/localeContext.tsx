"use client";

import { createContext, useContext, type ReactNode } from "react";
import { getTranslations, type Translations } from "@/lib/translations/index";

type LocaleContextValue = {
  locale: string;
  t: Translations;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: "ko",
  t: getTranslations("ko"),
});

export function useT(): Translations {
  return useContext(LocaleContext).t;
}

export function useLocale(): string {
  return useContext(LocaleContext).locale;
}

export function LocaleProvider({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  const t = getTranslations(locale);
  return (
    <LocaleContext.Provider value={{ locale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}
