import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Loading from "../components/loading.component.jsx";
import useAuth from "../hooks/auth.hook.jsx";
import { applyForJob } from "../services/applications.services.js";
import { createNotification } from "../services/notifications.services.js";
import { getUserContactProfileByDocId } from "../services/user.services.js";
import { subscribeJob } from "../services/jobs.services.js";
import "../assets/styles/JobDetailsPage.css";

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [coverNote, setCoverNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeJob(
      jobId,
      (nextJob) => {
        setJob(nextJob);
        setIsLoading(false);
      },
      (loadError) => {
        console.error("Could not load this job:", loadError);
        setError("This job couldn’t be loaded.");
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [jobId]);

  const handleApply = async (event) => {
    event.preventDefault();

    if (!profile || !user) {
      navigate("/signin", { state: { from: `/jobs/${jobId}` } });
      return;
    }

    setError("");
    setIsApplying(true);

    try {
      const application = await applyForJob(jobId, profile, { coverNote });
      const providerProfile = await getUserContactProfileByDocId(
        job.providerDocId,
      );

      if (providerProfile) {
        await createNotification(profile, providerProfile, {
          type: "application_received",
          title: "New job application",
          body: `${profile.firstName} ${profile.lastName} applied for ${job.title}.`,
          link: "/dashboard",
          applicationId: application.applicationId,
        }).catch((notificationError) => {
          console.error("Application was sent but its alert failed:", notificationError);
        });
      }

      toast.success("Your application was sent.");
      navigate("/dashboard", { replace: true });
    } catch (applyError) {
      setError(applyError.message || "Your application could not be sent.");
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return <Loading label="Loading job details" />;
  }

  if (!job) {
    return (
      <main className="page-container page-section">
        <div className="empty-state glass-card">
          <h1>We couldn’t find that job</h1>
          <p>{error || "The role may have closed or the link may be incorrect."}</p>
          <Link className="button button--quiet" to="/jobs">Browse open jobs</Link>
        </div>
      </main>
    );
  }

  const canApply = profile?.role === "student" || profile?.role === "employee";
  const isProviderOwner = profile?.docId === job.providerDocId;

  return (
    <main className="job-details page-container page-section">
      <Link className="job-details__back" to="/jobs">
        <ArrowLeft size={15} /> Back to jobs
      </Link>

      <div className="job-details__layout">
        <article className="job-details__main glass-card">
          <div className="job-details__company-row">
            <span className="job-card__company-mark">
              {(job.companyName || "S").slice(0, 1).toUpperCase()}
            </span>
            <span>
              <strong>{job.companyName || "Hiring team"}</strong>
              <small>Hiring on Skill To Hire</small>
            </span>
          </div>

          <span className="eyebrow">{job.employmentType || "OPEN ROLE"}</span>
          <h1>{job.title}</h1>
          <div className="job-details__facts">
            <span><MapPin size={16} />{job.location || "Location flexible"}</span>
            <span><BriefcaseBusiness size={16} />{job.workMode || "Flexible"}</span>
            {job.createdAt && (
              <span>
                <CalendarDays size={16} />
                Posted {new Date(job.createdAt.seconds * 1000).toLocaleDateString()}
              </span>
            )}
          </div>

          {job.salaryRange && (
            <p className="job-details__salary">{job.salaryRange}</p>
          )}

          <div className="job-details__divider" />
          <section className="job-details__section">
            <h2>About the role</h2>
            <p>{job.description}</p>
          </section>

          {job.skills?.length > 0 && (
            <section className="job-details__section">
              <h2>Skills and experience</h2>
              <div className="skill-list">
                {job.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </section>
          )}

          {job.requirements && (
            <section className="job-details__section">
              <h2>What you’ll bring</h2>
              <p>{job.requirements}</p>
            </section>
          )}
        </article>

        <aside className="job-details__sidebar">
          <section className="apply-card glass-card">
            <span className="eyebrow">YOUR NEXT STEP</span>
            <h2>Interested in this role?</h2>
            {canApply ? (
              <form className="apply-form" onSubmit={handleApply}>
                <label className="form-field">
                  Short note to the hiring team
                  <textarea
                    value={coverNote}
                    onChange={(event) => setCoverNote(event.target.value)}
                    rows={5}
                    maxLength={1600}
                    placeholder="Share why this role feels like a good fit."
                  />
                  <small>{coverNote.length}/1600</small>
                </label>
                {error && <p className="form-error" role="alert">{error}</p>}
                <button
                  className="button button--primary"
                  type="submit"
                  disabled={isApplying || job.status !== "published"}
                >
                  {isApplying ? "Sending application…" : "Apply for this role"}
                </button>
              </form>
            ) : isProviderOwner ? (
              <p className="apply-card__message">
                This is your listing. Review applicants from your dashboard.
              </p>
            ) : user ? (
              <p className="apply-card__message">
                Job applications are available to student and employee profiles.
              </p>
            ) : (
              <div className="apply-card__actions">
                <p>Create a candidate profile to apply and follow your applications.</p>
                <Link className="button button--primary" to="/signup">
                  Create a profile
                </Link>
                <Link className="apply-card__signin" to="/signin">
                  Already have an account? Sign in
                </Link>
              </div>
            )}
            {job.status !== "published" && (
              <p className="form-error">This role is no longer accepting applications.</p>
            )}
          </section>
          <p className="job-details__privacy">
            Your application details are shared only with this hiring team.
          </p>
        </aside>
      </div>
    </main>
  );
};

export default JobDetailsPage;
