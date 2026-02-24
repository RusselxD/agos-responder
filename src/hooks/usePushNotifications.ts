// usePushNotifications.js
import { useEffect } from "react";
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
    const { responder } = useCoreHook();

    useEffect(() => {
        const subscribe = async () => {
            // 1. check browser support
            if (!("serviceWorker" in navigator) || !("PushManager" in window))
                return;

            // 2. ask permission
            const permission = await Notification.requestPermission();
            if (permission !== "granted") return;

            // 3. register sw and wait until ready
            await navigator.serviceWorker.register("/sw.js");
            const sw = await navigator.serviceWorker.ready;

            // 4. get vapid public key from backend
            const { data } = await apiClient.get("/push/vapid-public-key");

            // 5. subscribe
            const subscription = await sw.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(data.public_key),
            });

            // 6. save subscription to backend
            await apiClient.post("/push/subscribe", {
                ...subscription.toJSON(),
                responder_id: responder?.id,
            });
        };

        subscribe();
    }, []); // runs once after login/mount
}
