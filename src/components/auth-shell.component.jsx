import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import "../assets/styles/AuthShell.css";

const AuthShell = ({ eyebrow, title, description, children }) => (
  <main className="auth-page page-container">
    <aside className="auth-story">
      <span className="auth-story__tag">A good next step starts here</span>
      <h1>Build a career that moves with you.</h1>
      <p>
        Skill To Hire brings people and teams together through skills, real
        work, and direct conversations.
      </p>
      <div className="auth-story__notes">
        <span>
          <Check size={15} />
          Profiles built around what you can do
        </span>
        <span>
          <Check size={15} />
          Opportunities from real hiring teams
        </span>
        <span>
          <Check size={15} />
          Updates as your applications move
        </span>
      </div>
      <Link to="/jobs" className="auth-story__link">
        Explore open jobs <ArrowUpRight size={16} />
      </Link>
      <div className="auth-story__glass auth-story__glass--one" />
      <div className="auth-story__glass auth-story__glass--two" />
    </aside>

    <section className="auth-card glass-card">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p className="auth-card__description">{description}</p>
      {children}
    </section>
  </main>
);

export default AuthShell;
