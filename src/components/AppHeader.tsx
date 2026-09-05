import { useCoreHook } from "../context/CoreContext";

const MapPinFilled = ({ className }: { className?: string }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 10.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
            fill="currentColor"
        />
        <circle cx="12" cy="10" r="2" fill="white" />
    </svg>
);

export default function AppHeader() {
    const { responder } = useCoreHook();

    return (
        <div className="fixed z-50 top-0 left-0 right-0 flex items-center justify-between bg-white dark:bg-slate-900 custom-shadow pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] px-4">
            <div className="flex items-center gap-1">
                <img src="/patrol.svg" className="w-8" alt="" />
                <p className="font-black text-xl text-primary dark:text-accent">Patrol</p>
            </div>
            <div className="flex items-center gap-1">
                <MapPinFilled className="text-red-500" />
                <p className="font-semibold mt-1 dark:text-white">{responder?.locationName}</p>
            </div>
        </div>
    );
}
