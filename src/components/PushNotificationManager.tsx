import { usePushNotifications } from "../hooks/usePushNotifications";

/**
 * Drives push-notification subscription for the whole authenticated session.
 * Mounted once in MainLayout so a responder is subscribed regardless of which
 * page they land on — not only when they visit Home.
 */
export default function PushNotificationManager() {
    const { pushError } = usePushNotifications();

    if (!pushError) return null;

    return (
        <div className="mx-4 mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-300">
            {pushError}
        </div>
    );
}
