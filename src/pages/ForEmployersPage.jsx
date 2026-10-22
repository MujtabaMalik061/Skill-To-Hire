import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  Search,
  Sparkles,
  UserRound,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/auth.hook.jsx";
import "../assets/styles/PublicPage.css";
import "../assets/styles/LandingPage.css";

const STATS = [
  { value: "80+", label: "Hiring companies" },
  { value: "1 200+", label: "Active candidates" },
  { value: "500+", label: "Roles posted" },
  { value: "Free", label: "No listing fees" },
];

const STEPS = [
  {
    icon: <Building2 size={22} />,
    title: "Create your employer profile",
    body: "Set up your company account in minutes. Add your name, website, and a brief description so candidates know who they're applying to.",
  },
  {
    icon: <BriefcaseBusiness size={22} />,
    title: "Post a role",
    body: "Write a clear, direct job post with the skills you need, employment type, and location. Publish immediately when you're ready.",
  },
  {
    icon: <Users size={22} />,
    title: "Review applicants",
    body: "Candidates apply directly through their profile. You see their skills, bio, experience, and portfolio link all in one place.",
  },
  {
    icon: <ClipboardList size={22} />,
    title: "Manage your pipeline",
    body: "Move candidates through review, interview, offer, and closed stages. Candidates are notified automatically at each step.",
  },
];

const FEATURES = [
  {
    icon: <UserRound size={20} />,
    title: "Rich candidate profiles",
    body: "Every applicant brings a full profile — skills, professional headline, bio, employment history, and a portfolio link. No CVs to download or parse.",
  },
  {
    icon: <Zap size={20} />,
    title: "Instant pipeline",
    body: "Applications arrive the moment candidates submit. No email chains, no waiting — your dashboard updates in real time.",
  },
  {
    icon: <ClipboardList size={20} />,
    title: "One-click status updates",
    body: "Move a candidate from review to interview to offer with a single dropdown change. They receive a notification automatically.",
  },
  {
    icon: <Search size={20} />,
    title: "Searchable by candidates",
    body: "Your job posts are indexed immediately and surface in candidate searches. The right people find you without you having to advertise.",
  },
  {
    icon: <CheckCircle2 size={20} />,
    title: "Pause or close anytime",
    body: "Need to pause hiring? Unpublish a role in one click and republish later. Close it permanently when the position is filled.",
  },
  {
    icon: <Sparkles size={20} />,
    title: "Multiple roles, one workspace",
    body: "Post as many positions as you need. Every role and its applicants are managed from the same employer workspace.",
  },
];

const REASONS = [
  {
    stat: "Free to post",
    label: "No listing fees, no subscription. Post as many roles as you need.",
  },
  {
    stat: "Direct access",
    label: "No middlemen, no recruiter gatekeeping — you talk to candidates yourself.",
  },
  {
    stat: "Students & pros",
    label: "Talent from both early-career graduates and experienced professionals.",
  },
  {
    stat: "Real profiles",
    label: "Skills, bios, and portfolios on every applicant — no blank CVs.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We posted our first role and had 14 relevant applicants within a few days. The candidate profile pages make it really easy to see who's worth a conversation.",
    name: "James T.",
    role: "Founder · Fintech startup",
    initial: "J",
  },
  {
    quote:
      "The pipeline view is simple and does exactly what we need. I can see every application, move people forward, and keep the team informed without switching between tools.",
    name: "Sara L.",
    role: "Head of People · SaaS company",
    initial: "S",
  },
  {
    quote:
      "We've tried other platforms and the noise-to-signal ratio was terrible. Here the candidates are genuinely interested and their profiles actually tell you something.",
    name: "David O.",
    role: "CTO · Design agency",
    initial: "D",
  },
];

const FAQ = [
  {
    q: "Is it really free to post jobs?",
    a: "Yes, completely. Posting roles, managing applications, and updating candidate statuses are all free — no trial, no hidden tier. We believe the cost of hiring should go toward your team, not your tools.",
  },
  {
    q: "What types of roles can I post?",
    a: "Any role — full-time, part-time, contract, internship, or remote. There are no restrictions on industry, seniority, or location. If you're hiring, you can post it here.",
  },
  {
    q: "How do candidates apply?",
    a: "Candidates apply through their Skill To Hire profile with a single click. Their profile — including skills, bio, and portfolio link — is sent to you automatically. There's nothing for them to fill out.",
  },
  {
    q: "Can I pause a job post without losing applicants?",
    a: "Yes. Pausing a role hides it from public search but keeps all existing applications and their statuses intact. Republish whenever you're ready to accept new applicants again.",
  },
  {
    q: "Do candidates get notified when I update their status?",
    a: "Yes. Every status change you make — from submitted to reviewing, interview, offer, or closed — triggers a notification to the candidate so they always know where they stand.",
  },
  {
    q: "Can I search for candidates directly?",
    a: "At the moment, candidates come to you through applications. You can view the full profile of anyone who applies to your roles. Active search of the candidate pool is on our roadmap.",
  },
];

