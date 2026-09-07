import Card from "../../../components/common/Card";
import ErrorCard from "../../../components/common/ErrorCard";
import { AlertTriangle, CheckCircle2, Waves } from "lucide-react";

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

  const getStatusConfig = (status: Status | null) => {
    switch (status) {
      case "Clear":
        return {
          color: "text-emerald-400",
          background: "bg-emerald-400/10",
          icon: CheckCircle2,
        };
      case "Partial":
        return {
          color: "text-amber-400",
          background: "bg-amber-400/10",
          icon: AlertTriangle,
        };
      case "Blocked":
        return {
          color: "text-rose-400",
          background: "bg-rose-400/10",
          icon: AlertTriangle,
        };
      default:
        return {
          color: "text-slate-400",
          background: "bg-slate-400/10",
          icon: Waves,
        };
    }
  };

  const config = getStatusConfig(status);
  const StatusIcon = config.icon;
  const statusLabel =
    status === null
      ? "N/A"
      : status === "Blocked"
        ? t("home.blocked")
        : status === "Partial"
          ? t("home.possible")
          : t("home.clear");

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.background}`}
      >
        <StatusIcon className={`h-6 w-6 ${config.color}`} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className={`truncate text-2xl font-bold ${config.color}`}>
          {statusLabel}
        </p>
        <p className="text-xs text-slate-400">{t("home.confidence")}</p>
      </div>
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
  clear:
    "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  possible:
    "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  likely:
    "border-orange-300 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  confirmed:
    "border-rose-300 bg-rose-100 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
};

const ConfidencePill = ({
  confidence,
}: {
  confidence: ObstructionConfidence;
}) => {
  const { t } = useI18n();
  const percent = Math.round(Math.min(1, Math.max(0, confidence.score)) * 100);
  const style = CONFIDENCE_STYLES[confidence.tier] || CONFIDENCE_STYLES.clear;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${style}`}
      title={`${t("home.confidence")}: ${confidence.flagged_in_window}/${confidence.window_size}`}
    >
      <span className="uppercase tracking-wide">
        {t(CONFIDENCE_KEYS[confidence.tier])}
      </span>
      <span className="opacity-75">{percent}%</span>
    </span>
  );
};

const ProgressBar = () => {
  const { status } = useWaterwayContext();
  const { t } = useI18n();
  const barCount = getLevelCount(status);

  return (
    <div className="relative pt-3 pb-7">
      <div
        className="flex gap-1.5"
        role="img"
        aria-label={`${t("home.clear")} to ${t("home.blocked")}`}
      >
        {Array.from({ length: 3 }).map((_, index) => {
          return (
            <span
              key={index}
              className={`h-2.5 w-full rounded-full ${
                barCount >= index
                  ? barColors[barCount]
                  : "bg-gray-200 dark:bg-slate-600"
              }`}
            ></span>
          );
        })}
      </div>
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
    <Card
      className="!rounded-2xl !border !border-slate-600/80 !bg-slate-800/90 !p-4"
      headerTitle={t("home.blockageStatus")}
    >
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
