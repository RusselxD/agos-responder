import { useCallback, useEffect, useState } from "react";
import apiClient from "../lib/api/axiosConfig";
import { useCoreHook } from "../context/CoreContext";

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export type PushPermission = "default" | "granted" | "denied" | "unsupported";

interface PushNotificationsState {
    permission: PushPermission;
    isSubscribed: boolean;
    isSubscribing: boolean;
    error: string | null;
    subscribe: () => Promise<void>;
    recheck: () => void;
}

function readPermission(): PushPermission {
    if (typeof window === "undefined") return "unsupported";
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        return "unsupported";
    }
    return Notification.permission as PushPermission;
}

export function usePushNotifications(): PushNotificationsState {
    const { responderId } = useCoreHook();
    const [permission, setPermission] = useState<PushPermission>(() =>
        readPermission(),
    );
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const subscribe = useCallback(async () => {
        if (!responderId || isSubscribing) return;

        const supportState = readPermission();
        if (supportState === "unsupported") {
            setPermission("unsupported");
            return;
        }

        setIsSubscribing(true);
        setError(null);
        try {
            let current = Notification.permission as PushPermission;
            if (current === "default") {
                current = (await Notification.requestPermission()) as PushPermission;
            }
            setPermission(current);
            if (current !== "granted") return;

            await navigator.serviceWorker.register("/sw.js");
            const sw = await navigator.serviceWorker.ready;

            const { data } = await apiClient.get("/push/vapid-public-key");
            const publicKey = data.publicKey ?? data.public_key;
            if (!publicKey || typeof publicKey !== "string") {
                setError("vapid_missing");
                return;
            }

            const subscription = await sw.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey),
            });

            await apiClient.post("/push/subscribe", {
                ...subscription.toJSON(),
                responder_id: responderId,
            });

            setIsSubscribed(true);
        } catch (err) {
            if (import.meta.env.DEV) console.error("Push subscription failed:", err);
            setError("subscribe_failed");
        } finally {
            setIsSubscribing(false);
        }
    }, [responderId, isSubscribing]);

    const recheck = useCallback(() => {
        setPermission(readPermission());
        setError(null);
    }, []);

    // Auto-subscribe when permission is granted and we haven't tried yet.
    // The `!error` guard prevents an infinite retry loop after a failure —
    // user must tap Retry in the gate to attempt again.
    useEffect(() => {
        if (!responderId) return;
        if (
            permission === "granted" &&
            !isSubscribed &&
            !isSubscribing &&
            !error
        ) {
            subscribe();
        }
    }, [responderId, permission, isSubscribed, isSubscribing, error, subscribe]);

    // Listen for permission changes (e.g. user enables it in browser settings
    // while modal is open). Permissions API is unsupported in older Safari,
    // so failures are silent.
    useEffect(() => {
        if (typeof navigator === "undefined" || !("permissions" in navigator)) {
            return;
        }
        let cancelled = false;
        let status: PermissionStatus | null = null;
        const handleChange = () => {
            if (!cancelled && status) {
                setPermission(status.state as PushPermission);
            }
        };
        navigator.permissions
            .query({ name: "notifications" as PermissionName })
            .then((s) => {
                if (cancelled) return;
                status = s;
                status.addEventListener("change", handleChange);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
            status?.removeEventListener("change", handleChange);
        };
    }, []);

    return {
        permission,
        isSubscribed,
        isSubscribing,
        error,
        subscribe,
        recheck,
    };
}
