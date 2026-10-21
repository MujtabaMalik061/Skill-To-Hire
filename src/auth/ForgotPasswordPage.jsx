import { useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "../components/auth-shell.component.jsx";
import { requestPasswordReset } from "../services/auth.services.js";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSent(false);
    setIsSubmitting(true);

    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch (resetError) {
      setError(resetError.message || "The reset email could not be sent.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="ACCOUNT RECOVERY"
      title="Reset your password"
      description="We’ll email you a secure link to choose a new password."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="form-field">
          Email address
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}
        {sent && (
          <p className="form-success" role="status">
            If an account uses that address, a reset link is on its way.
          </p>
        )}

        <button
          className="button button--primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending link…" : "Send reset link"}
        </button>
      </form>

      <p className="auth-card__foot">
        Remembered it? <Link to="/signin">Back to sign in</Link>
      </p>
    </AuthShell>
  );
};

export default ForgotPasswordPage;
