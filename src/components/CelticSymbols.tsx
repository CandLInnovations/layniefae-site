import React from 'react';

// Five-Fold Symbol (Quaternary Celtic Cross with center)
export const FiveFoldSymbol: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    {/* Outer circle */}
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
    
    {/* Four outer circles */}
    <circle cx="50" cy="15" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="85" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="50" cy="85" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="15" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
    
    {/* Center circle */}
    <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
    
    {/* Connecting lines */}
    <line x1="50" y1="27" x2="50" y2="38" stroke="currentColor" strokeWidth="2"/>
    <line x1="73" y1="50" x2="62" y2="50" stroke="currentColor" strokeWidth="2"/>
    <line x1="50" y1="73" x2="50" y2="62" stroke="currentColor" strokeWidth="2"/>
    <line x1="27" y1="50" x2="38" y2="50" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// Bowen Knot (Celtic Love Knot)
export const BowenKnot: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    {/* Interlaced loops forming Bowen knot */}
    <path
      d="M20,50 Q20,20 50,20 Q80,20 80,50 Q80,80 50,80 Q20,80 20,50 Z M50,20 Q80,20 80,50 Q80,80 50,80 Q20,80 20,50 Q20,20 50,20 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Central interlace */}
    <circle cx="35" cy="35" r="8" fill="none" stroke="currentColor" strokeWidth="4"/>
    <circle cx="65" cy="35" r="8" fill="none" stroke="currentColor" strokeWidth="4"/>
    <circle cx="65" cy="65" r="8" fill="none" stroke="currentColor" strokeWidth="4"/>
    <circle cx="35" cy="65" r="8" fill="none" stroke="currentColor" strokeWidth="4"/>
    
    {/* Connecting curves */}
    <path
      d="M43,35 Q50,25 57,35 M57,35 Q67,42 57,50 Q67,58 57,65 M57,65 Q50,75 43,65 M43,65 Q33,58 43,50 Q33,42 43,35"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    />
  </svg>
);

// Quaternary Celtic Knot (Four-way interlaced knot)
export const QuaternaryCelticKnot: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    {/* Four interlaced loops */}
    <path
      d="M50,10 Q70,10 70,30 Q70,50 50,50 Q30,50 30,30 Q30,10 50,10 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      d="M90,50 Q90,70 70,70 Q50,70 50,50 Q50,30 70,30 Q90,30 90,50 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      d="M50,90 Q30,90 30,70 Q30,50 50,50 Q70,50 70,70 Q70,90 50,90 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      d="M10,50 Q10,30 30,30 Q50,30 50,50 Q50,70 30,70 Q10,70 10,50 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
    />
    
    {/* Center interlace pattern */}
    <circle cx="50" cy="50" r="6" fill="currentColor"/>
  </svg>
);

// Celtic Motherhood Knot (Heart with interlaced design)
export const MotherhoodKnot: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    {/* Heart shape base */}
    <path
      d="M50,25 C50,15 35,15 35,25 C35,35 50,50 50,75 C50,50 65,35 65,25 C65,15 50,15 50,25 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
    />
    
    {/* Interlaced loops within heart */}
    <path
      d="M40,30 Q35,25 40,20 Q45,25 40,30 Z M60,30 Q65,25 60,20 Q55,25 60,30 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    />
    
    {/* Central knot */}
    <path
      d="M45,35 Q50,30 55,35 Q50,40 45,35 Z M45,45 Q50,40 55,45 Q50,50 45,45 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    />
    
    {/* Lower connecting loops */}
    <path
      d="M42,55 Q38,50 42,45 Q46,50 42,55 Z M58,55 Q62,50 58,45 Q54,50 58,55 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    />
  </svg>
);