import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthShell from "../components/auth-shell.component.jsx";
import { CustomSelector } from "../components/custom.components.jsx";
import Loading from "../components/loading.component.jsx";
import ProviderButtons from "../components/provider-buttons.component.jsx";
import {
  signUpWithEmail,
  signUpWithProvider,
} from "../services/auth.services.js";

const roles = [
  { value: "student", label: "Student" },
  { value: "employee", label: "Employee or job seeker" },
  { value: "jobProvider", label: "Job provider" },
];

const SignUpPage = () => {
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get("role");
  const startingRole = roles.some((role) => role.value === requestedRole)
    ? requestedRole
    : "student";
  const navigate = useNavigate();
  const [role, setRole] = useState(startingRole);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    universityName: "",
    companyName: "",
    companyWebsite: "",
    headline: "",
    employmentStatus: "looking",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const profileData = () => ({
    role,
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim().toLowerCase(),
    universityName: form.universityName.trim(),
    companyName: form.companyName.trim(),
    companyWebsite: form.companyWebsite.trim(),
    headline: form.headline.trim(),
    employmentStatus: form.employmentStatus,
    skills: [],
  });

  const finishSignUp = () => {
    navigate("/dashboard", { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signUpWithEmail({
        ...profileData(),
        password: form.password,
      });

      finishSignUp();
    } catch (signUpError) {
      setError(signUpError.message || "Your account could not be created.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProviderSignUp = async (providerName) => {
    setError("");
    setIsSubmitting(true);

    try {
      await signUpWithProvider(providerName, profileData());
      finishSignUp();
    } catch (signUpError) {
      setError(
        signUpError.message || "Provider sign-up could not be completed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiresInstitution = role === "student";
  const requiresCompany = role === "jobProvider";

  if (isSubmitting) {
    return <Loading label="Creating your account" />;
  }

  return (
    <AuthShell
      eyebrow="JOIN SKILL TO HIRE"
      title="Create your account"
      description="Choose how you’ll use the platform. You can add more profile details later."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="form-field">
          Account type
          <CustomSelector
            value={role}
            onChange={(event) => setRole(event.target.value)}
            options={roles}
          />
        </label>

        <div className="auth-form__names">
          <label className="form-field">
            First name
            <input
              name="firstName"
              value={form.firstName}
              onChange={updateField}
              autoComplete="given-name"
              required
            />
          </label>
          <label className="form-field">
            Last name
            <input
              name="lastName"
              value={form.lastName}
              onChange={updateField}
              autoComplete="family-name"
              required
            />
          </label>
        </div>

        <label className="form-field">
          Email address
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            autoComplete="email"
            required
          />
        </label>

        {requiresInstitution && (
          <label className="form-field">
            University or institution
            <input
              name="universityName"
              value={form.universityName}
              onChange={updateField}
              autoComplete="organization"
              required
            />
          </label>
        )}

        {requiresCompany && (
          <>
            <label className="form-field">
              Company or organization
              <input
                name="companyName"
                value={form.companyName}
                onChange={updateField}
                autoComplete="organization"
                required
              />
            </label>
            <label className="form-field">
              Company website <small>Optional</small>
              <input
                name="companyWebsite"
                type="url"
                value={form.companyWebsite}
                onChange={updateField}
                placeholder="https://example.com"
              />
            </label>
          </>
        )}

        {role === "employee" && (
          <>
            <label className="form-field">
              Employment status
              <CustomSelector
                name="employmentStatus"
                value={form.employmentStatus}
                onChange={updateField}
                options={[
                  { value: "looking", label: "Looking for work" },
                  { value: "employed", label: "Currently employed" },
                  { value: "open", label: "Open to opportunities" },
                ]}
              />
            </label>
            <label className="form-field">
              Professional headline <small>Optional</small>
              <input
                name="headline"
                value={form.headline}
                onChange={updateField}
                placeholder="e.g. Product designer, 4 years experience"
              />
            </label>
          </>
        )}

        <label className="form-field">
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            autoComplete="new-password"
            minLength={8}
            required
          />
          <small>Use at least 8 characters.</small>
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button className="button button--primary" type="submit">
          Create account
        </button>
      </form>

      <div className="auth-divider">or continue with</div>
      <ProviderButtons
        disabled={isSubmitting}
        onSelect={handleProviderSignUp}
      />

      <p className="auth-card__foot">
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </AuthShell>
  );
};

export default SignUpPage;
