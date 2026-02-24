import "../style.css";
import { ArrowDown, ArrowRight, ArrowUp, type LucideIcon } from "lucide-react";

import {
    capitalizeFirstLetter,
    getTimeAgo,
} from "../../../../../lib/utils/formatter";
import { useWaterLevel } from "../../../../../context/WaterLevelContext";

const AlertCategory = () => {
    const { sensorData } = useWaterLevel();
    const alert = sensorData?.alert.level || "";

    const getAlertClasses = (alert: string) => {
        switch (alert) {
            case "normal":
                return {
                    circle: "bg-green-600",
                    text: "text-green-700",
                };
            case "warning":
                return {
                    circle: "bg-yellow-500",
                    text: "text-yellow-600",
                };
            case "critical":
                return {
                    circle: "bg-red-600",
                    text: "text-red-700",
                };
            default:
                return {
                    circle: "bg-gray-600",
                    text: "text-gray-700",
                };
        }
    };

    const classes = getAlertClasses(alert);

    return (
        <div className="flex w-fit items-center gap-2">
            <span className={`w-4 h-4 rounded-full ${classes.circle}`}></span>
            <span className={`text-[0.800rem] font-semibold ${classes.text}`}>
                {capitalizeFirstLetter(alert)}
            </span>
        </div>
    );
};

const LevelInfo = () => {
    const { sensorData } = useWaterLevel();
    const level = sensorData?.water_level.trend || "stable";

    const getArrowDirection = (level: string): LucideIcon => {
        switch (level) {
            case "rising":
                return ArrowUp;
            case "falling":
                return ArrowDown;
            case "stable":
                return ArrowRight;
            default:
                return ArrowRight;
        }
    };

    const ArrowIcon = getArrowDirection(level || "stable");

    return (
        <div className="flex items-center gap-1">
            <ArrowIcon size={16} />
            <span className="text-sm">
                {capitalizeFirstLetter(level || "")}
            </span>
        </div>
    );
};

const GaugeDisplay = () => {
    const { sensorConfig, sensorData } = useWaterLevel();

    if (!sensorConfig || !sensorData) {
        return <div className="water-gauge" />;
    }

    // Calculate positions with 20% padding at top
    // Critical line is at 80% of gauge height (leaving 20% padding)
    const criticalLinePosition = 80;

    // Water fill scales to 80% max (where critical line is)
    const waterHeight =
        (sensorData.alert.percentage_of_critical / 100) * criticalLinePosition;

    return (
        <div className="water-gauge">
            <div
                className="water-fill"
                style={{
                    height: `${Math.min(waterHeight, 100)}%`,
                }}
            >
                <div className="wave-container">
                    <svg
                        className="wave wave1"
                        viewBox="0 0 100 20"
                        preserveAspectRatio="none"
                    >
                        <path d="M0,10 Q12.5,5 25,10 T50,10 T75,10 T100,10 L100,20 L0,20 Z" />
                    </svg>
                    <svg
                        className="wave wave2"
                        viewBox="0 0 100 20"
                        preserveAspectRatio="none"
                    >
                        <path d="M0,10 Q12.5,15 25,10 T50,10 T75,10 T100,10 L100,20 L0,20 Z" />
                    </svg>
                    <svg
                        className="wave wave3"
                        viewBox="0 0 100 20"
                        preserveAspectRatio="none"
                    >
                        <path d="M0,10 Q12.5,15 25,10 T50,10 T75,10 T100,10 L100,20 L0,20 Z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default function MainDisplay() {
    const { sensorData } = useWaterLevel();

    return (
        <div className="flex flex-col gap-2">
            <div className="flex relative items-center gap-2 mt-2">
                <GaugeDisplay />
                <div className="space-y-2">
                    <p>
                        <span className="text-2xl font-semibold">
                            {`${(
                                sensorData?.water_level.current_cm || 0
                            ).toFixed(1)} `}
                        </span>
                        <span>cm</span>
                    </p>
                    <AlertCategory />
                    <LevelInfo />
                </div>
            </div>
            <span className="text-[0.800rem] text-gray-900">
                {`Updated ${getTimeAgo(sensorData?.timestamp || "")}`}
            </span>
        </div>
    );
}
