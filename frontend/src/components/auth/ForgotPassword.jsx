import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/api";
import { toast } from "react-toastify";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import "./Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await forgotPassword({ email });
      toast.success(response.data.message || "Reset link sent to your email.");
      setEmail("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <button onClick={() => window.location.href = '/'} className="back-home">
         <FaArrowLeft /> Back to Home
      </button>
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <p className="auth-subtitle">Enter your email to receive a password reset link.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <div className="input-icon">
              <FaEnvelope />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="auth-footer">
          <Link to="/login" className="auth-link">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
