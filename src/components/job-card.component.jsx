import { ArrowUpRight, BriefcaseBusiness, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => (
  <article className="job-card glass-card">
    <div className="job-card__top">
      <span className="job-card__company-mark">
        {(job.companyName || "S").slice(0, 1).toUpperCase()}
      </span>
      <span className="job-card__type">{job.employmentType || "Full-time"}</span>
    </div>

    <h3>{job.title}</h3>
    <p className="job-card__company">{job.companyName || "Hiring team"}</p>

    <div className="job-card__meta">
      <span><MapPin size={14} />{job.location || "Location flexible"}</span>
      <span><BriefcaseBusiness size={14} />{job.workMode || "Flexible"}</span>
    </div>

    <div className="job-card__bottom">
      {job.salaryRange ? (
        <span className="job-card__salary">{job.salaryRange}</span>
      ) : (
        <span className="job-card__salary job-card__salary--muted">
          Compensation discussed
        </span>
      )}
      <Link
        className="job-card__open"
        to={`/jobs/${job.jobId}`}
        aria-label={`View ${job.title}`}
      >
        <ArrowUpRight size={18} />
      </Link>
    </div>
  </article>
);

export default JobCard;
