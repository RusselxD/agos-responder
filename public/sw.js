import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

// Skip waiting only when the client explicitly requests it (prompt update flow)
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
clientsClaim();

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Vibration patterns per alert type
const vibrationPatterns = {
    critical: [200, 100, 200, 100, 400],
    warning: [200, 100, 200],
    blockage: [150, 80, 150],
    announcement: [100],
};

// Push notification handlers
self.addEventListener("push", (event) => {
    const data = event.data?.json() ?? { title: "AGOS", message: "" };
    const type = data.type || "announcement";
    const vibrate = vibrationPatterns[type] || vibrationPatterns.announcement;

    event.waitUntil(
        Promise.all([
            self.registration.showNotification(data.title, {
                body: data.message,
                icon: "/agos.png",
                badge: "/agos.png",
                vibrate,
                tag: type,
                data: { url: data.url ?? "/", type },
            }),
            // Notify focused clients for in-app sound feedback
            clients
                .matchAll({ type: "window", includeUncontrolled: true })
                .then((clientList) => {
                    for (const client of clientList) {
                        client.postMessage({
                            type: "PUSH_RECEIVED",
                            alertType: type,
                        });
                    }
                }),
        ]),
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    event.waitUntil(
        clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url.endsWith("/") && "focus" in client)
                        return client.focus();
                }
                if (clients.openWindow)
                    return clients.openWindow(
                        event.notification.data?.url ?? "/",
                    );
            }),
    );
});
