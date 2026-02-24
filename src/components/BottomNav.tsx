import type { FC } from "react";
import type { LucideProps } from "lucide-react";
import { Bell, Home, User } from "lucide-react";
import { NavLink } from "react-router-dom";

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
    return (
        <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between py-1 px-10 bg-white border-t border-gray-200">
            {tabs.map((tab, index) => {
                return (
                    <NavLink
                        to={tab.path}
                        end
                        key={index}
                        className={({ isActive }) =>
                            `gap-1 flex flex-col items-center rounded-xl py-3 px-5 ${
                                isActive
                                    ? "text-accent font-medium cursor-default bg-accent/10"
                                    : "text-gray-600 active:bg-gray-100"
                            }`
                        }
                    >
                        <tab.icon className="w-5" />
                        <span className="text-xs ">{tab.name}</span>
                    </NavLink>
                );
            })}
        </div>
    );
}
