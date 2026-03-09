import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { ReactNode } from "react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
    mode: ThemeMode;
    isDark: boolean;
    setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "theme-mode";

function getSystemPrefersDark() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyThemeClass(isDark: boolean) {
    document.documentElement.classList.toggle("dark", isDark);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark" || stored === "system") {
            return stored;
        }
        return "system";
    });

    const isDark =
        mode === "dark" || (mode === "system" && getSystemPrefersDark());

    const setMode = useCallback((newMode: ThemeMode) => {
        setModeState(newMode);
        localStorage.setItem(STORAGE_KEY, newMode);
    }, []);

    // Apply dark class and listen for system preference changes
    useEffect(() => {
        applyThemeClass(isDark);

        if (mode !== "system") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => applyThemeClass(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, [mode, isDark]);

    const contextValue = useMemo(
        () => ({ mode, isDark, setMode }),
        [mode, isDark, setMode],
    );

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
