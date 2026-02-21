import {
    createContext,
    useContext,
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import type { ResponderVerifyRequest } from "../../../types/verify";

interface VerifyPageContextValue {
    responderDetails: ResponderVerifyRequest | null;
    setResponderDetails: Dispatch<
        SetStateAction<ResponderVerifyRequest | null>
    >;
}

const VerifyPageContext = createContext<VerifyPageContextValue | undefined>(
    undefined,
);

export function VerifyPageProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [responderDetails, setResponderDetails] =
        useState<ResponderVerifyRequest | null>(null);

    const contextValue = useMemo(
        () => ({
            responderDetails,
            setResponderDetails,
        }),
        [responderDetails],
    );

    return (
        <VerifyPageContext.Provider value={contextValue}>
            {children}
        </VerifyPageContext.Provider>
    );
}

export const useVerify = () => {
    const context = useContext(VerifyPageContext);
    if (!context) {
        throw new Error("useVerify must be used within a VerifyPageProvider");
    }
    return context;
};
