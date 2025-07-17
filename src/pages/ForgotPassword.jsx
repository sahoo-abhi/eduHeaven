import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from '../components/Navbar';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      return setError("Please enter your email address");
    }
    
    try {
      setError("");
      setLoading(true);
      
      // Send password reset email
      await resetPassword(email);
      setSuccess(true);
      
      // Navigate back to signin after 3 seconds
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
      
    } catch (err) {
      setError("Failed to reset password: " + err.message);
    }
    
    setLoading(false);
  }

  if (success) {
    return (
      <>
        <Navbar />
        <div className="signin-container">
          <h2 className="signin-title">Reset Email Sent!</h2>
          <p className="signin-subtitle">Check your email for password reset instructions</p>
          
          <div className="bg-green-900 text-white px-4 py-3 rounded mb-4">
            Password reset email sent successfully! Please check your spam inbox and follow the instructions to reset your password. Redirecting to sign in...
          </div>
          
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="signin-container">
        <h2 className="signin-title">Reset Your Password</h2>
        <p className="signin-subtitle">Enter your email address to receive reset instructions</p>

        {error && (
          <div className="bg-red-900 text-white px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signin-input"
            placeholder="Enter your email address"
          />

         <div className="button-wrapper">
           <button
              type="submit"
              disabled={loading}
              className="signin-btn"
            >
            {loading ? "Sending Reset Email..." : "Send Reset Email"}
           </button>
         </div>
        </form>

        <div className="signup-section">
          Remember your password?{" "}
          <Link to="/signin" className="purple-link">
            Back to Sign In
          </Link>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
