export type NotificationType =
    | "warning"
    | "critical"
    | "blockage"
    | "announcement";

export interface Alert {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    isAcknowledged: boolean;
    acknowledgedAt: string | null;
}
