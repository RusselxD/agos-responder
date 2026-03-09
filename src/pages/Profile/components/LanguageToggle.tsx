import Card from "../../../components/common/Card";
import SectionLabel from "./common/SectionLabel";
import { useI18n } from "../../../context/I18nContext";
import type { Locale } from "../../../lib/i18n";

const options: { locale: Locale; label: string }[] = [
    { locale: "en", label: "English" },
    { locale: "fil", label: "Filipino" },
];

export default function LanguageToggle() {
    const { locale, setLocale, t } = useI18n();

    return (
        <div>
            <SectionLabel label={t("profile.language")} />
            <Card className="!p-2">
                <div className="grid grid-cols-2 gap-1">
                    {options.map((option) => {
                        const isActive = locale === option.locale;
                        return (
                            <button
                                key={option.locale}
                                onClick={() => setLocale(option.locale)}
                                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-accent/15 text-accent"
                                        : "text-gray-600 dark:text-gray-400 active:bg-gray-100 dark:active:bg-slate-700"
                                }`}
                            >
                                <span>{option.label}</span>
                            </button>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}
