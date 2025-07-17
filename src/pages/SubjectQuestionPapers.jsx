import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaFileAlt, 
  FaUpload, 
  FaClock,
  FaGraduationCap
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";

const SubjectQuestionPapers = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const subjectDisplayName = subject?.replace(/-/g, ' ').toUpperCase() || 'UNKNOWN';

  const handlePaperTypeClick = (paperType) => {
    navigate(`/upload-papers/${subject}/${paperType}`);
  };

  const handleViewPapers = (paperType) => {
    navigate(`/view-papers/${subject}/${paperType}`);
  };

  if (!currentUser) {
    navigate('/signin');
    return null;
  }

  const paperTypes = [
    {
      id: 'mid-sem',
      title: 'Mid Semester Papers',
      description: 'Upload and access mid-semester examination papers',
      icon: FaClock,
      color: 'from-blue-500 to-purple-600',
      bgGradient: 'from-blue-500/10 to-purple-600/10'
    },
    {
      id: 'end-sem',
      title: 'End Semester Papers',
      description: 'Upload and access end-semester examination papers',
      icon: FaGraduationCap,
      color: 'from-green-500 to-blue-600',
      bgGradient: 'from-green-500/10 to-blue-600/10'
    }
  ];

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
                {subjectDisplayName} - Question Papers 📄
              </motion.div>
              
              <motion.div
                className="dashboard-welcome-desc relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Choose the type of question papers you want to access
              </motion.div>
            </motion.div>

            {/* Paper Types Grid */}
            <motion.div
              className="question-papers-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {paperTypes.map((paperType, index) => (
                <motion.div
                  key={paperType.id}
                  className="dashboard-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.2, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="flex flex-col items-center text-center h-full justify-between">
                    <div className="flex flex-col items-center">
                      <div className={`dashboard-card-icon bg-gradient-to-r ${paperType.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                        <paperType.icon className="text-2xl text-white" />
                      </div>
                      
                      <h3 className="dashboard-card-title text-white font-bold text-xl mb-3">
                        {paperType.title}
                      </h3>
                      
                      <p className="dashboard-card-desc text-slate-300 text-sm mb-6 line-height-relaxed">
                        {paperType.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                      <motion.button
                        onClick={() => handlePaperTypeClick(paperType.id)}
                        className={`w-full bg-gradient-to-r ${paperType.color} text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 hover:shadow-lg`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaUpload /> Upload Papers
                      </motion.button>
                      
                      <motion.button
                        onClick={() => handleViewPapers(paperType.id)}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaFileAlt /> View Papers
                      </motion.button>
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
                  Building a comprehensive question paper repository for {subjectDisplayName}
                </motion.span>
                <div className="dashboard-footer-divider"></div>
                <span className="dashboard-footer-brand">eduHeaven</span>
                <motion.span
                  className="dashboard-footer-emoji"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  📄
                </motion.span>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SubjectQuestionPapers;
