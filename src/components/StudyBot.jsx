import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaGraduationCap, FaLightbulb, FaTimes } from 'react-icons/fa';

const StudyBot = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const studyTips = [
    "💡 Take a 5-minute break every 25 minutes!",
    "🎯 Focus on one subject at a time for better retention.",
    "📚 Review your notes before sleeping to improve memory.",
    "🌟 You're doing great! Keep up the excellent work!",
    "⏰ Create a study schedule and stick to it.",
    "🧠 Practice active recall instead of just re-reading.",
    "🎵 Try studying with instrumental music for better focus.",
    "💪 Remember: every expert was once a beginner!",
    "📝 Summarize what you've learned in your own words.",
    "🚀 Small progress is still progress. Keep going!"
  ];

  useEffect(() => {
    // Handle window resize for responsive positioning
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Show a message every 30 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessage(studyTips[messageIndex]);
      setShowMessage(true);
      setMessageIndex((prev) => (prev + 1) % studyTips.length);
      
      // No automatic hide - only hide when user clicks close button
    }, 30000);

    // Show initial message after 3 seconds
    const initialTimeout = setTimeout(() => {
      setCurrentMessage(studyTips[0]);
      setShowMessage(true);
      setMessageIndex(1);
      
      // No automatic hide - only hide when user clicks close button
    }, 3000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(messageInterval);
      clearTimeout(initialTimeout);
    };
  }, [messageIndex]);

  const handleBotClick = () => {
    if (!showMessage) {
      setCurrentMessage(studyTips[Math.floor(Math.random() * studyTips.length)]);
      setShowMessage(true);
      
      // No automatic hide - only hide when user clicks close button
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: isMobile ? '100px' : '20px', // Move higher on mobile
      right: isMobile ? 'calc(50% + 30px)' : '20px', // Move more left on mobile
      left: isMobile ? 'calc(50% - 30px)' : 'auto',
      transform: isMobile ? 'translateX(-50%)' : 'none',
      zIndex: 999,
      pointerEvents: 'none'
    }}>
      {/* Message Bubble */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: 'absolute',
              bottom: '80px',
              right: isMobile ? 'auto' : '0px',
              left: isMobile ? '-110px' : 'auto', // Adjust bubble position for new bot position
              transform: isMobile ? 'none' : 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '16px',
              maxWidth: isMobile ? '280px' : '220px', // Fixed width on mobile
              width: isMobile ? '280px' : 'auto', // Fixed width instead of calc
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              pointerEvents: 'auto',
              textAlign: 'center' // Center text on mobile
            }}
          >
            {currentMessage}
            <div style={{
              position: 'absolute',
              bottom: '-8px',
              right: isMobile ? 'auto' : '24px',
              left: isMobile ? '140px' : 'auto', // Center the tail under the bubble
              transform: isMobile ? 'none' : 'none',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid rgba(102, 126, 234, 0.9)'
            }} />
            <button
              onClick={() => setShowMessage(false)}
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                padding: '2px',
                fontSize: '10px'
              }}
            >
              <FaTimes />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Study Bot */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotateY: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        onClick={handleBotClick}
        style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(79, 172, 254, 0.4)',
          border: '3px solid rgba(255,255,255,0.3)',
          position: 'relative',
          pointerEvents: 'auto',
          transform: 'perspective(100px) rotateX(10deg)',
          transformStyle: 'preserve-3d'
        }}
        whileHover={{
          scale: 1.1,
          rotateY: 15,
          boxShadow: '0 12px 40px rgba(79, 172, 254, 0.6)'
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Bot Icon with 3D effect */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            fontSize: '24px',
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            transform: 'translateZ(10px)'
          }}
        >
          <FaRobot />
        </motion.div>

        {/* Floating particles around the bot */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            borderStyle: 'dashed'
          }}
        />

        {/* Knowledge particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              rotate: 360,
              scale: [1, 1.5, 1]
            }}
            transition={{
              rotate: { 
                duration: 6 + i * 2, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 0.5
              },
              scale: { 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.3
              }
            }}
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              background: 'rgba(255,255,255,0.8)',
              borderRadius: '50%',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) translateY(-35px) rotate(${i * 120}deg) translateY(35px)`,
              boxShadow: '0 0 8px rgba(255,255,255,0.6)'
            }}
          />
        ))}

        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            color: '#666',
            fontSize: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <FaTimes />
        </button>
      </motion.div>

      {/* Pulsing glow effect */}
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '60px',
          height: '60px',
          background: 'radial-gradient(circle, rgba(79, 172, 254, 0.4) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default StudyBot;
