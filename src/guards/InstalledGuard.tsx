import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isPwaInstalled } from "../lib/utils/pwa";
import type { ReactNode } from "react";

interface InstalledGuardProps {
    children: ReactNode;
}

export default function InstalledGuard({ children }: InstalledGuardProps) {
    const [installed, setInstalled] = useState<boolean>(() => isPwaInstalled());
    const location = useLocation();

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            "(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)",
        );
        const handler = () => setInstalled(isPwaInstalled());
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    if (!installed) {
        return <Navigate to="/install" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
