import SectionLabel from "./common/SectionLabel";
import Card from "../../../components/common/Card";
import { useCoreHook } from "../../../context/CoreContext";
import { useI18n } from "../../../context/I18nContext";
import { formatDate } from "../../../lib/utils/formatter";

interface DetailsProps {
    label: string;
    value: string;
    borderBottom?: boolean;
}

const Details = ({ label, value, borderBottom = true }: DetailsProps) => {
    return (
        <div
            className={`flex py-4 px-4 items-center justify-between ${borderBottom ? "border-b border-gray-300 dark:border-slate-600" : ""}`}
        >
            <p className="font-semibold dark:text-gray-200">{label}</p>
            <p className="text-sm font-medium dark:text-gray-400">{value}</p>
        </div>
    );
};

export default function AccountDetails() {
    const { responder } = useCoreHook();
    const { t } = useI18n();

    return (
        <div>
            <SectionLabel label={t("profile.account")} />
            <Card className="!p-0">
                <Details
                    label={t("profile.registered")}
                    value={responder?.createdAt ? formatDate(responder.createdAt) : "N/A"}
                />
                <Details
                    label={t("profile.activated")}
                    value={responder?.activatedAt ? formatDate(responder.activatedAt) : "N/A"}
                />
                <Details
                    label={t("profile.assignedSite")}
                    value={responder?.locationName || "N/A"}
                    borderBottom={false}
                />
            </Card>
        </div>
    );
}
