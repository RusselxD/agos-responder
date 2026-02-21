import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
}

export default function AndroidInstall() {
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalling, setIsInstalling] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [showManualHint, setShowManualHint] = useState(false);

    useEffect(() => {
        const displayModeQuery = window.matchMedia(
            "(display-mode: standalone)",
        );
        const updateInstalledState = () => {
            setIsInstalled(displayModeQuery.matches);
        };

        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setDeferredPrompt(event as BeforeInstallPromptEvent);
            setShowManualHint(false);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
            setShowManualHint(false);
        };

        updateInstalledState();
        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt as EventListener,
        );
        window.addEventListener("appinstalled", handleAppInstalled);
        displayModeQuery.addEventListener("change", updateInstalledState);

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt as EventListener,
            );
            window.removeEventListener("appinstalled", handleAppInstalled);
            displayModeQuery.removeEventListener(
                "change",
                updateInstalledState,
            );
        };
    }, []);

    const handleInstall = async () => {
        if (isInstalled || isInstalling) {
            return;
        }

        if (!deferredPrompt) {
            setShowManualHint(true);
            return;
        }

        setIsInstalling(true);

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === "accepted") {
                setIsInstalled(true);
                setShowManualHint(false);
            } else {
                setShowManualHint(true);
            }
        } finally {
            setDeferredPrompt(null);
            setIsInstalling(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleInstall}
                disabled={isInstalling || isInstalled}
                className="w-full bg-accent hover:bg-teal-400 text-white font-semibold py-3 rounded-xl transition-colors"
            >
                {isInstalled
                    ? "AGOS Installed"
                    : isInstalling
                      ? "Opening Install Prompt..."
                      : "Install AGOS"}
            </button>
            {showManualHint && (
                <p className="mt-3 text-sm text-gray-700">
                    Install prompt is unavailable. In Chrome, open the browser
                    menu and tap "Add to Home screen."
                </p>
            )}
        </div>
    );
}
