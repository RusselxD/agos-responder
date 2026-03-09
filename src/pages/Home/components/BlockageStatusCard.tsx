import Card from "../../../components/common/Card";

import { useWaterwayContext } from "../../../context/BlockageContext";
import { useI18n } from "../../../context/I18nContext";
import type { Status } from "../../../types/blockage";

export const barColors = ["bg-clear", "bg-partial", "bg-blocked"];

export const getLevelCount = (status: Status | null): number => {
    switch (status) {
        case "Clear":
            return 0;
        case "Partial":
            return 1;
        case "Blocked":
            return 2;
        default:
            return 0;
    }
};

const StatusText = () => {
    const { status } = useWaterwayContext();

    const getStatusColor = (status: Status | null): string => {
        switch (status) {
            case "Clear":
                return "text-clear";
            case "Partial":
                return "text-partial";
            case "Blocked":
                return "text-blocked";
            default:
                return "text-gray-400";
        }
    };

    const levelCount: number = status ? getLevelCount(status) : 0;

    return (
        <div className="flex items-center gap-2 my-2">
            <span
                className={`w-4 h-4 rounded-full ${barColors[levelCount]} ${
                    levelCount === 2 && "pulse-circle"
                }`}
            ></span>
            <span className={`font-bold text-3xl ${getStatusColor(status)}`}>
                {status}
            </span>
        </div>
    );
};

const ProgressBar = () => {
    const { status } = useWaterwayContext();
    const { t } = useI18n();
    const barCount = getLevelCount(status);

    return (
        <div className="relative flex gap-1 pb-7">
            {Array.from({ length: 3 }).map((_, index) => {
                return (
                    <span
                        key={index}
                        className={`w-full rounded-md h-2 ${
                            barCount >= index
                                ? barColors[barCount]
                                : "bg-gray-200 dark:bg-slate-600"
                        }`}
                    ></span>
                );
            })}
            <div className="absolute bottom-0 flex items-center justify-between text-gray-500 dark:text-gray-400 text-sm w-full">
                <span>{t("home.clear")}</span>
                <span>{t("home.blocked")}</span>
            </div>
        </div>
    );
};

export default function BlockageStatusCard() {
    const { isFetching, status } = useWaterwayContext();
    const { t } = useI18n();

    if (isFetching && !status) {
        return <div className="skeleton h-36 w-full rounded-xl" />;
    }

    return (
        <Card className="bg-white !p-3" headerTitle={t("home.blockageStatus")}>
            <div>
                <StatusText />
                <ProgressBar />
            </div>
        </Card>
    );
}
