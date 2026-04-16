import { Phone } from "lucide-react";
import Card from "../../../components/common/Card";
import { useCoreHook } from "../../../context/CoreContext";
import { useI18n } from "../../../context/I18nContext";
import { formatPHNumber } from "../../../lib/utils/phone";
import ConnectionStatus from "./ConnectionStatus";

const getLastChunkOfId = (id: string) => {
    let res = "";
    let i = id.length - 1;
    while (i >= 0 && id[i] !== "-") {
        res = id[i] + res;
        i--;
    }
    return res;
};

export default function MainDetails() {
    const { responder } = useCoreHook();
    const { t } = useI18n();

    if (!responder) {
        return <div className="skeleton h-28 w-full rounded-xl" />;
    }

    return (
        <Card>
            <div>
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t("profile.responderProfile")}
                    </p>
                    <ConnectionStatus />
                </div>
                <div className="flex justify-between items-end mt-2">
                    <div className="space-y-1">
                        <h2 className="font-bold text-2xl dark:text-white">{`${responder?.firstName || ""} ${responder?.lastName || ""}`.trim() || "Unknown"}</h2>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 dark:text-gray-300" />
                            <p className="text-sm dark:text-gray-300">
                                {responder?.phoneNumber ? formatPHNumber(responder.phoneNumber) : "N/A"}
                            </p>
                        </div>
                    </div>
                    <p className="text-xs font-medium bg-accent/10 rounded-full px-2 py-1 w-fit text-accent ">
                        <span>ID: </span>
                        <span>{responder?.id ? getLastChunkOfId(responder.id) : "N/A"}</span>
                    </p>
                </div>
            </div>
        </Card>
    );
}
