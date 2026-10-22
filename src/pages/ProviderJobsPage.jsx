import { useCallback, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Loading from "../components/loading.component.jsx";
import useAuth from "../hooks/auth.hook.jsx";
import {
  deleteJob,
  getProviderJobsPage,
  updateJobStatus,
} from "../services/jobs.services.js";
import "../assets/styles/DashboardPage.css";

const ProviderJobsPage = () => {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadJobs = useCallback(
    async ({ nextCursor = null, append = false } = {}) => {
      if (append) setIsLoadingMore(true);
      else setIsLoading(true);

      try {
        const page = await getProviderJobsPage({
          providerAuthId: profile.authId,
          cursor: nextCursor,
        });
        setJobs((c) => (append ? [...c, ...page.items] : page.items));
        setCursor(page.cursor);
        setHasMore(page.hasMore);
      } catch {
        toast.error("Jobs could not be loaded.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [profile.authId],
  );

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleJobStatus = async (job) => {
    const nextStatus = job.status === "published" ? "paused" : "published";
    try {
      await updateJobStatus(job.jobId, nextStatus);
      setJobs((c) =>
        c.map((j) => (j.jobId === job.jobId ? { ...j, status: nextStatus } : j)),
      );
      toast.success(nextStatus === "published" ? "Job is live." : "Job paused.");
    } catch (error) {
      toast.error(error.message || "Job status could not be changed.");
    }
  };

  const handleDeleteJob = async (job) => {
    if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    try {
      await deleteJob(job.jobId);
      setJobs((c) => c.filter((j) => j.jobId !== job.jobId));
      toast.success("Job deleted.");
    } catch (error) {
      toast.error(error.message || "Job could not be deleted.");
    }
  };

  return (
    <main className="page-container page-section dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <span className="eyebrow">YOUR OPENINGS</span>
          <h1>Manage job posts</h1>
          <p>View, pause, or remove your active listings.</p>
        </div>
        <Link className="button button--primary" to="/provider/jobs/new">
          Post a job <ArrowRight size={16} />
        </Link>
      </div>

      <section className="dashboard-panel glass-card">
        <div className="dashboard-panel__heading">
          <div>
            <span className="eyebrow">ALL LISTINGS</span>
            <h2>{isLoading ? "Loading…" : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} loaded`}</h2>
          </div>
          <Link className="text-link" to="/provider/jobs/new">
            Create a role <ArrowRight size={15} />
          </Link>
        </div>

        {isLoading ? (
          <Loading label="Loading your jobs" />
        ) : jobs.length ? (
          <>
            <div className="provider-job-list">
              {jobs.map((job) => (
                <article className="provider-job-row" key={job.jobId}>
                  <div className="provider-job-row__info">
                    <h3>{job.title}</h3>
                    <p>{job.location} · {job.employmentType} · {job.status}</p>
                  </div>
                  <div className="provider-job-row__actions">
                    <Link
                      className="button button--quiet button--small"
                      to={`/jobs/${job.jobId}`}
                    >
                      View
                    </Link>
                    <button
                      className="button button--quiet button--small"
                      type="button"
                      onClick={() => handleJobStatus(job)}
                    >
                      {job.status === "published" ? "Pause" : "Republish"}
                    </button>
                    <button
                      className="button button--quiet button--small button--danger"
                      type="button"
                      onClick={() => handleDeleteJob(job)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {hasMore && (
              <div className="dashboard-load-more">
                <button
                  className="button button--quiet button--small"
                  type="button"
                  disabled={isLoadingMore}
                  onClick={() => loadJobs({ nextCursor: cursor, append: true })}
                >
                  {isLoadingMore ? "Loading…" : "Load more jobs"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="dashboard-empty">
            <p>You haven't posted any jobs yet.</p>
            <Link to="/provider/jobs/new">
              Post your first job <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
};

export default ProviderJobsPage;
