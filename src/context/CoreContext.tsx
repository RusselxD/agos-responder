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
    isLoading: boolean;
    logOut: () => void;
}

const CoreContext = createContext<CoreContextValue | undefined>(undefined);

export function CoreProvider({ children }: { children: ReactNode }) {
    const responderId = localStorage.getItem("responderId") || "";

    const [responder, setResponder] = useState<Responder | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
            } finally {
                setIsLoading(false);
            }
        };

        if (responderId) {
            fetchResponderDetails();
        } else {
            setIsLoading(false);
        }
    }, [responderId, logOut]);

    const contextValue = useMemo(
        () => ({
            responderId,
            responder,
            isLoading,
            logOut,
        }),
        [responderId, responder, isLoading, logOut],
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
