import Page from "../../components/common/Page";
import AlertCard from "./components/AlertCard";
import AlertDetails from "./components/AlertDetails/AlertDetails";
import {
    AlertsSkeleton,
    AlertTypeFilters,
    EmptyPage,
    ErrorPage,
} from "./components/PageComponents";
import { useAlertsPageHook } from "./context/AlertsPageContext";

export default function Alerts() {
    const { shownAlerts, isFetching, error, chosenFilter } =
        useAlertsPageHook();

    if (isFetching) {
        return <AlertsSkeleton />;
    }

    if (error) {
        return <ErrorPage message={error} />;
    }

    return (
        <Page className="!space-y-2">
            <AlertTypeFilters />

            {shownAlerts && shownAlerts.length === 0 && (
                <EmptyPage isAllChosen={chosenFilter === "all"} />
            )}

            {shownAlerts?.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
            ))}
            <AlertDetails />
        </Page>
    );
}
