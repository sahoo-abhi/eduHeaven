import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from '../components/Navbar';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      // Check if branch exists in localStorage
      const branch = localStorage.getItem("branch");
      if (branch) {
        navigate("/dashboard");
      } else {
        navigate("/branch-selection");
      }
    } catch (err) {
      setError("Failed to sign in: " + err.message);
    }
    
    setLoading(false);
  }

  return (
    <>
    <Navbar />
    <div className="signin-container">
      <h2 className="signin-title">Sign in to eduHeaven</h2>
      <p className="signin-subtitle">Your gateway to knowledge and education</p>

      {error && (
        <div className="bg-red-900 text-white px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="form-label">
          Email address
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
          placeholder="Email address"
        />

        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signin-input"
          placeholder="Password"
        />

        <div className="remember-me">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
          />
          <label htmlFor="remember-me">
            Remember me
          </label>
        </div>

       <div className="button-wrapper">
         <button
            type="submit"
            disabled={loading}
            className="signin-btn"
          >
          Sign In
         </button>
       </div>
      </form>

      <div className="button-wrapper">
         <Link to="/forgot-password" className="purple-link">
            Forgot your password?
         </Link>
      </div>

      <div className="signup-section">
        Don't have an account?{" "}
        <Link to="/signup" className="purple-link">
          Sign Up
        </Link>
      </div>

      {/* This creates the purple patterned area shown in your screenshot */}
      <div className="purple-area"></div>
    </div>
  </>
  );
};

export default SignIn;