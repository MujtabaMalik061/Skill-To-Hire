import { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  BriefcaseBusiness,
  GraduationCap,
  Search,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import JobCard from "../components/job-card.component.jsx";
import Loading from "../components/loading.component.jsx";
import { getPublishedJobsPage } from "../services/jobs.services.js";
import "../assets/styles/LandingPage.css";
import useAuth from "../hooks/auth.hook.jsx";

const LandingPage = () => {
  const navigate = useNavigate();
  const { getCachedSearchTokens } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const loadFeaturedJobs = async () => {
      try {
        const page = await getPublishedJobsPage();
        setJobs(page.items.slice(0, 3));
      } catch (error) {
        console.error("Could not load featured jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedJobs();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const search = keyword.trim();
    navigate(search ? `/jobs?search=${encodeURIComponent(search)}` : "/jobs");
  };

  const searchSuggestions = getCachedSearchTokens(keyword);

  console.log("searchSuggestions--->", searchSuggestions);
  

  return (
    <main>
      <section className="landing-hero">
        <div className="landing-hero__glow landing-hero__glow--one" />
        <div className="landing-hero__glow landing-hero__glow--two" />

        <div className="page-container landing-hero__content">
          <div className="landing-hero__copy">
            <div className="hero-badge">
              <Sparkles size={14} />A clearer path from skills to opportunity
            </div>
            <h1>
              Work that fits
              <span> who you’re becoming.</span>
            </h1>
            <p className="landing-hero__lead">
              Find meaningful roles, show what you can do, and connect directly
              with the people building their teams.
            </p>

            <form className="hero-search" onSubmit={handleSearch}>
              <div className="search-container">
                <Search size={19} aria-hidden="true" />
                <input
                  aria-label="Search jobs"
                  placeholder="Role, skill, or company"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />
              </div>
              <button className="button button--primary" type="submit">
                Find jobs <ArrowRight size={16} />
              </button>
            </form>

            <div className="landing-hero__links">
              <span>Starting your search?</span>
              <Link to="/signup">Build your profile</Link>
              <span className="landing-hero__dot">·</span>
              <Link to="/signup?role=jobProvider">Hiring a team?</Link>
            </div>
          </div>

          <div className="landing-hero__visual" aria-hidden="true">
            <div className="hero-orbit hero-orbit--outer" />
            <div className="hero-orbit hero-orbit--inner" />
            <div className="hero-glass-card hero-glass-card--main">
              <div className="hero-card-topline">
                <span className="hero-card-icon">
                  <GraduationCap size={20} />
                </span>
                <span className="hero-card-spark">✦</span>
              </div>
              <span className="hero-card-label">YOUR NEXT CHAPTER</span>
              <h2>
                Skills in motion.
                <br />
                Careers in reach.
              </h2>
              <div className="hero-card-progress">
                <span />
              </div>
              <div className="hero-card-caption">
                <span>Profile strength</span>
                <strong>Growing</strong>
              </div>
            </div>
            <div className="hero-float-card hero-float-card--top">
              <span className="hero-float-check">✓</span>
              <span>
                <strong>One good match</strong>
                <small>can change everything</small>
              </span>
            </div>
            <div className="hero-float-card hero-float-card--bottom">
              <span className="hero-float-build">
                <Building2 size={17} />
              </span>
              <span>
                <strong>Real teams</strong>
                <small>Ready to meet you</small>
              </span>
            </div>
          </div>
        </div>
        <div className="landing-hero__bottom page-container">
          <span>Made for the next step in your career</span>
          <span className="landing-hero__bottom-rule" />
          <span>Students</span>
          <span>Professionals</span>
          <span>Growing teams</span>
        </div>
      </section>

      <section className="page-container landing-jobs">
        <div className="section-heading">
          <div>
            <span className="eyebrow">START WITH WHAT’S OPEN</span>
            <h2>Recently posted roles</h2>
            <p>
              Fresh opportunities from teams looking for the skills you bring.
            </p>
          </div>
          <Link className="text-link" to="/jobs">
            Explore all jobs <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <Loading label="Finding fresh opportunities" />
        ) : jobs.length ? (
          <div className="job-grid">
            {jobs.map((job) => (
              <JobCard key={job.jobId} job={job} />
            ))}
          </div>
        ) : (
          <div className="empty-state glass-card">
            <div className="empty-state__icon">
              <BriefcaseBusiness size={22} />
            </div>
            <h3>Good opportunities are on their way</h3>
            <p>
              There are no published jobs yet. Check back soon or create your
              profile now.
            </p>
            <Link className="button button--quiet" to="/signup">
              Create a profile
            </Link>
          </div>
        )}
      </section>

      <section className="page-container landing-paths">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A PLACE FOR EVERY NEXT STEP</span>
            <h2>Make your next move count</h2>
          </div>
        </div>
        <div className="path-grid">
          <Link className="path-card glass-card" to="/signup?role=student">
            <span className="path-card__icon path-card__icon--mint">
              <GraduationCap size={21} />
            </span>
            <h3>For students</h3>
            <p>
              Turn your studies, projects, and potential into a first
              opportunity.
            </p>
            <span className="path-card__link">
              Start your profile <ArrowRight size={15} />
            </span>
          </Link>
          <Link className="path-card glass-card" to="/signup?role=employee">
            <span className="path-card__icon path-card__icon--blue">
              <Sparkles size={20} />
            </span>
            <h3>For professionals</h3>
            <p>
              Bring your experience to teams where your next chapter can grow.
            </p>
            <span className="path-card__link">
              Find your next role <ArrowRight size={15} />
            </span>
          </Link>
          <Link className="path-card glass-card" to="/signup?role=jobProvider">
            <span className="path-card__icon path-card__icon--sand">
              <Building2 size={20} />
            </span>
            <h3>For employers</h3>
            <p>Share a role and meet motivated people ready to contribute.</p>
            <span className="path-card__link">
              Build your team <ArrowRight size={15} />
            </span>
          </Link>
        </div>
      </section>

      <footer className="site-footer page-container">
        <span>© {new Date().getFullYear()} Skill To Hire</span>
        <span>Skills open doors. People make the difference.</span>
      </footer>
    </main>
  );
};

export default LandingPage;
