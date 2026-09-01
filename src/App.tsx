import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { startPwaUpdateLifecycle } from "./lib/pwa/updateLifecycle";

export default function App() {
    useEffect(() => startPwaUpdateLifecycle(router), []);

    return (
        <div className="max-w-md mx-auto">
            <RouterProvider router={router} />
        </div>
    );
}
