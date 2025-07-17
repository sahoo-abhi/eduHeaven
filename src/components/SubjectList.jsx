import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowRight, 
  FaGraduationCap, 
  FaBrain, 
  FaCode, 
  FaNetworkWired, 
  FaWifi,
  FaCloud,
  FaCube,
  FaLock,
  FaMobile
} from 'react-icons/fa';
import Navbar from './Navbar';

const SubjectList = ({ onSubjectSelect }) => {
  const [selectedSemester, setSelectedSemester] = useState('Semester 1');
  const navigate = useNavigate();

  const subjects = {
    'Semester 1': [
      {
        id: 'aiml',
        name: 'AI/ML',
        fullName: 'Artificial Intelligence & Machine Learning',
        icon: FaBrain,
        lastUpdated: 'No papers yet',
        description: 'Deep learning, neural networks, and intelligent systems'
      },
      {
        id: 'advanced-dsa',
        name: 'Advanced DSA',
        fullName: 'Advanced Data Structures & Algorithms',
        icon: FaCode,
        lastUpdated: 'No papers yet',
        description: 'Complex algorithms and optimization techniques'
      },
      {
        id: 'distributed-systems',
        name: 'Distributed Systems',
        fullName: 'Distributed Computing Systems',
        icon: FaNetworkWired,
        lastUpdated: 'No papers yet',
        description: 'Scalable and fault-tolerant system design'
      },
      {
        id: 'iot',
        name: 'IOT',
        fullName: 'Internet of Things',
        icon: FaWifi,
        lastUpdated: 'No papers yet',
        description: 'Connected devices and smart systems'
      }
    ],
    'Semester 2': [
      {
        id: 'cloud-computing',
        name: 'Cloud Computing',
        fullName: 'Cloud Computing Technologies',
        icon: FaCloud,
        lastUpdated: 'No papers yet',
        description: 'Cloud platforms and distributed computing'
      },
      {
        id: 'blockchain',
        name: 'Blockchain',
        fullName: 'Blockchain Technology',
        icon: FaCube,
        lastUpdated: 'No papers yet',
        description: 'Decentralized systems and cryptocurrencies'
      },
      {
        id: 'cybersecurity',
        name: 'Cybersecurity',
        fullName: 'Information Security',
        icon: FaLock,
        lastUpdated: 'No papers yet',
        description: 'Security protocols and threat analysis'
      },
      {
        id: 'mobile-dev',
        name: 'Mobile Development',
        fullName: 'Mobile Application Development',
        icon: FaMobile,
        lastUpdated: 'No papers yet',
        description: 'iOS and Android app development'
      },
      {
        id: 'web-dev',
        name: 'Web Development',
        fullName: 'Full Stack Web Development',
        icon: FaCode,
        lastUpdated: 'No papers yet',
        description: 'Frontend and backend web technologies'
      },
      {
        id: 'data-science',
        name: 'Data Science',
        fullName: 'Data Science & Analytics',
        icon: FaBrain,
        lastUpdated: 'No papers yet',
        description: 'Data analysis, visualization, and machine learning'
      }
    ]
  };

  const semesters = Object.keys(subjects);

  return (
    <div className="subject-notes-page">
      <Navbar />
      
      {/* Enhanced Fixed Header */}
      <div className="subject-notes-header">
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center gap-4 relative z-10"
        >
          <motion.div 
            className="floating-element"
            whileHover={{ scale: 1.2, rotate: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaGraduationCap className="text-5xl text-blue-400 pulse-glow" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1>Subject Notes</h1>
          </motion.div>
          
          <motion.div 
            className="floating-element"
            style={{ animationDelay: '1s' }}
            whileHover={{ scale: 1.1, rotate: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-80" />
          </motion.div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10"
        >
          <motion.span
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Select a subject to view and manage your study materials
          </motion.span>
        </motion.p>
        
        {/* Decorative Elements */}
        <motion.div
          className="absolute left-8 top-1/2 transform -translate-y-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-400 opacity-60"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1 }}
        />
        <motion.div
          className="absolute right-8 top-1/2 transform -translate-y-1/2 w-12 h-0.5 bg-gradient-to-l from-transparent to-purple-400 opacity-60"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        />
      </div>
      
      <div
        className="subject-notes-black-bg min-h-screen bg-black"
        style={{ backgroundColor: '#000000', minHeight: '100vh' }}
      >
        <div className="max-w-4xl mx-auto subject-notes-content px-6 py-8">
          {/* Semester Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-12"
          >
            <div className="semester-tabs-container flex gap-2">
              {semesters.map((semester) => (
                <button
                  key={semester}
                  onClick={() => setSelectedSemester(semester)}
                  className={`semester-tab ${
                    selectedSemester === semester ? 'active' : ''
                  }`}
                >
                  {semester}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Subjects Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSemester}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="subjects-grid-desktop"
            >
              {subjects[selectedSemester].map((subject, index) => {
                const IconComponent = subject.icon;
                return (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 30, rotateX: 15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.6,
                      ease: "easeOut"
                    }}
                    className="subject-card-premium card-tilt"
                  >
                    {/* Sparkle Effects */}
                    <div className="sparkle"></div>
                    <div className="sparkle"></div>
                    <div className="sparkle"></div>
                    
                    <div className="flex items-start justify-between h-full p-8">
                      <div className="flex items-start gap-5 flex-1">
                        <motion.div 
                          className="subject-icon-gradient"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <IconComponent />
                        </motion.div>
                        
                        <div className="flex-1 min-w-0">
                          <motion.h3 
                            className="text-xl font-bold text-white mb-2 leading-tight"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                          >
                            {subject.name}
                          </motion.h3>
                          
                          <motion.p 
                            className="text-sm text-gray-300 mb-3 leading-relaxed"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                          >
                            {subject.fullName}
                          </motion.p>
                          
                          <motion.p 
                            className="text-xs text-gray-400 mb-4 leading-relaxed line-clamp-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.4 }}
                          >
                            {subject.description}
                          </motion.p>
                          
                          <motion.div 
                            className="text-xs text-gray-500 font-medium"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.5 }}
                          >
                            Last updated: <span className="text-gray-400">{subject.lastUpdated}</span>
                          </motion.div>
                        </div>
                      </div>
                      
                      <motion.button
                        onClick={() => navigate(`/subject-notes/${subject.id}`)}
                        className="view-papers-button interactive-button ml-6 flex-shrink-0"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.6 }}
                      >
                        View Papers 
                        <FaArrowRight className="arrow-icon" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Enhanced Stats Footer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="stats-card-enhanced subject-notes-stats-card rounded-xl px-8 py-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-50"></div>
              <div className="relative z-10">
                <motion.p 
                  className="text-gray-300 text-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <span className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {subjects[selectedSemester].length}
                  </span>{' '}
                  subjects available in{' '}
                  <span className="font-semibold text-white">{selectedSemester}</span>
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="mt-3 flex justify-center gap-2"
                >
                  {[...Array(subjects[selectedSemester].length)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.3 + i * 0.1 }}
                    />
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SubjectList;
