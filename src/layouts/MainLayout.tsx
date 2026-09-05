import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { WebSocketProvider } from "../context/WebsocketContext";
import { CoreProvider, useCoreHook } from "../context/CoreContext";
import { FusionAnalysisProvider } from "../context/FusionAnalysisContext";
import { BlockageProvider } from "../context/BlockageContext";
import { WaterLevelProvider } from "../context/WaterLevelContext";
import AppHeader from "../components/AppHeader";
import PushNotificationManager from "../components/PushNotificationManager";
import { WeatherProvider } from "../context/WeatherContext";
import { NotificationProvider } from "../context/NotificationContext";

function CoreGate({ children }: { children: React.ReactNode }) {
    const { isLoading } = useCoreHook();

    if (isLoading) {
        return (
            <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-white dark:bg-slate-900">
                <img src="/patrol.png" className="w-32" alt="Patrol" />
            </div>
        );
    }

    return <>{children}</>;
}

export default function MainLayout() {
    return (
        <CoreProvider>
            <CoreGate>
                <WebSocketProvider>
                    <FusionAnalysisProvider>
                        <BlockageProvider>
                            <WaterLevelProvider>
                                <WeatherProvider>
                                    <NotificationProvider>
                                        <div>
                                            <AppHeader />
                                            <div className="min-h-[100dvh] bg-background dark:bg-background-dark pt-14 pb-[calc(5rem+env(safe-area-inset-bottom))]">
                                                <PushNotificationManager />
                                                <Outlet />
                                            </div>
                                            <BottomNav />
                                        </div>
                                    </NotificationProvider>
                                </WeatherProvider>
                            </WaterLevelProvider>
                        </BlockageProvider>
                    </FusionAnalysisProvider>
                </WebSocketProvider>
            </CoreGate>
        </CoreProvider>
    );
}
