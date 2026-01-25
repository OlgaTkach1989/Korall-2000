import { createContext, useContext, useMemo, useState } from "react";
import translations from "../i18n/translations";

const I18nContext = createContext();

const getNested = (obj, path) =>
  path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "de",
  );

  const t = (key, vars = {}) => {
    const dict = translations[language] || translations.de;
    const template = getNested(dict, key) || key;
    return Object.entries(vars).reduce(
      (acc, [name, value]) => acc.replaceAll(`{${name}}`, value),
      template,
    );
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage: (next) => {
        localStorage.setItem("language", next);
        setLanguage(next);
      },
      t,
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);
