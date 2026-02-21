import { useState } from "react";
import { isAxiosError } from "axios";
import Container from "../components/Container";
import { normalizeNumberInput, formatPHNumber } from "../../../lib/utils/phone";
import PhoneNumberInput from "../components/PhoneNumberInput";
import { verifyAPI } from "../../../lib/api/verify";
import { useVerify } from "../context/VerifyPageContext";
import { useNavigate } from "react-router-dom";

export default function PhoneLookup() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [normalizedPhoneNumber, setNormalizedPhoneNumber] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { setResponderDetails } = useVerify();
    const navigate = useNavigate();

    const handleInputNumber = (input: string) => {
        setError(null);
        normalizeNumberInput(input, setPhoneNumber, setNormalizedPhoneNumber);
    };

    const handleSubmit = async () => {
        setError(null);
        setIsSubmitting(true);
        try {
            const res = await verifyAPI.getResponderDetailsForApproval({
                phoneNumber: normalizedPhoneNumber,
            });
            setResponderDetails(res);
            navigate("/verify/otp-verification");
        } catch (err) {
            const detail = isAxiosError(err) && err.response?.data?.detail;
            setError(
                detail ??
                    "Unable to reach the server. Please check your connection and try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container
            headerTitle="Activate Your Account"
            headerSubtitle="Enter your registered mobile number to receive your access code"
        >
            {error && (
                <p className="text-sm mt-3 text-red-600 bg-red-50 py-2 px-2 border border-red-500 rounded-md">
                    {error}
                </p>
            )}
            <div className="mt-5">
                <p className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                </p>
                <PhoneNumberInput
                    value={phoneNumber}
                    onChange={handleInputNumber}
                />
                {normalizedPhoneNumber && (
                    <span className="text-sm mt-1 text-gray-500 block">{`Full number: ${formatPHNumber(normalizedPhoneNumber)}`}</span>
                )}
                <button
                    onClick={() => handleSubmit()}
                    disabled={normalizedPhoneNumber.length < 13}
                    className="btn-submit mt-5"
                >
                    {isSubmitting && <div className="spinner w-4 h-4" />}
                    <span>Continue</span>
                </button>
            </div>
        </Container>
    );
}
