import Page from "../../components/common/Page";
import BlockageStatusCard from "./components/BlockageStatusCard";
import FusionAnalysisCard from "./components/FusionAnalysisCard";
import WaterLevelStatusCard from "./components/WaterLevelStatusCard/WaterLevelStatusCard";
import WeatherConditionCard from "./components/WeatherConditionCard/WeatherConditionCard";

export default function Home() {
    return (
        <Page>
            <FusionAnalysisCard />
            <BlockageStatusCard />
            <WaterLevelStatusCard />
            <WeatherConditionCard />
        </Page>
    );
}
