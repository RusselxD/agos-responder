import type { FC } from "react";
import type { LucideProps } from "lucide-react";
import { Bell, Home, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useNotificationHook } from "../context/NotificationContext";

interface Tab {
    name: string;
    path: string;
    icon: FC<LucideProps>;
}

const tabs: Tab[] = [
    {
        name: "Home",
        path: "/home",
        icon: Home,
    },
    {
        name: "Alerts",
        path: "/alerts",
        icon: Bell,
    },
    {
        name: "Profile",
        path: "/me",
        icon: User,
    },
];

export default function BottomNav() {
    const { unreadCount } = useNotificationHook();

    return (
        <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between py-1 px-10 bg-white border-t border-gray-200">
            {tabs.map((tab, index) => {
                return (
                    <NavLink
                        to={tab.path}
                        end
                        key={index}
                        className={({ isActive }) =>
                            `gap-1 flex flex-col relative items-center rounded-xl py-3 px-5 ${
                                isActive
                                    ? "text-accent font-medium cursor-default bg-accent/10"
                                    : "text-gray-600 active:bg-gray-100"
                            }`
                        }
                    >
                        {tab.name === "Alerts" && unreadCount > 0 && (
                            <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {unreadCount}
                            </span>
                        )}
                        <tab.icon className="w-5" />
                        <span className="text-xs ">{tab.name}</span>
                    </NavLink>
                );
            })}
        </div>
    );
}
