import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
    children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const hasResponderId = localStorage.getItem("responderId") !== null;
    const hasToken = localStorage.getItem("responderToken") !== null;

    if (!hasResponderId || !hasToken) {
        return <Navigate to="/verify" replace />;
    }

    return <div>{children}</div>;
}
