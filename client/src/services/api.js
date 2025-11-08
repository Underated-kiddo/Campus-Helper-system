import axios from "axios";

const base = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ensure no accidental double `/api/api` by trimming trailing slashes
const normalizedBase = base.replace(/\/+$/, "");

const API = axios.create({
    baseURL: normalizedBase,
    timeout: 10000,
});

// Request interceptor to add auth token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (status === 401) {
            // Clear stored auth and redirect to login
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            // using location.href so it's available outside react-router
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default API;
