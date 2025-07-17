import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from '../components/Navbar';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    
    try {
      setError("");
      setLoading(true);
      const userCredential = await signup(email, password);
      // Redirect to branch selection instead of dashboard
      navigate("/branch-selection", { 
        state: { userId: userCredential.user.uid } 
      });
    } catch (err) {
      setError("Failed to create an account: " + err.message);
    }
    
    setLoading(false);
  }

  return (
  <>
  <Navbar />
  <div className="min-h-screen text-white flex flex-col justify-center items-center">
    <div className="signin-container"> {/* Reuse frosted glass style */}
      <h2 className="signin-title">Sign Up for eduHeaven</h2>
      <p className="signin-subtitle">Your gateway to knowledge and education</p>

      {error && (
        <div className="bg-red-900 text-white px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form className="form-group" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signin-input"
          />
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signin-input"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="form-label">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="signin-input"
          />
        </div>

        <div className="button-wrapper">
          <button
            type="submit"
            disabled={loading}
            className="signin-btn"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </div>
      </form>

      <div className="signup-section">
        Already have an account?{" "}
        <Link to="/signin" className="purple-link">
          Sign In
        </Link>
      </div>
    </div>
  </div>
  </>
);
};

export default SignUp;