import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { usePushNotifications } from "../hooks/usePushNotifications";

interface AuthGuardProps {
    children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    if (localStorage.getItem("responderId") === null) {
        return <Navigate to="/verify" replace />;
    }

    usePushNotifications();

    return <div>{children}</div>;
}
