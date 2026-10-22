import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/App.layout.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import CandidateProfilePage from "../pages/CandidateProfilePage.jsx";
import ForEmployersPage from "../pages/ForEmployersPage.jsx";
import MyApplicationsPage from "../pages/MyApplicationsPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import ForgotPasswordPage from "../auth/ForgotPasswordPage.jsx";
import JobDetailsPage from "../pages/JobDetailsPage.jsx";
import JobFormPage from "../pages/JobFormPage.jsx";
import JobsPage from "../pages/JobsPage.jsx";
import LandingPage from "../pages/LandingPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import NotificationsPage from "../pages/NotificationsPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import ProviderApplicationsPage from "../pages/ProviderApplicationsPage.jsx";
import ProviderJobsPage from "../pages/ProviderJobsPage.jsx";
import SignInPage from "../auth/SignInPage.jsx";
import SignUpPage from "../auth/SignUpPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";

const AppRoutes = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/for-employers" element={<ForEmployersPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/jobs/:jobId" element={<JobDetailsPage />} />

      <Route element={<PublicRoute />}>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/applications" element={<MyApplicationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["jobProvider"]} />}>
        <Route path="/provider/jobs" element={<ProviderJobsPage />} />
        <Route path="/provider/jobs/new" element={<JobFormPage />} />
        <Route path="/provider/applications" element={<ProviderApplicationsPage />} />
        <Route path="/provider/candidates/:docId" element={<CandidateProfilePage />} />
      </Route>

      <Route path="/test" element={<Navigate to="/testing" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export default AppRoutes;
