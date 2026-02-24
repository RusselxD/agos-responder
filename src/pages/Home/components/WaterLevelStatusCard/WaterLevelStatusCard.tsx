import Card from "../../../../components/common/Card";
import MainDisplay from "./components/MainDisplay";
import MetricCards from "./components/MetricCards";
import "./style.css";

export default function WaterLevelStatusCard() {
    return (
        <Card headerTitle="WATER LEVEL STATUS" className="!p-3">
            <div className="flex h-full justify-between">
                <MainDisplay />
                <MetricCards />
            </div>
        </Card>
    );
}
