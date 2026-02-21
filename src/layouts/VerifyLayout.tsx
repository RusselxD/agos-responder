import { Outlet } from "react-router-dom";

export default function VerifyLayout() {
    return (
        <div className="min-h-[100dvh] px-2 flex flex-col items-center justify-center">
            <div className="-mt-28">
                <Outlet />
            </div>
        </div>
    );
}
