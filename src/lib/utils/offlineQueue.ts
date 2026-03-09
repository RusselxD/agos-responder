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

export async function flushQueue(): Promise<number> {
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
}
