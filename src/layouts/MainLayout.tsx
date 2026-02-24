import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { WebSocketProvider } from "../context/WebsocketContext";
import { CoreProvider } from "../context/CoreContext";
import { FusionAnalysisProvider } from "../context/FusionAnalysisContext";
import { BlockageProvider } from "../context/BlockageContext";
import { WaterLevelProvider } from "../context/WaterLevelContext";

export default function MainLayout() {
    return (
        <CoreProvider>
            <WebSocketProvider>
                <FusionAnalysisProvider>
                    <BlockageProvider>
                        <WaterLevelProvider>
                            <div>
                                <div className="min-h-[100dvh] bg-background">
                                    <Outlet />
                                </div>
                                <BottomNav />
                            </div>
                        </WaterLevelProvider>
                    </BlockageProvider>
                </FusionAnalysisProvider>
            </WebSocketProvider>
        </CoreProvider>
    );
}
