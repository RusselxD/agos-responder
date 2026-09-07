import {
    AlertTriangle,
    Check,
    CheckCircle2,
    CloudRain,
    Droplets,
    MapPinned,
    ShieldCheck,
    Waves,
} from "lucide-react";
import { useFusionAnalysis } from "../../../context/FusionAnalysisContext";
import { useWaterLevel } from "../../../context/WaterLevelContext";
import { useWeather } from "../../../context/WeatherContext";
import { useI18n } from "../../../context/I18nContext";
import Card from "../../../components/common/Card";

type PatrolState = "safe" | "advisory" | "critical" | "unavailable";

function getPatrolState(alertName: string | undefined, riskScore?: number): PatrolState {
    const normalized = alertName?.toLowerCase() || "";

    if (normalized.includes("critical")) return "critical";
    if (normalized.includes("warning") || normalized.includes("advisory")) return "advisory";
    if (normalized.includes("normal") || normalized.includes("safe") || normalized.includes("clear")) {
        return "safe";
    }
    if (typeof riskScore === "number") {
        if (riskScore >= 0.7) return "critical";
        if (riskScore >= 0.4) return "advisory";
        return "safe";
    }

    return "unavailable";
}

const stateStyles: Record<PatrolState, { icon: typeof ShieldCheck; color: string; background: string }> = {
    safe: {
        icon: ShieldCheck,
        color: "text-emerald-400",
        background: "border-emerald-500/40 bg-emerald-950/50",
    },
    advisory: {
        icon: AlertTriangle,
        color: "text-amber-400",
        background: "border-amber-500/50 bg-amber-950/40",
    },
    critical: {
        icon: AlertTriangle,
        color: "text-red-400",
        background: "border-red-500/50 bg-red-950/40",
    },
    unavailable: {
        icon: ShieldCheck,
        color: "text-slate-400",
        background: "border-slate-600 bg-slate-800/80",
    },
};

function SummaryTile({
    icon: Icon,
    label,
    value,
    detail,
}: {
    icon: typeof Waves;
    label: string;
    value: string;
    detail: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-600/80 bg-slate-800/90 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-slate-300">
                <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                <span>{label}</span>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-white">{value}</p>
            <p className="mt-1 text-xs text-slate-400">{detail}</p>
        </div>
    );
}

export default function HomeOverview() {
    const { fusionAnalysis } = useFusionAnalysis();
    const { sensorData } = useWaterLevel();
    const { weatherData } = useWeather();
    const { t } = useI18n();

    const state = getPatrolState(
        fusionAnalysis?.fusion_data.alert_name,
        fusionAnalysis?.fusion_data.combined_risk_score,
    );
    const styles = stateStyles[state];
    const StateIcon = styles.icon;
    const waterLevel = sensorData?.water_level.current_cm;
    const rainfall = weatherData?.precipitation_mm;

    const stateCopy: Record<PatrolState, { title: string; body: string }> = {
        safe: { title: t("home.statusSafe"), body: t("home.statusSafeBody") },
        advisory: { title: t("home.statusAdvisory"), body: t("home.statusAdvisoryBody") },
        critical: { title: t("home.statusCritical"), body: t("home.statusCriticalBody") },
        unavailable: { title: t("home.statusUnavailable"), body: t("home.statusUnavailableBody") },
    };

    return (
        <section className="space-y-4" aria-label={t("home.overview")}>
            <div className={`rounded-3xl border px-5 py-7 text-center shadow-sm ${styles.background}`}>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-950/70 ring-1 ring-white/5">
                    <StateIcon className={`h-11 w-11 ${styles.color}`} aria-hidden="true" />
                </div>
                <h1 className={`mt-5 text-4xl font-bold tracking-tight ${styles.color}`}>
                    {stateCopy[state].title}
                </h1>
                <p className="mx-auto mt-3 max-w-sm text-base leading-7 text-slate-200">
                    {stateCopy[state].body}
                </p>
                <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950/50 px-4 py-2 text-xs text-slate-300">
                    <span className={`h-2 w-2 rounded-full ${state === "critical" ? "bg-red-400" : state === "advisory" ? "bg-amber-400" : "bg-accent"}`} />
                    {fusionAnalysis ? t("home.statusLive") : t("home.statusWaiting")}
                </div>
            </div>

            <Card className="!border !border-slate-600/80 !bg-slate-800/90 !p-5 dark:!border-slate-600/80">
                <h2 className="text-xl font-semibold text-white">{t("home.recommendationsTitle")}</h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-200">
                    {[t("home.actionKeepPhone"), t("home.actionReviewCenters"), t("home.actionFollowAnnouncements")].map(
                        (action) => (
                            <li key={action} className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                                    <Check className="h-4 w-4" aria-hidden="true" />
                                </span>
                                <span>{action}</span>
                            </li>
                        ),
                    )}
                </ul>
            </Card>

            <div>
                <h2 className="mb-3 px-1 text-xl font-semibold text-white">{t("home.currentConditions")}</h2>
                <div className="grid grid-cols-2 gap-3">
                    <SummaryTile
                        icon={Droplets}
                        label={t("home.waterLevel")}
                        value={waterLevel == null ? t("home.unavailable") : `${waterLevel.toFixed(1)} cm`}
                        detail={sensorData ? t(`home.${sensorData.alert.level}`) : t("home.unavailable")}
                    />
                    <SummaryTile
                        icon={CloudRain}
                        label={t("home.rainfall")}
                        value={rainfall == null ? t("home.unavailable") : `${rainfall.toFixed(1)} mm`}
                        detail={rainfall == null ? t("home.unavailable") : rainfall > 0 ? t("home.monitorRain") : t("home.noRain")}
                    />
                </div>
            </div>

            <div className="space-y-3">
                <button type="button" className="flex w-full items-center gap-4 rounded-2xl border border-slate-600/80 bg-slate-800/90 p-4 text-left shadow-sm">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-700 text-accent">
                        <Waves className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-white">{t("home.waterwaySurface")}</span>
                        <span className="mt-1 block text-sm text-slate-400">{t("home.surfaceMonitoring")}</span>
                    </span>
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
                </button>
                <button type="button" className="flex w-full items-center gap-4 rounded-2xl border border-slate-600/80 bg-slate-800/90 p-4 text-left shadow-sm">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-slate-950">
                        <MapPinned className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-white">{t("home.evacuationCenters")}</span>
                        <span className="mt-1 block text-sm text-slate-400">{t("home.evacuationDescription")}</span>
                    </span>
                    <MapPinned className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
                </button>
            </div>
        </section>
    );
}