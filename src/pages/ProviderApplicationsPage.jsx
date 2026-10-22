import { useCallback, useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Loading from "../components/loading.component.jsx";
import { CustomSelector } from "../components/custom.components.jsx";
import useAuth from "../hooks/auth.hook.jsx";
import {
  getProviderApplicationsPage,
  updateApplicationStatus,
} from "../services/applications.services.js";
import { createNotification } from "../services/notifications.services.js";
import { getUserContactProfileByDocId } from "../services/user.services.js";
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

const ProviderApplicationsPage = () => {
  const { profile } = useAuth();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  const loadApplications = useCallback(
    async ({ nextCursor = null, append = false } = {}) => {
      if (append) setIsLoadingMore(true);
      else setIsLoading(true);

      try {
        const page = await getProviderApplicationsPage({
          providerAuthId: profile.authId,
          cursor: nextCursor,
        });
        setApplications((c) => (append ? [...c, ...page.items] : page.items));
        setCursor(page.cursor);
        setHasMore(page.hasMore);
      } catch {
        toast.error("Applications could not be loaded.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [profile.authId],
  );

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleApplicationStatus = async (application, status) => {
    setUpdatingId(application.applicationId);
    try {
      await updateApplicationStatus(application.applicationId, status);
      const candidate = await getUserContactProfileByDocId(
        application.candidateDocId,
      );
      if (candidate) {
        await createNotification(profile, candidate, {
          type: "application_status",
          title: `Application update: ${statusLabels[status]}`,
          body: `Your application for ${application.jobTitle} is now ${statusLabels[status].toLowerCase()}.`,
          link: "/dashboard",
          applicationId: application.applicationId,
        }).catch((e) =>
          console.error("Status updated but notification failed:", e),
        );
      }
      toast.success("Applicant status updated.");
    } catch (error) {
      toast.error(error.message || "The application could not be updated.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <main className="page-container page-section dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <span className="eyebrow">CANDIDATES</span>
          <h1>Applications</h1>
          <p>Review and update each candidate's status.</p>
        </div>
        <span className="dashboard-count">{applications.length} loaded</span>
      </div>

      <section className="dashboard-panel glass-card">
        <div className="dashboard-panel__heading">
          <div>
            <span className="eyebrow">ALL APPLICATIONS</span>
            <h2>Recent applications</h2>
          </div>
        </div>

        {isLoading ? (
          <Loading label="Loading applications" />
        ) : applications.length ? (
          <>
            <div className="application-list">
              {applications.map((application) => (
                <article
                  className="application-row application-row--provider"
                  key={application.applicationId}
                >
                  <span className="application-row__icon">
                    <Users size={17} />
                  </span>
                  <div className="application-row__main">
                    <Link
                      to={`/provider/candidates/${application.candidateDocId}`}
                    >
                      {application.candidateName}
                    </Link>
                    <span>
                      {application.jobTitle} · {formatDate(application.createdAt)}
                    </span>
                    {application.coverNote && (
                      <p>{application.coverNote}</p>
                    )}
                  </div>
                  <label className="status-select">
                    <span className="sr-only">Update candidate status</span>
                    <CustomSelector
                      value={application.status}
                      disabled={updatingId === application.applicationId}
                      onChange={(e) =>
                        handleApplicationStatus(application, e.target.value)
                      }
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
            <p>Applications will appear here as people apply.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default ProviderApplicationsPage;
