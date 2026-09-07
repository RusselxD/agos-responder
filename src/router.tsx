import { createBrowserRouter, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/common/ErrorBoundary";

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
        element: (
          <ErrorBoundary>
            <Home />
          </ErrorBoundary>
        ),
      },
      {
        path: "/alerts",
        element: (
          <ErrorBoundary>
            <AlertsPageProvider>
              <Alerts />
            </AlertsPageProvider>
          </ErrorBoundary>
        ),
      },
      {
        path: "/me",
        element: (
          <ErrorBoundary>
            <Profile />
          </ErrorBoundary>
        ),
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
