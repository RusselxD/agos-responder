import Page from "../../components/common/Page";
import AccountDetails from "./components/AccountDetails";
import Logout from "./components/Logout";
import MainDetails from "./components/MainDetails";
import PushNotifications from "./components/PushNotifications";

export default function Profile() {
    return (
        <Page className="space-y-5">
            <MainDetails />
            <PushNotifications />
            <AccountDetails />
            <Logout />
        </Page>
    );
}
