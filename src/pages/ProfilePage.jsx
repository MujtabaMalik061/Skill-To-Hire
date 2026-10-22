import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../components/loading.component.jsx";
import {CustomSelector} from "../components/custom.components.jsx";
import useAuth from "../hooks/auth.hook.jsx";
import { updateUserProfile } from "../services/user.services.js";
import "../assets/styles/ProfilePage.css";

const ProfilePage = () => {
  const { profile, user } = useAuth();
  const [form, setForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setForm({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      role: profile.role || "employee",
      headline: profile.headline || "",
      skills: (profile.skills || []).join(", "),
      employmentStatus: profile.employmentStatus || "looking",
      universityName: profile.universityName || "",
      companyName: profile.companyName || "",
      companyWebsite: profile.companyWebsite || "",
      bio: profile.bio || "",
      portfolio: profile.portfolio || "",
    });
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      await updateUserProfile(profile.docId, {
        ...form,
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
          .slice(0, 20),
      });
      toast.success("Your profile is up to date.");
    } catch (error) {
      toast.error(error.message || "Your profile could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!form) {
    return <Loading label="Loading your profile" />;
  }

  return (
    <main className="page-container page-section profile-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR ACCOUNT</span>
          <h1>Profile settings</h1>
          <p>Keep the details you share with hiring teams current.</p>
        </div>
      <span className="profile-role-pill">
        {form.role === "jobProvider"
          ? "Job provider"
          : form.role === "student"
            ? "Student"
            : "Employee / job seeker"}
      </span>
      </div>

      <form className="profile-form glass-card" onSubmit={handleSubmit}>
        {form.role !== "jobProvider" && (
          <section className="profile-role-setting">
            <label className="form-field">
              Account type
              <CustomSelector
                name="role"
                value={form.role}
                onChange={handleChange}
                options={[
                  { value: "student", label: "Student" },
                  { value: "employee", label: "Employee / job seeker" },
                ]}
              />
            </label>
            <p>
              Switch between a student and job seeker account at any time.
            </p>
          </section>
        )}

        {form.role !== "jobProvider" && (
          <div className="profile-form__row">
            <label className="form-field">
              First name
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
            </label>
            <label className="form-field">
              Last name
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
            </label>
          </div>
        )}

        {form.role === "jobProvider" ? (
          <>
            <label className="form-field">
              Company name
              <input name="companyName" value={form.companyName} onChange={handleChange} required />
            </label>
            <label className="form-field">
              Company website
              <input name="companyWebsite" type="url" value={form.companyWebsite} onChange={handleChange} />
            </label>
          </>
        ) : null}

        {form.role === "student" && (
          <label className="form-field">
            University
            <input name="universityName" value={form.universityName} onChange={handleChange} required />
          </label>
        )}

        {(form.role === "employee" || form.role === "student") && (
          <>
            <label className="form-field">
              Professional headline
              <input
                name="headline"
                value={form.headline}
                onChange={handleChange}
                maxLength={120}
                placeholder="What kind of work are you looking for?"
              />
            </label>
            {form.role === "employee" && (
              <label className="form-field">
                Employment status
                <CustomSelector
                  name="employmentStatus"
                  value={form.employmentStatus}
                  onChange={handleChange}
                  options={[
                    { value: "looking", label: "Looking for work" },
                    { value: "employed", label: "Currently employed" },
                    { value: "open", label: "Open to opportunities" },
                  ]}
                />
              </label>
            )}
            <label className="form-field">
              Skills
              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="Separate skills with commas"
              />
            </label>
            <label className="form-field">
              Portfolio link
              <input
                name="portfolio"
                type="text"
                value={form.portfolio}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
              />
            </label>
          </>
        )}

        <label className="form-field">
          About
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={5}
            maxLength={1200}
            placeholder="A short introduction, your interests, and what you’d like to work on."
          />
        </label>

        <div className="profile-form__footer">
          <span>{user?.email}</span>
          <button className="button button--primary" type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : "Save profile"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default ProfilePage;
