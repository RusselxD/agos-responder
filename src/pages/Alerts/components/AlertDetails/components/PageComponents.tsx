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
import { enqueueAcknowledgement } from "../../../../../lib/utils/offlineQueue";
import { useNotificationHook } from "../../../../../context/NotificationContext";
import { useI18n } from "../../../../../context/I18nContext";

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
            <h2 className="font-semibold text-[1.120rem] dark:text-white">{title}</h2>
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
        <div className="bg-gray-100 dark:bg-slate-700 p-3 rounded-xl flex flex-col gap-1.5">
            <p className="text-sm dark:text-gray-200">{message}</p>
            <span className="text-[0.800rem] text-gray-500 dark:text-gray-400">
                {timestamp ? formatDate(timestamp) : "N/A"}
            </span>
        </div>
    );
};

export const AcknowledgeNotification = () => {
    const [message, setMessage] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { responderId } = useCoreHook();
    const { chosenAlert, acknowledgeAlert } = useAlertsPageHook();
    const { reduceUnreadCount } = useNotificationHook();
    const { t } = useI18n();

    const handleSubmitAcknowledgement = async () => {
        if (isSubmitting || !chosenAlert || !responderId) return;

        try {
            setIsSubmitting(true);

            const payload: AcknowledgeNotificationPayload = {
                message: message || null,
                responderId: responderId,
                deliveryId: chosenAlert.id,
            };
            const res = await alertsAPI.acknowledgeNotification(payload);

            acknowledgeAlert(
                chosenAlert.id,
                res.acknowledgeMessage,
                res.acknowledgedAt,
            );
            reduceUnreadCount(1);
        } catch {
            // Queue for retry when back online
            enqueueAcknowledgement({
                message: message || null,
                responderId: responderId,
                deliveryId: chosenAlert.id,
            });
            // Optimistically mark as acknowledged locally
            acknowledgeAlert(
                chosenAlert.id,
                message || null,
                new Date().toISOString(),
            );
            reduceUnreadCount(1);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <span className="text-[0.800rem] text-gray-700 dark:text-gray-300 -mb-1">
                {t("alerts.leaveMessage")}
            </span>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="text-sm p-2 border border-gray-400 dark:border-slate-600 rounded-lg resize-none outline-none focus:outline-none focus:ring-0 focus:border-gray-400 dark:focus:border-slate-500 bg-transparent dark:text-gray-200 dark:placeholder-gray-500"
                rows={3}
                placeholder={t("alerts.placeholder")}
            />
            <button
                onClick={() => handleSubmitAcknowledgement()}
                className="text-white bg-accent rounded-lg py-3 flex items-center justify-center gap-2"
            >
                {isSubmitting && <div className="spinner w-4 h-4"></div>}
                {t("alerts.acknowledge")}
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
    const { t } = useI18n();

    return (
        <div className="space-y-3">
            <div className="bg-green-100 dark:bg-green-950/50 border border-green-500 dark:border-green-700 p-2 rounded-lg text-green-700 dark:text-green-400 text-sm flex gap-3 items-center">
                <CircleCheck className="w-6 h-6" />
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{t("alerts.acknowledged")}</span>
                    <span className="text-[0.800rem]">
                        {acknowledgedAt ? formatDate(acknowledgedAt) : "N/A"}
                    </span>
                </div>
            </div>

            {acknowledgeMessage && (
                <div className="text-sm">
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{t("alerts.notes")}</p>
                    <p>{acknowledgeMessage}</p>
                </div>
            )}
        </div>
    );
};

export const AlertTypeBadge = ({ type }: { type: NotificationType }) => {
    const { t } = useI18n();
    const label =
        type === "blockage"
            ? t("alerts.surfaceObstruction")
            : type.toUpperCase();

    return (
        <div
            className={`${getBadgeColor(type)} border w-fit px-4 py-1.5 flex items-center gap-1 text-xs font-medium rounded-full`}
        >
            {getIcon(type)}
            <span>{label}</span>
        </div>
    );
};

export const AcknowledgeBadge = ({
    isAcknowledged,
}: {
    isAcknowledged: boolean;
}) => {
    const { t } = useI18n();
    const message = isAcknowledged ? t("alerts.acknowledged").toUpperCase() : t("alerts.pendingAcknowledgement");

    return (
        <div className="flex items-center gap-2 text-[0.800rem] font-medium">
            {isAcknowledged ? (
                <CircleCheck className="w-4 h-4 text-green-600" />
            ) : (
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            )}
            <span
                className={`${isAcknowledged ? "text-green-600 dark:text-green-400" : "text-yellow-500 dark:text-yellow-400"}`}
            >
                {message}
            </span>
        </div>
    );
};
