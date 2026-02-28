import { LogOut } from "lucide-react";
import { useCoreHook } from "../../../context/CoreContext";

export default function Logout() {
    const { logOut } = useCoreHook();

    return (
        <button
            onClick={() => logOut()}
            className="px-4 py-3 w-full active:bg-red-50 transition-colors rounded-xl bg-white text-red-500 font-medium border-2 border-red-300 flex items-center gap-2 justify-center"
        >
            <LogOut className="w-6 h-6" />
            <span>Logout</span>
        </button>
    );
}
