import { useEffect, useState } from "react";
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

export function usePushNotifications() {
    const { responderId } = useCoreHook();
    const [pushError, setPushError] = useState<string | null>(null);

    useEffect(() => {
        const subscribe = async () => {
            if (!responderId) return;

            if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
                setPushError("Push notifications are not supported on this device.");
                return;
            }

            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                setPushError("Push notifications are blocked. Enable them in your browser settings to receive critical alerts.");
                return;
            }

            try {
                await navigator.serviceWorker.register("/sw.js");
                const sw = await navigator.serviceWorker.ready;

                const { data } = await apiClient.get("/push/vapid-public-key");
                const publicKey = data.publicKey ?? data.public_key;
                if (!publicKey || typeof publicKey !== "string") {
                    setPushError("Failed to configure push notifications. Please try again later.");
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

                setPushError(null); // Success
            } catch (err) {
                if (import.meta.env.DEV) console.error("Push subscription failed:", err);
                setPushError("Failed to set up push notifications. Please refresh and try again.");
            }
        };

        subscribe();
    }, [responderId]);

    return { pushError };
}
