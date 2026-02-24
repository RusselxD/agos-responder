import { useWaterLevel } from "../../../../../context/WaterLevelContext";

type StatCardProps = {
    title: string;
    data: string | number;
    desc: string;
};

const StatCard = ({ title, data, desc }: StatCardProps) => {
    const { warning } = useWaterLevel();

    return (
        <div
            className={`border w-full h-full flex flex-col justify-between rounded-md px-3 py-2 ${warning ? "bg-amber-100 border-amber-300" : "bg-slate-100 border-gray-300"}`}
        >
            <p className="text-sm font-medium text-gray-700">{title}</p>
            <p>
                <span className="text-2xl font-semibold">{data}</span>
                <span className="text-xs ml-1 text-gray-700">{desc}</span>
            </p>
        </div>
    );
};

export default function MetricCards() {
    const { sensorData } = useWaterLevel();

    const getTitleAndDesc = (): StatCardProps => {
        switch (sensorData?.alert.level) {
            case "normal":
                return {
                    title: "To Warning",
                    data: (
                        sensorData?.alert.distance_to_warning_cm || 0
                    ).toFixed(1),
                    desc: "cm remaining",
                };
            case "warning":
                return {
                    title: "To Critical",
                    data: (
                        sensorData?.alert.distance_to_critical_cm || 0
                    ).toFixed(1),
                    desc: "cm remaining",
                };
            case "critical":
                return {
                    title: "Above Critical",
                    data: (
                        sensorData?.alert.distance_from_critical_cm || 0
                    ).toFixed(1),
                    desc: "cm over",
                };
            default:
                return {
                    title: "To Warning",
                    data: (
                        sensorData?.alert.distance_to_warning_cm || 0
                    ).toFixed(1),
                    desc: "cm remaining",
                };
        }
    };

    const titleAndDesc = getTitleAndDesc();

    const changeRateData = sensorData?.water_level.change_rate || 0;
    const changeRateDisplay =
        changeRateData > 0 ? `+${changeRateData}` : `${changeRateData}`;

    return (
        <div className="flex flex-col justify-between ml-10 gap-3 flex-1">
            <StatCard
                title="Change Rate"
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
