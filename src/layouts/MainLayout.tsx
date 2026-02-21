import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { WebSocketProvider } from "../context/WebsocketContext";
import { CoreProvider } from "../context/CoreContext";
import { FusionAnalysisProvider } from "../context/FusionAnalysisContext";

export default function MainLayout() {
    return (
        <CoreProvider>
            <WebSocketProvider>
                <FusionAnalysisProvider>
                    <div>
                        <div className="min-h-[100dvh] bg-background">
                            <Outlet />
                        </div>
                        <BottomNav />
                    </div>
                </FusionAnalysisProvider>
            </WebSocketProvider>
        </CoreProvider>
    );
}
