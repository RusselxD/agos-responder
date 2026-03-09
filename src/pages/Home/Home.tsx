import Page from "../../components/common/Page";
import { useWebSocket } from "../../context/WebsocketContext";
import { usePushNotifications } from "../../hooks/usePushNotifications";
import BlockageStatusCard from "./components/BlockageStatusCard";
import ConnectionStatusBanner from "./components/ConnectionStatusBanner";
import FusionAnalysisCard from "./components/FusionAnalysisCard";
import WaterLevelStatusCard from "./components/WaterLevelStatusCard/WaterLevelStatusCard";
import WeatherConditionCard from "./components/WeatherConditionCard/WeatherConditionCard";

export default function Home() {
    usePushNotifications();
    const { connectionStatus } = useWebSocket();

    return (
        <Page>
            <ConnectionStatusBanner status={connectionStatus} />
            <FusionAnalysisCard />
            <BlockageStatusCard />
            <WaterLevelStatusCard />
            <WeatherConditionCard />
        </Page>
    );
}
