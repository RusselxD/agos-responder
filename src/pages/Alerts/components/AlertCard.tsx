import type { Alert, NotificationType } from "../../../types/alert";
import Card from "../../../components/common/Card";
import {
    getBadgeColor,
    getContainerBorderColor,
    getIcon,
} from "../utils/getClasses.tsx";
import { formatTimestamp } from "../../../lib/utils/formatter.ts";
import { ChevronRight } from "lucide-react";
import { useAlertsPageHook } from "../context/AlertsPageContext.tsx";

const AlertTypeBadge = ({ type }: { type: NotificationType }) => {
    return (
        <div
            className={`${getBadgeColor(type)} w-fit px-2 py-1 flex items-center gap-1 text-xs font-medium rounded-md`}
        >
            {getIcon(type)}
            <span>{type.toUpperCase()}</span>
        </div>
    );
};

const TimeStamp = ({ timestamp }: { timestamp: string }) => {
    return (
        <p className="text-xs text-gray-500">{formatTimestamp(timestamp)}</p>
    );
};

const AlertBody = ({ title, message }: { title: string; message: string }) => {
    return (
        <div className="my-3 space-y-1 text-sm">
            <h2 className="font-semibold">{title}</h2>
            <p className="text-gray-700">{message}</p>
        </div>
    );
};

const AcknowledgeBadge = ({ isAcknowledged }: { isAcknowledged: boolean }) => {
    const message = isAcknowledged ? "Acknowledged" : "Unacknowledged";

    const badgeColor = isAcknowledged
        ? "bg-green-100 text-green-700 border-green-400"
        : "bg-amber-100 text-amber-700 border-amber-400";

    return (
        <div className={`rounded-lg border ${badgeColor} px-2`}>
            <span className="text-[0.800rem]">{message}</span>
        </div>
    );
};

export default function AlertCard({ alert }: { alert: Alert }) {
    const { handleSetChosenAlert } = useAlertsPageHook();

    return (
        <div onClick={() => handleSetChosenAlert(alert.id)}>
            <Card
                className={`!px-3 !py-4 border-l-4 ${getContainerBorderColor(alert.type)}`}
            >
                <div className="flex justify-between">
                    <AlertTypeBadge type={alert.type} />
                    <TimeStamp timestamp={alert.timestamp} />
                </div>

                <AlertBody title={alert.title} message={alert.message} />

                <div className="flex items-center justify-between">
                    <AcknowledgeBadge isAcknowledged={alert.isAcknowledged} />
                    <ChevronRight className="text-gray-600"/>
                </div>
            </Card>
        </div>
    );
}
