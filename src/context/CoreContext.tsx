import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Responder } from "../types/responder";
import { responderAPI } from "../lib/api/responder";

interface CoreContextValue {
    responderId: string;
    responder: Responder | null;
}

const CoreContext = createContext<CoreContextValue | undefined>(undefined);

export function CoreProvider({ children }: { children: ReactNode }) {
    const responderId = localStorage.getItem("responderId") || "";

    const [responder, setResponder] = useState<Responder | null>(null);

    useEffect(() => {
        const fetchResponderDetails = async () => {
            try {
                const res = await responderAPI.getResponderDetails(responderId);
                setResponder(res);
            } catch (error) {
                console.error("Failed to fetch responder details:", error);
            }
        };

        if (responderId) {
            fetchResponderDetails();
        }
    }, [responderId]);

    const contextValue = useMemo(
        () => ({
            responderId,
            responder,
        }),
        [responderId, responder],
    );

    return (
        <CoreContext.Provider value={contextValue}>
            {children}
        </CoreContext.Provider>
    );
}

export const useCoreHook = () => {
    const context = useContext(CoreContext);
    if (!context) {
        throw new Error("useCoreHook must be used within a CoreProvider");
    }
    return context;
};
