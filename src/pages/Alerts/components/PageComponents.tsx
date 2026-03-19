import { BellOff } from "lucide-react";
import Page from "../../../components/common/Page";
import { FILTERS, useAlertsPageHook } from "../context/AlertsPageContext";
import { useI18n } from "../../../context/I18nContext";
import type { TranslationKey } from "../../../lib/i18n";

const filterLabelKeys: Record<string, TranslationKey> = {
    all: "alerts.all",
    critical: "alerts.critical",
    warning: "alerts.warning",
    announcement: "alerts.announcement",
};

export const EmptyPage = ({ isAllChosen }: { isAllChosen: boolean }) => {
    const { t } = useI18n();
    const message = isAllChosen
        ? t("alerts.allCaughtUp")
        : t("alerts.noAlertsOfType");

    return (
        <Page className="flex flex-col items-center gap-4 !space-y-0 pt-10">
            <div className="rounded-full bg-gray-200 dark:bg-slate-700 p-4">
                <BellOff className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="font-semibold text-xl dark:text-white">{t("alerts.noAlerts")}</h2>
            <p className="text-center text-gray-600 dark:text-gray-400">{message}</p>
        </Page>
    );
};

export const AlertsSkeleton = () => {
    return (
        <Page className="space-y-2">
            {Array.from({ length: 8 }).map((_, index) => (
                <div
                    className="skeleton h-14 w-full rounded-lg"
                    key={index}
                ></div>
            ))}
        </Page>
    );
};

export const ErrorPage = ({ message }: { message: string }) => {
    return (
        <Page>
            <div className="text-red-500 dark:text-red-400 w-full rounded-lg p-3 border border-red-500 dark:border-red-700 bg-red-50 dark:bg-red-950/50 text-sm">
                {message}
            </div>
        </Page>
    );
};

export const AlertTypeFilters = () => {
    const { chosenFilter, handleFilterChange } = useAlertsPageHook();
    const { t } = useI18n();

    return (
        <div className="flex items-center gap-1 flex-wrap">
            {FILTERS.map((filter) => {
                return (
                    <button
                        key={filter}
                        className={`px-4 py-2 text-sm rounded-md text-white ${chosenFilter === filter ? "bg-primary dark:bg-accent dark:text-slate-900" : "bg-accent/70"}`}
                        onClick={() => handleFilterChange(filter)}
                    >
                        {t(filterLabelKeys[filter])}
                    </button>
                );
            })}
        </div>
    );
};
