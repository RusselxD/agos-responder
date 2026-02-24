import {
    CircleAlert,
    Megaphone,
    TriangleAlert,
    Waves,
    type LucideIcon,
} from "lucide-react";
import Card from "../../../components/common/Card";
import SectionLabel from "./common/SectionLabel";

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
    return (
        <div>
            <SectionLabel label="PUSH NOTIFICATIONS" />
            <Card className="!p-0">
                <ToggleSection
                    Icon={TriangleAlert}
                    label="Warning Alerts"
                    isActive={true}
                    onToggle={() => {}}
                />
                <ToggleSection
                    Icon={CircleAlert}
                    label="Critical Alerts"
                    isActive={true}
                    onToggle={() => {}}
                />
                <ToggleSection
                    Icon={Waves}
                    label="Blockage Detections"
                    isActive={false}
                    onToggle={() => {}}
                />
                <ToggleSection
                    Icon={Megaphone}
                    label="Announcements"
                    isActive={true}
                    onToggle={() => {}}
                />
            </Card>
        </div>
    );
}
