import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "../../../context/I18nContext";
import type { TranslationKey } from "../../../lib/i18n";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

const config: Record<
    ConnectionStatus,
    { icon: typeof Wifi; iconClass: string; textKey: TranslationKey; bg: string }
> = {
    connecting: {
        icon: Loader2,
        iconClass: "animate-spin",
        textKey: "home.connecting",
        bg: "bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-950/50 dark:border-yellow-700 dark:text-yellow-400",
    },
    connected: {
        icon: Wifi,
        iconClass: "",
        textKey: "home.connected",
        bg: "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-700 dark:text-emerald-400",
    },
    disconnected: {
        icon: WifiOff,
        iconClass: "",
        textKey: "home.disconnected",
        bg: "bg-red-50 border-red-300 text-red-700 dark:bg-red-950/50 dark:border-red-700 dark:text-red-400",
    },
};

export default function ConnectionStatusBanner({
    status,
}: {
    status: ConnectionStatus;
}) {
    const [visible, setVisible] = useState(true);
    const { t } = useI18n();

    // Auto-hide after 3 seconds when connected
    useEffect(() => {
        setVisible(true);

        if (status === "connected") {
            const timeout = setTimeout(() => setVisible(false), 3000);
            return () => clearTimeout(timeout);
        }
    }, [status]);

    if (!visible) return null;

    const { icon: Icon, iconClass, textKey, bg } = config[status];

    return (
        <div
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-opacity ${bg}`}
        >
            <Icon className={`w-4 h-4 shrink-0 ${iconClass}`} />
            <span>{t(textKey)}</span>
        </div>
    );
}
