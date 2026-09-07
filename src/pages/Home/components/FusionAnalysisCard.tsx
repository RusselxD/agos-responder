import {
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    type LucideIcon,
} from "lucide-react";
import { useFusionAnalysis } from "../../../context/FusionAnalysisContext";
import { getMostRecentDate, getTimeAgo } from "../../../lib/utils/formatter";
import Card from "../../../components/common/Card";
import ErrorCard from "../../../components/common/ErrorCard";

interface TierConfig {
    [key: string]: TierDetails;
}

interface TierDetails {
    color: string;
    bgColor: string;
    borderColor: string;
    icon: LucideIcon;
}

const tierConfig: TierConfig = {
    normal: {
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "!bg-emerald-50 dark:!bg-emerald-950/50",
        borderColor: "border-emerald-300 dark:border-emerald-700",
        icon: CheckCircle,
    },
    warning: {
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "!bg-yellow-50 dark:!bg-yellow-950/50",
        borderColor: "border-yellow-400 dark:border-yellow-700",
        icon: AlertTriangle,
    },
    critical: {
        color: "text-red-600 dark:text-red-400",
        bgColor: "!bg-red-50 dark:!bg-red-950/50",
        borderColor: "border-red-400 dark:border-red-700",
        icon: AlertCircle,
    },
    unavailable: {
        color: "text-gray-600 dark:text-gray-400",
        bgColor: "!bg-gray-50 dark:!bg-slate-800",
        borderColor: "border-gray-300 dark:border-slate-600",
        icon: AlertCircle,
    },
    "n/a": {
        color: "text-gray-600 dark:text-gray-400",
        bgColor: "!bg-gray-50 dark:!bg-slate-800",
        borderColor: "border-gray-300 dark:border-slate-600",
        icon: CheckCircle,
    },
};

const TimeAgoDisplay = () => {
    const { fusionAnalysis } = useFusionAnalysis();

    const mostRecent = getMostRecentDate(
        [
            fusionAnalysis?.blockage_status?.timestamp,
            fusionAnalysis?.water_level_status?.timestamp,
            fusionAnalysis?.weather_status?.timestamp,
        ].filter((d): d is string => d != null),
    );

    return (
        <p className="text-gray-600 dark:text-gray-400 text-xs absolute bottom-2 left-2.5">
            {mostRecent ? getTimeAgo(mostRecent) : "No data"}
        </p>
    );
};

const TriggeredConditionlist = ({
    conditions,
}: {
    conditions: string[] | undefined;
}) => {
    if (!conditions || conditions.length === 0) return null;

    return (
        <ul className="list-disc list-inside space-y-1">
            {conditions.map((condition, index) => (
                <li key={index} className="text-[0.800rem] text-gray-700 dark:text-gray-300">
                    {condition}
                </li>
            ))}
        </ul>
    );
};

export default function FusionAnalysisCard() {
    const { fusionAnalysis, isFetching, error } = useFusionAnalysis();

    const tier =
        tierConfig[
            fusionAnalysis?.fusion_data.alert_name.toLowerCase() || "n/a"
        ] || tierConfig["n/a"];

    if (error) {
        return <ErrorCard message={error} />;
    }

    if (isFetching && !fusionAnalysis) {
        return <div className="skeleton h-24 w-full rounded-xl" />;
    }

    return (
        <Card
            className={`${tier.bgColor} ${tier.borderColor} border !rounded-2xl !px-5 !py-6 relative`}
        >
            <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-950/60 ring-1 ring-white/5">
                    <tier.icon className={`h-9 w-9 ${tier.color}`} />
                </div>
                <div className="space-y-1">
                    <span className={`block text-3xl font-bold ${tier.color}`}>
                        {fusionAnalysis?.fusion_data.alert_name || "N/A"}
                    </span>

                    <TriggeredConditionlist
                        conditions={
                            fusionAnalysis?.fusion_data.triggered_conditions
                        }
                    />
                </div>
            </div>
            <TimeAgoDisplay />
        </Card>
    );
}
