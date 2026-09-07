import { useEffect, useState } from "react";
import { useWeather } from "../../../../context/WeatherContext";
import { getTimeAgo } from "../../../../lib/utils/formatter";
import type { WeatherData } from "../../../../types/weather";
import Card from "../../../../components/common/Card";
import ErrorCard from "../../../../components/common/ErrorCard";
import { useI18n } from "../../../../context/I18nContext";

type WeatherProps = {
    weather: WeatherData;
};

const WeatherCondition = ({ weather }: WeatherProps) => {
    return (
        <div className="flex gap-2 items-center my-3">
            <weather.icon size={40} className={weather.color} />
            <div>
                <h2 className={`font-semibold text-2xl ${weather.color}`}>
                    {weather.condition}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{weather.description}</p>
            </div>
        </div>
    );
};

const PrecipitationInfo = ({
    precipitation_mm,
}: {
    precipitation_mm: number;
}) => {
    const { warning } = useWeather();
    const { t } = useI18n();

    return (
        <div
            className={`rounded-lg p-2.5 border ${warning ? "bg-amber-100 border-amber-300 dark:bg-amber-950/50 dark:border-amber-700" : "bg-slate-100 border-gray-300 dark:bg-slate-700 dark:border-slate-600"}`}
        >
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("home.precipitation")}</p>
            <p className="text-sm ">
                <span>{`${precipitation_mm.toFixed(1)} mm/h`}</span>
            </p>
        </div>
    );
};

const LastUpdatedInfo = ({ timestamp }: { timestamp: string }) => {
    const { warning } = useWeather();
    const { t } = useI18n();

    const [timeAgo, setTimeAgo] = useState<string>(getTimeAgo(timestamp));

    useEffect(() => {
        setTimeAgo(getTimeAgo(timestamp));
        // Update every 60 seconds
        const intervalId = setInterval(() => {
            setTimeAgo(getTimeAgo(timestamp));
        }, 60 * 1000);

        // Cleanup
        return () => clearInterval(intervalId);
    }, [timestamp]);

    return (
        <div
            className={`rounded-lg p-2.5 border ${warning ? "bg-amber-100 border-amber-300 dark:bg-amber-950/50 dark:border-amber-700" : "bg-slate-100 border-gray-300 dark:bg-slate-700 dark:border-slate-600"}`}
        >
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("home.lastUpdated")}</p>
            <p className="text-sm">{timeAgo}</p>
        </div>
    );
};

export default function WeatherConditionCard() {
    const { weatherData, isFetching, error } = useWeather();
    const { t } = useI18n();

    if (isFetching && !weatherData) {
        return <div className="skeleton h-40 w-full rounded-xl" />;
    }

    if (error) {
        return <ErrorCard message={error} />;
    }

    if (!weatherData) {
        return <div className="skeleton h-40 w-full rounded-xl" />;
    }

    return (
        <Card headerTitle={t("home.weatherCondition")} className="!rounded-2xl !border !border-slate-600/80 !bg-slate-800/90 !p-4">
            <WeatherCondition weather={weatherData} />
            <div className="grid grid-cols-2 gap-2">
                <PrecipitationInfo
                    precipitation_mm={weatherData.precipitation_mm}
                />
                <LastUpdatedInfo timestamp={weatherData.timestamp} />
            </div>
        </Card>
    );
}
