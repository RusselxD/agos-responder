import { useWaterLevel } from "../../../../../context/WaterLevelContext";
import { useI18n } from "../../../../../context/I18nContext";

type StatCardProps = {
    title: string;
    data: string | number;
    desc: string;
};

const StatCard = ({ title, data, desc }: StatCardProps) => {
    const { warning } = useWaterLevel();

    return (
        <div
            className={`border w-full min-h-[4.5rem] flex flex-col justify-between rounded-xl px-3 py-2 ${warning ? "bg-amber-950/50 border-amber-700" : "bg-slate-700/90 border-slate-600"}`}
        >
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</p>
            <p>
                <span className="text-2xl font-semibold dark:text-white">{data}</span>
                <span className="text-xs ml-1 text-gray-700 dark:text-gray-300">{desc}</span>
            </p>
        </div>
    );
};

export default function MetricCards() {
    const { sensorData } = useWaterLevel();
    const { t } = useI18n();

    const getTitleAndDesc = (): StatCardProps => {
        switch (sensorData?.alert.level) {
            case "normal":
                return {
                    title: t("home.toWarning"),
                    data: (
                        sensorData?.alert.distance_to_warning_cm ?? 0
                    ).toFixed(1),
                    desc: t("home.cmRemaining"),
                };
            case "warning":
                return {
                    title: t("home.toCritical"),
                    data: (
                        sensorData?.alert.distance_to_critical_cm ?? 0
                    ).toFixed(1),
                    desc: t("home.cmRemaining"),
                };
            case "critical":
                return {
                    title: t("home.aboveCritical"),
                    data: (
                        sensorData?.alert.distance_from_critical_cm ?? 0
                    ).toFixed(1),
                    desc: t("home.cmOver"),
                };
            default:
                return {
                    title: t("home.toWarning"),
                    data: (
                        sensorData?.alert.distance_to_warning_cm ?? 0
                    ).toFixed(1),
                    desc: t("home.cmRemaining"),
                };
        }
    };

    const titleAndDesc = getTitleAndDesc();

    const changeRateData = sensorData?.water_level.change_rate ?? 0;
    const changeRateDisplay =
        changeRateData > 0 ? `+${changeRateData}` : `${changeRateData}`;

    return (
        <div className="flex min-w-0 flex-col justify-between gap-3">
            <StatCard
                title={t("home.changeRate")}
                data={changeRateDisplay}
                desc="cm/min"
            />
            <StatCard
                title={titleAndDesc.title}
                data={titleAndDesc.data}
                desc={titleAndDesc.desc}
            />
        </div>
    );
}
