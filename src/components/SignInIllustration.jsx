import React from 'react';

const SignInIllustration = ({ className }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 500" 
        className="w-full h-full max-w-md"
      >
        {/* Simple student illustration */}
        <circle cx="250" cy="125" r="50" fill="#8BB3FF" />
        <rect x="225" y="175" width="50" height="150" fill="#4361EE" />
        <rect x="185" y="200" width="40" height="100" fill="#4361EE" />
        <rect x="275" y="200" width="40" height="100" fill="#4361EE" />
        <rect x="200" y="325" width="35" height="75" fill="#8BB3FF" />
        <rect x="265" y="325" width="35" height="75" fill="#8BB3FF" />
        <rect x="175" y="175" width="150" height="25" rx="10" fill="#8BB3FF" />
        
        {/* Computer */}
        <rect x="125" y="225" width="60" height="45" rx="5" fill="#3A3A3A" />
        <rect x="130" y="230" width="50" height="35" fill="#FFFFFF" />
        <rect x="155" y="270" width="10" height="15" fill="#3A3A3A" />
        <rect x="140" y="285" width="40" height="5" fill="#3A3A3A" />
        
        {/* Desk */}
        <rect x="100" y="290" width="300" height="10" fill="#DEC394" />
        <rect x="110" y="300" width="10" height="50" fill="#BA9B63" />
        <rect x="380" y="300" width="10" height="50" fill="#BA9B63" />
        
        {/* Decorative elements */}
        <circle cx="360" cy="100" r="25" fill="#FFD166" /> {/* Sun/light */}
        <circle cx="160" cy="170" r="10" fill="#FF6B6B" /> {/* Apple */}
      </svg>
    </div>
  );
};

export default SignInIllustration;