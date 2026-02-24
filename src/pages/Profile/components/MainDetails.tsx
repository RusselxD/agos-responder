import { Phone } from "lucide-react";
import Card from "../../../components/common/Card";
import { useCoreHook } from "../../../context/CoreContext";
import { formatPHNumber } from "../../../lib/utils/phone";

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

    return (
        <Card>
            <div>
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">
                        RESPONDER PROFILE
                    </p>
                    <p className="text-sm">Online</p>
                </div>
                <div className="flex justify-between items-end mt-2">
                    <div className="space-y-1">
                        <h2 className="font-bold text-2xl">{`${responder?.firstName} ${responder?.lastName || ""}`}</h2>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <p className="text-sm">
                                {formatPHNumber(responder?.phoneNumber || "")}
                            </p>
                        </div>
                    </div>
                    <p className="text-xs font-medium bg-accent/10 rounded-full px-2 py-1 w-fit text-accent ">
                        <span>ID: </span>
                        <span>{getLastChunkOfId(responder?.id || "")}</span>
                    </p>
                </div>
            </div>
        </Card>
    );
}
