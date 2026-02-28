import type { ReactElement } from "react";
import type { NotificationType } from "../../../types/alert";
import { TriangleAlert, CircleAlert, Ban, Megaphone } from "lucide-react";

export const getIcon = (type: NotificationType): ReactElement | null => {
    switch (type) {
        case "critical":
            return <TriangleAlert className="text-red-600 w-4 h-4" />;
        case "warning":
            return <CircleAlert className="text-yellow-600 w-4 h-4" />;
        case "blockage":
            return <Ban className="text-gray-600 w-4 h-4" />;
        case "announcement":
            return <Megaphone className="text-blue-600 w-4 h-4" />;
        default:
            return null;
    }
};

export const getBadgeColor = (type: NotificationType): string => {
    switch (type) {
        case "critical":
            return "bg-red-100 text-red-800";
        case "warning":
            return "bg-yellow-100 text-yellow-800";
        case "blockage":
            return "bg-gray-100 text-gray-800";
        case "announcement":
            return "bg-blue-100 text-blue-800";
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
