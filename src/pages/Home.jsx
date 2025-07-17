import React from 'react';
import { motion } from 'framer-motion';// Importing the Footer component
import Navbar from '../components/Navbar';


function Home() {
  // Text to be animated with typing effect
  const text = "Your perfect companion for effective learning and academic success";
  
  // Vibration animation keyframes
  const vibrationAnimation = {
    x: [0, -2, 2, -2, 2, -1, 1, -1, 1, 0, 0, 0],
    transition: {
      duration: 0.4,
      times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1],
      repeat: Infinity,
      repeatDelay: 4,
      ease: "easeInOut",
    }
  };
  
  return (
    <>
    <Navbar />
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url("/images/bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: 'white',
      textAlign: 'center',
    }}>
      {/* Semi-transparent overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(18, 28, 46, 0.6)',
        zIndex: 1
      }} />
      
      <div style={{ 
        maxWidth: '600px', 
        width: '100%', 
        position: 'relative', 
        zIndex: 2
      }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '42px', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.span
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Welcome to
            </motion.span>
            
            <motion.span
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              eduHeaven
            </motion.span>
          </div>
          
          <motion.p
            style={{ fontSize: '18px', color: '#b0b0b0', marginTop: '10px', height: '2em' }}
          >
            {text.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.1,
                  delay: 1.5 + index * 0.05,
                  ease: "easeIn"
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
          {/* Sign In Button with vibration effect */}
          <motion.div
            style={{ position: 'relative' }}
            animate={vibrationAnimation}
            transition={{ delay: 3 }}
          >
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.6 + text.length * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              href="/signin"
              style={{
                backgroundColor: '#3b82f6',
                color: 'white', 
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                boxShadow: '0px 4px 8px rgba(59, 130, 246, 0.3)',
                display: 'block'
              }}
            >
              Sign In
            </motion.a>
          </motion.div>
          
          {/* Sign Up Button with delayed vibration effect */}
          <motion.div
            style={{ position: 'relative' }}
            animate={vibrationAnimation}
            transition={{ delay: 5 }}
          >
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 + text.length * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              href="/signup"
              style={{
                backgroundColor: '#4f46e5',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                boxShadow: '0px 4px 8px rgba(79, 70, 229, 0.3)',
                display: 'block'
              }}
            >
              Sign Up
            </motion.a>
          </motion.div>
        </div>
      </div>
      
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 + text.length * 0.05 }}
        style={{
          position: 'absolute',
          bottom: '20px',
          zIndex: 2,
          fontSize: '14px',
          color: '#b0b0b0'
        }}
      >
        © 2025 eduHeaven. All rights reserved.
      </motion.footer>
    </div>
    </>
  );
}

export default Home;

