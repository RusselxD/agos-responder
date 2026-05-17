import type { AcknowledgeNotificationPayload } from "../../types/alert";
import { alertsAPI } from "../api/alert";

const QUEUE_KEY = "offline-ack-queue";

export function getQueue(): AcknowledgeNotificationPayload[] {
    try {
        return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    } catch {
        return [];
    }
}

function saveQueue(queue: AcknowledgeNotificationPayload[]) {
    try {
        localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch {
        // localStorage may be full or disabled — fail silently
    }
}

export function enqueueAcknowledgement(
    payload: AcknowledgeNotificationPayload,
) {
    const queue = getQueue();
    // Avoid duplicates for the same deliveryId
    if (!queue.some((item) => item.deliveryId === payload.deliveryId)) {
        queue.push(payload);
        saveQueue(queue);
    }
}

let flushPromise: Promise<number> | null = null;

export function flushQueue(): Promise<number> {
    // Guard against concurrent runs: two rapid "online" events would otherwise
    // each read the same queue snapshot (it is only cleared after all awaits
    // finish) and double-submit every queued acknowledgement.
    if (flushPromise) return flushPromise;

    flushPromise = (async () => {
        try {
            const queue = getQueue();
            if (queue.length === 0) return 0;

            let synced = 0;
            const remaining: AcknowledgeNotificationPayload[] = [];

            for (const payload of queue) {
                try {
                    await alertsAPI.acknowledgeNotification(payload);
                    synced++;
                } catch {
                    remaining.push(payload);
                }
            }

            saveQueue(remaining);
            return synced;
        } finally {
            flushPromise = null;
        }
    })();

    return flushPromise;
}
