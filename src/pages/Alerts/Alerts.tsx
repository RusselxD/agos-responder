import Page from "../../components/common/Page";
import AlertCard from "./components/AlertCard";
import AlertDetails from "./components/AlertDetails/AlertDetails";
import {
    AlertsSkeleton,
    AlertTypeFilters,
    EmptyPage,
    ErrorPage,
} from "./components/PageComponents";
import { useAlertsPageHook } from "./context/AlertsPageContext";
import { useI18n } from "../../context/I18nContext";

export default function Alerts() {
    const { shownAlerts, isFetching, isLoadingMore, hasMore, error, chosenFilter, loadMore } =
        useAlertsPageHook();
    const { t } = useI18n();

    if (isFetching) {
        return <AlertsSkeleton />;
    }

    if (error) {
        return <ErrorPage message={error} />;
    }

    return (
        <Page className="!space-y-2">
            <AlertTypeFilters />

            {shownAlerts && shownAlerts.length === 0 && (
                <EmptyPage isAllChosen={chosenFilter === "all"} />
            )}

            {shownAlerts?.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
            ))}

            {hasMore && (
                <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="w-full py-3 text-sm font-medium text-primary dark:text-accent hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50 transition-colors"
                >
                    {isLoadingMore ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="spinner w-4 h-4 border-primary dark:border-accent border-t-transparent" />
                            {t("alerts.loading") || "Loading..."}
                        </span>
                    ) : (
                        t("alerts.loadMore") || "Load more"
                    )}
                </button>
            )}

            <AlertDetails />
        </Page>
    );
}
