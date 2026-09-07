import Card from "../../../components/common/Card";
import ErrorCard from "../../../components/common/ErrorCard";

import { useWaterwayContext } from "../../../context/BlockageContext";
import { useI18n } from "../../../context/I18nContext";
import type {
    ObstructionConfidence,
    ObstructionTier,
    Status,
} from "../../../types/blockage";
import type { TranslationKey } from "../../../lib/i18n";

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
    const { t } = useI18n();

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
    const statusLabel =
        status === null
            ? "N/A"
            : status === "Blocked"
            ? t("home.blocked")
            : status === "Partial"
              ? t("home.possible")
              : t("home.clear");

    return (
        <div className="flex items-center gap-2 my-2">
            <span
                className={`w-4 h-4 rounded-full ${barColors[levelCount]} ${
                    levelCount === 2 && "pulse-circle"
                }`}
            ></span>
            <span className={`font-bold text-3xl ${getStatusColor(status)}`}>
                {statusLabel}
            </span>
        </div>
    );
};

const CONFIDENCE_KEYS: Record<ObstructionTier, TranslationKey> = {
    clear: "home.confidence.clear",
    possible: "home.confidence.possible",
    likely: "home.confidence.likely",
    confirmed: "home.confidence.confirmed",
};

const CONFIDENCE_STYLES: Record<ObstructionTier, string> = {
    clear: "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    possible: "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    likely: "border-orange-300 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    confirmed: "border-rose-300 bg-rose-100 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
};

const ConfidencePill = ({
    confidence,
}: {
    confidence: ObstructionConfidence;
}) => {
    const { t } = useI18n();
    const percent = Math.round(confidence.score * 100);

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold ${CONFIDENCE_STYLES[confidence.tier]}`}
            title={`${t("home.confidence")}: ${confidence.flagged_in_window}/${confidence.window_size}`}
        >
            <span className="uppercase tracking-wide">
                {t(CONFIDENCE_KEYS[confidence.tier])}
            </span>
            <span className="opacity-70">{percent}%</span>
        </span>
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
    const { isFetching, status, confidence, error } = useWaterwayContext();
    const { t } = useI18n();

    if (isFetching && !status) {
        return <div className="skeleton h-36 w-full rounded-xl" />;
    }

    if (error) {
        return <ErrorCard message={error} />;
    }

    return (
        <Card className="!rounded-2xl !border !border-slate-600/80 !bg-slate-800/90 !p-4" headerTitle={t("home.blockageStatus")}>
            <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <StatusText />
                    {confidence && <ConfidencePill confidence={confidence} />}
                </div>
                <ProgressBar />
            </div>
        </Card>
    );
}
