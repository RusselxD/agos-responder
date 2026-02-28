import type { Alert, NotificationType } from "../../../types/alert";
import Card from "../../../components/common/Card";
import {
    getBadgeColor,
    getContainerBorderColor,
    getIcon,
} from "../utils/getClasses.tsx";
import { getTimeAgo } from "../../../lib/utils/formatter.ts";
import { Check, Pointer } from "lucide-react";

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
    return <p className="text-xs text-gray-500">{getTimeAgo(timestamp)}</p>;
};

const AlertBody = ({ title, message }: { title: string; message: string }) => {
    return (
        <div className="my-2 space-y-1 text-sm">
            <h2 className="font-semibold">{title}</h2>
            <p className="text-gray-700">{message}</p>
        </div>
    );
};

const AcknowledgedBadge = ({ acknowledgedAt }: { acknowledgedAt: string }) => {
    return (
        <div className="flex items-center gap-2 text-xs text-green-700">
            <div className="bg-green-600 flex items-center justify-center w-fit h-fit rounded-full p-1">
                <Check className="text-white w-3 h-3" />
            </div>
            <p className="font-medium">{`Acknowledged ${getTimeAgo(acknowledgedAt)}`}</p>
        </div>
    );
};

const AcknowledgeButton = () => {
    return (
        <button className="flex items-center gap-2 bg-amber-500 active:bg-amber-600 text-white py-2 px-3 rounded-lg transition-colors duration-[10ms]">
            <Pointer className="w-4 h-4" />
            <span className="text-sm">Acknowledge</span>
        </button>
    );
};

export default function AlertCard({ alert }: { alert: Alert }) {
    return (
        <Card
            className={`!px-3 !py-4 border-l-4 ${getContainerBorderColor(alert.type)}`}
        >
            <div className="flex justify-between">
                <AlertTypeBadge type={alert.type} />
                <TimeStamp timestamp={alert.timestamp} />
            </div>

            <AlertBody title={alert.title} message={alert.message} />

            {alert.isAcknowledged ? (
                <AcknowledgedBadge acknowledgedAt={alert.acknowledgedAt!} />
            ) : (
                <AcknowledgeButton />
            )}
        </Card>
    );
}
