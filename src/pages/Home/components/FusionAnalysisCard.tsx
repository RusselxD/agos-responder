import {
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    type LucideIcon,
} from "lucide-react";
import { useFusionAnalysis } from "../../../context/FusionAnalysisContext";
import { getMostRecentDate, getTimeAgo } from "../../../lib/utils/formatter";
import Card from "../../../components/common/Card";

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
        color: "text-emerald-600",
        bgColor: "!bg-emerald-50",
        borderColor: "border-emerald-300",
        icon: CheckCircle,
    },
    warning: {
        color: "text-yellow-600",
        bgColor: "!bg-yellow-50",
        borderColor: "border-yellow-400",
        icon: AlertTriangle,
    },
    critical: {
        color: "text-red-600",
        bgColor: "!bg-red-50",
        borderColor: "border-red-400",
        icon: AlertCircle,
    },
    "n/a": {
        color: "text-gray-600",
        bgColor: "!bg-gray-50",
        borderColor: "border-gray-300",
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
        <p className="text-gray-600 text-xs absolute bottom-2 left-2.5">
            {getTimeAgo(mostRecent)}
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
                <li key={index} className="text-[0.800rem] text-gray-700">
                    {condition}
                </li>
            ))}
        </ul>
    );
};

export default function FusionAnalysisCard() {
    const { fusionAnalysis, error } = useFusionAnalysis();

    const tier =
        tierConfig[
            fusionAnalysis?.fusion_data.alert_name.toLowerCase() || "n/a"
        ] || tierConfig["n/a"];

    if (error) {
        return null;
    }

    return (
        <Card
            className={`${tier.bgColor} ${tier.borderColor} border-l-4 !pb-8 !py-3 !pl-3 relative`}
        >
            <div className="flex gap-3">
                <tier.icon className={`w-8 h-8 ${tier.color}`} />
                <div className="space-y-1">
                    <span className={`font-semibold ${tier.color}`}>
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
