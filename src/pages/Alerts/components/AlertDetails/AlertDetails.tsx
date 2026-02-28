import { useAlertsPageHook } from "../../context/AlertsPageContext";
import DrawerContainer from "./components/DrawerContainer";
import {
    Header,
    NotificationDetails,
    AcknowledgeNotification,
    AcknowledgementDetails,
} from "./components/PageComponents";

export default function AlertDetails() {
    const { chosenAlert, handleCloseAlertDetail } = useAlertsPageHook();
    const isOpen = Boolean(chosenAlert);

    return (
        <DrawerContainer
            isOpen={isOpen}
            handleCloseDrawer={handleCloseAlertDetail}
        >
            <div
                className={`absolute bottom-0 left-0 right-0 max-h-[80dvh] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-2xl transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-y-0" : "translate-y-full"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {chosenAlert && (
                    <div className="space-y-4">
                        <div className="w-full flex justify-center">
                            <div className="h-1.5 rounded-full w-16 bg-gray-300"></div>
                        </div>

                        <Header
                            type={chosenAlert.type}
                            title={chosenAlert.title}
                            isAcknowledged={chosenAlert.isAcknowledged}
                        />

                        <NotificationDetails
                            message={chosenAlert.message}
                            timestamp={chosenAlert.timestamp}
                        />

                        {chosenAlert.isAcknowledged ? (
                            <AcknowledgementDetails
                                acknowledgeMessage={
                                    chosenAlert.acknowledgeMessage
                                }
                                acknowledgedAt={chosenAlert.acknowledgedAt!}
                            />
                        ) : (
                            <AcknowledgeNotification />
                        )}
                    </div>
                )}
            </div>
        </DrawerContainer>
    );
}
