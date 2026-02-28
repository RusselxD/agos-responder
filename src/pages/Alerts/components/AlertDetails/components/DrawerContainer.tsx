import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

interface DrawerContainerProps {
    isOpen: boolean;
    children: ReactNode;
    handleCloseDrawer: () => void;
}

export default function DrawerContainer({
    isOpen,
    children,
    handleCloseDrawer,
}: DrawerContainerProps) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleCloseDrawer();
            }
        };

        if (isOpen) {
            // Prevent body scroll when drawer is open
            document.body.style.overflow = "hidden";
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            // Restore body scroll when drawer closes
            document.body.style.overflow = "unset";
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleCloseDrawer]);

    return createPortal(
        <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${
                isOpen
                    ? "pointer-events-auto opacity-100 bg-black/30"
                    : "pointer-events-none opacity-0 bg-black/0"
            }`}
            onClick={handleCloseDrawer}
        >
            {children}
        </div>,
        document.body,
    );
}
