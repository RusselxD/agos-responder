import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import type { ReactNode } from "react";
import { useCoreHook } from "./CoreContext";

const websocketUrl = import.meta.env.VITE_API_WS_URL;

type WebSocketMessage = { type: string; data: any };

interface WSContextValue {
    isConnected: boolean;
    subscribe: (type: string, callback: (data: any) => void) => () => void;
}

const WSContext = createContext<WSContextValue | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const socketRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { responder } = useCoreHook();

    // Storage box that keeps track of event listeners for different message types
    const listenersRef = useRef<Map<string, Set<(data: any) => void>>>(
        new Map(),
    );

    useEffect(() => {
        if (!responder) return;

        const ws = new WebSocket(
            `${websocketUrl}/ws?location_id=${responder.locationId}`,
        );
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected");
            setIsConnected(true);
        };

        ws.onmessage = (e) => {
            try {
                const message: WebSocketMessage = JSON.parse(e.data);
                console.log("Message received: ", message);

                // Call function subscribers for this message type
                const callbacks = listenersRef.current.get(message.type);
                if (callbacks) {
                    callbacks.forEach((callback) => callback(message.data));
                }
            } catch (error) {
                console.error("Failed to parse WebSocket message:", error);
            }
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");
            setIsConnected(false);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            ws.close();
        };
    }, [responder]);

    // Function to subscribe to messages of a specific type
    // useCallback memoizes a function definition between component re-renders
    const subscribe = useCallback(
        (type: string, callback: (data: any) => void) => {
            // If no one is listening to this type yet, create a new set
            if (!listenersRef.current.has(type)) {
                listenersRef.current.set(type, new Set());
            }

            // Add the callback to the set of listeners for this type
            listenersRef.current.get(type)!.add(callback);

            // Return a cleanup function that will remove THIS specific callback
            // when the component unmounts (called by React's useEffect cleanup)
            return () => {
                const callbacks = listenersRef.current.get(type);
                if (callbacks) {
                    callbacks.delete(callback); // Remove the callback from the set

                    if (callbacks.size === 0) {
                        // If no more listeners, remove the set
                        listenersRef.current.delete(type);
                    }
                }
            };
        },
        [],
    );

    const contextValue = useMemo(
        () => ({
            isConnected,
            subscribe,
        }),
        [isConnected, subscribe],
    );

    return (
        <WSContext.Provider value={contextValue}>{children}</WSContext.Provider>
    );
}

// Custom hook to use the WebSocket context
export const useWebSocket = () => {
    const context = useContext(WSContext);
    if (context === undefined) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return context;
};

// ===========================================
// Custom hook to listen for specific messages
// ===========================================
export function useWebSocketMessage<T = any>(
    messageType: string,
    onMessage: (data: T) => void,
) {
    // Get subscribe function from context
    const { subscribe } = useWebSocket();

    // Wrap onMessage in a ref so it doesn't trigger re-subscription
    const callbackRef = useRef(onMessage);

    // Keeps the ref updated
    useEffect(() => {
        callbackRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        const unsubscribe = subscribe(messageType, (data) => {
            callbackRef.current(data); // Call the latest onMessage
        });

        return unsubscribe; // Cleanup function on unmount
    }, [messageType, subscribe]);
}
