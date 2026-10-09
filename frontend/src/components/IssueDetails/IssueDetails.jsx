import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addComment } from "../../services/api"; 
import { getIssueById } from "../../services/api";
import { upvoteIssue } from "../../services/api";
import {
  FaMapMarkerAlt,
  FaThumbsUp,
  FaCommentDots,
  FaImage,
  FaRegThumbsUp,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaSearchPlus,
  FaShareAlt,
  FaWhatsapp,
  FaTwitter,
  FaEnvelope,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import StatusBadge from "../common/StatusBadge";
import ProgressStepper from "../common/ProgressStepper";
import "./IssueDetails.css";

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = currentUser?._id;

  const handleCopyShareLink = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setIsLinkCopied(true);
        setTimeout(() => setIsLinkCopied(false), 2000);
      }).catch(() => {
        setIsLinkCopied(true);
        setTimeout(() => setIsLinkCopied(false), 2000);
      });
    } else {
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    }
  };

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await getIssueById(id);
        setIssue(res.data);
      } catch (err) {
        console.error(
          "Failed to load issue:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchIssue();
  }, [id]);
  useEffect(() => {
    if (issue) {
      setHasUpvoted(issue.upvotes.includes(userId));
    }
  }, [issue, userId]);

  const QUICK_REACTIONS = [
    "👍 Validated",
    "⚠️ Urgent attention needed",
    "🙏 Please expedite",
    "📍 Still an issue",
    "👏 Great progress",
  ];

  const handleAddReaction = (reaction) => {
    setComment((prev) => (prev ? `${prev} ${reaction}` : reaction));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await addComment(id, comment); 
      const data = res.data;

      setIssue((prev) => ({
        ...prev,
        comments: [...prev.comments, data.comment],
      }));
      setComment("");
    } catch (err) {
      console.error(
        "Error submitting comment:",
        err.response?.data?.message || err.message
      );
    }
  };

  const handleUpvote = async () => {
    try {
      const res = await upvoteIssue(id); // Axios sends token via interceptor

      if (res.status === 200) {
        setIssue((prev) => ({
          ...prev,
          upvotes: hasUpvoted
            ? prev.upvotes.filter((uid) => uid !== userId)
            : [...prev.upvotes, userId],
        }));
        setHasUpvoted(!hasUpvoted);
      }
    } catch (error) {
      console.error("Error upvoting:", error.response?.data || error.message);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? issue.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === issue.images.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen || !issue?.images?.length) return;
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, issue]);

  const handleViewLocation = () => {
    const coords = issue.location?.coordinates;
    if (Array.isArray(coords) && coords.length === 2) {
      const [lng, lat] = coords;
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
    } else {
      alert("Location not available.");
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading issue details...</p></div>;
  if (!issue) return <div className="error-container"><p>Issue not found</p></div>;

  return (
    <>
      <Navbar />
      <div className="issue-details-container">
        <div className="issue-main-card">
          <div className="issue-header-row1">
            <div className="status-section1">
              <StatusBadge
                status={issue.status}
                size="md"
                pulse={issue.status?.toLowerCase().includes("progress")}
              />
              <button
                className="view-location-btn"
                onClick={handleViewLocation}
              >
                📍 View Location
              </button>
            </div>
            <span className="issue-district">
              {issue.location?.address?.split(",").pop()?.trim() ||
                issue.districtCode}
            </span>
          </div>
          <h1 className="issue-title">{issue.title}</h1>
          <div className="issue-image-container issue-detail-image">
            {issue.images && issue.images.length > 0 ? (
              <>
                <div
                  className="issue-image-large clickable"
                  onClick={() => setIsLightboxOpen(true)}
                  title="Click to view full image"
                >
                  <img
                    src={issue.images[currentImageIndex]}
                    alt={issue.title}
                  />
                  <div className="image-zoom-hint">
                    <FaSearchPlus /> Click to enlarge
                  </div>
                  {issue.images.length > 1 && (
                    <>
                      <button
                        className="image-nav-button prev"
                        onClick={handlePrevImage}
                        aria-label="Previous image"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        className="image-nav-button next"
                        onClick={handleNextImage}
                        aria-label="Next image"
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  )}
                </div>
                {issue.images.length > 1 && (
                  <div className="image-indicators">
                    {issue.images.map((_, index) => (
                      <button
                        key={index}
                        className={`indicator-dot ${
                          index === currentImageIndex ? "active" : ""
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="image-placeholder">
                <FaImage />
                <span>No image available</span>
              </div>
            )}
          </div>
          <p className="issue-description">{issue.description}</p>
          <ProgressStepper status={issue.status} />
          <div className="issue-meta-row">
            <span className="meta-item">
              <FaMapMarkerAlt /> {issue.location?.address}
            </span>
            <span className="meta-item">
              <svg
                width="18"
                height="18"
                style={{ marginRight: 4 }}
                fill="#888"
              >
                <path d="M7 10h1V7h2v3h1v2H7v-2z" />
              </svg>
              {new Date(issue.createdAt).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <hr className="issue-divider" />
          <div className="issue-footer-row">
            <div className="reporter-info">
              <div className="comment-avatar" />
              <div>
                <span
                  className="comment-user"
                  onClick={() => navigate(`/user/${issue.createdBy._id}`)}
                >
                  {issue.createdBy.username}
                </span>
                <div className="reporter-role">Reporter</div>
              </div>
            </div>
            <div className="issue-footer-stats">
              <span
                className={`upvote-button ${hasUpvoted ? "active" : ""}`}
                onClick={handleUpvote}
              >
                {hasUpvoted ? <FaThumbsUp /> : <FaRegThumbsUp />}{" "}
                {issue.upvotes?.length || 0}
              </span>
              <span>
                <FaCommentDots /> {issue.comments?.length || 0}
              </span>
              <button
                type="button"
                className="share-trigger-btn"
                onClick={() => setIsShareModalOpen(true)}
                title="Share this civic issue"
                data-testid="share-modal-trigger"
              >
                <FaShareAlt /> Share
              </button>
            </div>
          </div>
        </div>
        <div className="issue-details-comments">
          <div className="comments-header">
            <FaCommentDots style={{ marginRight: 8 }} />
            <span>
              Comments {issue.comments ? `(${issue.comments.length})` : ""}
            </span>
          </div>
          <div className="comments-list">
            {issue.comments && issue.comments.length > 0 ? (
              issue.comments.map((c, idx) => (
                <div key={idx} className="comment-block">
                  <div className="comment-avatar" />
                  <div className="comment-content">
                    <div className="comment-meta">
                      <span
                        className="comment-user"
                        onClick={() => navigate(`/user/${c.user._id}`)}
                      >
                        {c.user.username}
                      </span>
                      <span className="comment-date">
                        {new Date(c.createdAt).toLocaleString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="comment-text">{c.text}</div>
                  </div>
                </div>
              ))
            ) : (
              <div>No comments yet.</div>
            )}
          </div>
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <div className="quick-reactions-bar">
              <span className="quick-reactions-label">Quick observations:</span>
              <div className="quick-reactions-chips">
                {QUICK_REACTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="reaction-chip-btn"
                    onClick={() => handleAddReaction(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  handleCommentSubmit(e);
                }
              }}
              placeholder="Add a comment... (Ctrl+Enter to post)"
              required
              rows={3}
              maxLength={500}
            />

            <div className="comment-form-footer">
              <span className={`char-counter ${comment.length > 450 ? "near-limit" : ""}`}>
                {comment.length} / 500 characters
              </span>

              <button type="submit" disabled={!comment.trim()}>
                <span style={{ marginRight: 6, display: "inline-block" }}>
                  <svg width="18" height="18" fill="currentColor">
                    <path d="M2 16l14-7L2 2v5l10 2-10 2z" />
                  </svg>
                </span>
                Post Comment
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Interactive Image Lightbox Modal */}
      {isLightboxOpen && issue.images && issue.images.length > 0 && (
        <div
          className="lightbox-overlay"
          onClick={() => setIsLightboxOpen(false)}
          data-testid="lightbox-overlay"
        >
          <div className="lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <FaTimes />
            </button>
            <img
              src={issue.images[currentImageIndex]}
              alt={issue.title}
              className="lightbox-img"
            />
            {issue.images.length > 1 && (
              <>
                <button
                  type="button"
                  className="lightbox-nav-btn prev"
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </button>
                <button
                  type="button"
                  className="lightbox-nav-btn next"
                  onClick={handleNextImage}
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </button>
                <div className="lightbox-counter">
                  {currentImageIndex + 1} / {issue.images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Interactive Share Modal */}
      {isShareModalOpen && (
        <div
          className="share-modal-overlay"
          onClick={() => setIsShareModalOpen(false)}
          data-testid="share-modal-overlay"
        >
          <div className="share-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="share-modal-header">
              <h3>Share Civic Issue</h3>
              <button
                type="button"
                className="share-modal-close-btn"
                onClick={() => setIsShareModalOpen(false)}
                aria-label="Close share dialog"
              >
                <FaTimes />
              </button>
            </div>
            <p className="share-modal-subtitle">
              Help resolve this civic problem by spreading awareness in your community.
            </p>

            <div className="share-social-grid">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Check out this civic issue on Civix: "${issue.title}"\n${window.location.href}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-share-btn whatsapp"
              >
                <FaWhatsapp className="social-icon" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `Civic issue reported on @Civix: "${issue.title}"\n${window.location.href}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-share-btn twitter"
              >
                <FaTwitter className="social-icon" />
                <span>Twitter / X</span>
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent(
                  `Civic Issue: ${issue.title}`
                )}&body=${encodeURIComponent(
                  `Civic issue report:\n\nTitle: ${issue.title}\nDetails: ${issue.description}\nLink: ${window.location.href}`
                )}`}
                className="social-share-btn email"
              >
                <FaEnvelope className="social-icon" />
                <span>Email</span>
              </a>
            </div>

            <div className="share-link-box">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="share-link-input"
              />
              <button
                type="button"
                className={`copy-link-btn ${isLinkCopied ? "copied" : ""}`}
                onClick={handleCopyShareLink}
              >
                {isLinkCopied ? (
                  <>
                    <FaCheck /> Copied
                  </>
                ) : (
                  <>
                    <FaCopy /> Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IssueDetails;
