import { useState } from "react";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  Compass,
  LayoutDashboard,
  LogOut,
  Search,
  UserRound,
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

const WorkspaceSidebar = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const workspaceLinks =
    profile?.role === "jobProvider"
      ? [
          {
            label: "Employer workspace",
            to: "/dashboard",
            icon: LayoutDashboard,
          },
          {
            label: "Post a job",
            to: "/provider/jobs/new",
            icon: BriefcaseBusiness,
          },
          { label: "Browse jobs", to: "/jobs", icon: Compass },
        ]
      : [
          { label: "My dashboard", to: "/dashboard", icon: LayoutDashboard },
          { label: "Explore jobs", to: "/jobs", icon: Compass },
        ];

  return (
    <aside className="workspace-sidebar">
      <Link className="brand workspace-sidebar__brand" to="/">
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
            <NavLink key={to} to={to} end={to === "/dashboard"}>
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="workspace-sidebar__group">
        <span className="workspace-sidebar__label">ACCOUNT</span>
        <nav className="workspace-sidebar__nav" aria-label="Account">
          <NavLink to="/profile">
            <UserRound size={17} />
            <span>Profile settings</span>
          </NavLink>
          <NavLink to="/notifications">
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

const WorkspaceTopbar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/jobs?search=${encodeURIComponent(query)}` : "/jobs");
  };

  return (
    <header className="workspace-topbar">
      <form className="workspace-topbar__search" onSubmit={handleSearch}>
        <Search size={17} aria-hidden="true" />
        <input
          aria-label="Search jobs"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search jobs, skills, or companies"
        />
      </form>
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
  const isAccountRoute = [
    "/dashboard",
    "/profile",
    "/notifications",
    "/provider/jobs/new",
  ].some((path) => pathname === path);
  const isAuthenticatedJobsRoute =
    user && (pathname === "/jobs" || pathname.startsWith("/jobs/"));
  const isWorkspaceRoute = isAccountRoute || isAuthenticatedJobsRoute;

  if (isWorkspaceRoute) {
    return (
      <div className="workspace-shell">
        <WorkspaceSidebar />
        <div className="workspace-shell__main">
          <WorkspaceTopbar />
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
