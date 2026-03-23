import { useEffect, useState } from "react";
import { sensorAPI, type WaterLevelTrendPoint } from "../../../lib/api/sensor";
import { useCoreHook } from "../../../context/CoreContext";
import Card from "../../../components/common/Card";
import CardTitle from "../../../components/common/CardTitle";
import { useI18n } from "../../../context/I18nContext";

export default function WaterLevelSparkline() {
    const { responder } = useCoreHook();
    const [data, setData] = useState<WaterLevelTrendPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useI18n();

    useEffect(() => {
        if (!responder?.locationId) return;

        const fetchTrend = async () => {
            try {
                const res = await sensorAPI.getWaterLevelTrend(responder.locationId);
                setData(res);
            } catch {
                // Silently fail — sparkline is supplementary
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrend();
        // Refresh every 5 minutes
        const interval = setInterval(fetchTrend, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [responder?.locationId]);

    if (isLoading) {
        return (
            <Card>
                <CardTitle title={t("home.waterLevelTrend")} />
                <div className="h-16 skeleton rounded-md mt-2" />
            </Card>
        );
    }

    if (data.length < 2) return null;

    return (
        <Card>
            <CardTitle title={t("home.waterLevelTrend")} />
            <div className="mt-2">
                <SparklineSVG points={data} />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                <span>24h ago</span>
                <span>Now</span>
            </div>
        </Card>
    );
}

function SparklineSVG({ points }: { points: WaterLevelTrendPoint[] }) {
    const width = 300;
    const height = 60;
    const padding = 4;

    const values = points.map((p) => p.waterLevelCm);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const toX = (i: number) => padding + (i / (points.length - 1)) * (width - padding * 2);
    const toY = (v: number) => height - padding - ((v - min) / range) * (height - padding * 2);

    const pathData = points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(p.waterLevelCm).toFixed(1)}`)
        .join(" ");

    // Area fill
    const areaPath = `${pathData} L ${toX(points.length - 1).toFixed(1)} ${height} L ${toX(0).toFixed(1)} ${height} Z`;

    const lastValue = values[values.length - 1];
    const lastX = toX(points.length - 1);
    const lastY = toY(lastValue);

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16" preserveAspectRatio="none">
            <defs>
                <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(10, 61, 98)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="rgb(10, 61, 98)" stopOpacity="0.02" />
                </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#sparkFill)" />
            <path d={pathData} fill="none" stroke="rgb(10, 61, 98)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-accent" />
            <circle cx={lastX} cy={lastY} r="2.5" fill="rgb(10, 61, 98)" className="dark:fill-accent" />
        </svg>
    );
}
