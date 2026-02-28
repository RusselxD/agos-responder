import { CircleCheck } from "lucide-react";
import type {
    AcknowledgeNotificationPayload,
    NotificationType,
} from "../../../../../types/alert";
import { getBadgeColor, getIcon } from "../../../utils/getClasses";
import { formatDate } from "../../../../../lib/utils/formatter";
import { useState } from "react";
import { useCoreHook } from "../../../../../context/CoreContext";
import { useAlertsPageHook } from "../../../context/AlertsPageContext";
import { alertsAPI } from "../../../../../lib/api/alert";

export const Header = ({
    type,
    title,
    isAcknowledged,
}: {
    type: NotificationType;
    title: string;
    isAcknowledged: boolean;
}) => {
    return (
        <div className="flex flex-col items-center gap-2.5">
            <AlertTypeBadge type={type} />
            <h2 className="font-semibold text-[1.120rem]">{title}</h2>
            <AcknowledgeBadge isAcknowledged={isAcknowledged} />
        </div>
    );
};

export const NotificationDetails = ({
    message,
    timestamp,
}: {
    message: string;
    timestamp: string;
}) => {
    return (
        <div className="bg-gray-100 p-3 rounded-xl flex flex-col gap-1.5">
            <p className="text-sm">{message}</p>
            <span className="text-[0.800rem] text-gray-500">
                {formatDate(timestamp)}
            </span>
        </div>
    );
};

export const AcknowledgeNotification = () => {
    const [message, setMessage] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { responderId } = useCoreHook();
    const { chosenAlert, acknowledgeAlert } = useAlertsPageHook();

    const handleSubmitAcknowledgement = async () => {
        try {
            setIsSubmitting(true);
            const payload = {
                message: message || null,
                responderId: responderId!,
                deliveryId: chosenAlert!.id,
            } as AcknowledgeNotificationPayload;
            const res = await alertsAPI.acknowledgeNotification(payload);
            acknowledgeAlert(
                chosenAlert!.id,
                res.acknowledgeMessage,
                res.acknowledgedAt,
            );
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <span className="text-[0.800rem] text-gray-700 -mb-1">
                Leave a message (optional)
            </span>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="text-sm p-2 border border-gray-400 rounded-lg resize-none outline-none focus:outline-none focus:ring-0 focus:border-gray-400"
                rows={3}
                placeholder="Enter optional acknowledgment message..."
            />
            <button
                onClick={() => handleSubmitAcknowledgement()}
                className="text-white bg-accent rounded-lg py-3 flex items-center justify-center gap-2"
            >
                {isSubmitting && <div className="spinner w-4 h-4"></div>}
                Acknowledge
            </button>
        </div>
    );
};

export const AcknowledgementDetails = ({
    acknowledgeMessage,
    acknowledgedAt,
}: {
    acknowledgeMessage: string | null;
    acknowledgedAt: string;
}) => {
    return (
        <div className="space-y-3">
            <div className="bg-green-100 border border-green-500 p-2 rounded-lg text-green-700 text-sm flex gap-3 items-center">
                <CircleCheck className="w-6 h-6" />
                <div className="flex flex-col">
                    <span className="text-sm font-medium">Acknowledged</span>
                    <span className="text-[0.800rem]">
                        {formatDate(acknowledgedAt)}
                    </span>
                </div>
            </div>

            {acknowledgeMessage && (
                <div className="text-sm">
                    <p className="text-gray-500 font-medium">NOTES</p>
                    <p>{acknowledgeMessage}</p>
                </div>
            )}
        </div>
    );
};

export const AlertTypeBadge = ({ type }: { type: NotificationType }) => {
    return (
        <div
            className={`${getBadgeColor(type)} border w-fit px-4 py-1.5 flex items-center gap-1 text-xs font-medium rounded-full`}
        >
            {getIcon(type)}
            <span>{type.toUpperCase()}</span>
        </div>
    );
};

export const AcknowledgeBadge = ({
    isAcknowledged,
}: {
    isAcknowledged: boolean;
}) => {
    const message = isAcknowledged ? "ACKNOWLEDGED" : "PENDING ACKNOWLEDGEMENT";

    return (
        <div className="flex items-center gap-2 text-[0.800rem] font-medium">
            {isAcknowledged ? (
                <CircleCheck className="w-4 h-4 text-green-600" />
            ) : (
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            )}
            <span
                className={`${isAcknowledged ? "text-green-600" : "text-yellow-500"}`}
            >
                {message}
            </span>
        </div>
    );
};
