import type { ReactNode } from "react";

interface ContainerProps {
    headerTitle: string;
    headerSubtitle: string;
    children: ReactNode;
}

export default function Container({
    headerTitle,
    headerSubtitle,
    children,
}: ContainerProps) {
    return (
        <div className="rounded-xl overflow-hidden px-5 py-10 relative custom-shadow bg-white dark:bg-slate-800 dark:border dark:border-slate-700">
            <div className="h-1.5 bg-primary dark:bg-accent absolute top-0 left-0 right-0"></div>

            <div className="flex flex-col items-center">
                <img src="/patrol.svg" className="w-12" alt="Patrol" />
                <h2 className="text-[1.600rem] font-bold mt-4 dark:text-white">
                    {headerTitle}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
                    {headerSubtitle}
                </p>
            </div>

            <div>{children}</div>
        </div>
    );
}
