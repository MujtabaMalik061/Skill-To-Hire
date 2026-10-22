import { useCallback, useEffect, useState } from "react";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";
import Loading from "../components/loading.component.jsx";
import useAuth from "../hooks/auth.hook.jsx";
import { getCandidateApplicationsPage } from "../services/applications.services.js";
import "../assets/styles/DashboardPage.css";

const statusLabels = {
  submitted: "Submitted",
  reviewing: "In review",
  interview: "Interview",
  accepted: "Offer made",
  declined: "Closed",
};

const formatDate = (timestamp) => {
  if (!timestamp?.seconds) return "Just now";
  return new Date(timestamp.seconds * 1000).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const MyApplicationsPage = () => {
  const { profile } = useAuth();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const loadApplications = useCallback(
    async ({ nextCursor = null, append = false } = {}) => {
      if (!profile?.authId) return;
      if (append) setIsLoadingMore(true);
      else setIsLoading(true);

      try {
        const page = await getCandidateApplicationsPage({
          candidateAuthId: profile.authId,
          cursor: nextCursor,
        });
        setApplications((c) =>
          append ? [...c, ...page.items] : page.items,
        );
        setCursor(page.cursor);
        setHasMore(page.hasMore);
      } catch (error) {
        console.error("Could not load applications:", error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [profile?.authId],
  );

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  if (!profile) {
    return <Loading label="Loading your applications" />;
  }

  return (
    <main className="page-container page-section dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <span className="eyebrow">YOUR APPLICATIONS</span>
          <h1>My applications</h1>
          <p>Track every role you've applied to and its current status.</p>
        </div>
        <Link className="button button--primary" to="/jobs">
          Find more roles <ArrowRight size={16} />
        </Link>
      </div>

      <section className="dashboard-panel glass-card">
        <div className="dashboard-panel__heading">
          <div>
            <span className="eyebrow">ALL APPLICATIONS</span>
            <h2>Your activity</h2>
          </div>
          <span className="dashboard-count">{applications.length} loaded</span>
        </div>

        {isLoading ? (
          <Loading label="Loading your applications" />
        ) : applications.length ? (
          <>
            <div className="application-list">
              {applications.map((application) => (
                <article
                  className="application-row"
                  key={application.applicationId}
                >
                  <span className="application-row__icon">
                    <BriefcaseBusiness size={17} />
                  </span>
                  <div className="application-row__main">
                    <Link to={`/jobs/${application.jobId}`}>
                      {application.jobTitle}
                    </Link>
                    <span>
                      {application.companyName} · Applied{" "}
                      {formatDate(application.createdAt)}
                    </span>
                  </div>
                  <span
                    className={`status-pill status-pill--${application.status}`}
                  >
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
                  {isLoadingMore ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="dashboard-empty">
            <p>You haven't applied to a role yet.</p>
            <Link to="/jobs">
              Find a role that fits <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
};

export default MyApplicationsPage;
