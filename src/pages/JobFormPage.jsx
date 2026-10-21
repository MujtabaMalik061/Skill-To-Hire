import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Loading from "../components/loading.component.jsx";
import {CustomSelector} from "../components/custom.components.jsx";
import useAuth from "../hooks/auth.hook.jsx";
import { createJob } from "../services/jobs.services.js";
import "../assets/styles/JobFormPage.css";

const initialForm = {
  title: "",
  employmentType: "Full-time",
  workMode: "Hybrid",
  location: "",
  salaryRange: "",
  description: "",
  requirements: "",
  skills: "",
};

const JobFormPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await createJob(profile, {
        ...form,
        title: form.title.trim(),
        location: form.location.trim(),
        salaryRange: form.salaryRange.trim(),
        description: form.description.trim(),
        requirements: form.requirements.trim(),
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
          .slice(0, 12),
      });

      toast.success("Your job is live.");
      navigate("/dashboard", { replace: true });
    } catch (createError) {
      setError(createError.message || "The job couldn’t be published.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <Loading label="Publishing your job" />;
  }

  return (
    <main className="page-container page-section job-form-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">GROW YOUR TEAM</span>
          <h1>Post a job</h1>
          <p>Give candidates a clear picture of the work and who they’ll work with.</p>
        </div>
      </div>

      <form className="job-form glass-card" onSubmit={handleSubmit}>
        <label className="form-field">
          Job title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Frontend engineer"
            maxLength={90}
            required
          />
        </label>

        <div className="job-form__row">
          <label className="form-field">
            Employment type
            <CustomSelector
              name="employmentType"
              value={form.employmentType}
              onChange={handleChange}
              options={["Full-time", "Part-time", "Contract", "Internship"]}
            />
          </label>
          <label className="form-field">
            Work mode
            <CustomSelector
              name="workMode"
              value={form.workMode}
              onChange={handleChange}
              options={["Hybrid", "On-site", "Remote"]}
            />
          </label>
        </div>

        <div className="job-form__row">
          <label className="form-field">
            Location
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City or region"
              maxLength={90}
              required
            />
          </label>
          <label className="form-field">
            Salary range <small>Optional, include currency</small>
            <input
              name="salaryRange"
              value={form.salaryRange}
              onChange={handleChange}
              placeholder="e.g. PKR 180k–240k / month"
              maxLength={80}
            />
          </label>
        </div>

        <label className="form-field">
          Role description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={7}
            maxLength={8000}
            placeholder="Describe the work, team, and impact of this role."
            required
          />
        </label>

        <label className="form-field">
          Skills
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="React, communication, research"
            maxLength={500}
          />
          <small>Separate skills with commas.</small>
        </label>

        <label className="form-field">
          Requirements <small>Optional</small>
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            rows={4}
            maxLength={4000}
            placeholder="Experience, education, or other requirements."
          />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="job-form__footer">
          <p>Your listing will appear in the live jobs feed after publishing.</p>
          <button className="button button--primary" type="submit">
            Publish job
          </button>
        </div>
      </form>
    </main>
  );
};

export default JobFormPage;
