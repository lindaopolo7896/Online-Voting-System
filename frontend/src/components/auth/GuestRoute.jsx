import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function GuestRoute() {
  const { user, isAuthenticated } = useAuth();
  if (isAuthenticated) {
    const dest =
      user?.role === "admin" ? "/organisation/dashboard" : "/voter/dashboard";
    return <Navigate to={dest} replace />;
  }
  return <Outlet />;
}

export default GuestRoute;
