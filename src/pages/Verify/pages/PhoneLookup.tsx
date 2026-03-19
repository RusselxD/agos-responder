import { useState } from "react";
import { isAxiosError } from "axios";
import Container from "../components/Container";
import { normalizeNumberInput, formatPHNumber } from "../../../lib/utils/phone";
import PhoneNumberInput from "../components/PhoneNumberInput";
import { verifyAPI } from "../../../lib/api/verify";
import { useVerify } from "../context/VerifyPageContext";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../../context/I18nContext";

export default function PhoneLookup() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [normalizedPhoneNumber, setNormalizedPhoneNumber] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { setResponderDetails } = useVerify();
    const navigate = useNavigate();
    const { t } = useI18n();

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
            headerTitle={t("verify.activateAccount")}
            headerSubtitle={t("verify.activateSubtitle")}
        >
            {error && (
                <p className="text-sm mt-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 py-2 px-2 border border-red-500 dark:border-red-700 rounded-md">
                    {error}
                </p>
            )}
            <div className="mt-5">
                <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("verify.mobileNumber")}
                </p>
                <PhoneNumberInput
                    value={phoneNumber}
                    onChange={handleInputNumber}
                />
                {normalizedPhoneNumber && (
                    <span className="text-sm mt-1 text-gray-500 block">{`${t("verify.fullNumber")} ${formatPHNumber(normalizedPhoneNumber)}`}</span>
                )}
                <button
                    onClick={() => handleSubmit()}
                    disabled={normalizedPhoneNumber.length < 13}
                    className="btn-submit mt-5"
                >
                    {isSubmitting && <div className="spinner w-4 h-4" />}
                    <span>{t("verify.continue")}</span>
                </button>
            </div>
        </Container>
    );
}
