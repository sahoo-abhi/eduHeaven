import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from '../components/Navbar';

const branches = [
  { id: "cs", name: "Computer Science Engineering", abbr: "CSE" },
];

const BranchSelection = () => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  // Check if user already has a branch selected
  useEffect(() => {
    const savedBranch = localStorage.getItem("userBranch");
    if (savedBranch) {
      try {
        const branchData = JSON.parse(savedBranch);
        setSelectedBranch(branchData.id);
      } catch (err) {
        console.error("Error parsing saved branch:", err);
        localStorage.removeItem("userBranch");
      }
    }
  }, []);

  const handleBranchSelection = async (e) => {
    e.preventDefault();
    if (!selectedBranch) {
      setError("Please select a branch to continue");
      return;
    }
    setError("");
    setLoading(true);
    
    try {
      const branchObj = branches.find(b => b.id === selectedBranch);
      if (!branchObj) throw new Error("Invalid branch selection");

      // Save branch selection to localStorage
      const branchData = {
        id: branchObj.id,
        name: branchObj.name,
        abbr: branchObj.abbr,
        selectedAt: new Date().toISOString(),
        userId: currentUser?.uid || 'guest'
      };

      localStorage.setItem("userBranch", JSON.stringify(branchData));
      
      // Also save a simplified version for backward compatibility
      localStorage.setItem("branch", JSON.stringify(branchObj));

      // Navigate to dashboard after a short delay to show success
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
      
    } catch (err) {
      console.error("Branch selection error:", err);
      setError(err.message || "An error occurred while saving your branch selection");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-center items-center bg-pattern">
        <div className="signin-container frosted-glass" style={{ maxWidth: "400px" }}>
          <h2 className="signin-title" style={{ textAlign: "center" }}>Select Your Branch</h2>
          <p className="signin-subtitle" style={{ textAlign: "center" }}>
            Choose your academic branch to personalize your eduHeaven experience
          </p>
          {error && (
            <div className="bg-red-900 text-white px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleBranchSelection}>
            <div className="branch-options mt-6 space-y-3" style={{ marginBottom: "18px" }}>
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selectedBranch === branch.id}
                  style={{
                    padding: "10px 16px",
                    marginBottom: "6px",
                    border: selectedBranch === branch.id ? "2px solid #7c3aed" : "1px solid #aaa",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background: selectedBranch === branch.id ? "#ede9fe" : "#fff",
                    fontWeight: 600,
                    color: "#222",
                    outline: "none",
                    transition: "border 0.2s, background 0.2s"
                  }}
                  onClick={() => setSelectedBranch(branch.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelectedBranch(branch.id);
                  }}
                >
                  {branch.name}
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <button
                type="submit"
                disabled={loading || !selectedBranch}
                className="signin-btn"
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: 600,
                  padding: "8px 18px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: loading || !selectedBranch ? "not-allowed" : "pointer",
                  opacity: loading || !selectedBranch ? 0.7 : 1
                }}
              >
                {loading ? "Saving..." : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BranchSelection;