import Page from "../../components/common/Page";
import AccountDetails from "./components/AccountDetails";
import Logout from "./components/Logout";
import MainDetails from "./components/MainDetails";
import PushNotifications from "./components/PushNotifications";
import ThemeToggle from "./components/ThemeToggle";
import LanguageToggle from "./components/LanguageToggle";

export default function Profile() {
    return (
        <Page className="space-y-5">
            <MainDetails />
            <PushNotifications />
            <LanguageToggle />
            <ThemeToggle />
            <AccountDetails />
            <Logout />
        </Page>
    );
}
