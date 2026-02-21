import { Outlet } from "react-router-dom";

export default function VerifyLayout() {
    return (
        <div className="min-h-[100dvh] px-2 pt-32">
            <Outlet />
        </div>
    );
}
