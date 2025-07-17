import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBook, 
  FaFileAlt, 
  FaCalendarAlt, 
  FaBookOpen, 
  FaGraduationCap,
  FaStar,
  FaEnvelope
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import StudyBot from "../components/StudyBot";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const [branch, setBranch] = useState(null);
  const cardRefs = useRef([]);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Extract first 8 letters from email
  const getUserName = () => {
    if (currentUser?.email) {
      return currentUser.email.substring(0, 8);
    }
    return "User";
  };

  const dashboardItems = [
    {
      id: 1,
      title: "Subject Notes",
      description: "Access lecture notes and study materials organized by subject.",
      icon: <FaBook className="dashboard-card-icon" style={{ color: "#63e6be" }} />,
      path: "/subject-notes",
      color: "#63e6be",
      gradient: "from-emerald-400 to-cyan-400"
    },
    {
      id: 2,
      title: "Question Papers",
      description: "Previous years' question papers for all subjects.",
      icon: <FaFileAlt className="dashboard-card-icon" style={{ color: "#f88c6f" }} />,
      path: "/question-papers",
      color: "#f88c6f",
      gradient: "from-orange-400 to-red-400"
    },
    {
      id: 3,
      title: "Lecture Schedules",
      description: "Weekly timetable and lecture schedules.",
      icon: <FaCalendarAlt className="dashboard-card-icon" style={{ color: "#5bc0f8" }} />,
      path: "/upload-schedule",
      color: "#5bc0f8",
      gradient: "from-blue-400 to-indigo-400"
    },
    {
      id: 4,
      title: "Reference Books",
      description: "Recommended textbooks and reference materials.",
      icon: <FaBookOpen className="dashboard-card-icon" style={{ color: "#f7e463" }} />,
      path: "/reference-books",
      color: "#f7e463",
      gradient: "from-yellow-400 to-orange-400"
    },
    {
      id: 5,
      title: "Contact Me",
      description: "Have questions or suggestions? Get in touch!",
      icon: <FaEnvelope className="dashboard-card-icon" style={{ color: "#a78bfa" }} />,
      path: "/contact",
      color: "#a78bfa",
      gradient: "from-purple-400 to-pink-400"
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const storedBranch = localStorage.getItem("branch");
    if (storedBranch) setBranch(JSON.parse(storedBranch));
    
    // Add touch event handlers for mobile hover effects
    const addTouchEffects = () => {
      cardRefs.current.forEach((card) => {
        if (!card) return;
        
        const handleTouchStart = () => {
          card.classList.add('hover-active');
        };
        
        const handleTouchEnd = () => {
          // Keep the hover effect for a short time after touch
          setTimeout(() => {
            card.classList.remove('hover-active');
          }, 500); // 500ms delay before removing effect
        };
        
        card.addEventListener('touchstart', handleTouchStart);
        card.addEventListener('touchend', handleTouchEnd);
        
        // Store event handlers for cleanup
        card._touchHandlers = {
          start: handleTouchStart,
          end: handleTouchEnd
        };
      });
    };
    
    // Wait for DOM to be ready
    setTimeout(addTouchEffects, 100);
    
    // Clean up event listeners
    return () => {
      cardRefs.current.forEach(card => {
        if (!card || !card._touchHandlers) return;
        card.removeEventListener('touchstart', card._touchHandlers.start);
        card.removeEventListener('touchend', card._touchHandlers.end);
      });
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="dashboard-bg">
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-40"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 30}%`,
              }}
              animate={{
                y: [-15, 15, -15],
                opacity: [0.2, 0.6, 0.2],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <main className="dashboard-main" style={{ paddingTop: "8rem" }}>
          <div className="dashboard-container">
            {/* Enhanced Welcome Card */}
            <motion.div 
              className="dashboard-welcome-card"
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Decorative Elements */}
              <motion.div
                className="absolute top-4 right-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <FaStar className="text-yellow-300 text-xl opacity-60" />
              </motion.div>
              
              <motion.div
                className="absolute top-4 left-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <FaGraduationCap className="text-blue-300 text-xl opacity-60" />
              </motion.div>

              <motion.div
                className="dashboard-welcome-title relative z-10"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  marginBottom: "0.5em",
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Welcome, {getUserName()}! 
                </span>
                <motion.span
                  className="ml-2"
                  animate={{ rotate: [0, 20, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  👋
                </motion.span>
              </motion.div>
              
              {branch && (
                <motion.div
                  className="dashboard-welcome-desc relative z-10"
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 400,
                    opacity: 0.95,
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  Dashboard for <b className="text-blue-100">{branch.name}</b> ({branch.abbr})
                </motion.div>
              )}
            </motion.div>

            {/* Enhanced Dashboard Cards */}
            <div className="dashboard-cards-container">
              {dashboardItems.map((item, index) => (
                <motion.div 
                  key={item.id} 
                  className="dashboard-card group"
                  ref={el => cardRefs.current[index] = el}
                  onClick={() => handleCardClick(item.path)}
                  style={{ cursor: item.path !== "#" ? "pointer" : "default" }}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.15,
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Hover Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at center, ${item.color}15 0%, transparent 70%)`,
                    }}
                  />

                  {/* Content */}
                  <motion.div
                    className="relative z-10 flex items-start gap-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 + 0.2, duration: 0.5 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {item.icon}
                    </motion.div>
                    
                    <div className="flex-1">
                      <motion.div 
                        className="dashboard-card-title"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
                      >
                        {item.title}
                      </motion.div>
                      <motion.div 
                        className="dashboard-card-desc"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 + 0.4, duration: 0.5 }}
                      >
                        {item.description}
                      </motion.div>
                    </div>

                    {/* Arrow Indicator for Clickable Items */}
                    {item.path !== "#" && (
                      <motion.div
                        className="text-blue-400 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        →
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced Footer */}
            <motion.div 
              className="dashboard-footer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="dashboard-footer-content">
                <motion.span
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  Your personalized learning dashboard
                </motion.span>
                <div className="dashboard-footer-divider"></div>
                <span className="dashboard-footer-brand">eduHeaven</span>
                <motion.span
                  className="dashboard-footer-emoji"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  ✨
                </motion.span>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
      
      {/* 3D Study Assistant Bot */}
      <StudyBot />
    </>
  );
};

export default Dashboard;