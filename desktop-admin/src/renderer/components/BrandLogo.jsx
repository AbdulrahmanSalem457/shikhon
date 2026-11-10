import React from 'react';

export const BrandLogo = ({ className = "w-8 h-8" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Prestige Admin Sapphire Blue Gradient */}
        <linearGradient id="shkAutoGradAdmin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>

        {/* Chrome Specular Reflection */}
        <linearGradient id="shkChromeAdmin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#64748b" stopOpacity="0.15" />
        </linearGradient>

        {/* Xenon LED Glow */}
        <linearGradient id="shkGlowAdmin" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>
      </defs>

      {/* 2. Aerodynamic GT Supercar Silhouette (Pure Car without outer frames/rings) */}
      {/* Roofline & Windshield */}
      <path 
        d="M45,34 Q60,25 75,34 L82,46 Q60,43 38,46 Z" 
        fill="url(#shkAutoGradAdmin)" 
        opacity="0.85"
      />
      <path 
        d="M48,35 Q60,28 72,35 L77,44 Q60,42 43,44 Z" 
        fill="#ffffff" 
        opacity="0.3"
      />

      {/* Supercar Muscular Body & Fender Contours */}
      <path 
        d="M20,58 C20,48 30,46 38,46 L82,46 C90,46 100,48 100,58 C100,66 96,74 92,78 L86,84 C80,88 68,90 60,90 C52,90 40,88 34,84 L28,78 C24,74 20,66 20,58 Z" 
        stroke="url(#shkAutoGradAdmin)" 
        strokeWidth="3.2" 
        strokeLinejoin="round"
      />

      {/* Hood Aerodynamic Sculpt Lines */}
      <path d="M42,47 L48,68" stroke="url(#shkChromeAdmin)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M78,47 L72,68" stroke="url(#shkChromeAdmin)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M60,45 L60,65" stroke="url(#shkAutoGradAdmin)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

      {/* Aggressive LED Matrix Headlights */}
      <path 
        d="M25,58 L39,63 L36,66 L23,61 Z" 
        fill="url(#shkGlowAdmin)" 
      />
      <path 
        d="M95,58 L81,63 L84,66 L97,61 Z" 
        fill="url(#shkGlowAdmin)" 
      />

      {/* Front Intercooler Grille */}
      <path 
        d="M40,72 L80,72 L76,84 L44,84 Z" 
        fill="url(#shkAutoGradAdmin)" 
        opacity="0.2"
      />
      <path 
        d="M40,72 L80,72 L76,84 L44,84 Z" 
        stroke="url(#shkAutoGradAdmin)" 
        strokeWidth="1.5"
      />

      {/* Center Engine Piston (Auto Parts Icon) */}
      <g transform="translate(60, 77)">
        {/* Piston Crown & Rings */}
        <rect x="-6" y="-4" width="12" height="6" rx="1.5" fill="url(#shkChromeAdmin)" />
        <line x1="-5" y1="-2" x2="5" y2="-2" stroke="#0284c7" strokeWidth="0.8" />
        {/* Connecting Rod */}
        <path d="M-2,2 L-2,7 L2,7 L2,2 Z" fill="url(#shkAutoGradAdmin)" />
      </g>

      {/* Aerodynamic Carbon Splitter */}
      <path 
        d="M16,86 Q60,94 104,86 L102,90 Q60,98 18,90 Z" 
        fill="url(#shkAutoGradAdmin)"
      />
      
      {/* Side Velocity Speed Fins */}
      <path d="M12,52 L18,50" stroke="url(#shkAutoGradAdmin)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <path d="M10,60 L16,60" stroke="url(#shkAutoGradAdmin)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <path d="M12,68 L18,70" stroke="url(#shkAutoGradAdmin)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

      <path d="M108,52 L102,50" stroke="url(#shkAutoGradAdmin)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <path d="M110,60 L104,60" stroke="url(#shkAutoGradAdmin)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <path d="M108,68 L102,70" stroke="url(#shkAutoGradAdmin)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
};