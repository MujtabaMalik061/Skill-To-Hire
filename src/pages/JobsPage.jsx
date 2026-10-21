import { useCallback, useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import JobCard from "../components/job-card.component.jsx";
import {CustomSelector} from "../components/custom.components.jsx";
import Loading from "../components/loading.component.jsx";
import { getPublishedJobsPage } from "../services/jobs.services.js";
import "../assets/styles/JobsPage.css";

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState(searchParams.get("search") || "");
  const [employmentType, setEmploymentType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");
  const searchTerm = searchParams.get("search") || "";

  const loadJobs = useCallback(async ({ nextCursor = null, append = false } = {}) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setError("");
    }

    try {
      const page = await getPublishedJobsPage({
        employmentType,
        searchTerm,
        cursor: nextCursor,
      });

      setJobs((currentJobs) =>
        append ? [...currentJobs, ...page.items] : page.items,
      );
      setCursor(page.cursor);
      setHasMore(page.hasMore);
    } catch (loadError) {
      console.error("Could not load jobs:", loadError);
      setError("Jobs could not be loaded. Please try again in a moment.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [employmentType, searchTerm]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const nextParams = new URLSearchParams(searchParams);

    if (keyword.trim()) {
      nextParams.set("search", keyword.trim());
    } else {
      nextParams.delete("search");
    }

    setSearchParams(nextParams, { replace: true });
  };

  return (
    <main className="page-section jobs-page page-container">
      <div className="jobs-page__intro">
        <span className="eyebrow">OPPORTUNITY, WITHOUT THE NOISE</span>
        <h1>Find work that fits.</h1>
        <p>Explore roles shared by hiring teams on Skill To Hire.</p>
      </div>

      <form className="jobs-toolbar glass-card" onSubmit={handleSearchSubmit}>
        <label className="jobs-toolbar__search">
          <Search size={18} aria-hidden="true" />
          <input
            aria-label="Search by role, skill, or company"
            placeholder="Role, skill, company, or location"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </label>
          <CustomSelector
            aria-label="Filter by employment type"
            value={employmentType}
            onChange={(event) => setEmploymentType(event.target.value)}
            options={[
              { value: "all", label: "All schedules" },
              { value: "Full-time", label: "Full-time" },
              { value: "Part-time", label: "Part-time" },
              { value: "Contract", label: "Contract" },
              { value: "Internship", label: "Internship" },
            ]}
          />
        <button className="button button--primary" type="submit">
          Search jobs
        </button>
      </form>

      <div className="jobs-page__count">
        <strong>{jobs.length}</strong>
        <span>{jobs.length === 1 ? "role" : "roles"} loaded</span>
        <span className="jobs-page__live-dot" />
        <span>Live updates</span>
      </div>

      {error ? (
        <p className="form-error" role="alert">{error}</p>
      ) : isLoading ? (
        <Loading label="Loading open jobs" />
      ) : jobs.length ? (
        <>
          <div className="job-grid job-grid--all">
            {jobs.map((job) => (
              <JobCard key={job.jobId} job={job} />
            ))}
          </div>
          {hasMore && (
            <div className="jobs-page__load-more">
              <button
                className="button button--quiet"
                type="button"
                disabled={isLoadingMore}
                onClick={() => loadJobs({ nextCursor: cursor, append: true })}
              >
                {isLoadingMore ? "Loading…" : "Load more jobs"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state glass-card jobs-page__empty">
          <div className="empty-state__icon"><Search size={20} /></div>
          <h2>No matching roles just yet</h2>
          <p>Try a different search or check back as new roles are posted.</p>
        </div>
      )}
    </main>
  );
};

export default JobsPage;
