import React from 'react';

const BrandLogo = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <radialGradient id="splashGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#FFA500" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFA500" stopOpacity="0" />
          </radialGradient>
          
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#9C7B00" />
          </linearGradient>
        </defs>

        {/* Watercolor Splash Effect (Simplified) */}
        <g opacity="0.6">
          <path d="M60 10 C80 5 100 20 110 40 C120 60 110 85 95 100 C80 115 50 118 30 110 C10 102 -5 70 5 45 C15 20 40 15 60 10Z" fill="url(#splashGradient)" />
          <path d="M55 20 C70 15 85 25 92 38 C99 51 95 68 88 78 C81 88 65 92 52 88 C39 84 32 72 35 58 C38 44 45 25 55 20Z" fill="#FFD700" fillOpacity="0.15" />
        </g>

        {/* Golden Circular Frame */}
        <circle cx="60" cy="60" r="42" fill="#FDFCF0" stroke="url(#goldGradient)" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="39" stroke="url(#goldGradient)" strokeWidth="0.8" />
        
        {/* Main Text Content */}
        <g transform="translate(60, 60)" style={{ fontFamily: "'Playfair Display', serif" }}>
          {/* S.O.I */}
          <text y="-2" textAnchor="middle" fill="#800020" style={{ fontWeight: 900, fontSize: '20px', letterSpacing: '0.05em' }}>
            S.O.I
          </text>
          
          {/* Ornaments in/around S.O.I */}
          {/* Small Crown on I */}
          <path transform="translate(18, -25) scale(0.25)" d="M5 10 L2 5 L8 2 L14 5 L11 10 Z" fill="#800020" />
          
          {/* Small Crown on O */}
          <path transform="translate(-2, -14) scale(0.2)" d="M5 10 L2 5 L8 2 L14 5 L11 10 Z" fill="#800020" />

          {/* SPICE OF INDIA */}
          <text y="16" textAnchor="middle" fill="#332211" style={{ fontSize: '5.5px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Spice Of India
          </text>
        </g>
      </svg>
    </div>
  );
};

export default BrandLogo;
