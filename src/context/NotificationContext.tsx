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
