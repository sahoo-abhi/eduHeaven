import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine where the logo should navigate based on user status and current page
  const getLogoDestination = () => {
    if (currentUser) {
      // If user is logged in, check if they're already on dashboard or related pages
      if (location.pathname === '/dashboard' || 
          location.pathname === '/branch' || 
          location.pathname.startsWith('/dashboard')) {
        return '/dashboard'; // Keep them on dashboard
      }
      // If logged in but on other pages, take them to dashboard
      return '/dashboard';
    }
    // If not logged in, take them to home
    return '/';
  };

  // Get profile image URL with fallback
  const getProfileImageStyle = (user) => {
    if (!user || !user.photoURL || profileImageError) {
      return {
        background: user ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)'
      };
    }
    
    // Handle different photo URL formats
    let photoURL = user.photoURL;
    
    // If it's a Google photo, ensure it has the right size parameter
    if (photoURL.includes('googleusercontent.com')) {
      photoURL = photoURL.replace(/s\d+-c/, 's96-c'); // Set size to 96px
    }
    
    console.log('Profile photo URL:', photoURL); // Debug log
    
    return {
      backgroundImage: `url(${photoURL})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
  };

  // Reset image error when user changes
  useEffect(() => {
    setProfileImageError(false);
  }, [currentUser?.photoURL]);
  
  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileMenu(false);
      setIsOpen(false); // Close mobile menu if open
      // Navigate to home page after successful logout
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };
  
  // Animation variants for mobile menu
  const menuVariants = {
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3
      }
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(17, 24, 39, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {/* Logo on the left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to={getLogoDestination()} style={{
          color: '#ffffff',
          fontSize: '24px',
          fontWeight: 'bold',
          textDecoration: 'none',
          transition: 'color 0.3s ease'
        }}>
          eduHeaven
        </Link>
      </motion.div>
      
      {/* Mobile Right Section - Profile Circle and Hamburger Menu */}
      {isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Profile Circle for Mobile */}
          <div className="profile-menu-container" style={{ position: 'relative' }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                ...getProfileImageStyle(currentUser),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Show actual image if available and not errored */}
              {currentUser?.photoURL && !profileImageError && (
                <img
                  src={currentUser.photoURL.includes('googleusercontent.com') 
                    ? currentUser.photoURL.replace(/s\d+-c/, 's96-c')
                    : currentUser.photoURL}
                  alt="Profile"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                  onError={() => {
                    console.log('Profile image failed to load:', currentUser.photoURL);
                    setProfileImageError(true);
                  }}
                  onLoad={() => {
                    console.log('Profile image loaded successfully');
                    setProfileImageError(false);
                  }}
                />
              )}
              {/* Show initials if no photo or photo failed to load */}
              {(!currentUser?.photoURL || profileImageError) && (
                <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  {!currentUser ? 'G' : 
                   (currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 
                    currentUser.email ? currentUser.email[0].toUpperCase() : 'U')}
                </span>
              )}
            </motion.div>
            
            {/* Mobile Profile Dropdown Menu */}
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  top: '45px',
                  right: 0,
                  background: 'rgba(17, 24, 39, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '8px',
                  padding: '10px 0',
                  minWidth: '180px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                  zIndex: 1002
                }}
              >
                {currentUser ? (
                  <>
                    <div style={{
                      padding: '10px 15px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px'
                    }}>
                      <div style={{ fontWeight: 'bold' }}>
                        {currentUser.displayName || 'User'}
                      </div>
                      <div style={{ color: '#9ca3af', fontSize: '12px' }}>
                        {currentUser.email}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        padding: '10px 15px',
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '14px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                      onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                      <FaSignOutAlt />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{
                      padding: '10px 15px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px'
                    }}>
                      <div style={{ fontWeight: 'bold' }}>Guest User</div>
                      <div style={{ color: '#9ca3af', fontSize: '12px' }}>
                        Not signed in
                      </div>
                    </div>
                    <Link
                      to="/signin"
                      onClick={() => setShowProfileMenu(false)}
                      style={{
                        width: '100%',
                        padding: '10px 15px',
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '14px',
                        textDecoration: 'none',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                      onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                      <FaUser />
                      Sign In
                    </Link>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      )}
      
    
          
          {/* Profile Circle */}
          <div className="profile-menu-container" style={{ position: 'relative' }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                ...getProfileImageStyle(currentUser),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Show actual image if available and not errored */}
              {currentUser?.photoURL && !profileImageError && (
                <img
                  src={currentUser.photoURL.includes('googleusercontent.com') 
                    ? currentUser.photoURL.replace(/s\d+-c/, 's96-c')
                    : currentUser.photoURL}
                  alt="Profile"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                  onError={() => {
                    console.log('Profile image failed to load:', currentUser.photoURL);
                    setProfileImageError(true);
                  }}
                  onLoad={() => {
                    console.log('Profile image loaded successfully');
                    setProfileImageError(false);
                  }}
                />
              )}
              {/* Show initials if no photo or photo failed to load */}
              {(!currentUser?.photoURL || profileImageError) && (
                <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  {!currentUser ? 'G' : 
                   (currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 
                    currentUser.email ? currentUser.email[0].toUpperCase() : 'U')}
                </span>
              )}
            </motion.div>
            
            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  top: '50px',
                  right: 0,
                  background: 'rgba(17, 24, 39, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '8px',
                  padding: '10px 0',
                  minWidth: '180px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
                }}
              >
                {currentUser ? (
                  <>
                    <div style={{
                      padding: '10px 15px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px'
                    }}>
                      <div style={{ fontWeight: 'bold' }}>
                        {currentUser.displayName || 'User'}
                      </div>
                      <div style={{ color: '#9ca3af', fontSize: '12px' }}>
                        {currentUser.email}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        padding: '10px 15px',
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '14px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                      onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                      <FaSignOutAlt />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{
                      padding: '10px 15px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px'
                    }}>
                      <div style={{ fontWeight: 'bold' }}>Guest User</div>
                      <div style={{ color: '#9ca3af', fontSize: '12px' }}>
                        Not signed in
                      </div>
                    </div>
                    <Link
                      to="/signin"
                      onClick={() => setShowProfileMenu(false)}
                      style={{
                        width: '100%',
                        padding: '10px 15px',
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '14px',
                        textDecoration: 'none',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                      onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                      <FaUser />
                      Sign In
                    </Link>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Mobile Menu */}
      {isMobile && (
        <motion.div
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={menuVariants}
          style={{
            position: 'absolute',
            top: '64px',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(17, 24, 39, 0.98)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: isOpen ? '15px' : 0
          }}
        >
          {['Notes', 'Papers', 'Contact'].map((item, index) => {
            // Map items to their correct routes
            const getItemRoute = (item) => {
              switch(item) {
                case 'Notes': return '/subject-notes';
                case 'Papers': return '/question-papers';
                case 'Contact': return '/contact';
                default: return `/${item.toLowerCase()}`;
              }
            };
            
            return (
              <Link
                key={item}
                to={getItemRoute(item)}
                onClick={() => setIsOpen(false)}
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '15px 0',
                  width: '100%',
                  textAlign: 'center',
                  borderBottom: index < 2 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + (index * 0.1) }}
                >
                  {item}
                </motion.span>
              </Link>
            );
          })}
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;


