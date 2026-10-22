import { useCallback, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import JobCard from "../components/job-card.component.jsx";
import {CustomSelector} from "../components/custom.components.jsx";
import Loading from "../components/loading.component.jsx";
import { getPublishedJobsPage, getSearchTokens } from "../services/jobs.services.js";
import "../assets/styles/JobsPage.css";

const TOKENS_KEY = "sth_search_tokens";
const TOKENS_TTL = 24 * 60 * 60 * 1000;

const loadCachedTokens = () => {
  try {
    const raw = localStorage.getItem(TOKENS_KEY);
    if (!raw) return null;
    const { tokens, ts } = JSON.parse(raw);
    return Date.now() - ts < TOKENS_TTL ? tokens : null;
  } catch {
    return null;
  }
};

const cacheTokens = (tokens) => {
  localStorage.setItem(TOKENS_KEY, JSON.stringify({ tokens, ts: Date.now() }));
};

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
  const [allTokens, setAllTokens] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTerm = searchParams.get("search") || "";
  const searchWrapRef = useRef(null);

  useEffect(() => {
    const cached = loadCachedTokens();
    if (cached) {
      setAllTokens(cached);
      return;
    }
    getSearchTokens()
      .then((tokens) => {
        setAllTokens(tokens);
        cacheTokens(tokens);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trimmed = keyword.trim().toLowerCase();
  const suggParts = trimmed.split(/\s+/).filter(Boolean);
  const lastWord = suggParts.at(-1) ?? "";
  const leadingPhrase = suggParts.slice(0, -1).join(" ");
  const suggestions =
    lastWord.length >= 2
      ? allTokens
          .filter((t) => t.startsWith(lastWord))
          .slice(0, 8)
          .map((t) => (leadingPhrase ? `${leadingPhrase} ${t}` : t))
          .filter((s) => s !== trimmed)
      : [];

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

  const submitSearch = (value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      nextParams.set("search", value.trim());
    } else {
      nextParams.delete("search");
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setShowSuggestions(false);
    submitSearch(keyword);
  };

  const handleSuggestionClick = (token) => {
    setKeyword(token);
    setShowSuggestions(false);
    submitSearch(token);
  };

  return (
    <main className="page-section jobs-page page-container">
      <div className="jobs-page__intro">
        <span className="eyebrow">OPPORTUNITY, WITHOUT THE NOISE</span>
        <h1>Find work that fits.</h1>
        <p>Explore roles shared by hiring teams on Skill To Hire.</p>
      </div>

      <form className="jobs-toolbar glass-card" onSubmit={handleSearchSubmit}>
        <div className="jobs-toolbar__search-wrap" ref={searchWrapRef}>
        <label className="jobs-toolbar__search">
          <Search size={18} aria-hidden="true" />
          <input
            aria-label="Search by role, skill, or company"
            placeholder="Role, skill, company, or location"
            value={keyword}
            autoComplete="off"
            onChange={(event) => {
              setKeyword(event.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => e.key === "Escape" && setShowSuggestions(false)}
          />
        </label>
        {showSuggestions && suggestions.length > 0 && (
          <ul className="search-suggestions" role="listbox">
            {suggestions.map((token) => (
              <li key={token}>
                <button
                  type="button"
                  role="option"
                  className="search-suggestions__item"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionClick(token);
                  }}
                >
                  <Search size={12} aria-hidden="true" />
                  {token}
                </button>
              </li>
            ))}
          </ul>
        )}
        </div>
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
