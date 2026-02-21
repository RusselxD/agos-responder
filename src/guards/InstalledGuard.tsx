import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { isPwaInstalled } from "../lib/utils/pwa";

interface InstalledGuardProps {
    children: ReactNode;
}

export default function InstalledGuard({ children }: InstalledGuardProps) {
    const [installed, setInstalled] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        const updateInstalled = () => {
            setInstalled(isPwaInstalled());
        };

        // Initial check
        updateInstalled();

        // React to display-mode changes (e.g. user installs while on page)
        const mediaQuery = window.matchMedia(
            "(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)",
        );
        const handler = () => updateInstalled();
        mediaQuery.addEventListener("change", handler);

        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    if (installed === null) {
        return null;
    }

    if (!installed) {
        return <Navigate to="/install" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
