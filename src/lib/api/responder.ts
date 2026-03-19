import type { NotificationPreferences, Responder } from "../../types/responder";
import apiClient from "./axiosConfig";

export const responderAPI = {
    getResponderDetails: async (responderId: string): Promise<Responder> => {
        try {
            const res = await apiClient.get(`/responder/${responderId}`);
            const d = res.data;
            return {
                id: d.id,
                firstName: d.first_name,
                lastName: d.last_name,
                status: d.status,
                phoneNumber: d.phone_number,
                locationId: d.location_id,
                locationName: d.location_name,
                createdAt: d.created_at,
                activatedAt: d.activated_at,
            };
        } catch (error) {
            throw error;
        }
    },

    getResponderNotifPreferences: async (
        responderId: string,
    ): Promise<NotificationPreferences> => {
        try {
            const res = await apiClient.get(
                `/responder/notif-preferences/${responderId}`,
            );
            return res.data as NotificationPreferences;
        } catch (error) {
            throw error;
        }
    },

    updateResponderNotifPreferences: async (
        responderId: string,
        key: keyof NotificationPreferences,
        value: boolean,
    ) => {
        try {
            const payload = {
                key: key,
                value: value,
            };

            const res = await apiClient.put(
                `/responder/notif-preferences/${responderId}`,
                payload,
            );
            return res.data as NotificationPreferences;
        } catch (error) {
            throw error;
        }
    },
};
