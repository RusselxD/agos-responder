import type {
    ResponderRegistrationRequest,
    ResponderOTPVerifyRequest,
    ResponderVerifyRequest,
    ResponderOTPVerifyResponse,
} from "../../types/verify";
import apiClient from "./axiosConfig";

export const verifyAPI = {
    getResponderDetailsForApproval: async (
        request: ResponderRegistrationRequest,
    ): Promise<ResponderVerifyRequest> => {
        const res = await apiClient.post(`/responder/for-approval`, request);
        return res.data as ResponderVerifyRequest;
    },

    resendVerificationOTP: async (responderId: string): Promise<void> => {
        await apiClient.post(`/responder/resend-otp/${responderId}`);
    },

    verifyOTP: async (
        request: ResponderOTPVerifyRequest,
    ): Promise<ResponderOTPVerifyResponse> => {
        const res = await apiClient.post("/responder/verify-otp", request);
        return res.data as ResponderOTPVerifyResponse;
    },
};
