import { detectPlatform } from "../../lib/utils/platform";
import AndroidInstall from "./components/AndroidInstall";
import Header from "./components/Header";
import IosInstall from "./components/IosInstall";

export default function InstallGate() {
    const platform = detectPlatform();

    return (
        <div className="pt-14 px-2">
            <Header />
            <div className="mt-5">
                {platform === "android" && <AndroidInstall />}
                {platform === "ios" && <IosInstall />}
            </div>
        </div>
    );
}
