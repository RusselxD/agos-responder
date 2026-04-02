import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { NotificationType, Alert } from "../../../types/alert";
import { alertsAPI } from "../../../lib/api/alert";
import { flushQueue } from "../../../lib/utils/offlineQueue";
import { useCoreHook } from "../../../context/CoreContext";

interface AlertsPageContextValue {
    shownAlerts: Alert[] | undefined;
    chosenAlert: Alert | null;
    isFetching: boolean;
    isLoadingMore: boolean;
    hasMore: boolean;
    error: string;
    chosenFilter: AlertTypeFilter;
    handleFilterChange: (filter: AlertTypeFilter) => void;
    handleSetChosenAlert: (alertId: string) => void;
    handleCloseAlertDetail: () => void;
    loadMore: () => void;
    acknowledgeAlert: (
        alertId: string,
        message: string | null,
        acknowledgedAt: string,
    ) => void;
}

const AlertsPageContext = createContext<AlertsPageContextValue | undefined>(
    undefined,
);

type AlertTypeFilter = "all" | NotificationType;

export const FILTERS = [
    "all",
    "critical",
    "warning",
    "announcement",
] as AlertTypeFilter[];

export function AlertsPageProvider({ children }: { children: ReactNode }) {
    const [alerts, setAlerts] = useState<Alert[] | undefined>(undefined);
    const [chosenAlert, setChosenAlert] = useState<Alert | null>(null);
    const [chosenFilter, setChosenFilter] = useState<AlertTypeFilter>("all");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string>("");

    const { responderId } = useCoreHook();

    const fetchAlerts = useCallback(async (
        targetPage: number,
        filter: AlertTypeFilter,
        append: boolean = false,
    ) => {
        if (append) {
            setIsLoadingMore(true);
        } else {
            setIsFetching(true);
        }

        try {
            const filterType = filter === "all" ? undefined : filter;
            const res = await alertsAPI.getAlerts(responderId, targetPage, filterType);

            if (append) {
                setAlerts((prev) => [...(prev || []), ...res.items]);
            } else {
                setAlerts(res.items);
            }
            setHasMore(res.hasMore);
            setError("");
        } catch {
            if (!append) {
                setError("Failed to fetch alerts. Please try again.");
            }
        } finally {
            setIsFetching(false);
            setIsLoadingMore(false);
        }
    }, [responderId]);

    const handleFilterChange = useCallback((filter: AlertTypeFilter) => {
        window.scrollTo(0, 0);
        setChosenFilter(filter);
        setPage(1);
        setAlerts(undefined);
        fetchAlerts(1, filter);
    }, [fetchAlerts]);

    const loadMore = useCallback(() => {
        if (isLoadingMore || !hasMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchAlerts(nextPage, chosenFilter, true);
    }, [isLoadingMore, hasMore, page, chosenFilter, fetchAlerts]);

    const handleSetChosenAlert = useCallback((alertId: string) => {
        const alert = alerts?.find((a) => a.id === alertId) || null;
        setChosenAlert(alert);
    }, [alerts]);

    const handleCloseAlertDetail = useCallback(() => {
        setChosenAlert(null);
    }, []);

    const acknowledgeAlert = useCallback((
        alertId: string,
        message: string | null,
        acknowledgedAt: string,
    ) => {
        setAlerts((prev) => {
            if (!prev) return prev;
            return prev.map((a) =>
                a.id === alertId
                    ? { ...a, isAcknowledged: true, acknowledgeMessage: message, acknowledgedAt }
                    : a,
            );
        });
        setChosenAlert((prev) =>
            prev && prev.id === alertId
                ? { ...prev, isAcknowledged: true, acknowledgeMessage: message, acknowledgedAt }
                : prev,
        );
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchAlerts(1, "all");
    }, []);

    // Flush queued offline acknowledgements when back online
    useEffect(() => {
        const handleOnline = () => {
            flushQueue().then((synced) => {
                if (synced > 0) {
                    console.log(`Synced ${synced} queued acknowledgement(s)`);
                }
            });
        };

        window.addEventListener("online", handleOnline);
        if (navigator.onLine) handleOnline();

        return () => window.removeEventListener("online", handleOnline);
    }, []);

    const contextValue = useMemo(
        () => ({
            shownAlerts: alerts,
            isFetching,
            isLoadingMore,
            hasMore,
            error,
            chosenFilter,
            chosenAlert,
            handleFilterChange,
            handleSetChosenAlert,
            handleCloseAlertDetail,
            loadMore,
            acknowledgeAlert,
        }),
        [alerts, isFetching, isLoadingMore, hasMore, error, chosenFilter, chosenAlert, handleFilterChange, handleSetChosenAlert, handleCloseAlertDetail, loadMore, acknowledgeAlert],
    );

    return (
        <AlertsPageContext.Provider value={contextValue}>
            {children}
        </AlertsPageContext.Provider>
    );
}

export const useAlertsPageHook = () => {
    const context = useContext(AlertsPageContext);
    if (!context) {
        throw new Error(
            "useAlertsPageHook must be used within a AlertsPageProvider",
        );
    }
    return context;
};
