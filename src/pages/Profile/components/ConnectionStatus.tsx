import { RefreshCw } from "lucide-react";
import { useWebSocket } from "../../../context/WebsocketContext";
import { useI18n } from "../../../context/I18nContext";
import type { TranslationKey } from "../../../lib/i18n";

const statusConfig: Record<
    string,
    { labelKey: TranslationKey; dotColor: string; textColor: string }
> = {
    connecting: {
        labelKey: "profile.connecting",
        dotColor: "bg-yellow-400",
        textColor: "text-yellow-600",
    },
    connected: {
        labelKey: "profile.online",
        dotColor: "bg-emerald-400",
        textColor: "text-emerald-600",
    },
    disconnected: {
        labelKey: "profile.offline",
        dotColor: "bg-red-400",
        textColor: "text-red-600",
    },
};

export default function ConnectionStatus() {
    const { connectionStatus, reconnect } = useWebSocket();
    const { t } = useI18n();
    const { labelKey, dotColor, textColor } = statusConfig[connectionStatus];

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
                <span
                    className={`w-2 h-2 rounded-full ${dotColor} ${
                        connectionStatus === "connecting" ? "animate-pulse" : ""
                    }`}
                />
                <span className={`text-sm font-medium ${textColor}`}>
                    {t(labelKey)}
                </span>
            </div>

            {connectionStatus === "disconnected" && (
                <button
                    onClick={reconnect}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 active:bg-gray-200 dark:active:bg-slate-600 transition-colors"
                    title="Reconnect"
                >
                    <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                </button>
            )}
        </div>
    );
}
