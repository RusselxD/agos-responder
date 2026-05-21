import { Bell, BellOff, ShieldAlert } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import { useCoreHook } from "../context/CoreContext";
import { useI18n } from "../context/I18nContext";
import {
    usePushNotifications,
    type PushPermission,
} from "../hooks/usePushNotifications";

function isIos(): boolean {
    if (typeof window === "undefined") return false;
    const ua = window.navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua);
}

interface ContentProps {
    permission: PushPermission;
    error: string | null;
    isSubscribing: boolean;
    onAction: () => void;
    onRecheck: () => void;
}

function GateContent({
    permission,
    error,
    isSubscribing,
    onAction,
    onRecheck,
}: ContentProps) {
    const { t } = useI18n();
    const { logOut } = useCoreHook();

    if (permission === "unsupported") {
        return (
            <>
                <div className="flex flex-col items-center text-center gap-3">
                    <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3">
                        <BellOff className="w-7 h-7 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-lg font-semibold dark:text-white">
                        {t("push.unsupportedTitle")}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t("push.unsupportedBody")}
                    </p>
                </div>
                <button
                    onClick={logOut}
                    className="w-full mt-5 rounded-lg border border-gray-300 dark:border-slate-600 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 active:bg-gray-100 dark:active:bg-slate-700"
                >
                    {t("push.logoutButton")}
                </button>
            </>
        );
    }

    if (permission === "denied") {
        return (
            <>
                <div className="flex flex-col items-center text-center gap-3">
                    <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-3">
                        <ShieldAlert className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h2 className="text-lg font-semibold dark:text-white">
                        {t("push.deniedTitle")}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t("push.deniedBody")}
                    </p>
                </div>
                <div className="mt-4 rounded-lg bg-gray-50 dark:bg-slate-700/40 border border-gray-200 dark:border-slate-600 p-3 text-left">
                    <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">
                        {isIos() ? t("push.iosSteps") : t("push.androidSteps")}
                    </p>
                </div>
                <button
                    onClick={onRecheck}
                    className="w-full mt-4 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white active:opacity-90"
                >
                    {t("push.recheckButton")}
                </button>
                <button
                    onClick={logOut}
                    className="w-full mt-2 rounded-lg border border-gray-300 dark:border-slate-600 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 active:bg-gray-100 dark:active:bg-slate-700"
                >
                    {t("push.logoutButton")}
                </button>
            </>
        );
    }

    // default OR granted-but-not-subscribed (subscription error case)
    const isRetryCase = permission === "granted" && !!error;
    const errorMessage =
        error === "vapid_missing"
            ? t("push.errorVapid")
            : error === "subscribe_failed"
              ? t("push.errorSubscribe")
              : null;

    return (
        <>
            <div className="flex flex-col items-center text-center gap-3">
                <div className="rounded-full bg-accent/10 p-3">
                    <Bell className="w-7 h-7 text-accent" />
                </div>
                <h2 className="text-lg font-semibold dark:text-white">
                    {isRetryCase ? t("push.retryTitle") : t("push.title")}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {isRetryCase ? t("push.retrySubtitle") : t("push.subtitle")}
                </p>
            </div>

            {errorMessage && (
                <p className="mt-4 text-xs text-red-600 dark:text-red-400 text-center">
                    {errorMessage}
                </p>
            )}

            <button
                onClick={onAction}
                disabled={isSubscribing}
                className="w-full mt-5 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white active:opacity-90 disabled:opacity-60"
            >
                {isSubscribing
                    ? t("push.enabling")
                    : isRetryCase
                      ? t("push.retryButton")
                      : t("push.enableButton")}
            </button>
            <button
                onClick={logOut}
                className="w-full mt-2 rounded-lg border border-gray-300 dark:border-slate-600 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 active:bg-gray-100 dark:active:bg-slate-700"
            >
                {t("push.logoutButton")}
            </button>
        </>
    );
}

export default function PushPermissionGate() {
    const { responderId } = useCoreHook();
    const { permission, isSubscribed, isSubscribing, error, subscribe, recheck } =
        usePushNotifications();

    const needsGate =
        !!responderId &&
        !isSubscribed &&
        (permission !== "granted" || error !== null);

    useEffect(() => {
        if (!needsGate) {
            document.body.style.overflow = "unset";
            return;
        }
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [needsGate]);

    if (!needsGate) return null;

    return createPortal(
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-800 shadow-2xl p-6">
                <GateContent
                    permission={permission}
                    error={error}
                    isSubscribing={isSubscribing}
                    onAction={subscribe}
                    onRecheck={recheck}
                />
            </div>
        </div>,
        document.body,
    );
}
