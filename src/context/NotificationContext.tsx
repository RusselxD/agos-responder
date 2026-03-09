import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { useCoreHook } from "./CoreContext";
import { alertsAPI } from "../lib/api/alert";
import { triggerAlertFeedback } from "../lib/utils/alertFeedback";

interface NotificationContextValue {
    unreadCount: number;
    reduceUnreadCount: (amount: number) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
    undefined,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [unreadCount, setUnreadCount] = useState(0);

    const { responderId } = useCoreHook();

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const res = await alertsAPI.getUnreadAlertsCount(responderId);
                setUnreadCount(res);
            } catch (error) {
                console.error("Failed to fetch unread alerts count:", error);
            }
        };

        if (responderId) {
            fetchUnreadCount();
        }
    }, [responderId]);

    // Listen for push notifications from service worker and play in-app sound
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data?.type === "PUSH_RECEIVED") {
                triggerAlertFeedback(event.data.alertType);
                setUnreadCount((prev) => prev + 1);
            }
        };

        navigator.serviceWorker?.addEventListener("message", handler);
        return () =>
            navigator.serviceWorker?.removeEventListener("message", handler);
    }, []);
    const reduceUnreadCount = (amount: number = 1) => {
        setUnreadCount((prev) => Math.max(prev - amount, 0));
    };

    const contextValue = useMemo(
        () => ({
            unreadCount,
            reduceUnreadCount,
        }),
        [unreadCount],
    );

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotificationHook = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotificationHook must be used within a NotificationProvider",
        );
    }
    return context;
};
