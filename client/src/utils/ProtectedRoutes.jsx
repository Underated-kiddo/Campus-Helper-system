import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function ProtectedRoutes({ allowedRoles }) {
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        let mounted = true;

        const verifyUser = async () => {
            try {
                // Fast path: check localStorage first
                const localUserRaw = localStorage.getItem("user");
                if (localUserRaw) {
                    try {
                        const localUser = JSON.parse(localUserRaw);
                        if (localUser?.role && allowedRoles.includes(localUser.role)) {
                            if (mounted) {
                                setIsAuthorized(true);
                                setLoading(false);
                            }
                            // still run background verification to keep auth fresh
                            API.get("/auth/profile").catch((err) => {
                                // If backend rejects token, clear local and force a redirect next time
                                if (err?.response?.status === 401) {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("user");
                                }
                            });
                            return;
                        }
                    } catch {
                        // corrupted local user; ignore and continue to verify with server
                    }
                }

                // Server verification
                const res = await API.get("/auth/profile");
                const userRole = res.data.role;

                if (allowedRoles.includes(userRole)) {
                    // persist minimal user info (optional)
                    try {
                        localStorage.setItem("user", JSON.stringify({ role: userRole }));
                    } catch { }
                    if (mounted) setIsAuthorized(true);
                } else {
                    if (mounted) setIsAuthorized(false);
                }
            } catch (err) {
                console.error("Auth verification failed:", err);
                // If 401 - clear local auth tokens
                if (err?.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
                if (mounted) setIsAuthorized(false);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        verifyUser();

        return () => {
            mounted = false;
        };
    }, [allowedRoles]);

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center p-6">Checking authentication...</div>
            </div>
        );

    if (!isAuthorized) return <Navigate to="/login" replace />;

    return <Outlet />;
}
