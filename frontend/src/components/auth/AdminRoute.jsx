import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function AdminRoute() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;
  if (user?.role !== "admin") return <Navigate to="/voter/dashboard" replace />;
  return <Outlet />;
}

export default AdminRoute;
