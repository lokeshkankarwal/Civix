import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllIssues, upvoteIssue } from "../../services/api";
import "./Home.css";
import {
  FaThumbsUp,
  FaRegThumbsUp,
  FaCommentDots,
  FaMapMarkerAlt,
  FaImage,
  FaSearch,
  FaTimes,
  FaSortAmountDown,
  FaThLarge,
  FaList,
  FaShareAlt,
  FaCheck,
} from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import { statesAndDistricts } from "../../utils/statesAndDistricts";
import StatusBadge from "../common/StatusBadge";
import IssueCardSkeleton from "../common/IssueCardSkeleton";
import { normalizeStatus } from "../../utils/formatters";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filteredIssues, setFilteredIssues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem("civix_view_mode") || "grid";
    } catch {
      return "grid";
    }
  });
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districtOptions, setDistrictOptions] = useState([]);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const [userCoords, setUserCoords] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const toKey = (value) => (value || "").trim().toLowerCase();

  useEffect(() => {
    detectAndSetLocation();
  }, []);

  useEffect(() => {
    if (!selectedState) {
      setDistrictOptions([]);
      setSelectedDistrict("");
      return;
    }

    const stateData = statesAndDistricts.find(
      (entry) => entry.state === selectedState,
    );
    const nextDistricts = stateData?.districts || [];
    setDistrictOptions(nextDistricts);

    if (selectedDistrict && !nextDistricts.includes(selectedDistrict)) {
      setSelectedDistrict("");
    }
  }, [selectedState]);

  const detectAndSetLocation = () => {
    if (!navigator.geolocation) {
      fetchIssues();
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const coords = { lat: latitude, lng: longitude };
          setUserCoords(coords);

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          );
          const data = await response.json();
          const address = data?.address || {};

          const detectedStateRaw =
            address.state ||
            address["ISO3166-2-lvl4"] ||
            address.union_territory ||
            "";
          const detectedDistrictRaw =
            address.city ||
            "";


          const matchedState = statesAndDistricts.find(
            (entry) => toKey(entry.state) === toKey(detectedStateRaw),
          );

          if (matchedState) {
            const matchedDistrict = matchedState.districts.find(
              (district) => toKey(district) === toKey(detectedDistrictRaw),
            );

            setSelectedState(matchedState.state);
            setSelectedDistrict(matchedDistrict || "");
            fetchIssues(matchedState.state, matchedDistrict || "", 1, coords);
          } else {
            fetchIssues("", "", 1, coords);
          }
        } catch (locationError) {
          console.error("Failed to detect location:", locationError);
          fetchIssues();
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        setDetectingLocation(false);
        fetchIssues();
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const fetchIssues = async (state = "", districtName = "", pageNum = 1, coords = userCoords) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        state,
        districtName,
        page: pageNum,
        limit: 20,
      };

      if (coords) {
        params.lat = coords.lat;
        params.lng = coords.lng;
      }

      const response = await getAllIssues(params);
      setFilteredIssues(response.data.issues || []);
      setTotalPages(response.data.totalPages || 1);
      setPage(response.data.currentPage || 1);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const handleManualSearch = () => {
    fetchIssues(selectedState, selectedDistrict, 1);
  };

  const STATUS_TABS = [
    { key: "all", label: "All Issues" },
    { key: "unsolved", label: "Unsolved" },
    { key: "in_progress", label: "In Progress" },
    { key: "solved", label: "Solved" },
    { key: "re-reported", label: "Re-reported" },
  ];

  const statusCounts = useMemo(() => {
    const counts = { all: filteredIssues.length, unsolved: 0, in_progress: 0, solved: 0, "re-reported": 0 };
    filteredIssues.forEach((issue) => {
      const norm = normalizeStatus(issue.status);
      if (norm === "solved" || norm === "resolved") {
        counts.solved += 1;
      } else if (norm === "in_progress") {
        counts.in_progress += 1;
      } else if (norm === "re-reported" || norm === "re_reported") {
        counts["re-reported"] += 1;
      } else {
        counts.unsolved += 1;
      }
    });
    return counts;
  }, [filteredIssues]);

  const impactStats = useMemo(() => {
    const total = filteredIssues.length;
    const resolved = statusCounts.solved;
    const inProgress = statusCounts.in_progress;
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    return { total, resolved, inProgress, rate };
  }, [filteredIssues.length, statusCounts]);

  const displayedIssues = useMemo(() => {
    let result = filteredIssues;

    // Filter by status tab
    if (statusFilter !== "all") {
      result = result.filter((issue) => {
        const norm = normalizeStatus(issue.status);
        if (statusFilter === "solved") return norm === "solved" || norm === "resolved";
        if (statusFilter === "in_progress") return norm === "in_progress";
        if (statusFilter === "re-reported") return norm === "re-reported" || norm === "re_reported";
        return norm === "unsolved" || norm === "pending" || norm === "reported";
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((issue) => {
        const title = (issue.title || "").toLowerCase();
        const desc = (issue.description || "").toLowerCase();
        const addr = (issue.location?.address || "").toLowerCase();
        const author = (issue.createdBy?.username || "").toLowerCase();
        const district = (issue.districtCode || "").toLowerCase();
        return (
          title.includes(q) ||
          desc.includes(q) ||
          addr.includes(q) ||
          author.includes(q) ||
          district.includes(q)
        );
      });
    }

    // Sort issues
    const sorted = [...result].sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "upvotes") {
        return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
      }
      if (sortBy === "comments") {
        return (b.comments?.length || 0) - (a.comments?.length || 0);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return sorted;
  }, [filteredIssues, searchQuery, statusFilter, sortBy]);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const handleQuickUpvote = async (e, issueId) => {
    e.stopPropagation();
    if (!currentUser?._id) {
      alert("Please log in to upvote issues.");
      return;
    }

    setFilteredIssues((prevIssues) =>
      prevIssues.map((item) => {
        if (item._id === issueId) {
          const upvotes = Array.isArray(item.upvotes) ? item.upvotes : [];
          const hasUpvoted = upvotes.includes(currentUser._id);
          const newUpvotes = hasUpvoted
            ? upvotes.filter((uid) => uid !== currentUser._id)
            : [...upvotes, currentUser._id];
          return { ...item, upvotes: newUpvotes };
        }
        return item;
      })
    );

    try {
      await upvoteIssue(issueId);
    } catch (err) {
      console.error("Failed to upvote:", err);
    }
  };

  const [copiedIssueId, setCopiedIssueId] = useState(null);

  const handleQuickShare = (e, issue) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/issue/${issue._id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedIssueId(issue._id);
        setTimeout(() => setCopiedIssueId(null), 2200);
      }).catch(() => {
        setCopiedIssueId(issue._id);
        setTimeout(() => setCopiedIssueId(null), 2200);
      });
    } else {
      setCopiedIssueId(issue._id);
      setTimeout(() => setCopiedIssueId(null), 2200);
    }
  };

  const handleIssueClick = (issueId) => {
    navigate(`/issue/${issueId}`);
  };

  return (
    <div className="home-layout">
      {/* Navbar always visible */}
      <Navbar />

      <div className="home-container">
        {/* Error State */}
        {error && (
          <div className="error-container">
            <p>Error: {error}</p>
            <button
              onClick={() => fetchIssues(selectedState, selectedDistrict)}
              className="retry-btn"
            >
              Retry
            </button>
          </div>
        )}

        <section className="content">
          {/* Hero Section */}
          <div className="hero-section">
            <div className="hero-text">
              <h3>Civic Issues</h3>
              <p>Report and track community problems in your area</p>
            </div>

            {/* Interactive Impact Metrics */}
            <div className="hero-impact-grid">
              <button
                type="button"
                className={`impact-card ${statusFilter === "all" ? "active" : ""}`}
                onClick={() => setStatusFilter("all")}
                title="Filter by all issues"
                data-testid="impact-card-all"
              >
                <span className="impact-num">{impactStats.total}</span>
                <span className="impact-label">Total Reported</span>
              </button>

              <button
                type="button"
                className={`impact-card ${statusFilter === "solved" ? "active" : ""}`}
                onClick={() => setStatusFilter("solved")}
                title="Filter by solved issues"
                data-testid="impact-card-solved"
              >
                <span className="impact-num solved">{impactStats.resolved}</span>
                <span className="impact-label">Resolved Issues</span>
              </button>

              <button
                type="button"
                className={`impact-card ${statusFilter === "in_progress" ? "active" : ""}`}
                onClick={() => setStatusFilter("in_progress")}
                title="Filter by in-progress issues"
                data-testid="impact-card-progress"
              >
                <span className="impact-num in-progress">{impactStats.inProgress}</span>
                <span className="impact-label">In Progress</span>
              </button>

              <div className="impact-card rate-card">
                <span className="impact-num rate">{impactStats.rate}%</span>
                <span className="impact-label">Resolution Rate</span>
              </div>
            </div>
          </div>

            {/* Location Search & Real-Time Filter */}
            <div className="filters-bar">
              <div className="search-top-header">
                <div>
                  <h4 style={{ margin: "0 0 4px 0", color: "#1f2937", fontSize: "1.1rem", fontWeight: "700" }}>
                    Search issues at your location
                  </h4>
                  {detectingLocation && (
                    <p style={{ margin: "0 0 6px 0", color: "#6b7280", fontSize: "0.85rem" }}>
                      Detecting your location...
                    </p>
                  )}
                </div>
              </div>

              {/* Real-time search query box */}
              <div className="interactive-search-bar">
                <FaSearch className="search-bar-icon" />
                <input
                  type="text"
                  placeholder="Search issues by title, description or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="interactive-search-field"
                  data-testid="search-issues-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              <div className="select-wrapper">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Select State</option>
                  {statesAndDistricts.map((entry) => (
                    <option key={entry.state} value={entry.state}>
                      {entry.state}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="filter-select"
                  disabled={!selectedState}
                >
                  <option value="">Select District</option>
                  {districtOptions.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>

                <button className="retry-btn" onClick={handleManualSearch}>
                  Search
                </button>
              </div>

              {searchQuery && (
                <div className="search-active-pill">
                  Showing <strong>{displayedIssues.length}</strong> {displayedIssues.length === 1 ? "result" : "results"} for "{searchQuery}"
                </div>
              )}
            </div>

            {/* Interactive Status Tabs */}
            <div className="status-tabs-container">
              {STATUS_TABS.map((tab) => {
                const count = statusCounts[tab.key] || 0;
                const isActive = statusFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    className={`status-tab-btn ${isActive ? "active" : ""}`}
                    onClick={() => setStatusFilter(tab.key)}
                    data-testid={`status-tab-${tab.key}`}
                  >
                    <span>{tab.label}</span>
                    <span className="status-tab-count">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Sort & Results Bar */}
            <div className="filter-actions-bar">
              <span className="results-counter">
                Showing <strong>{displayedIssues.length}</strong> {displayedIssues.length === 1 ? "issue" : "issues"}
              </span>

              <div className="bar-right-controls">
                <div className="sort-control">
                  <FaSortAmountDown className="sort-icon" />
                  <label htmlFor="sort-select" className="sort-label">Sort:</label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="interactive-sort-select"
                    data-testid="sort-select"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="upvotes">Most Upvoted</option>
                    <option value="comments">Most Discussed</option>
                  </select>
                </div>

                <div className="view-mode-toggle" role="group" aria-label="View layout">
                  <button
                    type="button"
                    className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                    onClick={() => {
                      setViewMode("grid");
                      try { localStorage.setItem("civix_view_mode", "grid"); } catch {}
                    }}
                    title="Grid View"
                    data-testid="grid-view-btn"
                  >
                    <FaThLarge />
                  </button>
                  <button
                    type="button"
                    className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
                    onClick={() => {
                      setViewMode("list");
                      try { localStorage.setItem("civix_view_mode", "list"); } catch {}
                    }}
                    title="Compact List View"
                    data-testid="list-view-btn"
                  >
                    <FaList />
                  </button>
                </div>
              </div>
            </div>

            {/* Issues Grid / List */}
            {loading ? (
              <IssueCardSkeleton count={8} />
            ) : (
              <div className={`civix-card-layout ${viewMode === "list" ? "list-view" : ""}`}>
                {displayedIssues.length > 0 ? (
                displayedIssues.map((issue) => (
                  <div
                    key={issue._id}
                    className={`civix-item-card ${viewMode === "list" ? "list-mode" : ""}`}
                    onClick={() => handleIssueClick(issue._id)}
                  >
                    <div className="civix-card-media">
                      {issue.images && issue.images.length > 0 ? (
                        <img
                          src={issue.images[0]}
                          alt={issue.title}
                          className="civix-media-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                            e.target.parentElement.classList.add("has-error");
                          }}
                        />
                      ) : (
                        <div className="civix-media-empty">
                          <FaImage />
                          <span>No image available</span>
                        </div>
                      )}

                      {/* Fallback for broken image */}
                      <div className="civix-media-empty civix-media-fallback">
                        <FaImage />
                        <span>Image unavailable</span>
                      </div>

                      <div className="civix-badge-container">
                        <StatusBadge
                          status={issue.status}
                          size="sm"
                          pulse={normalizeStatus(issue.status) === "in_progress"}
                        />
                      </div>
                    </div>

                    <div className="civix-card-body">
                      <div className="civix-card-top-row">
                        <span className="civix-tag-district">
                          {issue.districtCode || "General"}
                        </span>
                        <div className="civix-top-right-meta">
                          <span className="civix-tag-date">
                            {new Date(issue.createdAt).toLocaleDateString()}
                          </span>
                          <button
                            type="button"
                            className={`civix-card-share-btn ${copiedIssueId === issue._id ? "copied" : ""}`}
                            onClick={(e) => handleQuickShare(e, issue)}
                            title={copiedIssueId === issue._id ? "Link copied!" : "Share issue"}
                            data-testid={`quick-share-${issue._id}`}
                          >
                            {copiedIssueId === issue._id ? (
                              <span className="copied-text"><FaCheck /> Copied</span>
                            ) : (
                              <FaShareAlt />
                            )}
                          </button>
                        </div>
                      </div>

                      <h3 className="civix-card-title">{issue.title}</h3>

                      <p className="civix-card-desc">
                        {issue.description.length > 90
                          ? `${issue.description.substring(0, 90)}...`
                          : issue.description}
                        {issue.description.length > 90 && (
                          <span className="civix-read-more">Read more</span>
                        )}
                      </p>

                      <div className="civix-card-location">
                        <FaMapMarkerAlt />
                        <span>
                          {issue.location?.address || "Location unavailable"}
                        </span>
                      </div>

                      <div className="civix-card-bottom">
                        <div className="civix-author-info">
                          By{" "}
                          <strong>
                            {issue.createdBy?.username || "Unknown"}
                          </strong>
                        </div>
                        <div className="civix-metrics">
                          <button
                            type="button"
                            className={`civix-metric-btn upvote-btn ${
                              Array.isArray(issue.upvotes) && issue.upvotes.includes(currentUser?._id)
                                ? "upvoted"
                                : ""
                            }`}
                            onClick={(e) => handleQuickUpvote(e, issue._id)}
                            title="Upvote issue"
                            data-testid={`quick-upvote-${issue._id}`}
                          >
                            {Array.isArray(issue.upvotes) && issue.upvotes.includes(currentUser?._id) ? (
                              <FaThumbsUp className="thumb-icon active" />
                            ) : (
                              <FaRegThumbsUp className="thumb-icon" />
                            )}
                            <span>{issue.upvotes?.length || 0}</span>
                          </button>
                          <span className="civix-metric-span" title="Comments">
                            <FaCommentDots /> {issue.comments?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="civix-empty-state">
                  <p>No issues found matching your filters.</p>
                </div>
              )}
            </div>
          )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-bar" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "30px", marginBottom: "20px" }}>
                <button
                  onClick={() => {
                    if (page > 1) {
                      fetchIssues(selectedState, selectedDistrict, page - 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  disabled={page === 1}
                  className="retry-btn"
                  style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}
                >
                  Previous
                </button>
                <span style={{ fontWeight: "600", color: "#4b5563" }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => {
                    if (page < totalPages) {
                      fetchIssues(selectedState, selectedDistrict, page + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  disabled={page === totalPages}
                  className="retry-btn"
                  style={{ opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? "not-allowed" : "pointer" }}
                >
                  Next
                </button>
              </div>
            )}
          </section>
      </div>
    </div>
  );
};

export default Home;
