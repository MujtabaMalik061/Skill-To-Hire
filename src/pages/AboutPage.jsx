import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Heart,
  LayoutDashboard,
  Lightbulb,
  Scale,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/auth.hook.jsx";
import "../assets/styles/PublicPage.css";
import "../assets/styles/LandingPage.css";

const VALUES = [
  {
    icon: <GraduationCap size={20} />,
    title: "Opportunity for everyone",
    body: "Whether you're fresh out of university or ten years in, there's a role here that fits where you are right now. We don't gatekeep by seniority or credential.",
  },
  {
    icon: <Sparkles size={20} />,
    title: "Skills over credentials",
    body: "We put what you can do at the front. Your skills, bio, and portfolio speak before a degree ever has to. Hiring teams see the person, not just the paper.",
  },
  {
    icon: <Building2 size={20} />,
    title: "Employers who mean it",
    body: "The teams on this platform are genuinely looking. No ghost listings, no endless loops — real roles posted by real people who are ready to hire.",
  },
  {
    icon: <BriefcaseBusiness size={20} />,
    title: "Simple by design",
    body: "Apply in a click, manage your pipeline in one place. We believe the less friction between talent and opportunity, the better the outcome for everyone.",
  },
  {
    icon: <Heart size={20} />,
    title: "Built with care",
    body: "Every decision we make on this platform — from how profiles are structured to how notifications work — is made with the candidate's experience in mind first.",
  },
  {
    icon: <Scale size={20} />,
    title: "Transparency at every step",
    body: "Candidates always know where their application stands. Every status change is communicated. No ghosting, no radio silence — just honest updates.",
  },
];

const TEAM = [
  {
    initial: "M",
    name: "Moon Awan",
    role: "Founder & Developer",
    bio: "Building Skill To Hire to close the gap between talented people and the teams that need them. Full-stack developer with a focus on product.",
  },
  {
    initial: "A",
    name: "Aisha Rehan",
    role: "Product Design",
    bio: "Designs every screen and flow from the perspective of the person who just opened the page for the first time. Obsessed with reducing friction.",
  },
  {
    initial: "T",
    name: "Tariq Hassan",
    role: "Growth & Partnerships",
    bio: "Brings employers onto the platform and works to make sure the roles posted here are ones worth applying to.",
  },
];

const STORY_STATS = [
  { icon: <Users size={18} />, value: "1 200+", label: "Registered users" },
  { icon: <BriefcaseBusiness size={18} />, value: "500+", label: "Jobs posted" },
  { icon: <Building2 size={18} />, value: "80+", label: "Hiring companies" },
  { icon: <Lightbulb size={18} />, value: "2024", label: "Year founded" },
];

