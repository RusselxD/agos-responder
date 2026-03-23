import axios, { type InternalAxiosRequestConfig } from "axios";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

type ConfigWithSkip = InternalAxiosRequestConfig & {
    skipKeyConversion?: boolean;
    skipResponseKeyConversion?: boolean;
};

const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
    timeout: 10000, // 10 seconds timeout
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to convert camelCase to snake_case and inject auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Inject responder auth token
        const token = localStorage.getItem("responderToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const skipConversion = (config as ConfigWithSkip).skipKeyConversion;
        if (skipConversion) return config;

        // 🔁 Convert camelCase → snake_case (request body)
        if (config.data && typeof config.data === "object") {
            config.data = snakecaseKeys(config.data, { deep: true });
        }

        // 🔁 Convert camelCase → snake_case (query params)
        if (config.params && typeof config.params === "object") {
            config.params = snakecaseKeys(config.params, { deep: true });
        }

        return config;
    },
    (error) => Promise.reject(error),
);

// Response interceptor to convert snake_case to camelCase and handle 401
apiClient.interceptors.response.use(
    (response) => {
        const skipConversion = (response.config as ConfigWithSkip)
            .skipResponseKeyConversion;
        if (skipConversion) {
            return response;
        }

        if (response.data && typeof response.data === "object") {
            response.data = camelcaseKeys(response.data, { deep: true });
        }

        return response;
    },
    (error) => {
        // Handle 401 — token expired or invalid, force re-verification
        if (error?.response?.status === 401) {
            // Only redirect if we had a token (avoid redirect loops on pre-auth endpoints)
            if (localStorage.getItem("responderToken")) {
                localStorage.removeItem("responderId");
                localStorage.removeItem("responderToken");
                window.location.href = "/verify";
                return Promise.reject(error);
            }
        }

        const skipConversion = (error?.config as ConfigWithSkip | undefined)
            ?.skipResponseKeyConversion;

        if (
            !skipConversion &&
            error?.response?.data &&
            typeof error.response.data === "object"
        ) {
            error.response.data = camelcaseKeys(error.response.data, {
                deep: true,
            });
        }

        return Promise.reject(error);
    },
);

export default apiClient;
