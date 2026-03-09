import { Monitor, Moon, Sun } from "lucide-react";
import Card from "../../../components/common/Card";
import SectionLabel from "./common/SectionLabel";
import { useTheme } from "../../../context/ThemeContext";
import { useI18n } from "../../../context/I18nContext";
import type { TranslationKey } from "../../../lib/i18n";

type ThemeMode = "light" | "dark" | "system";

const options: { mode: ThemeMode; icon: typeof Sun; labelKey: TranslationKey }[] = [
    { mode: "light", icon: Sun, labelKey: "profile.light" },
    { mode: "dark", icon: Moon, labelKey: "profile.dark" },
    { mode: "system", icon: Monitor, labelKey: "profile.system" },
];

export default function ThemeToggle() {
    const { mode, setMode } = useTheme();
    const { t } = useI18n();

    return (
        <div>
            <SectionLabel label={t("profile.appearance")} />
            <Card className="!p-2">
                <div className="grid grid-cols-3 gap-1">
                    {options.map((option) => {
                        const isActive = mode === option.mode;
                        return (
                            <button
                                key={option.mode}
                                onClick={() => setMode(option.mode)}
                                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-accent/15 text-accent"
                                        : "text-gray-600 dark:text-gray-400 active:bg-gray-100 dark:active:bg-slate-700"
                                }`}
                            >
                                <option.icon className="w-4 h-4" />
                                <span>{t(option.labelKey)}</span>
                            </button>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}
