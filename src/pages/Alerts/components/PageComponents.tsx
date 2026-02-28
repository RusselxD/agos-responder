import { BellOff } from "lucide-react";
import Page from "../../../components/common/Page";
import { FILTERS, useAlertsPageHook } from "../context/AlertsPageContext";
import { capitalizeFirstLetter } from "../../../lib/utils/formatter";

export const EmptyPage = ({ isAllChosen }: { isAllChosen: boolean }) => {
    const message = isAllChosen
        ? "You're all caught up! New critical alerts, warnings, and announcements will appear here."
        : "No alerts of this type. Try changing the filter to see more alerts.";

    return (
        <Page className="flex flex-col items-center gap-4 !space-y-0 pt-10">
            <div className="rounded-full bg-gray-200 p-4">
                <BellOff className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="font-semibold text-xl">No alerts</h2>
            <p className="text-center text-gray-600">{message}</p>
        </Page>
    );
};

export const AlertsSkeleton = () => {
    return (
        <Page className="space-y-2">
            {Array.from({ length: 8 }).map((_, index) => (
                <div
                    className="skeleton h-14 w-full rounded-lg"
                    key={index}
                ></div>
            ))}
        </Page>
    );
};

export const ErrorPage = ({ message }: { message: string }) => {
    return (
        <Page>
            <div className="text-red-500 w-full rounded-lg p-3 border border-red-500 bg-red-50 text-sm">
                {message}
            </div>
        </Page>
    );
};

export const AlertTypeFilters = () => {
    const { chosenFilter, handleFilterChange } = useAlertsPageHook();

    return (
        <div className="flex items-center gap-1 flex-wrap">
            {FILTERS.map((filter) => {
                return (
                    <button
                        key={filter}
                        className={`px-4 py-2 text-sm rounded-md text-white ${chosenFilter === filter ? "bg-primary" : "bg-accent/70"}`}
                        onClick={() => handleFilterChange(filter)}
                    >
                        {capitalizeFirstLetter(filter)}
                    </button>
                );
            })}
        </div>
    );
};
