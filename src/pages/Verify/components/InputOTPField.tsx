import type {
    KeyboardEvent,
    Dispatch,
    SetStateAction,
    ClipboardEvent,
    RefObject,
} from "react";

interface InputOTPFieldProps {
    isLoading: boolean;
    disabled?: boolean;
    otp: string[];
    setOtp: Dispatch<SetStateAction<string[]>>;
    setErrorMessage: Dispatch<SetStateAction<string>>;
    handleVerify: (code: string) => Promise<void>;
    inputRefs: RefObject<(HTMLInputElement | null)[]>;
}

export default function InputOTPField({
    isLoading,
    disabled = false,
    otp,
    setOtp,
    setErrorMessage,
    handleVerify,
    inputRefs,
}: InputOTPFieldProps) {
    const isLocked = isLoading || disabled;

    const handleChange = (value: string, index: number) => {
        if (isLocked) return;

        if (value && !/^\d+$/.test(value)) return;

        setErrorMessage("");

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        const currentCode = newOtp.join("");

        if (currentCode.length === 6) {
            handleVerify(currentCode);
        } else if (value && index < 5) {
            inputRefs.current?.[index + 1]?.focus();
        }
    };

    const handleClick = (index: number) => {
        const firstEmptyIndex = otp.findIndex((val) => val === "");

        if (firstEmptyIndex !== -1 && index > firstEmptyIndex) {
            inputRefs.current?.[firstEmptyIndex]?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent, index: number) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            return;
        }

        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current?.[index - 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();
        if (isLocked) return;
        const data = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(data)) return;

        const newOtp = data.split("");
        const fullOtp = [...newOtp, ...new Array(6 - newOtp.length).fill("")];
        setOtp(fullOtp);

        if (data.length === 6) {
            handleVerify(data);
        } else {
            inputRefs.current?.[data.length]?.focus();
        }
    };

    return (
        <div className="flex items-center justify-center gap-2">
            {otp.map((digit, index) => (
                <input
                    disabled={isLocked}
                    key={index}
                    type="text"
                    ref={(el) => {
                        if (inputRefs.current) {
                            inputRefs.current[index] = el;
                        }
                    }}
                    value={digit}
                    onClick={() => handleClick(index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onPaste={(e) => handlePaste(e)}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]*"
                    className="w-12 h-14 text-center border-2 border-gray-300 text-xl font-semibold rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
            ))}
        </div>
    );
}
