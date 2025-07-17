import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaCode, 
  FaNetworkWired, 
  FaWifi, 
  FaBrain, 
  FaBook,
  FaRobot,
  FaArrowLeft
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";

const SubjectNotes = () => {
  const [branch, setBranch] = useState(null);
  const [activeSemester, setActiveSemester] = useState('sem1');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const sem1Subjects = [
    {
      id: 1,
      name: "DSA",
      fullName: "Data Structures and Algorithms",
      description: "Master fundamental data structures and algorithmic problem-solving techniques.",
      icon: <FaCode className="dashboard-card-icon" style={{ color: "#63e6be" }} />,
      color: "#63e6be",
      gradient: "from-emerald-400 to-cyan-400",
      path: "/subject-notes/dsa"
    },
    {
      id: 2,
      name: "Distributed System",
      fullName: "Distributed Systems",
      description: "Learn about distributed computing, scalability, and system design patterns.",
      icon: <FaNetworkWired className="dashboard-card-icon" style={{ color: "#f88c6f" }} />,
      color: "#f88c6f",
      gradient: "from-orange-400 to-red-400",
      path: "/subject-notes/distributed-system"
    },
    {
      id: 3,
      name: "IoT",
      fullName: "Internet of Things",
      description: "Explore connected devices, sensors, and smart system architectures.",
      icon: <FaWifi className="dashboard-card-icon" style={{ color: "#5bc0f8" }} />,
      color: "#5bc0f8",
      gradient: "from-blue-400 to-indigo-400",
      path: "/subject-notes/iot"
    },
    {
      id: 4,
      name: "AI-ML",
      fullName: "Artificial Intelligence & Machine Learning",
      description: "Dive into machine learning algorithms, neural networks, and AI applications.",
      icon: <FaBrain className="dashboard-card-icon" style={{ color: "#c084fc" }} />,
      color: "#c084fc",
      gradient: "from-purple-400 to-pink-400",
      path: "/subject-notes/ai-ml"
    },
    {
      id: 5,
      name: "FOCS",
      fullName: "Fundamentals of Computer Science",
      description: "Build strong foundations in computer science theory and principles.",
      icon: <FaBook className="dashboard-card-icon" style={{ color: "#f7e463" }} />,
      color: "#f7e463",
      gradient: "from-yellow-400 to-orange-400",
      path: "/subject-notes/focs"
    },
    {
      id: 6,
      name: "Big Data",
      fullName: "Fundamentals of Big Data",
      description: "Learn Big Data technologies and frameworks for handling large datasets.",
      icon: <FaCode className="dashboard-card-icon" style={{ color: "#a5b4fc" }} />,
      color: "#a5b4fc",
      gradient: "from-indigo-400 to-purple-400",
    },
    {
      id: '7',
      name: 'Pattern Recognition',
      fullName: 'Fundamentals of Pattern Recognition',
      icon: <FaBrain className="dashboard-card-icon" style={{ color: "#c084fc" }} />,
      lastUpdated: 'No papers yet',
      description: 'Data analysis, visualization, and machine learning'
    }
  ];

  const sem2Subjects = [
    {
      id: 8,
      name: "Testing and Verification",
      fullName: "Testing and Verification",
      description: "Learn about testing methodologies, verification techniques, and quality assurance.",
      icon: <FaCode className="dashboard-card-icon" style={{ color: "#63e6be" }} />,
      color: "#63e6be",
      gradient: "from-emerald-400 to-cyan-400",
      path: "/subject-notes/testing-and-verification"
    },
    {
      id: 9,
      name: "Game Theory",
      fullName: "Game Theory",
      description: "Understand strategic interactions and decision-making.",
      icon: <FaNetworkWired className="dashboard-card-icon" style={{ color: "#f88c6f" }} />,
      color: "#f88c6f",
      gradient: "from-orange-400 to-red-400",
      path: "/subject-notes/game-theory"
    },
    {
      id: 10,
      name: "Deep Learning",
      fullName: "Deep Learning",
      description: "Master deep learning frameworks, neural networks, and AI applications.",
      icon: <FaWifi className="dashboard-card-icon" style={{ color: "#5bc0f8" }} />,
      color: "#5bc0f8",
      gradient: "from-blue-400 to-indigo-400",
      path: "/subject-notes/deep-learning"
    },
    {
      id: 11,
      name: "Cryptography",
      fullName: "Cryptography & Network Security",
      description: "Explore encryption algorithms, digital signatures, and security protocols.",
      icon: <FaBrain className="dashboard-card-icon" style={{ color: "#c084fc" }} />,
      color: "#c084fc",
      gradient: "from-purple-400 to-pink-400",
      path: "/subject-notes/cryptography"
    },
    {
      id: 12,
      name: "Deep Learning with Img Processing",
      fullName: "Deep Learning with Image Processing",
      description: "Learn about convolutional neural networks, image classification, and object detection.",
      icon: <FaWifi className="dashboard-card-icon" style={{ color: "#f7e463" }} />,
      color: "#f7e463",
      gradient: "from-yellow-400 to-orange-400",
      path: "/subject-notes/deep-learning-with-image-processing"
    },
    {
      id: 13,
      name: "Online Algorithms",
      fullName: "Online Algorithms",
      description: "Learn about online algorithms and their applications.",
      icon: <FaBook className="dashboard-card-icon" style={{ color: "#5bc0f8" }} />,
      color: "#f7e463",
      gradient: "from-yellow-400 to-orange-400",
      path: "/subject-notes/online-algorithms"
    },
    {
      id: 14,
      name: "Soft Computing",
      fullName: "Soft Computing",
      description: "Explore soft computing techniques, including fuzzy logic and genetic algorithms.",
      icon: <FaRobot className="dashboard-card-icon" style={{ color: "#f7e463" }} />,
      color: "#f7e463",
      gradient: "from-yellow-400 to-orange-400",
      path: "/subject-notes/soft-computing"
    },
    {
      id: 15,
      name: "Cognitive Science",
      fullName: "Cognitive Science",
      description: "Explore cognitive processes, learning theories, and AI applications.",
      icon: <FaBrain className="dashboard-card-icon" style={{ color: "#c084fc" }} />,
      color: "#f7e463",
      gradient: "from-yellow-400 to-orange-400",
      path: "/subject-notes/cognitive-science"
    },
    {
      id: 16,
      name: "Computational Geometry",
      fullName: "Computational Geometry",
      description: "Explore geometric algorithms, spatial data structures, and their applications.",
      icon: <FaRobot className="dashboard-card-icon" style={{ color: "#f7e463" }} />,
      color: "#f7e463",
      gradient: "from-yellow-400 to-orange-400",
      path: "/subject-notes/computational-geometry"
    },
    {
      id: 17,
      name: "Quantum Theory",
      fullName: "Quantum Theory",
      description: "Explore the principles of quantum mechanics and their applications.",
      icon: <FaBrain className="dashboard-card-icon" style={{ color: "#c084fc" }} />,
      color: "#f7e463",
      gradient: "from-yellow-400 to-orange-400",
      path: "/subject-notes/quantum-theory"
    },
  ];

  const currentSubjects = activeSemester === 'sem1' ? sem1Subjects : sem2Subjects;

  const handleSubjectClick = (path, subjectName) => {
    // Navigate to view notes page with subject parameter
    const subjectParam = subjectName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Show options modal or navigate directly to view notes
    const choice = confirm("Would you like to:\n\nClick 'OK' to View Notes\nClick 'Cancel' to Upload Files");
    
    if (choice) {
      navigate(`/view-notes/${subjectParam}`);
    } else {
      navigate(`/upload-notes/${subjectParam}`);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    const storedBranch = localStorage.getItem("branch");
    if (storedBranch) setBranch(JSON.parse(storedBranch));
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

        <main className="dashboard-main" style={{ paddingTop: "4rem" }}>
          <div className="dashboard-container">
            {/* Subject Notes Header */}
            <motion.div 
              className="dashboard-welcome-card"
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
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
                  Subject Notes 📚
                </span>
              </motion.div>
              
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
                Select a subject to access comprehensive study materials and notes
              </motion.div>
            </motion.div>

            {/* Semester Tabs */}
            <motion.div 
              className="flex justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl p-2 border border-gray-700/30 shadow-2xl shadow-black/40">
                {/* Outer glow ring */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-sm"></div>
                
                <div className="relative flex gap-2">
                  {/* Animated background slider */}
                  <motion.div
                    className="absolute inset-y-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl"
                    style={{
                      width: 'calc(50% - 4px)',
                      left: activeSemester === 'sem1' ? '4px' : 'calc(50% + 4px)',
                    }}
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(59, 130, 246, 0.3)',
                        '0 0 30px rgba(168, 85, 247, 0.4)',
                        '0 0 20px rgba(59, 130, 246, 0.3)',
                      ],
                    }}
                    transition={{ 
                      layout: { type: "spring", stiffness: 400, damping: 40 },
                      boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    layout
                  />
                  
                  <motion.button
                    className={`relative z-10 px-10 py-4 rounded-2xl font-bold text-sm transition-all duration-500 ${
                      activeSemester === 'sem1'
                        ? 'text-white shadow-lg'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    onClick={() => setActiveSemester('sem1')}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: 0.95,
                      transition: { duration: 0.1 }
                    }}
                  >
                    <motion.div
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                    >
                      <motion.span 
                        className="text-xl"
                        animate={activeSemester === 'sem1' ? { 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ 
                          duration: 2, 
                          repeat: activeSemester === 'sem1' ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                      >
                        📚
                      </motion.span>
                      <span className="tracking-wider">SEMESTER 1</span>
                    </motion.div>
                  </motion.button>
                  
                  <motion.button
                    className={`relative z-10 px-10 py-4 rounded-2xl font-bold text-sm transition-all duration-500 ${
                      activeSemester === 'sem2'
                        ? 'text-white shadow-lg'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    onClick={() => setActiveSemester('sem2')}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: 0.95,
                      transition: { duration: 0.1 }
                    }}
                  >
                    <motion.div
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                    >
                      <motion.span 
                        className="text-xl"
                        animate={activeSemester === 'sem2' ? { 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ 
                          duration: 2, 
                          repeat: activeSemester === 'sem2' ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                      >
                        🎓
                      </motion.span>
                      <span className="tracking-wider">SEMESTER 2</span>
                    </motion.div>
                  </motion.button>
                </div>
                
                {/* Ambient glow effects */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                  }}
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Floating particles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
                    style={{
                      left: `${30 + i * 20}%`,
                      top: `${20 + i * 15}%`,
                    }}
                    animate={{
                      y: [-8, 8, -8],
                      x: [-5, 5, -5],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.8,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Subject Cards */}
            <div className="dashboard-cards-container">
              {currentSubjects.map((subject, index) => (
                <motion.div 
                  key={`${activeSemester}-${subject.id}`} 
                  className="dashboard-card group"
                  onClick={() => handleSubjectClick(subject.path, subject.name)}
                  style={{ cursor: "pointer" }}
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
                      background: `radial-gradient(circle at center, ${subject.color}15 0%, transparent 70%)`,
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
                      {subject.icon}
                    </motion.div>
                    
                    <div className="flex-1">
                      <motion.div 
                        className="dashboard-card-title"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
                      >
                        {subject.name}
                      </motion.div>
                      <motion.div 
                        className="text-sm text-gray-300 mb-2"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 + 0.35, duration: 0.5 }}
                      >
                        {subject.fullName}
                      </motion.div>
                      <motion.div 
                        className="dashboard-card-desc"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 + 0.4, duration: 0.5 }}
                      >
                        {subject.description}
                      </motion.div>
                    </div>

                    {/* Arrow Indicator */}
                    <motion.div
                      className="text-blue-400 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      →
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
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
                  Comprehensive study materials for your success
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
    </>
  );
};

export default SubjectNotes;
