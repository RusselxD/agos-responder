import { LogOut } from "lucide-react";
import { useCoreHook } from "../../../context/CoreContext";
import { useI18n } from "../../../context/I18nContext";

export default function Logout() {
    const { logOut } = useCoreHook();
    const { t } = useI18n();

    return (
        <button
            onClick={() => logOut()}
            className="px-4 py-3 w-full active:bg-red-50 dark:active:bg-red-950/50 transition-colors rounded-xl bg-white dark:bg-slate-800 text-red-500 dark:text-red-400 font-medium border-2 border-red-300 dark:border-red-700 flex items-center gap-2 justify-center"
        >
            <LogOut className="w-6 h-6" />
            <span>{t("profile.logout")}</span>
        </button>
    );
}
