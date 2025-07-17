import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaBook, 
  FaRocket, 
  FaGraduationCap,
  FaCode,
  FaCalculator,
  FaAtom,
  FaIndustry,
  FaCogs,
  FaNetworkWired,
  FaDatabase,
  FaMicrochip,
  FaRobot
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";

const ReferenceBooks = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeSemester, setActiveSemester] = useState(1);

  const semesters = [
    { id: 1, name: 'Semester 1' },
    { id: 2, name: 'Semester 2' },
  ];

  const subjectsBySemester = {
    1: [
      { id: 'Advance DSA', name: 'Advance DSA', icon: FaCalculator, color: 'from-blue-500 to-purple-600' },
      { id: 'Distributed System', name: 'Distributed System', icon: FaAtom, color: 'from-green-500 to-blue-600' },
      { id: 'AI-ML', name: 'AI-ML', icon: FaAtom, color: 'from-red-500 to-pink-600' },
      { id: 'FOCS', name: 'FOCS', icon: FaCode, color: 'from-purple-500 to-indigo-600' },
      { id: 'IOT', name: 'IOT', icon: FaGraduationCap, color: 'from-yellow-500 to-orange-600' },
      { id: 'Big Data', name: 'Big Data', icon: FaCalculator, color: 'from-blue-500 to-purple-600' },
      { id: 'Pattern Recognition', name: 'Pattern Recognition', icon: FaAtom, color: 'from-green-500 to-blue-600' },
    ],
    2: [
      { id: 'Soft Computing', name: 'Soft Computing', icon: FaCalculator, color: 'from-blue-500 to-purple-600' },
      { id: 'Deep Learning', name: 'Deep Learning', icon: FaAtom, color: 'from-green-500 to-blue-600' },
      { id: 'Deep Learning with Img Proc', name: 'Deep Learning with Img Proc', icon: FaDatabase, color: 'from-indigo-500 to-purple-600' },
      { id: 'Game Theory', name: 'Game Theory', icon: FaMicrochip, color: 'from-red-500 to-pink-600' },
      { id: 'Online Algorithm', name: 'Online Algorithm', icon: FaCogs, color: 'from-gray-500 to-gray-700' },
      { id: 'Cognitive Science', name: 'Cognitive Science', icon: FaNetworkWired, color: 'from-blue-500 to-purple-600' },
      { id: 'CryptoGraphy', name: 'CryptoGraphy', icon: FaRobot, color: 'from-green-500 to-blue-600' },
      { id: 'Computation Geometry', name: 'Computation Geometry', icon: FaAtom, color: 'from-green-500 to-blue-600' },
      { id: 'Quantum Theory', name: 'Quantum Theory', icon: FaCogs, color: 'from-gray-500 to-gray-700' },
      { id: 'Testing and Verification', name: 'Testing and Verification', icon: FaMicrochip, color: 'from-red-500 to-pink-600' },
    ],
  };

  const handleSubjectClick = (subjectId) => {
    navigate(`/upload-reference-books/${subjectId}`);
  };

  if (!currentUser) {
    navigate('/signin');
    return null;
  }

  const currentSubjects = subjectsBySemester[activeSemester] || [];

  return (
    <>
      <Navbar />
      <div className="dashboard-bg pt-20">
        <main className="main-content">
          <div className="dashboard-container">
            {/* Header */}
            <motion.div 
              className="dashboard-welcome-card"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="dashboard-welcome-title relative z-10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Reference Books 📚
              </motion.div>
              
              <motion.div
                className="dashboard-welcome-desc relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Access and upload reference books and textbooks for all subjects
              </motion.div>
            </motion.div>

            {/* Semester Tabs */}
            <motion.div 
              className="flex justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="semester-tabs-container">
                {semesters.map((semester) => (
                  <button
                    key={semester.id}
                    onClick={() => setActiveSemester(semester.id)}
                    className={`semester-tab ${activeSemester === semester.id ? 'active' : ''}`}
                  >
                    {semester.name}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Subjects Grid */}
            <motion.div
              className="subjects-grid-desktop"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {currentSubjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  className="subject-card-premium"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  onClick={() => handleSubjectClick(subject.id)}
                >
                  <div className="sparkle"></div>
                  <div className="sparkle"></div>
                  <div className="sparkle"></div>
                  
                  <div className="flex flex-col items-center text-center p-6 relative z-10">
                    <div className="subject-icon-gradient mb-4">
                      <subject.icon />
                    </div>
                    
                    <h3 className="dashboard-card-title text-white font-bold text-lg mb-2 leading-tight">
                      {subject.name}
                    </h3>
                    
                    <p className="dashboard-card-desc text-slate-300 text-sm mb-4 opacity-90">
                      Access reference books and textbooks for comprehensive study
                    </p>
                    
                    <div className="view-papers-button">
                      <FaBook className="text-sm" />
                      <span>Reference Books</span>
                      <motion.div 
                        className="arrow-icon"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        →
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Footer */}
            <motion.div 
              className="dashboard-footer mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <div className="dashboard-footer-content">
                <motion.span
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  Building a comprehensive library of reference books for all students
                </motion.span>
                <div className="dashboard-footer-divider"></div>
                <span className="dashboard-footer-brand">eduHeaven</span>
                <motion.span
                  className="dashboard-footer-emoji"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  📚
                </motion.span>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ReferenceBooks;
