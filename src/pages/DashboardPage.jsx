import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  LayoutList,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Loading from "../components/loading.component.jsx";
import useAuth from "../hooks/auth.hook.jsx";
import {
  getCandidateApplicationsPage,
  getProviderApplicationsPage,
} from "../services/applications.services.js";
import { getProviderJobsPage } from "../services/jobs.services.js";
import "../assets/styles/DashboardPage.css";

const statusLabels = {
  submitted: "Submitted",
  reviewing: "In review",
  interview: "Interview",
  accepted: "Offer made",
  declined: "Closed",
};

const STATUS_CONFIG = [
  { key: "submitted",  label: "Submitted",  color: "#f59e0b" },
  { key: "reviewing",  label: "In review",  color: "#818cf8" },
  { key: "interview",  label: "Interview",  color: "#4cd7f6" },
  { key: "accepted",   label: "Offer made", color: "#10b981" },
  { key: "declined",   label: "Closed",     color: "#fb7185" },
];

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "rgba(10, 15, 29, 0.97)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "#e7ebfb",
    fontSize: 12,
    boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
  },
  itemStyle: { color: "#a5b4fc" },
  labelStyle: { color: "#a5afc5", marginBottom: 2 },
};

const formatDate = (timestamp) => {
  if (!timestamp?.seconds) return "Just now";
  return new Date(timestamp.seconds * 1000).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const buildWeeklyData = (applications) =>
  Array.from({ length: 6 }, (_, i) => {
    const offset = 5 - i;
    const now = Date.now();
    const start = now - offset * 7 * 86400000;
    const end = start + 7 * 86400000;
    return {
      week: new Date(start).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      count: applications.filter((a) => {
        const ms = (a.createdAt?.seconds || 0) * 1000;
        return ms >= start && ms < end;
      }).length,
    };
  });

// ─── Candidate dashboard ───────────────────────────────────────────────────

const CandidateDashboard = ({ profile }) => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const page = await getCandidateApplicationsPage({
        candidateAuthId: profile.authId,
      });
      setApplications(page.items);
    } catch (error) {
      console.error("Could not load applications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [profile.authId]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const reviewingCount = applications.filter((a) => a.status === "reviewing").length;
  const interviewCount = applications.filter((a) => a.status === "interview").length;
  const offerCount = applications.filter((a) => a.status === "accepted").length;

  const statusCounts = applications.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = STATUS_CONFIG.map((s) => ({
    ...s,
    value: statusCounts[s.key] || 0,
  })).filter((s) => s.value > 0);

  const weeklyData = buildWeeklyData(applications);

  return (
    <>
      {/* Welcome */}
      <div className="dashboard-welcome">
        <div>
          <span className="eyebrow">YOUR CAREER, IN MOTION</span>
          <h1>Welcome back, {profile.firstName || "there"}.</h1>
          <p>Keep your search moving and stay close to every application.</p>
        </div>
        <Link className="button button--primary" to="/jobs">
          Explore jobs <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats */}
      <div className="dashboard-stats dashboard-stats--4">
        <div className="dashboard-stat glass-card">
          <span>Applied</span>
          <strong>{isLoading ? "—" : applications.length}</strong>
        </div>
        <div className="dashboard-stat glass-card">
          <span>In review</span>
          <strong>{isLoading ? "—" : reviewingCount}</strong>
        </div>
        <div className="dashboard-stat glass-card">
          <span>Interviews</span>
          <strong>{isLoading ? "—" : interviewCount}</strong>
        </div>
        <div className="dashboard-stat glass-card">
          <span>Offers</span>
          <strong>{isLoading ? "—" : offerCount}</strong>
        </div>
      </div>

      {/* Charts */}
      <div className="dashboard-charts">
        {/* Area — applications over time */}
        <div className="dashboard-chart-card glass-card">
          <div className="dashboard-chart-card__heading">
            <h3>Applications over time</h3>
            <span className="dashboard-chart-card__sub">Last 6 weeks</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={weeklyData}
              margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
            >
              <defs>
                <linearGradient id="candGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4cd7f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4cd7f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="week"
                tick={{ fill: "#77839e", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#77839e", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                width={26}
              />
              <Tooltip
                {...TOOLTIP_STYLE}
                cursor={{ stroke: "rgba(76,215,246,0.18)", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Applications"
                stroke="#4cd7f6"
                strokeWidth={2}
                fill="url(#candGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#4cd7f6", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut — status breakdown */}
        <div className="dashboard-chart-card glass-card">
          <div className="dashboard-chart-card__heading">
            <h3>Status breakdown</h3>
            <span className="dashboard-chart-card__sub">
              {applications.length} total
            </span>
          </div>
          {isLoading ? (
            <div className="dashboard-chart-card__empty">Loading…</div>
          ) : pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={148}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} opacity={0.9} />
                    ))}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                {pieData.map((entry) => (
                  <div key={entry.key} className="chart-legend__item">
                    <span className="chart-legend__label">
                      <span
                        className="chart-legend__dot"
                        style={{ background: entry.color }}
                      />
                      {entry.label}
                    </span>
                    <span className="chart-legend__value">{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="dashboard-chart-card__empty">
              No applications yet.
            </div>
          )}
        </div>
      </div>

      {/* Quick action cards */}
      <div className="dashboard-quick-links">
        <Link className="dashboard-quick-card glass-card" to="/applications">
          <span className="dashboard-quick-card__icon">
            <FileText size={20} />
          </span>
          <div>
            <strong>My applications</strong>
            <span>Track every role you've applied to</span>
          </div>
          <ArrowRight size={16} />
        </Link>
        <Link className="dashboard-quick-card glass-card" to="/jobs">
          <span className="dashboard-quick-card__icon">
            <BriefcaseBusiness size={20} />
          </span>
          <div>
            <strong>Explore jobs</strong>
            <span>Browse new opportunities that match your skills</span>
          </div>
          <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
};

// ─── Provider dashboard ────────────────────────────────────────────────────

const ProviderDashboard = ({ profile }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProviderJobsPage({ providerAuthId: profile.authId }),
      getProviderApplicationsPage({ providerAuthId: profile.authId }),
    ])
      .then(([jobsPage, appsPage]) => {
        setJobs(jobsPage.items);
        setApplications(appsPage.items);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [profile.authId]);

  const publishedCount = jobs.filter((j) => j.status === "published").length;
  const reviewingCount = applications.filter((a) => a.status === "reviewing").length;
  const interviewCount = applications.filter((a) => a.status === "interview").length;

  const statusCounts = applications.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = STATUS_CONFIG.map((s) => ({
    ...s,
    value: statusCounts[s.key] || 0,
  })).filter((s) => s.value > 0);

  const weeklyData = buildWeeklyData(applications);

  return (
    <>
      {/* Welcome */}
      <div className="dashboard-welcome">
        <div>
          <span className="eyebrow">EMPLOYER WORKSPACE</span>
          <h1>{profile.companyName || "Your team"}</h1>
          <p>Share roles and follow each application as it comes in.</p>
        </div>
        <Link className="button button--primary" to="/provider/jobs/new">
          Post a job <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats */}
      <div className="dashboard-stats dashboard-stats--4">
        <div className="dashboard-stat glass-card">
          <span>Live jobs</span>
          <strong>{isLoading ? "—" : publishedCount}</strong>
        </div>
        <div className="dashboard-stat glass-card">
          <span>Applications</span>
          <strong>{isLoading ? "—" : applications.length}</strong>
        </div>
        <div className="dashboard-stat glass-card">
          <span>In review</span>
          <strong>{isLoading ? "—" : reviewingCount}</strong>
        </div>
        <div className="dashboard-stat glass-card">
          <span>Interviews</span>
          <strong>{isLoading ? "—" : interviewCount}</strong>
        </div>
      </div>

      {/* Charts */}
      <div className="dashboard-charts">
        {/* Area — applications over time */}
        <div className="dashboard-chart-card glass-card">
          <div className="dashboard-chart-card__heading">
            <h3>Applications over time</h3>
            <span className="dashboard-chart-card__sub">Last 6 weeks</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={weeklyData}
              margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
            >
              <defs>
                <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="week"
                tick={{ fill: "#77839e", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#77839e", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                width={26}
              />
              <Tooltip
                {...TOOLTIP_STYLE}
                cursor={{ stroke: "rgba(129,140,248,0.18)", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Applications"
                stroke="#818cf8"
                strokeWidth={2}
                fill="url(#appGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#818cf8", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut — status breakdown */}
        <div className="dashboard-chart-card glass-card">
          <div className="dashboard-chart-card__heading">
            <h3>Status breakdown</h3>
            <span className="dashboard-chart-card__sub">
              {applications.length} total
            </span>
          </div>
          {isLoading ? (
            <div className="dashboard-chart-card__empty">Loading…</div>
          ) : pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={148}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} opacity={0.9} />
                    ))}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                {pieData.map((entry) => (
                  <div key={entry.key} className="chart-legend__item">
                    <span className="chart-legend__label">
                      <span
                        className="chart-legend__dot"
                        style={{ background: entry.color }}
                      />
                      {entry.label}
                    </span>
                    <span className="chart-legend__value">{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="dashboard-chart-card__empty">
              No applications yet.
            </div>
          )}
        </div>
      </div>

      {/* Quick action cards */}
      <div className="dashboard-quick-links">
        <Link
          className="dashboard-quick-card glass-card"
          to="/provider/jobs"
        >
          <span className="dashboard-quick-card__icon">
            <LayoutList size={20} />
          </span>
          <div>
            <strong>Manage job posts</strong>
            <span>View, pause, or remove your active listings</span>
          </div>
          <ArrowRight size={16} />
        </Link>
        <Link
          className="dashboard-quick-card glass-card"
          to="/provider/applications"
        >
          <span className="dashboard-quick-card__icon">
            <ClipboardList size={20} />
          </span>
          <div>
            <strong>Applications</strong>
            <span>Review and update each candidate's status</span>
          </div>
          <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
};

// ─── Page shell ────────────────────────────────────────────────────────────

const DashboardPage = () => {
  const { profile } = useAuth();

  if (!profile) {
    return <Loading label="Loading your dashboard" />;
  }

  return (
    <main className="page-container page-section dashboard-page">
      {profile.role === "jobProvider" ? (
        <ProviderDashboard profile={profile} />
      ) : (
        <CandidateDashboard profile={profile} />
      )}
    </main>
  );
};

export default DashboardPage;
