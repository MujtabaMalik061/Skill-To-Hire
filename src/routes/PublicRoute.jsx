import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/loading.component.jsx";
import useAuth from "../hooks/auth.hook.jsx";

const PublicRoute = () => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return <Loading label="Checking your session" />;
  }

  if (!user) {
    return <Outlet />;
  }

  if (!profile) {
    return <Loading label="Finishing your account setup" />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
