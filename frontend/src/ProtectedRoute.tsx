import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = window.localStorage.getItem("token");

    return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;