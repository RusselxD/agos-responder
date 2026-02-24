import SectionLabel from "./common/SectionLabel";
import Card from "../../../components/common/Card";
import { useCoreHook } from "../../../context/CoreContext";
import { formatDate } from "../../../lib/utils/formatter";

interface DetailsProps {
    label: string;
    value: string;
    borderBottom?: boolean;
}

const Details = ({ label, value, borderBottom = true }: DetailsProps) => {
    return (
        <div
            className={`flex py-4 px-4 items-center justify-between ${borderBottom ? "border-b border-gray-300" : ""}`}
        >
            <p className="font-semibold">{label}</p>
            <p className="text-sm font-medium">{value}</p>
        </div>
    );
};

export default function AccountDetails() {
    const { responder } = useCoreHook();

    return (
        <div>
            <SectionLabel label="ACCOUNT" />
            <Card className="!p-0">
                <Details
                    label="Registered"
                    value={formatDate(responder?.createdAt || "") || "N/A"}
                />
                <Details
                    label="Activated"
                    value={formatDate(responder?.activatedAt || "") || "N/A"}
                />
                <Details
                    label="Assigned Site"
                    value={responder?.locationName || "N/A"}
                    borderBottom={false}
                />
            </Card>
        </div>
    );
}
