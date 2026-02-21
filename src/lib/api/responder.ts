import type { Responder } from "../../types/responder";
import apiClient from "./axiosConfig";

export const responderAPI = {
    getResponderDetails: async (responderId: string): Promise<Responder> => {
        try {
            const res = await apiClient.get(`/responder/${responderId}`);
            return res.data as Responder;
        } catch (error) {
            throw error;
        }
    },
};
