import type { FC } from "react";
import type { LucideProps } from "lucide-react";
import { Bell, Home, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useNotificationHook } from "../context/NotificationContext";
import { useI18n } from "../context/I18nContext";
import type { TranslationKey } from "../lib/i18n";

interface Tab {
    nameKey: TranslationKey;
    path: string;
    icon: FC<LucideProps>;
    id: string;
}

const tabs: Tab[] = [
    {
        nameKey: "nav.home",
        path: "/home",
        icon: Home,
        id: "home",
    },
    {
        nameKey: "nav.alerts",
        path: "/alerts",
        icon: Bell,
        id: "alerts",
    },
    {
        nameKey: "nav.profile",
        path: "/me",
        icon: User,
        id: "profile",
    },
];

export default function BottomNav() {
    const { unreadCount } = useNotificationHook();
    const { t } = useI18n();

    return (
        <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between py-1 px-10 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
            {tabs.map((tab) => {
                return (
                    <NavLink
                        to={tab.path}
                        end
                        key={tab.id}
                        className={({ isActive }) =>
                            `gap-1 flex flex-col relative items-center rounded-xl py-3 px-5 ${
                                isActive
                                    ? "text-accent font-medium cursor-default bg-accent/10"
                                    : "text-gray-600 dark:text-gray-400 active:bg-gray-100 dark:active:bg-slate-800"
                            }`
                        }
                    >
                        {tab.id === "alerts" && unreadCount > 0 && (
                            <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {unreadCount}
                            </span>
                        )}
                        <tab.icon className="w-5" />
                        <span className="text-xs ">{t(tab.nameKey)}</span>
                    </NavLink>
                );
            })}
        </div>
    );
}
