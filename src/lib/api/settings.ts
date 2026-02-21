import apiClient from "./axiosConfig";

export const settingsAPI = {
    getSettingValue: async (key: string): Promise<any> => {
        const res = await apiClient.get(`/system-settings/${key}/value`);
        return res.data as any;
    },
};
