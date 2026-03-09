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

const MAX_BACKOFF_MS = 30_000;
const BASE_BACKOFF_MS = 1_000;

type WebSocketMessage = { type: string; data: any };
type ConnectionStatus = "connecting" | "connected" | "disconnected";

interface WSContextValue {
    isConnected: boolean;
    connectionStatus: ConnectionStatus;
    reconnect: () => void;
    subscribe: (type: string, callback: (data: any) => void) => () => void;
}

const WSContext = createContext<WSContextValue | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const socketRef = useRef<WebSocket | null>(null);
    const [connectionStatus, setConnectionStatus] =
        useState<ConnectionStatus>("disconnected");
    const { responder } = useCoreHook();

    // Track whether the component is mounted to prevent reconnect after unmount
    const mountedRef = useRef(true);
    // Track intentional close to prevent reconnect on unmount
    const intentionalCloseRef = useRef(false);
    // Backoff state for reconnect attempts
    const retryCountRef = useRef(0);
    const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Storage box that keeps track of event listeners for different message types
    const listenersRef = useRef<Map<string, Set<(data: any) => void>>>(
        new Map(),
    );

    const connect = useCallback(() => {
        if (!responder || !mountedRef.current) return;

        // Clean up existing connection — close silently without triggering reconnect
        if (socketRef.current) {
            const oldSocket = socketRef.current;
            socketRef.current = null;
            oldSocket.onclose = null;
            oldSocket.onerror = null;
            oldSocket.onmessage = null;
            oldSocket.close();
        }

        setConnectionStatus("connecting");

        const ws = new WebSocket(
            `${websocketUrl}/ws?location_id=${responder.locationId}`,
        );
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected");
            setConnectionStatus("connected");
            retryCountRef.current = 0; // Reset backoff on successful connect
        };

        ws.onmessage = (e) => {
            try {
                const message: WebSocketMessage = JSON.parse(e.data);
                console.log("Message received: ", message);

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
            setConnectionStatus("disconnected");

            // Auto-reconnect with exponential backoff unless intentionally closed
            if (!intentionalCloseRef.current && mountedRef.current) {
                const delay = Math.min(
                    BASE_BACKOFF_MS * 2 ** retryCountRef.current,
                    MAX_BACKOFF_MS,
                );
                console.log(`Reconnecting in ${delay}ms...`);
                retryTimeoutRef.current = setTimeout(() => {
                    retryCountRef.current += 1;
                    connect();
                }, delay);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }, [responder]);

    // Connect when responder is available
    useEffect(() => {
        mountedRef.current = true;
        connect();

        return () => {
            mountedRef.current = false;
            intentionalCloseRef.current = true;
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
            socketRef.current?.close();
        };
    }, [connect]);

    // Manual reconnect: reset backoff and connect immediately
    const reconnect = useCallback(() => {
        retryCountRef.current = 0;
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }
        connect();
    }, [connect]);

    const subscribe = useCallback(
        (type: string, callback: (data: any) => void) => {
            if (!listenersRef.current.has(type)) {
                listenersRef.current.set(type, new Set());
            }

            listenersRef.current.get(type)!.add(callback);

            return () => {
                const callbacks = listenersRef.current.get(type);
                if (callbacks) {
                    callbacks.delete(callback);

                    if (callbacks.size === 0) {
                        listenersRef.current.delete(type);
                    }
                }
            };
        },
        [],
    );

    const isConnected = connectionStatus === "connected";

    const contextValue = useMemo(
        () => ({
            isConnected,
            connectionStatus,
            reconnect,
            subscribe,
        }),
        [isConnected, connectionStatus, reconnect, subscribe],
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
