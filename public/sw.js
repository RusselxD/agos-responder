import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Push notification handlers
self.addEventListener("push", (event) => {
    const data = event.data?.json() ?? { title: "AGOS", message: "" };

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.message,
            icon: "/agos.png",
            badge: "/agos.png",
            data: { url: data.url ?? "/" },
        }),
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
