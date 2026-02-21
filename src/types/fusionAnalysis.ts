import type { SummaryResponse } from "./readingResponse";

export interface FusionAnalysisSummaryResponse extends SummaryResponse {
    fusion_analysis: FusionAnalysisData;
}

export interface FusionAnalysisData {
    fusion_data: FusionData;
    blockage_status: BlockageStatus;
    water_level_status: WaterLevelStatus;
    weather_status: WeatherStatus;
}

interface FusionData {
    alert_name: string;
    combined_risk_score: number;
    triggered_conditions: string[];
}

interface StatusBase {
    timestamp: string;
}

interface BlockageStatus extends StatusBase {
    status: string;
}

interface WaterLevelStatus extends StatusBase {
    water_level_cm: number;
    change_rate: number;
    critical_percentage: number;
    trend: string;
}

interface WeatherStatus extends StatusBase {
    precipitation_mm: number;
    weather_condition: string;
}

export interface AlertThresholds {
    tier_1_max: number;
    tier_2_min: number;
    tier_2_max: number;
    tier_3_min: number;
}
