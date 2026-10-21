import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Loading from "../components/loading.component.jsx";
import {CustomSelector} from "../components/custom.components.jsx";
import useAuth from "../hooks/auth.hook.jsx";
import {
  getCandidateApplicationsPage,
  getProviderApplicationsPage,
  updateApplicationStatus,
} from "../services/applications.services.js";
import { createNotification } from "../services/notifications.services.js";
import {
  getProviderJobsPage,
  updateJobStatus,
} from "../services/jobs.services.js";
import {
  getUserContactProfileByDocId,
} from "../services/user.services.js";
import "../assets/styles/DashboardPage.css";

const statusLabels = {
  submitted: "Submitted",
  reviewing: "In review",
  interview: "Interview",
  accepted: "Offer made",
  declined: "Closed",
};

const formatDate = (timestamp) => {
  if (!timestamp?.seconds) {
    return "Just now";
  }

  return new Date(timestamp.seconds * 1000).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const CandidateDashboard = ({ profile }) => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const loadApplications = useCallback(async ({
    nextCursor = null,
    append = false,
  } = {}) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const page = await getCandidateApplicationsPage({
        candidateAuthId: profile.authId,
        cursor: nextCursor,
      });
      setApplications((currentApplications) =>
        append ? [...currentApplications, ...page.items] : page.items,
      );
      setCursor(page.cursor);
      setHasMore(page.hasMore);
    } catch (error) {
      console.error("Could not load applications:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [profile.authId]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  return (
    <>
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

      <section className="dashboard-panel glass-card">
        <div className="dashboard-panel__heading">
          <div>
            <span className="eyebrow">APPLICATIONS</span>
            <h2>Your recent activity</h2>
          </div>
          <span className="dashboard-count">
            {applications.length} loaded
          </span>
        </div>

        {isLoading ? (
          <Loading label="Loading your applications" />
        ) : applications.length ? (
          <>
            <div className="application-list">
            {applications.map((application) => (
              <article className="application-row" key={application.applicationId}>
                <span className="application-row__icon">
                  <BriefcaseBusiness size={17} />
                </span>
                <div className="application-row__main">
                  <Link to={`/jobs/${application.jobId}`}>
                    {application.jobTitle}
                  </Link>
                  <span>{application.companyName} · Applied {formatDate(application.createdAt)}</span>
                </div>
                <span className={`status-pill status-pill--${application.status}`}>
                  {statusLabels[application.status] || application.status}
                </span>
              </article>
            ))}
            </div>
            {hasMore && (
            <div className="dashboard-load-more">
              <button
                className="button button--quiet button--small"
                type="button"
                disabled={isLoadingMore}
                onClick={() =>
                  loadApplications({ nextCursor: cursor, append: true })
                }
              >
                {isLoadingMore ? "Loading…" : "Load more applications"}
              </button>
            </div>
            )}
          </>
        ) : (
          <div className="dashboard-empty">
            <p>You haven’t applied to a role yet.</p>
            <Link to="/jobs">Find a role that fits <ArrowRight size={14} /></Link>
          </div>
        )}
      </section>
    </>
  );
};

const ProviderDashboard = ({ profile }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [jobsCursor, setJobsCursor] = useState(null);
  const [applicationsCursor, setApplicationsCursor] = useState(null);
  const [hasMoreJobs, setHasMoreJobs] = useState(false);
  const [hasMoreApplications, setHasMoreApplications] = useState(false);
  const [isLoadingMoreJobs, setIsLoadingMoreJobs] = useState(false);
  const [isLoadingMoreApplications, setIsLoadingMoreApplications] = useState(false);

  useEffect(() => {
    const loadWorkspace = async () => {
      setIsLoading(true);

      try {
        const [jobsPage, applicationsPage] = await Promise.all([
          getProviderJobsPage({ providerAuthId: profile.authId }),
          getProviderApplicationsPage({ providerAuthId: profile.authId }),
        ]);
        setJobs(jobsPage.items);
        setJobsCursor(jobsPage.cursor);
        setHasMoreJobs(jobsPage.hasMore);
        setApplications(applicationsPage.items);
        setApplicationsCursor(applicationsPage.cursor);
        setHasMoreApplications(applicationsPage.hasMore);
      } catch (error) {
        console.error("Could not load your workspace:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkspace();
  }, [profile.authId]);

  const loadMoreJobs = async () => {
    setIsLoadingMoreJobs(true);

    try {
      const page = await getProviderJobsPage({
        providerAuthId: profile.authId,
        cursor: jobsCursor,
      });
      setJobs((currentJobs) => [...currentJobs, ...page.items]);
      setJobsCursor(page.cursor);
      setHasMoreJobs(page.hasMore);
    } catch (error) {
      toast.error("More jobs could not be loaded.");
    } finally {
      setIsLoadingMoreJobs(false);
    }
  };

  const loadMoreApplications = async () => {
    setIsLoadingMoreApplications(true);

    try {
      const page = await getProviderApplicationsPage({
        providerAuthId: profile.authId,
        cursor: applicationsCursor,
      });
      setApplications((currentApplications) => [
        ...currentApplications,
        ...page.items,
      ]);
      setApplicationsCursor(page.cursor);
      setHasMoreApplications(page.hasMore);
    } catch (error) {
      toast.error("More applications could not be loaded.");
    } finally {
      setIsLoadingMoreApplications(false);
    }
  };

  const handleApplicationStatus = async (application, status) => {
    setUpdatingId(application.applicationId);

    try {
      await updateApplicationStatus(application.applicationId, status);
      const candidate = await getUserContactProfileByDocId(application.candidateDocId);

      if (candidate) {
        await createNotification(profile, candidate, {
          type: "application_status",
          title: `Application update: ${statusLabels[status]}`,
          body: `Your application for ${application.jobTitle} is now ${statusLabels[status].toLowerCase()}.`,
          link: "/dashboard",
          applicationId: application.applicationId,
        }).catch((notificationError) => {
          console.error("Status was updated but its alert failed:", notificationError);
        });
      }

      toast.success("Applicant status updated.");
    } catch (error) {
      toast.error(error.message || "The application could not be updated.");
    } finally {
      setUpdatingId("");
    }
  };

  const handleJobStatus = async (job) => {
    const nextStatus = job.status === "published" ? "paused" : "published";

    try {
      await updateJobStatus(job.jobId, nextStatus);
      toast.success(nextStatus === "published" ? "Job is live." : "Job paused.");
    } catch (error) {
      toast.error(error.message || "Job status could not be changed.");
    }
  };

  return (
    <>
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

      <div className="dashboard-stats">
        <div className="dashboard-stat glass-card">
          <span>Published roles loaded</span>
          <strong>{jobs.filter((job) => job.status === "published").length}</strong>
        </div>
        <div className="dashboard-stat glass-card">
          <span>Applications loaded</span>
          <strong>{applications.length}</strong>
        </div>
        <div className="dashboard-stat glass-card">
          <span>In review loaded</span>
          <strong>{applications.filter((item) => item.status === "reviewing").length}</strong>
        </div>
      </div>

      <section className="dashboard-panel glass-card">
        <div className="dashboard-panel__heading">
          <div>
            <span className="eyebrow">YOUR OPENINGS</span>
            <h2>Manage job posts</h2>
          </div>
          <Link className="text-link" to="/provider/jobs/new">Create a role <ArrowRight size={15} /></Link>
        </div>

        {isLoading ? (
          <Loading label="Loading your team workspace" />
        ) : jobs.length ? (
          <>
            <div className="provider-job-list">
            {jobs.map((job) => (
              <article className="provider-job-row" key={job.jobId}>
                <div>
                  <h3>{job.title}</h3>
                  <p>{job.location} · {job.employmentType} · {job.status}</p>
                </div>
                <button
                  className="button button--quiet button--small"
                  type="button"
                  onClick={() => handleJobStatus(job)}
                >
                  {job.status === "published" ? "Pause" : "Republish"}
                </button>
              </article>
            ))}
            </div>
            {hasMoreJobs && (
            <div className="dashboard-load-more">
              <button
                className="button button--quiet button--small"
                type="button"
                disabled={isLoadingMoreJobs}
                onClick={loadMoreJobs}
              >
                {isLoadingMoreJobs ? "Loading…" : "Load more jobs"}
              </button>
            </div>
            )}
          </>
        ) : (
          <div className="dashboard-empty">
            <p>Your first role can reach motivated candidates here.</p>
            <Link to="/provider/jobs/new">Post your first job <ArrowRight size={14} /></Link>
          </div>
        )}
      </section>

      <section className="dashboard-panel glass-card">
        <div className="dashboard-panel__heading">
          <div>
            <span className="eyebrow">CANDIDATES</span>
            <h2>Recent applications</h2>
          </div>
          <span className="dashboard-count">{applications.length} loaded</span>
        </div>

        {isLoading ? (
          <Loading label="Loading applications" />
        ) : applications.length ? (
          <>
            <div className="application-list">
            {applications.map((application) => (
              <article className="application-row application-row--provider" key={application.applicationId}>
                <span className="application-row__icon"><Users size={17} /></span>
                <div className="application-row__main">
                  <strong>{application.candidateName}</strong>
                  <span>{application.jobTitle} · {formatDate(application.createdAt)}</span>
                  {application.coverNote && <p>{application.coverNote}</p>}
                </div>
                <label className="status-select">
                  <span className="sr-only">Update candidate status</span>
                  <CustomSelector
                    value={application.status}
                    disabled={updatingId === application.applicationId}
                    onChange={(event) => handleApplicationStatus(application, event.target.value)}
                    options={[
                      { value: "submitted", label: "Submitted" },
                      { value: "reviewing", label: "In review" },
                      { value: "interview", label: "Interview" },
                      { value: "accepted", label: "Offer made" },
                      { value: "declined", label: "Closed" },
                    ]}
                  />
                </label>
              </article>
            ))}
            </div>
            {hasMoreApplications && (
            <div className="dashboard-load-more">
              <button
                className="button button--quiet button--small"
                type="button"
                disabled={isLoadingMoreApplications}
                onClick={loadMoreApplications}
              >
                {isLoadingMoreApplications ? "Loading…" : "Load more applications"}
              </button>
            </div>
            )}
          </>
        ) : (
          <div className="dashboard-empty">
            <p>Applications will appear here as people apply.</p>
          </div>
        )}
      </section>
    </>
  );
};

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
