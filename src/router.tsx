import { createBrowserRouter } from "react-router-dom";
import InstallGate from "./pages/InstallGate/InstallGate";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <div></div>,
    },
    {
        path: "/install",
        element: <InstallGate />,
    },
]);
