import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "../components/loading.component.jsx";
import useAuth from "../hooks/auth.hook.jsx";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading label="Loading your account" />;
  }

  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: location }}
      />
    );
  }

  if (!profile) {
    return <Loading label="Finishing your account setup" />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
