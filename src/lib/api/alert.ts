import type { Alert } from "../../types/alert";
import apiClient from "./axiosConfig";

export const alertsAPI = {
    getUnreadAlertsCount: async (responderId: string): Promise<number> => {
        console.log(responderId);
        try {
            const res = await apiClient.get(
                `/responder/unread-alerts-count/${responderId}`,
            );
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    getAlerts: async (responderId: string): Promise<Alert[]> => {
        try {
            const res = await apiClient.get(`/responder/alerts/${responderId}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    // getAlerts: async (responderId: string): Promise<Alert[]> => {
    //     console.log(responderId);
    //     try {
    //         await new Promise((resolve) => setTimeout(resolve, 1000));
    //         return [
    //             {
    //                 id: "1",
    //                 type: "critical",
    //                 title: "Critical Alert",
    //                 message: "A critical-level condition has been detected.",
    //                 timestamp: new Date().toISOString(),
    //                 isAcknowledged: false,
    //                 acknowledgedAt: null,
    //             },
    //             {
    //                 id: "7",
    //                 type: "announcement",
    //                 title: "Test Announcement",
    //                 message: "This is a test announcement.",
    //                 timestamp: new Date().toISOString(),
    //                 isAcknowledged: false,
    //                 acknowledgedAt: null,
    //             },
    //             {
    //                 id: "8",
    //                 type: "announcement",
    //                 title: "Test Announcement",
    //                 message: "This is a test announcement.",
    //                 timestamp: new Date().toISOString(),
    //                 isAcknowledged: false,
    //                 acknowledgedAt: null,
    //             },
    //             {
    //                 id: "2",
    //                 type: "warning",
    //                 title: "Warning Alert",
    //                 message: "A warning-level condition has been detected.",
    //                 timestamp: new Date().toISOString(),
    //                 isAcknowledged: true,
    //                 acknowledgedAt: new Date().toISOString(),
    //             },
    //             {
    //                 id: "3",
    //                 type: "blockage",
    //                 title: "Blockage Alert",
    //                 message: "A blockage has been detected.",
    //                 timestamp: new Date().toISOString(),
    //                 isAcknowledged: true,
    //                 acknowledgedAt: new Date().toISOString(),
    //             },
    //             {
    //                 id: "4",
    //                 type: "announcement",
    //                 title: "Test Announcement",
    //                 message: "This is a test announcement.",
    //                 timestamp: new Date().toISOString(),
    //                 isAcknowledged: true,
    //                 acknowledgedAt: new Date().toISOString(),
    //             },
    //             {
    //                 id: "5",
    //                 type: "announcement",
    //                 title: "Test Announcement",
    //                 message: "This is a test announcement.",
    //                 timestamp: new Date().toISOString(),
    //                 isAcknowledged: false,
    //                 acknowledgedAt: null,
    //             },
    //             {
    //                 id: "6",
    //                 type: "announcement",
    //                 title: "Test Announcement",
    //                 message: "This is a test announcement.",
    //                 timestamp: new Date().toISOString(),
    //                 isAcknowledged: false,
    //                 acknowledgedAt: null,
    //             },
    //         ] as Alert[];
    //     } catch (error) {
    //         throw error;
    //     }
    // },
};
