import {
    CircleAlert,
    Megaphone,
    TriangleAlert,
    Waves,
    type LucideIcon,
} from "lucide-react";
import Card from "../../../components/common/Card";
import SectionLabel from "./common/SectionLabel";
import { useEffect, useState } from "react";
import type { NotificationPreferences } from "../../../types/responder";
import { useCoreHook } from "../../../context/CoreContext";
import { responderAPI } from "../../../lib/api/responder";

interface ToggleSectionProps {
    Icon: LucideIcon;
    label: string;
    isActive: boolean;
    onToggle: (enabled: boolean) => void;
    borderBottom?: boolean;
}

const ToggleSection = ({
    Icon,
    label,
    isActive,
    onToggle,
    borderBottom = true,
}: ToggleSectionProps) => {
    return (
        <div
            className={`flex py-4 px-4 items-center justify-between ${borderBottom ? "border-b border-gray-300" : ""}`}
        >
            <div className="flex items-center gap-2">
                <Icon className="w-6 h-6" />
                <div>
                    <p className="text-sm font-medium">{label}</p>
                </div>
            </div>

            <button
                onClick={() => onToggle(!isActive)}
                className={`rounded-full relative w-12 h-7 ${isActive ? "bg-accent/80" : "bg-gray-300"}`}
            >
                <span
                    className={`rounded-full aspect-square bg-white absolute top-1 bottom-1 ${isActive ? "left-6" : "left-1"}`}
                ></span>
            </button>
        </div>
    );
};

export default function PushNotifications() {
    const [notifPreferences, setNotifPreferences] =
        useState<NotificationPreferences | null>(null);
    const [isFetching, setIsFetching] = useState(true);

    const { responder } = useCoreHook();

    useEffect(() => {
        const fetchPreferences = async () => {
            if (!responder?.id) return;

            setIsFetching(true);
            try {
                const res = await responderAPI.getResponderNotifPreferences(
                    responder.id,
                );
                setNotifPreferences(res);
            } catch (error) {
                console.log(error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchPreferences();
    }, [responder?.id]);

    const handleToggle = async (
        type: keyof NotificationPreferences,
        enabled: boolean,
    ) => {
        const oldValue = notifPreferences?.[type];
        if (!responder?.id) return;

        try {
            setNotifPreferences((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    [type]: enabled,
                };
            });

            await responderAPI.updateResponderNotifPreferences(responder.id, type, enabled);
        } catch (error) {
            setNotifPreferences((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    [type]: oldValue,
                };
            });
        }
    };

    if (isFetching || !notifPreferences) {
        return <div>wait lang</div>;
    }

    return (
        <div>
            <SectionLabel label="PUSH NOTIFICATIONS" />
            <Card className="!p-0">
                <ToggleSection
                    Icon={TriangleAlert}
                    label="Warning Alerts"
                    isActive={notifPreferences.warning}
                    onToggle={(enabled) => handleToggle("warning", enabled)}
                />
                <ToggleSection
                    Icon={CircleAlert}
                    label="Critical Alerts"
                    isActive={notifPreferences.critical}
                    onToggle={(enabled) => handleToggle("critical", enabled)}
                />
                <ToggleSection
                    Icon={Waves}
                    label="Blockage Detections"
                    isActive={notifPreferences.blockage}
                    onToggle={(enabled) => handleToggle("blockage", enabled)}
                />
                <ToggleSection
                    Icon={Megaphone}
                    label="Announcements"
                    isActive={notifPreferences.announcement}
                    onToggle={(enabled) =>
                        handleToggle("announcement", enabled)
                    }
                />
            </Card>
        </div>
    );
}
