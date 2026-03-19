import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { isPwaInstalled } from "../../../lib/utils/pwa";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
}

type InstallState =
    | "idle"
    | "installing"
    | "installed"
    | "error"
    | "unavailable"
    | "dismissed";

export default function AndroidInstall() {
    const navigate = useNavigate();
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [installState, setInstallState] = useState<InstallState>(() =>
        isPwaInstalled() ? "installed" : "idle",
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isPwaInstalled()) {
            setInstallState("installed");
            setDeferredPrompt(null);
            return;
        }

        const displayModeQuery = window.matchMedia(
            "(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)",
        );

        const updateInstalledState = () => {
            if (isPwaInstalled()) {
                setInstallState("installed");
                setDeferredPrompt(null);
                setErrorMessage(null);
            }
        };

        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setDeferredPrompt(event as BeforeInstallPromptEvent);
            setInstallState("idle");
            setErrorMessage(null);
        };

        const handleAppInstalled = () => {
            setInstallState("installed");
            setDeferredPrompt(null);
            setErrorMessage(null);
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
        if (installState === "installed" || installState === "installing") {
            return;
        }

        if (isPwaInstalled()) {
            setInstallState("installed");
            return;
        }

        if (!deferredPrompt) {
            setInstallState("unavailable");
            setErrorMessage(null);
            return;
        }

        setInstallState("installing");
        setErrorMessage(null);

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === "accepted") {
                setInstallState("installed");
            } else {
                setInstallState("dismissed");
            }
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Install prompt failed";
            setInstallState("error");
            setErrorMessage(message);
        } finally {
            setDeferredPrompt(null);
        }
    };

    const handleContinue = () => {
        navigate("/verify", { replace: true });
    };

    if (installState === "installed" || isPwaInstalled()) {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600 font-medium">
                    <Check className="w-5 h-5 shrink-0" />
                    AGOS is installed
                </div>
                <button
                    onClick={handleContinue}
                    className="w-full bg-accent hover:bg-teal-400 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                    Continue to verification
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <button
                onClick={handleInstall}
                disabled={installState === "installing"}
                className="w-full bg-accent hover:bg-teal-400 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
            >
                {installState === "installing"
                    ? "Opening install prompt..."
                    : "Install AGOS"}
            </button>

            {installState === "error" && errorMessage && (
                <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                    {errorMessage}
                </p>
            )}

            {(installState === "unavailable" || installState === "dismissed") && (
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    {installState === "dismissed"
                        ? "Install was cancelled. You can try again or use the manual method below."
                        : null}
                    Install prompt is unavailable. In Chrome, open the browser
                    menu (⋮) and tap &quot;Add to Home screen&quot; or
                    &quot;Install app&quot;.
                </p>
            )}
        </div>
    );
}
