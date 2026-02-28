import { createBrowserRouter, Navigate } from "react-router-dom";

import VerifyLayout from "./layouts/VerifyLayout";
import PhoneLookup from "./pages/Verify/pages/PhoneLookup";
import OTPVerification from "./pages/Verify/pages/OTPVerification";
import { VerifyPageProvider } from "./pages/Verify/context/VerifyPageContext";
import InstallGate from "./pages/InstallGate";
import Home from "./pages/Home";
import AuthGuard from "./guards/AuthGuard";
import MainLayout from "./layouts/MainLayout";
import InstalledGuard from "./guards/InstalledGuard";
import Profile from "./pages/Profile";
import Alerts from "./pages/Alerts";
import { AlertsPageProvider } from "./pages/Alerts/context/AlertsPageContext";

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <InstalledGuard>
                <AuthGuard>
                    <MainLayout />
                </AuthGuard>
            </InstalledGuard>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/home" replace />,
            },
            {
                path: "/home",
                element: <Home />,
            },
            {
                path: "/alerts",
                element: (
                    <AlertsPageProvider>
                        <Alerts />
                    </AlertsPageProvider>
                ),
            },
            {
                path: "/me",
                element: <Profile />,
            },
        ],
    },
    {
        path: "/install",
        element: <InstallGate />,
    },
    {
        path: "/verify",
        element: (
            <InstalledGuard>
                <VerifyPageProvider>
                    <VerifyLayout />
                </VerifyPageProvider>
            </InstalledGuard>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="phone-lookup" replace />,
            },
            {
                path: "phone-lookup",
                element: <PhoneLookup />,
            },
            {
                path: "otp-verification",
                element: <OTPVerification />,
            },
        ],
    },
]);
