import AndroidInstall from "./components/AndroidInstall";
import Header from "./components/Header";
import IosInstall from "./components/IosInstall";

type Platform = "android" | "ios" | "unknown";

function detectPlatform(): Platform {
    if (typeof navigator === "undefined") {
        return "unknown";
    }

    const userAgent = navigator.userAgent ?? "";
    const isAndroid = /Android/i.test(userAgent);
    const isIos =
        /iPhone|iPad|iPod/i.test(userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isAndroid) {
        return "android";
    }

    if (isIos) {
        return "ios";
    }

    return "unknown";
}

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
