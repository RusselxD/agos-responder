import { detectPlatform } from "../../lib/utils/platform";
import AndroidInstall from "./components/AndroidInstall";
import Header from "./components/Header";
import IosInstall from "./components/IosInstall";

export default function InstallGate() {
    const platform = detectPlatform();

    return (
        <div className="min-h-[100dvh] bg-background dark:bg-background-dark px-4 pt-[max(3.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <Header />
            <div className="mt-5">
                {platform === "android" && <AndroidInstall />}
                {platform === "ios" && <IosInstall />}
            </div>
        </div>
    );
}
