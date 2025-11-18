import axios from "axios";

const base = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const normalizedBase = base.replace(/\/+$/, "");

const API = axios.create({
    baseURL: normalizedBase,
    timeout: 10000,
});

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

API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default API;
