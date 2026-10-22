import { useEffect, useState } from "react";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Compass,
  FileText,
  LayoutDashboard,
  LayoutList,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import SiteHeader from "../components/site-header.component.jsx";
import useAuth from "../hooks/auth.hook.jsx";
import { signOut } from "../services/auth.services.js";

const WorkspaceSidebar = ({ isOpen, onClose }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    onClose();
    await signOut();
    navigate("/");
  };

  const workspaceLinks =
    profile?.role === "jobProvider"
      ? [
          { label: "Employer workspace", to: "/dashboard", icon: LayoutDashboard },
          { label: "Manage jobs", to: "/provider/jobs", icon: LayoutList },
          { label: "Post a job", to: "/provider/jobs/new", icon: BriefcaseBusiness },
          { label: "Applications", to: "/provider/applications", icon: ClipboardList },
          { label: "Browse jobs", to: "/jobs", icon: Compass },
        ]
      : [
          { label: "My dashboard", to: "/dashboard", icon: LayoutDashboard },
          { label: "My applications", to: "/applications", icon: FileText },
          { label: "Explore jobs", to: "/jobs", icon: Compass },
        ];

  return (
    <aside className={`workspace-sidebar${isOpen ? " is-open" : ""}`}>
      <Link className="brand workspace-sidebar__brand" to="/" onClick={onClose}>
        <span className="brand__mark">
          <BriefcaseBusiness size={18} strokeWidth={2.4} />
        </span>
        <span>
          Skill <strong>to</strong> Hire
        </span>
      </Link>

      <div className="workspace-sidebar__group">
        <span className="workspace-sidebar__label">WORKSPACE</span>
        <nav className="workspace-sidebar__nav" aria-label="Workspace">
          {workspaceLinks.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} to={to} end onClick={onClose}>
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="workspace-sidebar__group">
        <span className="workspace-sidebar__label">ACCOUNT</span>
        <nav className="workspace-sidebar__nav" aria-label="Account">
          <NavLink to="/profile" onClick={onClose}>
            <UserRound size={17} />
            <span>Profile settings</span>
          </NavLink>
          <NavLink to="/notifications" onClick={onClose}>
            <Bell size={17} />
            <span>Notifications</span>
          </NavLink>
        </nav>
      </div>

      <div className="workspace-sidebar__footer">
        <span className="workspace-sidebar__avatar">
          {(profile?.firstName || profile?.companyName || "S")
            .slice(0, 1)
            .toUpperCase()}
        </span>
        <span className="workspace-sidebar__identity">
          <strong>
            {profile?.firstName
              ? `${profile.firstName} ${profile.lastName || ""}`.trim()
              : profile?.companyName || "Your account"}
          </strong>
          <small>
            {profile?.role === "jobProvider"
              ? "Job provider"
              : profile?.role === "student"
                ? "Student"
                : "Employee / job seeker"}
          </small>
        </span>
        <button
          className="icon-button workspace-sidebar__signout"
          type="button"
          aria-label="Sign out"
          title="Sign out"
          onClick={handleSignOut}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

const usePageTitle = (role) => {
  const { pathname } = useLocation();
  if (pathname === "/dashboard")
    return role === "jobProvider" ? "Employer workspace" : "My dashboard";
  if (pathname === "/profile") return "Profile settings";
  if (pathname === "/notifications") return "Notifications";
  if (pathname === "/provider/jobs") return "Manage jobs";
  if (pathname === "/provider/jobs/new") return "Post a job";
  if (pathname === "/provider/applications") return "Applications";
  if (pathname.startsWith("/provider/candidates/")) return "Candidate profile";
  if (pathname === "/applications") return "My applications";
  if (pathname === "/jobs") return "Browse jobs";
  if (pathname.startsWith("/jobs/")) return "Job details";
  return "";
};

const WorkspaceTopbar = ({ onToggle, isOpen }) => {
  const { profile } = useAuth();
  const pageTitle = usePageTitle(profile?.role);

  return (
    <header className="workspace-topbar">
      <button
        className="icon-button workspace-topbar__hamburger"
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={onToggle}
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <h2 className="topbar-page-title">{pageTitle}</h2>

      {profile?.companyName && (
        <span className="workspace-topbar__context">
          <Building2 size={15} /> {profile.companyName}
        </span>
      )}
      <Link
        className="icon-button workspace-topbar__notifications"
        to="/notifications"
        aria-label="Notifications"
      >
        <Bell size={17} />
      </Link>
    </header>
  );
};

const AppLayout = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // close sidebar whenever the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const isAccountRoute =
    [
      "/dashboard",
      "/profile",
      "/notifications",
      "/applications",
      "/provider/jobs",
      "/provider/jobs/new",
      "/provider/applications",
    ].some((path) => pathname === path) ||
    pathname.startsWith("/provider/candidates/");
  const isAuthenticatedJobsRoute =
    user && (pathname === "/jobs" || pathname.startsWith("/jobs/"));
  const isWorkspaceRoute = isAccountRoute || isAuthenticatedJobsRoute;

  if (isWorkspaceRoute) {
    return (
      <div className="workspace-shell">
        {/* backdrop — only rendered when drawer is open */}
        {sidebarOpen && (
          <div
            className="workspace-sidebar__overlay"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        <WorkspaceSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="workspace-shell__main">
          <WorkspaceTopbar
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen((o) => !o)}
          />
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <SiteHeader />
      <Outlet />
    </div>
  );
};

export default AppLayout;
