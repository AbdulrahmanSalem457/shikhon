import React from 'react';

export const BrandLogo = ({ className = "w-8 h-8" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shikhonGradAdmin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="shikhonRimAdmin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="44" stroke="url(#shikhonGradAdmin)" strokeWidth="2.5" opacity="0.4" />
      <circle cx="50" cy="50" r="39" stroke="url(#shikhonRimAdmin)" strokeWidth="1.5" />
      
      <g transform="translate(50, 50)" stroke="url(#shikhonGradAdmin)" strokeWidth="3.5" strokeLinecap="round">
        <path d="M0,-28 L0,-16" />
        <path d="M20,-20 L11,-11" />
        <path d="M28,0 L16,0" />
        <path d="M20,20 L11,11" />
        <path d="M0,28 L0,16" />
        <path d="M-20,20 L-11,11" />
        <path d="M-28,0 L-16,0" />
        <path d="M-20,-20 L-11,-11" />
      </g>
      
      <circle cx="50" cy="50" r="11" fill="url(#shikhonGradAdmin)" />
      <circle cx="47" cy="47" r="4" fill="white" opacity="0.85" />
    </svg>
  );
};
