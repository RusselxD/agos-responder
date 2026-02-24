import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { WebSocketProvider } from "../context/WebsocketContext";
import { CoreProvider } from "../context/CoreContext";
import { FusionAnalysisProvider } from "../context/FusionAnalysisContext";
import { BlockageProvider } from "../context/BlockageContext";
import { WaterLevelProvider } from "../context/WaterLevelContext";
import AppHeader from "../components/AppHeader";

export default function MainLayout() {
    return (
        <CoreProvider>
            <WebSocketProvider>
                <FusionAnalysisProvider>
                    <BlockageProvider>
                        <WaterLevelProvider>
                            <div>
                                <AppHeader />
                                <div className="min-h-[100dvh] bg-background pt-16">
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
