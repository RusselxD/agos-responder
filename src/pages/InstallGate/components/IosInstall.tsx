import { useNavigate } from "react-router-dom";
import { Share, PlusSquare, Check } from "lucide-react";
import { isPwaInstalled } from "../../../lib/utils/pwa";

export default function IosInstall() {
    const navigate = useNavigate();
    const installed = isPwaInstalled();

    const handleContinue = () => {
        navigate("/verify", { replace: true });
    };

    if (installed) {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600 font-medium">
                    <Check className="w-5 h-5 shrink-0" />
                    Patrol is installed
                </div>
                <button
                    onClick={handleContinue}
                    className="w-full bg-accent hover:bg-teal-400 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                    Continue to verification
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <p className="text-sm text-gray-600 dark:text-slate-300 text-center">
                Follow these steps to install Patrol on your iPhone:
            </p>

            <div className="space-y-4">
                <Step
                    number={1}
                    icon={<SafariIcon />}
                    title="Open in Safari"
                    description="Make sure you're viewing this page in Safari, not another browser."
                />
                <Step
                    number={2}
                    icon={<Share className="w-5 h-5 text-primary dark:text-accent" />}
                    title="Tap the Share button"
                    description="Tap the share icon at the bottom of the Safari toolbar."
                />
                <Step
                    number={3}
                    icon={<PlusSquare className="w-5 h-5 text-primary dark:text-accent" />}
                    title='Tap "Add to Home Screen"'
                    description="Scroll down in the share menu and select this option."
                />
                <Step
                    number={4}
                    icon={<Check className="w-5 h-5 text-primary dark:text-accent" />}
                    title='Tap "Add"'
                    description='Confirm by tapping "Add" in the top-right corner.'
                />
            </div>

            <button
                onClick={handleContinue}
                className="w-full bg-accent hover:bg-teal-400 text-white font-semibold py-3 rounded-xl transition-colors"
            >
                Skip and continue to verification
            </button>
        </div>
    );
}

function Step({
    number,
    icon,
    title,
    description,
}: {
    number: number;
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent font-bold text-sm shrink-0">
                {number}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                        {title}
                    </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {description}
                </p>
            </div>
        </div>
    );
}

function SafariIcon() {
    return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" className="text-primary dark:text-accent" />
            <path d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="text-primary dark:text-accent" />
        </svg>
    );
}
