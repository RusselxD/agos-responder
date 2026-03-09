import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import type { ReactNode } from "react";
import { getTranslation, type Locale, type TranslationKey } from "../lib/i18n";

interface I18nContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = "locale";

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "en" || stored === "fil") {
            return stored;
        }
        return "en";
    });

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem(STORAGE_KEY, newLocale);
    }, []);

    const t = useMemo(() => getTranslation(locale), [locale]);

    const contextValue = useMemo(
        () => ({ locale, setLocale, t }),
        [locale, setLocale, t],
    );

    return (
        <I18nContext.Provider value={contextValue}>
            {children}
        </I18nContext.Provider>
    );
}

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error("useI18n must be used within an I18nProvider");
    }
    return context;
};
