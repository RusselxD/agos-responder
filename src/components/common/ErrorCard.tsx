import { CircleAlert } from "lucide-react";
import { useI18n } from "../../context/I18nContext";

export default function ErrorCard({ message }: { message: string }) {
    const { t } = useI18n();

    return (
        <div className="rounded-xl p-3 flex gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 custom-shadow">
            <CircleAlert className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
                <p className="font-medium text-sm text-red-800 dark:text-red-300">
                    {t("home.errorLoadingData")}
                </p>
                <p className="text-xs text-red-500 dark:text-red-400">{message}</p>
            </div>
        </div>
    );
}
