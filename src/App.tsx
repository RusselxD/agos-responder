import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { startPwaUpdateLifecycle } from "./lib/pwa/updateLifecycle";

export default function App() {
    useEffect(() => startPwaUpdateLifecycle(router), []);

    return (
        <div className="min-h-[100dvh] max-w-md mx-auto bg-background dark:bg-background-dark">
            <RouterProvider router={router} />
        </div>
    );
}
