import { Outlet } from "react-router-dom";

export default function VerifyLayout() {
    return (
        <div className="verify-layout min-h-[100dvh] px-5 flex flex-col items-center justify-center bg-background">
            <div className="w-full max-w-sm">
                <Outlet />
            </div>
        </div>
    );
}
