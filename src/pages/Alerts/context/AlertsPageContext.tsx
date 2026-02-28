import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { NotificationType, Alert } from "../../../types/alert";
import { alertsAPI } from "../../../lib/api/alert";
import { useCoreHook } from "../../../context/CoreContext";

interface AlertsPageContextValue {
    shownAlerts: Alert[] | undefined;
    isFetching: boolean;
    error: string;
    chosenFilter: AlertTypeFilter;
    handleFilterChange: (filter: AlertTypeFilter) => void;
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
    const [shownAlerts, setShownAlerts] = useState<Alert[] | undefined>(
        undefined,
    );

    const [chosenFilter, setChosenFilter] = useState<AlertTypeFilter>("all");

    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string>("");

    const { responderId } = useCoreHook();

    const handleFilterChange = (filter: AlertTypeFilter) => {
        setChosenFilter(filter);
        if (filter === "all") {
            setShownAlerts(alerts);
        } else {
            setShownAlerts(alerts?.filter((alert) => alert.type === filter));
        }
    };

    useEffect(() => {
        const fetchAlerts = async () => {
            setIsFetching(true);
            try {
                const res = await alertsAPI.getAlerts(responderId);
                setAlerts(res);
                setShownAlerts(res);
            } catch (error) {
                setError("Failed to fetch alerts. Please try again.");
            } finally {
                setIsFetching(false);
            }
        };

        fetchAlerts();
    }, []);

    const contextValue = useMemo(
        () => ({
            shownAlerts,
            isFetching,
            error,
            chosenFilter,
            handleFilterChange,
        }),
        [shownAlerts, isFetching, error, chosenFilter],
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
