import Card from "../../../../components/common/Card";
import { useWaterLevel } from "../../../../context/WaterLevelContext";
import { useI18n } from "../../../../context/I18nContext";
import MainDisplay from "./components/MainDisplay";
import MetricCards from "./components/MetricCards";
import "./style.css";

export default function WaterLevelStatusCard() {
    const { isFetching, sensorData } = useWaterLevel();
    const { t } = useI18n();

    if (isFetching && !sensorData) {
        return <div className="skeleton h-48 w-full rounded-xl" />;
    }

    return (
        <Card headerTitle={t("home.waterLevelStatus")} className="!p-3">
            <div className="flex h-full justify-between">
                <MainDisplay />
                <MetricCards />
            </div>
        </Card>
    );
}
