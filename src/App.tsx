import { RouterProvider } from "react-router-dom";
import { useRegisterSW } from "virtual:pwa-register/react";
import { router } from "./router";

function UpdatePrompt() {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW();

    if (!needRefresh) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-white p-3 flex items-center justify-between text-sm shadow-lg">
            <span>A new version is available.</span>
            <div className="flex gap-2">
                <button
                    onClick={() => updateServiceWorker(true)}
                    className="px-3 py-1 bg-white text-primary rounded text-xs font-medium"
                >
                    Update
                </button>
                <button
                    onClick={() => setNeedRefresh(false)}
                    className="px-3 py-1 border border-white/30 rounded text-xs"
                >
                    Later
                </button>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <div className="max-w-md mx-auto">
            <UpdatePrompt />
            <RouterProvider router={router} />
        </div>
    );
}
