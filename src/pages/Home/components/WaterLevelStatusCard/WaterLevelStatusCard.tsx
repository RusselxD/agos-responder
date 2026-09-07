import Card from "../../../../components/common/Card";
import ErrorCard from "../../../../components/common/ErrorCard";
import { useWaterLevel } from "../../../../context/WaterLevelContext";
import { useI18n } from "../../../../context/I18nContext";
import MainDisplay from "./components/MainDisplay";
import MetricCards from "./components/MetricCards";
import "./style.css";

export default function WaterLevelStatusCard() {
  const { isFetching, sensorData, error } = useWaterLevel();
  const { t } = useI18n();

  if (isFetching && !sensorData) {
    return <div className="skeleton h-48 w-full rounded-xl" />;
  }

  if (error) {
    return <ErrorCard message={error} />;
  }

  return (
    <Card
      headerTitle={t("home.waterLevelStatus")}
      className="!rounded-2xl !border !border-slate-600/80 !bg-slate-800/90 !p-4"
    >
      <div className="grid grid-cols-[minmax(9rem,1fr)_minmax(0,1.35fr)] gap-3">
        <MainDisplay />
        <MetricCards />
      </div>
    </Card>
  );
}
