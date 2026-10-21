import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth-shell.component.jsx";
import Loading from "../components/loading.component.jsx";
import ProviderButtons from "../components/provider-buttons.component.jsx";
import {
  signInWithEmail,
  signInWithProvider,
} from "../services/auth.services.js";

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const continueToApp = () => {
    const requestedPath = location.state?.from;
    const destination =
      typeof requestedPath === "string"
        ? requestedPath
        : requestedPath?.pathname || "/dashboard";

    navigate(destination, { replace: true, state: { from: requestedPath } });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await signInWithEmail(form);
      continueToApp(result.profile);
    } catch (signInError) {
      setError(signInError.message || "We couldn’t sign you in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProviderSignIn = async (providerName) => {
    setError("");
    setIsSubmitting(true);

    try {
      const result = await signInWithProvider(providerName);
      continueToApp(result.profile);
    } catch (signInError) {
      setError(signInError.message || "Provider sign-in could not be completed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <Loading label="Signing you in" />;
  }

  return (
    <AuthShell
      eyebrow="WELCOME BACK"
      title="Sign in to continue"
      description="Pick up where you left off and keep your next opportunity moving."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="form-field">
          Email address
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleFieldChange}
            autoComplete="email"
            required
          />
        </label>

        <label className="form-field">
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleFieldChange}
            autoComplete="current-password"
            required
          />
        </label>

        <div className="auth-form__row">
          <span>Your account is protected by Firebase Authentication.</span>
          <Link to="/forgot-password">Forgot?</Link>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button className="button button--primary" type="submit">
          Sign in
        </button>
      </form>

      <div className="auth-divider">or sign in with</div>
      <ProviderButtons
        disabled={isSubmitting}
        onSelect={handleProviderSignIn}
      />

      <p className="auth-card__foot">
        New to Skill To Hire? <Link to="/signup">Create an account</Link>
      </p>
    </AuthShell>
  );
};

export default SignInPage;
