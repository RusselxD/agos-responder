export interface ResponderRegistrationRequest {
    phoneNumber: string;
}

export interface ResponderVerifyRequest {
    responderId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    status: "pending" | "active";
}

export interface ResponderOTPVerifyRequest {
    responderId: string;
    otp: string;
}

export interface ResponderOTPVerifyResponse {
    success: boolean;
    message: string;
    requiresResend: boolean;
}
