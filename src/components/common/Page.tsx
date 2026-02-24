import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
    className?: string;
};

export default function Page({ children, className }: Props) {
    return <div className={`p-4 space-y-3 ${className || ""}`}>{children}</div>;
}
