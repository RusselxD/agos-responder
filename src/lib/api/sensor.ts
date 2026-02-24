import type { SensorConfig } from "../../types/sensor";
import apiClient from "./axiosConfig";

export const sensorAPI = {
    getSensorDeviceConfig: async (
        locationId: number,
    ): Promise<SensorConfig> => {
        const res = await apiClient.get(
            `/sensor-devices/${locationId}/config/by-location`,
        );
        return res.data as SensorConfig;
    },
};
