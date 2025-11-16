import React from 'react';

export function OceanBackdrop() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Deep ocean gradient background */}
        <defs>
          <radialGradient id="abyssGradient" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#001122" />
            <stop offset="40%" stopColor="#002244" />
            <stop offset="80%" stopColor="#000814" />
            <stop offset="100%" stopColor="#000408" />
          </radialGradient>
          
          {/* Underwater currents */}
          <linearGradient id="currentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(64, 224, 208, 0.05)" />
            <stop offset="50%" stopColor="rgba(64, 224, 208, 0.02)" />
            <stop offset="100%" stopColor="rgba(64, 224, 208, 0.08)" />
          </linearGradient>
          
          {/* Bioluminescent glow */}
          <filter id="biolumGlow">
            <feGaussianBlur stdDeviation="8" />
            <feColorMatrix values="0 0 0 0 0.25   0 0 0 0 0.88   0 0 0 0 0.82   0 0 0 1 0" />
          </filter>
          
          {/* Subtle shimmer effect */}
          <filter id="shimmer">
            <feGaussianBlur stdDeviation="2" />
            <feColorMatrix values="0 0 0 0 0.25   0 0 0 0 0.88   0 0 0 0 0.82   0 0 0 0.3 0" />
          </filter>
        </defs>
        
        {/* Main abyss background */}
        <rect width="100%" height="100%" fill="url(#abyssGradient)" />
        
        {/* Underwater terrain silhouettes */}
        <path
          d="M0,800 Q200,750 400,780 T800,760 Q1000,740 1200,770 T1600,750 Q1800,730 1920,760 L1920,1080 L0,1080 Z"
          fill="rgba(0, 20, 40, 0.8)"
        />
        <path
          d="M0,900 Q300,850 600,880 T1200,860 Q1500,840 1800,870 L1920,870 L1920,1080 L0,1080 Z"
          fill="rgba(0, 15, 30, 0.9)"
        />
        
        {/* Mysterious underwater rock formations */}
        <ellipse cx="150" cy="950" rx="80" ry="120" fill="rgba(0, 10, 20, 0.7)" />
        <ellipse cx="1750" cy="920" rx="100" ry="140" fill="rgba(0, 8, 16, 0.8)" />
        <ellipse cx="900" cy="980" rx="60" ry="90" fill="rgba(0, 12, 24, 0.6)" />
        
        {/* Floating kelp-like structures */}
        <g opacity="0.4">
          <path
            d="M100,1080 Q110,900 95,700 Q120,500 105,300 Q130,100 115,0"
            stroke="rgba(0, 40, 30, 0.6)"
            strokeWidth="8"
            fill="none"
          />
          <path
            d="M1800,1080 Q1790,950 1805,800 Q1780,650 1795,500 Q1770,350 1785,200"
            stroke="rgba(0, 35, 25, 0.5)"
            strokeWidth="6"
            fill="none"
          />
        </g>
        
        {/* Bioluminescent particles */}
        <g filter="url(#biolumGlow)">
          <circle cx="300" cy="200" r="2" fill="rgba(64, 224, 208, 0.8)">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="1200" cy="150" r="1.5" fill="rgba(64, 224, 208, 0.6)">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle cx="800" cy="300" r="2.5" fill="rgba(64, 224, 208, 0.9)">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="1600" cy="250" r="1" fill="rgba(64, 224, 208, 0.5)">
            <animate attributeName="opacity" values="0.1;0.6;0.1" dur="7s" repeatCount="indefinite" />
          </circle>
          <circle cx="400" cy="400" r="1.8" fill="rgba(64, 224, 208, 0.7)">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.5s" repeatCount="indefinite" />
          </circle>
        </g>
        
        {/* Underwater currents/waves */}
        <g opacity="0.1">
          <path
            d="M0,300 Q480,280 960,300 T1920,300"
            stroke="url(#currentGradient)"
            strokeWidth="100"
            fill="none"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 30,5; 0,0"
              dur="8s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M0,500 Q480,480 960,500 T1920,500"
            stroke="url(#currentGradient)"
            strokeWidth="80"
            fill="none"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -20,8; 0,0"
              dur="12s"
              repeatCount="indefinite"
            />
          </path>
        </g>
        
        {/* Mysterious deep sea creatures' silhouettes */}
        <g opacity="0.15">
          <ellipse cx="1400" cy="400" rx="40" ry="15" fill="rgba(0, 30, 40, 0.8)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -200,20; -400,0; -200,-20; 0,0"
              dur="25s"
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse cx="200" cy="600" rx="25" ry="8" fill="rgba(0, 25, 35, 0.6)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 300,-10; 600,0; 300,10; 0,0"
              dur="30s"
              repeatCount="indefinite"
            />
          </ellipse>
        </g>
        
        {/* Distant underwater lights */}
        <g filter="url(#shimmer)">
          <circle cx="1500" cy="700" r="3" fill="rgba(64, 224, 208, 0.3)">
            <animate attributeName="r" values="2;4;2" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle cx="600" cy="650" r="2" fill="rgba(64, 224, 208, 0.2)">
            <animate attributeName="r" values="1;3;1" dur="8s" repeatCount="indefinite" />
          </circle>
        </g>
        
        {/* Abyssal trenches (darker areas) */}
        <path
          d="M400,1080 Q450,1000 500,1080 M800,1080 Q850,950 900,1080 M1300,1080 Q1350,980 1400,1080"
          stroke="rgba(0, 5, 10, 0.8)"
          strokeWidth="60"
          fill="none"
        />
      </svg>
    </div>
  );
}