const ForEmployersPage = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
  <main>
    {/* ── Hero ───────────────────────────────────────────────── */}
    <section className="public-hero">
      <div className="public-hero__glow public-hero__glow--one" />
      <div className="public-hero__glow public-hero__glow--two" />
      <div className="page-container public-hero__inner">
        <div className="public-hero__copy">
          <div className="hero-badge">
            <Sparkles size={14} /> Built for teams that care about who they hire
          </div>
          <h1>
            Find people ready
            <span> to contribute.</span>
          </h1>
          <p className="public-hero__lead">
            Post a role, meet motivated candidates — students and
            professionals — and move the right ones forward, all from one
            clean workspace. No fees. No algorithms. Just direct connections.
          </p>
          <div className="public-hero__actions">
            {isLoggedIn ? (
              <Link className="public-dashboard-nudge" to="/dashboard">
                <span className="public-dashboard-nudge__dot" />
                <LayoutDashboard size={15} />
                Go to your dashboard
                <ArrowRight size={14} />
              </Link>
            ) : (
              <Link className="button button--primary" to="/signup?role=jobProvider">
                Get started free <ArrowRight size={16} />
              </Link>
            )}
            <Link className="button button--quiet" to="/jobs">
              See active listings
            </Link>
          </div>
        </div>

        <div className="public-hero__visual-wrap" aria-hidden="true">
          <div className="public-stats-card glass-card">
            <span className="eyebrow">EMPLOYER WORKSPACE</span>
            <div className="public-stats-row">
              <div className="public-stat">
                <strong>3</strong>
                <span>Live jobs</span>
              </div>
              <div className="public-stat">
                <strong>24</strong>
                <span>Applicants</span>
              </div>
              <div className="public-stat">
                <strong>6</strong>
                <span>In review</span>
              </div>
            </div>
            <p className="public-pipeline__label">Pipeline activity</p>
            <div className="public-pipeline__bar">
              <span style={{ width: "42%", background: "#818cf8" }} />
              <span style={{ width: "26%", background: "#4cd7f6" }} />
              <span style={{ width: "18%", background: "#10b981" }} />
              <span style={{ width: "14%", background: "#fb7185" }} />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── Stats strip ────────────────────────────────────────── */}
    <div className="public-stats-strip">
      {STATS.map(({ value, label }) => (
        <div key={label} className="public-stats-strip__item">
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>

    {/* ── Why ────────────────────────────────────────────────── */}
    <section className="page-container public-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">WHY SKILL TO HIRE</span>
          <h2>Hiring without the noise</h2>
          <p>
            No algorithms, no bidding wars, no recruiter loops — just direct
            access to people who want to work.
          </p>
        </div>
      </div>
      <div className="public-reasons">
        {REASONS.map(({ stat, label }) => (
          <div key={stat} className="public-reason">
            <span className="public-reason__icon">
              <CheckCircle2 size={18} />
            </span>
            <strong>{stat}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>

    {/* ── Steps ──────────────────────────────────────────────── */}
    <section className="page-container public-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">HOW IT WORKS</span>
          <h2>From post to hire in four steps</h2>
          <p>No training, no onboarding, no complicated setup required.</p>
        </div>
      </div>
      <div className="public-steps">
        {STEPS.map(({ icon, title, body }, i) => (
          <div key={title} className="public-step">
            <span className="public-step__num">{i + 1}</span>
            <span className="public-step__icon">{icon}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ── Features ───────────────────────────────────────────── */}
    <section className="page-container public-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">WHAT'S INCLUDED</span>
          <h2>Everything you need to hire well</h2>
          <p>
            Every feature is built around one goal: getting the right people
            in front of your team as fast as possible.
          </p>
        </div>
      </div>
      <div className="public-features">
        {FEATURES.map(({ icon, title, body }) => (
          <div key={title} className="public-feature">
            <span className="public-feature__icon">{icon}</span>
            <div className="public-feature__body">
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* ── Testimonials ───────────────────────────────────────── */}
    <section className="page-container public-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">FROM OUR EMPLOYERS</span>
          <h2>What hiring teams are saying</h2>
        </div>
      </div>
      <div className="public-testimonials">
        {TESTIMONIALS.map(({ quote, name, role, initial }) => (
          <div key={name} className="public-testimonial">
            <span className="public-testimonial__quote">"</span>
            <blockquote>{quote}</blockquote>
            <div className="public-testimonial__author">
              <span className="public-testimonial__avatar">{initial}</span>
              <div className="public-testimonial__author-info">
                <strong>{name}</strong>
                <span>{role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* ── FAQ ────────────────────────────────────────────────── */}
    <section className="page-container public-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">QUESTIONS</span>
          <h2>Frequently asked by employers</h2>
        </div>
      </div>
      <div className="public-faq">
        {FAQ.map(({ q, a }) => (
          <div key={q} className="public-faq__item">
            <h3>{q}</h3>
            <p>{a}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ── Final CTA ──────────────────────────────────────────── */}
    <section className="page-container public-cta-section">
      <div className="public-cta">
        <h2>Ready to meet your next hire?</h2>
        <p>
          It takes under two minutes to create an account and post your first
          role. Free forever — no credit card required.
        </p>
        <div className="public-cta__actions">
          {isLoggedIn ? (
            <Link className="button button--primary" to="/dashboard">
              <LayoutDashboard size={16} /> Go to your dashboard
            </Link>
          ) : (
            <Link className="button button--primary" to="/signup?role=jobProvider">
              Create employer account <ArrowRight size={16} />
            </Link>
          )}
          <Link className="button button--quiet" to="/about">
            Learn more about us
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

export default ForEmployersPage;
