import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;
  return <Outlet />;
}

export default ProtectedRoute;
