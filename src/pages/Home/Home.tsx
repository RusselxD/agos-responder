import BlockageStatusCard from "./components/BlockageStatusCard";
import FusionAnalysisCard from "./components/FusionAnalysisCard";
import WaterLevelStatusCard from "./components/WaterLevelStatusCard/WaterLevelStatusCard";

export default function Home() {
    return (
        <div className="p-4 space-y-3">
            <FusionAnalysisCard />
            <BlockageStatusCard />
            <WaterLevelStatusCard />
        </div>
    );
}
