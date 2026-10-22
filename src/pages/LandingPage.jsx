import { useEffect, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardList,
  Compass,
  GraduationCap,
  Heart,
  LayoutDashboard,
  Search,
  Sparkles,
  UserRound,
  Users,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import JobCard from "../components/job-card.component.jsx";
import Loading from "../components/loading.component.jsx";
import useAuth from "../hooks/auth.hook.jsx";
import { getPublishedJobsPage } from "../services/jobs.services.js";
import "../assets/styles/LandingPage.css";

// ─── Static data ───────────────────────────────────────────────────────────

const STATS = [
  { value: "500+", label: "Jobs posted" },
  { value: "1 200+", label: "Candidates registered" },
  { value: "80+", label: "Hiring companies" },
  { value: "Free", label: "Always, for everyone" },
];

const HOW_IT_WORKS = [
  {
    icon: <UserRound size={22} />,
    title: "Build your profile",
    body: "Add your skills, professional headline, bio, and portfolio link. Your profile is how hiring teams find and evaluate you — make it count.",
  },
  {
    icon: <Compass size={22} />,
    title: "Discover the right roles",
    body: "Browse every open position or search by role, skill, or company. Filter by employment type and location to find what actually fits.",
  },
  {
    icon: <CheckCircle2 size={22} />,
    title: "Apply with one click",
    body: "When you find a role that fits, apply instantly. Your profile goes straight to the hiring team — no cover letter required.",
  },
];

const CANDIDATE_CHECKS = [
  "Build a profile that shows your skills, not just your CV",
  "Apply to any open role in a single click",
  "Track every application from submitted to offer in real time",
  "Get notified the moment a hiring team updates your status",
  "Available to students, graduates, and experienced professionals",
];

const EMPLOYER_CHECKS = [
  "Post any role — full-time, part-time, contract, or internship",
  "See rich candidate profiles with skills, bio, and portfolio",
  "Move applicants through review, interview, and offer stages",
  "Candidates are notified automatically at every status change",
  "Pause, republish, or close roles at any time — no fees ever",
];

const FEATURES = [
  {
    icon: <Zap size={20} />,
    title: "Instant applications",
    body: "Candidates apply directly from their profile. No forms to fill out, no uploads — just one click from the job listing.",
  },
  {
    icon: <ClipboardList size={20} />,
    title: "Live pipeline tracking",
    body: "Both sides always know where things stand. Candidates see their status, employers manage their pipeline — all in one place.",
  },
  {
    icon: <Building2 size={20} />,
    title: "Verified employers only",
    body: "Every job is posted by a real company account. No ghost listings, no mass recruiter blasts — only roles worth applying to.",
  },
  {
    icon: <Sparkles size={20} />,
    title: "Skills-first discovery",
    body: "Search is built around what you can do, not job titles. Candidates surface in the right results without gaming anything.",
  },
  {
    icon: <GraduationCap size={20} />,
    title: "Built for students too",
    body: "A dedicated student account type lets you show university, projects, and potential alongside the professionals.",
  },
  {
    icon: <Heart size={20} />,
    title: "No fees, ever",
    body: "Posting jobs, applying, tracking applications — all completely free. We think the cost of hiring should fund your team, not a platform.",
  },
];

const TESTIMONIALS = [
  {
    quote: "I applied to three roles in my first week and had an interview lined up within ten days. The whole process felt genuinely simple.",
    name: "Aisha K.",
    role: "Recent graduate · Software Engineering",
    initial: "A",
  },
  {
    quote: "We posted our first role and had 14 relevant applicants within a few days. The candidate profiles make it easy to see who's worth talking to.",
    name: "James T.",
    role: "Founder · Fintech startup",
    initial: "J",
  },
  {
    quote: "I'd been searching for a while without much luck on bigger platforms. Here I felt like an actual person, not just a CV in a pile.",
    name: "Priya M.",
    role: "Mid-level designer · Open to work",
    initial: "P",
  },
];

const FAQ = [
  {
    q: "Is this platform free?",
    a: "Yes, completely. Applying for jobs, posting roles, and managing your entire pipeline are all free — no hidden tiers, no credit card ever required.",
  },
  {
    q: "Who can sign up as a candidate?",
    a: "Anyone looking for work. We have two candidate account types — Student (for university students and recent graduates) and Employee / Job seeker (for professionals at any stage).",
  },
  {
    q: "How do candidates apply to jobs?",
    a: "Candidates apply through their Skill To Hire profile in a single click. The employer receives the full profile — skills, bio, and portfolio — automatically.",
  },
  {
    q: "How does the employer pipeline work?",
    a: "Employers move candidates through five stages: Submitted → In review → Interview → Offer made → Closed. Candidates receive a notification at each update.",
  },
  {
    q: "Can employers pause or delete a job post?",
    a: "Yes. Pausing hides the role from search without losing existing applicants. Deleting removes it permanently. Both can be done from the employer workspace in one click.",
  },
  {
    q: "What information does a candidate profile include?",
    a: "Name, professional headline, skills list, bio, employment/student status, university (for students), and an optional portfolio link. Employers see all of this when reviewing an application.",
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, getCachedSearchTokens } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    getPublishedJobsPage()
      .then((page) => setJobs(page.items.slice(0, 3)))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    navigate(q ? `/jobs?search=${encodeURIComponent(q)}` : "/jobs");
  };

  const isLoggedIn = !!user;
  getCachedSearchTokens(keyword); // warm cache

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="landing-hero__glow landing-hero__glow--one" />
        <div className="landing-hero__glow landing-hero__glow--two" />

        <div className="page-container landing-hero__content">
          <div className="landing-hero__copy">
            <div className="hero-badge">
              <Sparkles size={14} /> A clearer path from skills to opportunity
            </div>
            <h1>
              Work that fits
              <span>who you're becoming.</span>
            </h1>
            <p className="landing-hero__lead">
              Find meaningful roles, show what you can do, and connect
              directly with the people building their teams — no algorithms,
              no fees, no noise.
            </p>

            <form className="hero-search" onSubmit={handleSearch}>
              <div className="search-container">
                <Search size={19} aria-hidden="true" />
                <input
                  aria-label="Search jobs"
                  placeholder="Role, skill, or company"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <button className="button button--primary" type="submit">
                Find jobs <ArrowRight size={16} />
              </button>
            </form>

            {isLoggedIn ? (
              <div className="landing-hero__links">
                <Link to="/dashboard">
                  <LayoutDashboard size={14} /> Go to your dashboard →
                </Link>
              </div>
            ) : (
              <div className="landing-hero__links">
                <span>New here?</span>
                <Link to="/signup">Create a free profile</Link>
                <span className="landing-hero__dot">·</span>
                <Link to="/signin">Sign in</Link>
              </div>
            )}
          </div>

          <div className="landing-hero__visual" aria-hidden="true">
            <div className="hero-orbit hero-orbit--outer" />
            <div className="hero-orbit hero-orbit--inner" />
            <div className="hero-glass-card">
              <div className="hero-card-topline">
                <span className="hero-card-icon"><GraduationCap size={20} /></span>
                <span className="hero-card-spark">✦</span>
              </div>
              <span className="hero-card-label">YOUR NEXT CHAPTER</span>
              <h2>Skills in motion.<br />Careers in reach.</h2>
              <div className="hero-card-progress"><span /></div>
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
              <span className="hero-float-build"><Building2 size={17} /></span>
              <span>
                <strong>Real teams</strong>
                <small>Ready to meet you</small>
              </span>
            </div>
          </div>
        </div>

        <div className="landing-hero__bottom page-container">
          <span>Made for every next step</span>
          <span className="landing-hero__bottom-rule" />
          <span>Students</span>
          <span>Professionals</span>
          <span>Growing teams</span>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────── */}
      <div className="landing-stats-strip">
        {STATS.map(({ value, label }) => (
          <div key={label} className="landing-stats-strip__item">
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Featured jobs ────────────────────────────────────── */}
      <section className="page-container landing-jobs">
        <div className="section-heading">
          <div>
            <span className="eyebrow">START WITH WHAT'S OPEN</span>
            <h2>Recently posted roles</h2>
            <p>Fresh opportunities from teams looking for the skills you bring.</p>
          </div>
          <Link className="text-link" to="/jobs">
            Explore all jobs <ArrowRight size={16} />
          </Link>
        </div>
        {isLoading ? (
          <Loading label="Finding fresh opportunities" />
        ) : jobs.length ? (
          <div className="job-grid">
            {jobs.map((job) => <JobCard key={job.jobId} job={job} />)}
          </div>
        ) : (
          <div className="empty-state glass-card">
            <div className="empty-state__icon"><BriefcaseBusiness size={22} /></div>
            <h3>Good opportunities are on their way</h3>
            <p>No published jobs yet. Check back soon or create your profile now.</p>
            <Link className="button button--quiet" to="/signup">Create a profile</Link>
          </div>
        )}
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="page-container landing-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">HOW IT WORKS</span>
            <h2>Three steps to your next role</h2>
            <p>No complicated setup. Build your profile, find what fits, apply in one click.</p>
          </div>
        </div>
        <div className="landing-how-grid">
          {HOW_IT_WORKS.map(({ icon, title, body }) => (
            <div key={title} className="landing-how-card">
              <span className="landing-how-card__icon">{icon}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── For candidates ───────────────────────────────────── */}
      <section className="page-container landing-split">
        <div className="landing-split__copy">
          <span className="eyebrow">FOR JOB SEEKERS</span>
          <h2>Your career, moving forward.</h2>
          <p>
            Whether you're a student landing your first role or a professional
            ready for the next chapter, Skill To Hire gives you a profile that
            speaks for you and a pipeline you can actually follow.
          </p>
          <ul className="landing-split__checklist">
            {CANDIDATE_CHECKS.map((item) => (
              <li key={item}>
                <CheckCircle2 size={15} />
                {item}
              </li>
            ))}
          </ul>
          {isLoggedIn ? (
            <Link className="button button--primary" to="/dashboard">
              <LayoutDashboard size={16} /> Go to your dashboard
            </Link>
          ) : (
            <Link className="button button--primary" to="/signup">
              Create your free profile <ArrowRight size={16} />
            </Link>
          )}
        </div>
        <div className="landing-split__visual">
          <div className="landing-split__card">
            <div className="landing-split__card-head">
              <span className="landing-split__card-icon"><UserRound size={18} /></span>
              <div>
                <strong>Your profile</strong>
                <span>Skills · Bio · Portfolio</span>
              </div>
            </div>
            <div className="landing-split__tags">
              {["React", "TypeScript", "Node.js", "UI Design", "Figma", "Python"].map((s) => (
                <span key={s} className="landing-split__tag">{s}</span>
              ))}
            </div>
          </div>
          <div className="landing-split__card">
            <div className="landing-split__card-head">
              <span className="landing-split__card-icon"><ClipboardList size={18} /></span>
              <div>
                <strong>Application tracker</strong>
                <span>Live status updates</span>
              </div>
            </div>
            <div className="landing-split__bar"><span style={{ width: "60%" }} /></div>
            <div className="landing-split__bar"><span style={{ width: "40%" }} /></div>
            <div className="landing-split__bar"><span style={{ width: "80%" }} /></div>
          </div>
        </div>
      </section>

      {/* ── For employers ────────────────────────────────────── */}
      <section className="page-container landing-split landing-split--reverse">
        <div className="landing-split__copy">
          <span className="eyebrow">FOR EMPLOYERS</span>
          <h2>Meet the people ready to contribute.</h2>
          <p>
            Post a role, see real candidate profiles — skills, bio, portfolio
            — and move the right people forward from one clean workspace. No
            listing fees, no algorithms, no middlemen.
          </p>
          <ul className="landing-split__checklist">
            {EMPLOYER_CHECKS.map((item) => (
              <li key={item}>
                <CheckCircle2 size={15} />
                {item}
              </li>
            ))}
          </ul>
          {isLoggedIn ? (
            <Link className="button button--primary" to="/dashboard">
              <LayoutDashboard size={16} /> Go to your dashboard
            </Link>
          ) : (
            <Link className="button button--primary" to="/signup?role=jobProvider">
              Start hiring for free <ArrowRight size={16} />
            </Link>
          )}
        </div>
        <div className="landing-split__visual">
          <div className="landing-split__card">
            <div className="landing-split__card-head">
              <span className="landing-split__card-icon"><Building2 size={18} /></span>
              <div>
                <strong>Employer workspace</strong>
                <span>Jobs · Pipeline · Candidates</span>
              </div>
            </div>
            <div className="landing-split__tags">
              {["3 live jobs", "24 applicants", "6 in review", "2 interviews"].map((s) => (
                <span key={s} className="landing-split__tag">{s}</span>
              ))}
            </div>
          </div>
          <div className="landing-split__card">
            <div className="landing-split__card-head">
              <span className="landing-split__card-icon"><Users size={18} /></span>
              <div>
                <strong>Applicant pipeline</strong>
                <span>Status updates · Notifications</span>
              </div>
            </div>
            <div className="landing-split__bar"><span style={{ width: "75%" }} /></div>
            <div className="landing-split__bar"><span style={{ width: "50%" }} /></div>
            <div className="landing-split__bar"><span style={{ width: "30%" }} /></div>
          </div>
        </div>
      </section>

      {/* ── Platform features ────────────────────────────────── */}
      <section className="page-container landing-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">BUILT FOR BOTH SIDES</span>
            <h2>Everything the platform does</h2>
            <p>Every feature exists to make the connection between talent and opportunity faster and more honest.</p>
          </div>
        </div>
        <div className="landing-features">
          {FEATURES.map(({ icon, title, body }) => (
            <div key={title} className="landing-feature">
              <span className="landing-feature__icon">{icon}</span>
              <div className="landing-feature__body">
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who it's for (paths) ─────────────────────────────── */}
      <section className="page-container landing-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A PLACE FOR EVERY NEXT STEP</span>
            <h2>Make your next move count</h2>
          </div>
        </div>
        <div className="path-grid">
          <Link className="path-card" to="/signup?role=student">
            <span className="path-card__icon path-card__icon--mint"><GraduationCap size={21} /></span>
            <h3>For students</h3>
            <p>Turn your studies, projects, and potential into a first real opportunity.</p>
            <span className="path-card__link">Start your profile <ArrowRight size={15} /></span>
          </Link>
          <Link className="path-card" to="/signup?role=employee">
            <span className="path-card__icon path-card__icon--blue"><Sparkles size={20} /></span>
            <h3>For professionals</h3>
            <p>Bring your experience to teams where your next chapter can grow.</p>
            <span className="path-card__link">Find your next role <ArrowRight size={15} /></span>
          </Link>
          <Link className="path-card" to="/signup?role=jobProvider">
            <span className="path-card__icon path-card__icon--sand"><Building2 size={20} /></span>
            <h3>For employers</h3>
            <p>Share a role and meet motivated people ready to contribute today.</p>
            <span className="path-card__link">Start hiring <ArrowRight size={15} /></span>
          </Link>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="page-container landing-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">WHAT PEOPLE SAY</span>
            <h2>Real results, real people</h2>
            <p>From candidates and companies already using Skill To Hire.</p>
          </div>
        </div>
        <div className="landing-testimonials">
          {TESTIMONIALS.map(({ quote, name, role, initial }) => (
            <div key={name} className="landing-testimonial">
              <span className="landing-testimonial__quote">"</span>
              <blockquote>{quote}</blockquote>
              <div className="landing-testimonial__author">
                <span className="landing-testimonial__avatar">{initial}</span>
                <div>
                  <strong>{name}</strong>
                  <span>{role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="page-container landing-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">QUESTIONS</span>
            <h2>Frequently asked</h2>
            <p>Everything you need to know before you get started.</p>
          </div>
        </div>
        <div className="landing-faq">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="landing-faq__item">
              <h3>{q}</h3>
              <p>{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dark CTA ─────────────────────────────────────────── */}
      <section className="landing-cta-section">
        <div className="page-container landing-cta">
          <h2>
            Your next role is<span> already waiting.</span>
          </h2>
          <p>
            Join the platform where skills open doors and teams find real
            people. Free for everyone — candidates and employers alike.
          </p>
          <div className="landing-cta__actions">
            {isLoggedIn ? (
              <Link className="button button--primary" to="/dashboard">
                <LayoutDashboard size={16} /> Go to your dashboard
              </Link>
            ) : (
              <>
                <Link className="button button--primary" to="/signup">
                  Create your free profile <ArrowRight size={16} />
                </Link>
                <Link className="button button--quiet" to="/jobs">
                  Browse open roles
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="page-container site-footer--dark">
          <span>© {new Date().getFullYear()} Skill To Hire</span>
          <span>Skills open doors. People make the difference.</span>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
