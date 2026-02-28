import { useEffect, useState } from "react";
import type { Alert } from "../../types/alert";
import { alertsAPI } from "../../lib/api/alert";
import { useCoreHook } from "../../context/CoreContext";
import Page from "../../components/common/Page";
import AlertCard from "./components/AlertCard";
import { BellOff } from "lucide-react";

const EmptyPage = () => {
    return (
        <Page className="flex flex-col items-center gap-4 !space-y-0 pt-10">
            <div className="rounded-full bg-gray-200 p-4">
                <BellOff className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="font-semibold text-xl">No alerts</h2>
            <p className="text-center text-gray-600">
                You're all caught up! New critical alerts, warnings, and
                announcements will appear here.
            </p>
        </Page>
    );
};

const AlertsSkeleton = () => {
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

const ErrorPage = ({ message }: { message: string }) => {
    return (
        <Page>
            <div className="text-red-500 w-full rounded-lg p-3 border border-red-500 bg-red-50 text-sm">
                {message}
            </div>
        </Page>
    );
};

export default function Alerts() {
    const [alerts, setAlerts] = useState<Alert[] | undefined>(undefined);

    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string>("");

    const { responderId } = useCoreHook();

    useEffect(() => {
        const fetchAlerts = async () => {
            setIsFetching(true);
            try {
                const res = await alertsAPI.getAlerts(responderId);
                setAlerts(res);
            } catch (error) {
                setError("Failed to fetch alerts. Please try again.");
            } finally {
                setIsFetching(false);
            }
        };

        fetchAlerts();
    }, []);

    if (isFetching) {
        return <AlertsSkeleton />;
    }

    if (error) {
        return <ErrorPage message={error} />;
    }

    if (alerts && alerts.length === 0) {
        return <EmptyPage />;
    }

    return (
        <Page>
            {alerts?.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
            ))}
        </Page>
    );
}
