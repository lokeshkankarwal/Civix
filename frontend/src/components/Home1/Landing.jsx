import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaClipboardCheck,
  FaChevronDown,
  FaChevronUp,
  FaShieldAlt,
  FaComments,
} from "react-icons/fa";
import "./Landing.css";

const FAQS = [
  {
    q: "How does CiviX work?",
    a: "Citizens spot a problem in their community, snap a photo, add the location, and submit it. Our platform routes it to the responsible municipal department and local ward officers for action.",
  },
  {
    q: "Can I track the progress of my reported issue?",
    a: "Yes! Every issue has a live Resolution Stepper that tracks the status from 'Reported' to 'Acknowledged', 'In Progress', and 'Resolved' with real-time updates.",
  },
  {
    q: "Can other citizens support my report?",
    a: "Absolutely. Other neighbors can upvote your issue to increase its priority and add comments or additional photographic evidence.",
  },
  {
    q: "Is CiviX completely free for citizens to use?",
    a: "Yes, CiviX is 100% free for all residents to report and track civic issues in their neighborhoods.",
  },
];

const STATS = [
  { value: "15,000+", label: "Civic Issues Logged" },
  { value: "88%", label: "Resolution Rate" },
  { value: "45+", label: "Districts Active" },
  { value: "24/7", label: "Community Monitoring" },
];

const Landing = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (token && user) {
      navigate("/dashboard");
    }
  }, [token, user, navigate]);

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className="landing-container" data-testid="landing-page">
      <nav className="landing-nav">
        <div className="logo" onClick={() => navigate("/")}>CiviX</div>
        <div className="nav-buttons">
          <button onClick={() => navigate("/login")} className="btn-secondary">
            Login
          </button>
          <button onClick={() => navigate("/register")} className="btn-primary">
            Sign Up
          </button>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <h1>Making Communities Better Together</h1>
          <p>
            Report, track and resolve civic issues in your neighborhood - from potholes and waste to streetlights
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate("/register")} className="btn-primary">
              Get Started Free
            </button>
            <button onClick={() => navigate("/dashboard")} className="btn-outline">
              Explore Community Feed
            </button>
          </div>
        </section>

        {/* Stats Showcase */}
        <section className="landing-stats-section">
          <div className="landing-stats-grid">
            {STATS.map((stat, i) => (
              <div key={i} className="stat-card">
                <span className="stat-val">{stat.value}</span>
                <span className="stat-lbl">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <h2>Why Choose CiviX?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaMapMarkerAlt className="feature-icon" />
              <h3>Easy Geo-Tagging</h3>
              <p>
                Pinpoint issue locations automatically with GPS or click directly on the interactive neighborhood map.
              </p>
            </div>
            <div className="feature-card">
              <FaUsers className="feature-icon" />
              <h3>Community Upvoting</h3>
              <p>
                Collaborate with neighbors. Higher upvoted issues receive expedited attention from municipal administrators.
              </p>
            </div>
            <div className="feature-card">
              <FaClipboardCheck className="feature-icon" />
              <h3>Verified Results</h3>
              <p>
                Get notified as assigned field workers resolve issues and upload proof-of-work completion images.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive FAQ Accordion */}
        <section className="landing-faq-section">
          <h2>Frequently Asked Questions</h2>
          <p className="faq-subtitle">Everything you need to know about reporting civic issues with CiviX</p>
          <div className="faq-accordion" data-testid="faq-accordion">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className={`faq-item ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    data-testid={`faq-toggle-${idx}`}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <FaChevronUp className="faq-chevron" /> : <FaChevronDown className="faq-chevron" />}
                  </button>
                  {isOpen && (
                    <div className="faq-answer-pane">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta">
          <h2 className="footer-heading">Ready to improve your neighborhood?</h2>
          <p className="footer-heading">
            Join thousands of active citizens making a real difference in their community today.
          </p>
          <button onClick={() => navigate("/register")} className="btn-primary cta-btn">
            Sign Up Now - It's Free
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <p>© 2026 CiviX. All rights reserved. Empowering Civic Action.</p>
      </footer>
    </div>
  );
};

export default Landing;