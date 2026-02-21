import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import InputOTPField from "../components/InputOTPField";
import { formatPHNumber } from "../../../lib/utils/phone";
import { verifyAPI } from "../../../lib/api/verify";
import { useVerify } from "../context/VerifyPageContext";

export default function OTPVerification() {
    const { responderDetails } = useVerify();
    const navigate = useNavigate();

    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [otpError, setOtpError] = useState<string>("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [requiresResend, setRequiresResend] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (responderDetails === null) {
            navigate("/verify/phone-lookup");
        }
    }, [responderDetails, navigate]);

    const handleVerify = async (code: string) => {
        if (!responderDetails) return;
        setIsVerifying(true);
        setOtpError("");
        setRequiresResend(false);

        try {
            const res = await verifyAPI.verifyOTP({
                responderId: responderDetails.responderId,
                otp: code,
            });

            if (res.success) {
                localStorage.setItem("responderId", responderDetails.responderId);
                navigate(`/home`);
            } else {
                setOtpError(
                    res.message || "Verification failed. Please try again.",
                );
                setRequiresResend(res.requiresResend);
                setOtp(new Array(6).fill(""));
                inputRefs.current?.[0]?.focus();
            }
        } catch {
            setOtpError("Something went wrong. Please try again.");
            setOtp(new Array(6).fill(""));
            inputRefs.current?.[0]?.focus();
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOTP = async () => {
        if (!responderDetails) return;
        setIsResending(true);
        setOtpError("");
        setResendSuccess(false);

        try {
            await verifyAPI.resendVerificationOTP(responderDetails.responderId);
            setResendSuccess(true);
            setRequiresResend(false);
            setOtp(new Array(6).fill(""));
            inputRefs.current?.[0]?.focus();
        } catch {
            setOtpError("Failed to resend code. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    if (!responderDetails) {
        return null;
    }

    return (
        <Container
            headerTitle="Enter Verification Code"
            headerSubtitle="We sent a 6-digit code to your phone number. Enter it below to verify your account."
        >
            <div className="mt-5">
                <div className="p-4 bg-gray-50 rounded-lg text-center mb-6">
                    <p className="font-semibold text-gray-900">
                        {responderDetails.firstName} {responderDetails.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                        {formatPHNumber(responderDetails.phoneNumber)}
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <InputOTPField
                        isLoading={isVerifying}
                        disabled={requiresResend}
                        otp={otp}
                        setOtp={setOtp}
                        setErrorMessage={setOtpError}
                        handleVerify={handleVerify}
                        inputRefs={inputRefs}
                    />

                    {otpError && (
                        <p className="mt-3 text-center text-sm text-red-600 bg-red-50 py-2 px-2 border border-red-200 rounded-md">
                            {otpError}
                        </p>
                    )}

                    {resendSuccess && (
                        <p className="mt-3 text-center text-sm text-green-600 bg-green-50 py-2 px-2 border border-green-200 rounded-md">
                            A new verification code has been sent.
                        </p>
                    )}

                    {isVerifying && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                            <div className="spinner w-4 h-4 border-primary border-t-transparent" />
                            <span>Verifying...</span>
                        </div>
                    )}

                    <div className="mt-4 text-center">
                        {requiresResend ? (
                            <button
                                onClick={handleResendOTP}
                                disabled={isResending}
                                className="text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-50"
                            >
                                {isResending ? "Sending..." : "Send new code"}
                            </button>
                        ) : (
                            <p className="text-sm text-gray-500">
                                Didn't receive the code?{" "}
                                <button
                                    onClick={handleResendOTP}
                                    disabled={isResending}
                                    className="font-medium text-primary hover:text-primary/80 disabled:opacity-50"
                                >
                                    {isResending ? "Sending..." : "Resend"}
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <p className="mt-6 text-center text-xs text-gray-500">
                By verifying, you agree to receive emergency SMS alerts from
                AGOS Flood Monitoring System.
            </p>
        </Container>
    );
}
