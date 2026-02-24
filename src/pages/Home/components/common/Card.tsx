import type { ReactNode } from "react";
import CardTitle from "./CardTitle";

type Props = {
    children: ReactNode;
    headerTitle?: string;
    className?: string;
};

export default function Card({ children, headerTitle, className }: Props) {
    return (
        <div
            className={`rounded-lg bg-white custom-shadow px-4 py-5 ${className || ""}`}
        >
            {headerTitle && <CardTitle title={headerTitle} />}
            {children}
        </div>
    );
}
