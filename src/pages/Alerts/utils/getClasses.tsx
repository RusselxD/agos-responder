import type { ReactElement } from "react";
import type { NotificationType } from "../../../types/alert";
import { TriangleAlert, CircleAlert, Ban, Megaphone } from "lucide-react";

export const getIcon = (type: NotificationType): ReactElement | null => {
    switch (type) {
        case "critical":
            return <TriangleAlert className="w-4 h-4" />;
        case "warning":
            return <CircleAlert className="w-4 h-4" />;
        case "blockage":
            return <Ban className="w-4 h-4" />;
        case "announcement":
            return <Megaphone className="w-4 h-4" />;
        default:
            return null;
    }
};

export const getBadgeColor = (type: NotificationType): string => {
    switch (type) {
        case "critical":
            return "bg-red-100 text-red-800 border-red-400 dark:bg-red-950/50 dark:text-red-300 dark:border-red-700";
        case "warning":
            return "bg-yellow-100 text-yellow-800 border-yellow-400 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-700";
        case "blockage":
            return "bg-gray-100 text-gray-800 border-gray-400 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-500";
        case "announcement":
            return "bg-blue-100 text-blue-800 border-blue-400 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-700";
        default:
            return "";
    }
};

export const getContainerBorderColor = (type: NotificationType): string => {
    switch (type) {
        case "critical":
            return "border-red-600";
        case "warning":
            return "border-yellow-600";
        case "blockage":
            return "border-gray-600";
        case "announcement":
            return "border-blue-600";
        default:
            return "";
    }
};