const AboutPage = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
  <main>
    {/* ── Hero ───────────────────────────────────────────────── */}
    <section className="public-hero public-hero--about">
      <div className="public-hero__glow public-hero__glow--one" />
      <div className="page-container public-hero__inner public-hero__inner--centered">
        <div className="public-hero__copy public-hero__copy--centered">
          <div className="hero-badge">
            <Sparkles size={14} /> Our story
          </div>
          <h1>
            Connecting skills
            <span> to real opportunity.</span>
          </h1>
          <p className="public-hero__lead">
            Skill To Hire started with one simple observation: the gap between
            talented people and the teams that need them shouldn't be this wide.
            We built this platform to close it — for everyone.
          </p>
          <div className="public-hero__actions" style={{ justifyContent: "center" }}>
            {isLoggedIn ? (
              <Link className="public-dashboard-nudge" to="/dashboard">
                <span className="public-dashboard-nudge__dot" />
                <LayoutDashboard size={15} />
                Go to your dashboard
                <ArrowRight size={14} />
              </Link>
            ) : (
              <Link className="button button--primary" to="/signup">
                Join us <ArrowRight size={16} />
              </Link>
            )}
            <Link className="button button--quiet" to="/jobs">
              Browse open roles
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* ── Stats strip ────────────────────────────────────────── */}
    <div className="public-stats-strip">
      {STORY_STATS.map(({ value, label }) => (
        <div key={label} className="public-stats-strip__item">
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>

    {/* ── Mission ────────────────────────────────────────────── */}
    <section className="page-container public-section">
      <div className="public-mission">
        <span className="eyebrow">OUR MISSION</span>
        <h2>
          "Make the path from talent to opportunity as short as possible —
          for anyone, at any stage of their career."
        </h2>
        <p>
          Too many hiring platforms bury people under algorithms, irrelevant
          noise, and systems designed to extract money from both sides of the
          table. We believe in something simpler: a candidate's real skills in
          front of a hiring team's real needs, with nothing in between. That's
          the whole idea — and we intend to keep it that way.
        </p>
      </div>
    </section>

    {/* ── Story ──────────────────────────────────────────────── */}
    <section className="page-container public-story">
      <div className="public-story__copy">
        <span className="eyebrow">HOW WE GOT HERE</span>
        <h2>Built out of frustration with how hiring usually works</h2>
        <p>
          The idea for Skill To Hire came from watching talented people
          struggle to get in front of the right teams — not because they
          weren't good enough, but because the systems they had to navigate
          weren't built with them in mind. Long application forms, no
          feedback, ghosted after three rounds.
        </p>
        <p>
          On the other side, small and mid-size teams were spending time and
          money on job boards that delivered volume without signal. They
          didn't need a thousand CVs — they needed a handful of people they
          could actually talk to.
        </p>
        <p>
          So we built a platform where the profile does the work: candidates
          list their skills, write a bio, link their portfolio, and apply with
          one click. Employers post a role, see real profiles, and move people
          through a pipeline that keeps everyone informed. Direct. Honest.
          Simple.
        </p>
        <div className="public-hero__actions" style={{ marginTop: "24px" }}>
          {isLoggedIn ? (
            <Link className="button button--primary" to="/dashboard">
              <LayoutDashboard size={16} /> Go to your dashboard
            </Link>
          ) : (
            <Link className="button button--primary" to="/signup">
              Create your account <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>
      <div className="public-story__card glass-card">
        {STORY_STATS.map(({ icon, value, label }) => (
          <div key={label} className="public-story__stat">
            <span className="public-story__stat-icon">{icon}</span>
            <div>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* ── Values ─────────────────────────────────────────────── */}
    <section className="page-container public-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">WHAT WE STAND FOR</span>
          <h2>The principles behind the platform</h2>
          <p>
            These aren't values we hung on a wall — they're the decisions we
            make every time we build a new feature.
          </p>
        </div>
      </div>
      <div className="public-values">
        {VALUES.map(({ icon, title, body }) => (
          <div key={title} className="public-value">
            <span className="public-value__icon">{icon}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ── Team ───────────────────────────────────────────────── */}
    <section className="page-container public-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">THE TEAM</span>
          <h2>The people building this</h2>
          <p>A small team with a clear goal: make hiring more human.</p>
        </div>
      </div>
      <div className="public-team">
        {TEAM.map(({ initial, name, role, bio }) => (
          <div key={name} className="public-team-card">
            <span className="public-team-card__avatar">{initial}</span>
            <h3>{name}</h3>
            <span className="public-team-card__role">{role}</span>
            <p>{bio}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ── Who it's for ───────────────────────────────────────── */}
    <section className="page-container public-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">WHO IT'S FOR</span>
          <h2>A platform built for three kinds of people</h2>
        </div>
      </div>
      <div className="path-grid">
        <Link className="path-card glass-card" to="/signup?role=student">
          <span className="path-card__icon path-card__icon--mint">
            <GraduationCap size={21} />
          </span>
          <h3>Students</h3>
          <p>Turn your studies, projects, and potential into a first real opportunity.</p>
          <span className="path-card__link">
            Create your profile <ArrowRight size={15} />
          </span>
        </Link>
        <Link className="path-card glass-card" to="/signup?role=employee">
          <span className="path-card__icon path-card__icon--blue">
            <Sparkles size={20} />
          </span>
          <h3>Professionals</h3>
          <p>Bring your experience to teams where your next chapter can grow.</p>
          <span className="path-card__link">
            Find your next role <ArrowRight size={15} />
          </span>
        </Link>
        <Link className="path-card glass-card" to="/for-employers">
          <span className="path-card__icon path-card__icon--sand">
            <Building2 size={20} />
          </span>
          <h3>Employers</h3>
          <p>Share a role and meet motivated people ready to contribute today.</p>
          <span className="path-card__link">
            Start hiring <ArrowRight size={15} />
          </span>
        </Link>
      </div>
    </section>

    {/* ── CTA ────────────────────────────────────────────────── */}
    <section className="page-container public-cta-section">
      <div className="public-cta">
        <h2>Be part of what we're building.</h2>
        <p>
          Whether you're looking for work or looking to hire — there's a
          place for you here. Join a platform that puts people first.
        </p>
        <div className="public-cta__actions">
          {isLoggedIn ? (
            <Link className="button button--primary" to="/dashboard">
              <LayoutDashboard size={16} /> Go to your dashboard
            </Link>
          ) : (
            <Link className="button button--primary" to="/signup">
              Create a free account <ArrowRight size={16} />
            </Link>
          )}
          <Link className="button button--quiet" to="/for-employers">
            Hire with us
          </Link>
        </div>
      </div>
    </section>

    <footer className="site-footer page-container">
      <span>© {new Date().getFullYear()} Skill To Hire</span>
      <span>Skills open doors. People make the difference.</span>
    </footer>
  </main>
  );
};

export default AboutPage;
