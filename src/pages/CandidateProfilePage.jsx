import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  ExternalLink,
  GraduationCap,
  Link2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/loading.component.jsx";
import { getUserProfileByDocId } from "../services/user.services.js";
import "../assets/styles/CandidateProfilePage.css";

const roleLabel = (role) => {
  if (role === "student") return "Student";
  if (role === "employee") return "Employee / job seeker";
  return "Candidate";
};

const employmentLabels = {
  looking: "Looking for work",
  employed: "Currently employed",
  open: "Open to opportunities",
};

const CandidateProfilePage = () => {
  const { docId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getUserProfileByDocId(docId)
      .then((profile) => {
        if (!profile) setNotFound(true);
        else setCandidate(profile);
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [docId]);

  if (isLoading) return <Loading label="Loading candidate profile" />;

  if (notFound) {
    return (
      <main className="page-container page-section candidate-profile-page">
        <Link className="back-link" to="/provider/applications">
          <ArrowLeft size={15} /> Back to applications
        </Link>
        <p className="candidate-profile__not-found">
          This profile could not be found.
        </p>
      </main>
    );
  }

  const name =
    `${candidate.firstName || ""} ${candidate.lastName || ""}`.trim() ||
    "Candidate";

  return (
    <main className="page-container page-section candidate-profile-page">
      <Link className="back-link" to="/provider/applications">
        <ArrowLeft size={15} /> Back to applications
      </Link>

      <div className="candidate-profile glass-card">
        <div className="candidate-profile__header">
          <span className="candidate-profile__avatar">
            {name.slice(0, 1).toUpperCase()}
          </span>
          <div className="candidate-profile__header-info">
            <h1>{name}</h1>
            {candidate.headline && (
              <p className="candidate-profile__headline">{candidate.headline}</p>
            )}
          </div>
          <span className="profile-role-pill">{roleLabel(candidate.role)}</span>
        </div>

        {candidate.bio && (
          <section className="candidate-profile__section">
            <h2>About</h2>
            <p>{candidate.bio}</p>
          </section>
        )}

        {candidate.skills?.length > 0 && (
          <section className="candidate-profile__section">
            <h2>Skills</h2>
            <div className="candidate-profile__skills">
              {candidate.skills.map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {(candidate.universityName ||
          candidate.employmentStatus ||
          candidate.portfolio) && (
          <section className="candidate-profile__section">
            <h2>Details</h2>
            <div className="candidate-profile__details">
              {candidate.role === "student" && candidate.universityName && (
                <div className="candidate-profile__detail-row">
                  <GraduationCap size={15} />
                  <span>{candidate.universityName}</span>
                </div>
              )}
              {candidate.role === "employee" && candidate.employmentStatus && (
                <div className="candidate-profile__detail-row">
                  <Briefcase size={15} />
                  <span>
                    {employmentLabels[candidate.employmentStatus] ||
                      candidate.employmentStatus}
                  </span>
                </div>
              )}
              {candidate.portfolio && (
                <div className="candidate-profile__detail-row">
                  <Link2 size={15} />
                  <a
                    href={candidate.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {candidate.portfolio}
                    <ExternalLink size={11} />
                  </a>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default CandidateProfilePage;
