import type { ReactNode } from "react";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { Responder } from "../types/responder";
import { responderAPI } from "../lib/api/responder";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

interface CoreContextValue {
    responderId: string;
    responder: Responder | null;
    logOut: () => void;
}

const CoreContext = createContext<CoreContextValue | undefined>(undefined);

export function CoreProvider({ children }: { children: ReactNode }) {
    const responderId = localStorage.getItem("responderId") || "";

    const [responder, setResponder] = useState<Responder | null>(null);

    const navigate = useNavigate();

    const logOut = useCallback(() => {
        localStorage.clear();
        navigate("/verify");
    }, [navigate]);

    useEffect(() => {
        const fetchResponderDetails = async () => {
            try {
                const res = await responderAPI.getResponderDetails(responderId);
                setResponder(res);
            } catch (error: unknown) {
                if (isAxiosError(error) && error.response?.status === 404) {
                    logOut();
                    return;
                }
                console.error("Failed to fetch responder details:", error);
            }
        };

        if (responderId) {
            fetchResponderDetails();
        }
    }, [responderId, logOut]);

    const contextValue = useMemo(
        () => ({
            responderId,
            responder,
            logOut,
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
