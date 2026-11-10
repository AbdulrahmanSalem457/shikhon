import React from 'react';
import logoImg from '../assets/shikhon-logo.png';

export const BrandLogo = ({ className = "h-9 w-auto", alt = "شيخون | Shikhon Auto Spare Parts" }) => {
  return (
    <img 
      src={logoImg} 
      alt={alt} 
      className={`${className} object-contain inline-block select-none`}
      loading="eager"
    />
  );
};

export default BrandLogo;
