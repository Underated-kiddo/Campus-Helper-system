import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api"; 

export default function ProtectedRoutes({ allowedRoles }) {
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await API.get("/auth/profile");
                const userRole = res.data.role;

                if (allowedRoles.includes(userRole)) {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } catch (err) {
                console.error("Auth verification failed:", err);
                setIsAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, [allowedRoles]);

    if (loading) return <div className="text-center p-6">Checking authentication...</div>;

    if (!isAuthorized) return <Navigate to="/login" replace />;

    return <Outlet />;
}
