import { formatPhoneInputDisplay } from "../../../lib/utils/phone";

interface PhoneNumberInputProps {
    value: string;
    onChange: (input: string) => void;
}

export default function PhoneNumberInput({
    value,
    onChange,
}: PhoneNumberInputProps) {
    return (
        <label className="flex items-center border border-gray-200 rounded-lg bg-gray-50 px-3 py-2.5">
            <span className="text-gray-400 mr-2 border-r border-gray-400 pr-3 select-none">
                +63
            </span>
            <input
                type="tel"
                className="flex-1 bg-transparent outline-none border-none text-gray-900 placeholder-gray-400"
                placeholder="9XX XXX XXXX"
                maxLength={12}
                inputMode="numeric"
                autoComplete="tel"
                value={formatPhoneInputDisplay(value)}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.ctrlKey || e.metaKey) return;
                    const allowedKeys = [
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "Tab",
                        "Enter",
                    ];
                    if (!allowedKeys.includes(e.key) && !/[0-9]/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
                onPaste={(e) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData("text");
                    const digitsOnly = pastedText.replace(/\D/g, "");
                    onChange(digitsOnly);
                }}
            />
        </label>
    );
}
