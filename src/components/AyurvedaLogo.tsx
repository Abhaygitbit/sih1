import React from 'react';

interface AyurvedaLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  textColor?: string;
}

export const AyurvedaLogo: React.FC<AyurvedaLogoProps> = ({
  className = '',
  size = 36,
  showText = false,
  textColor = 'text-white'
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* SVG Icon matching the user's Ayurveda emblem: Cupped healing hands cradling a mortar & pestle with sprouting leaves */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm transition-transform hover:scale-105 duration-200"
      >
        <defs>
          {/* Bold Blue-Green Gradients */}
          <linearGradient id="ayur-green-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" /> {/* Vibrant Teal */}
            <stop offset="40%" stopColor="#0d9488" /> {/* Rich Blue-Green */}
            <stop offset="100%" stopColor="#065f46" /> {/* Deep Emerald */}
          </linearGradient>

          <linearGradient id="ayur-pestle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>

          <linearGradient id="ayur-hands-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          <filter id="ayur-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0d9488" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Pestle & Herb Crusher (Angled in the mortar) */}
        <g id="pestle-crusher">
          {/* Pestle top ball */}
          <circle cx="41" cy="28" r="10" fill="url(#ayur-pestle-grad)" />
          {/* Pestle shaft */}
          <path
            d="M44 33 L57 58 C55 60 51 60 48 57 L37 36 Z"
            fill="url(#ayur-pestle-grad)"
          />
        </g>

        {/* Sprouting Medicinal Ayurvedic Leaves */}
        <g id="ayurvedic-leaves">
          {/* Primary upright leaf */}
          <path
            d="M66 48 C63 32 72 17 76 14 C82 22 84 38 72 49 Z"
            fill="url(#ayur-green-grad)"
          />
          {/* Primary leaf center vein */}
          <path
            d="M68 46 Q73 30 76 16"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />

          {/* Secondary side leaf */}
          <path
            d="M74 46 C80 37 89 29 93 28 C96 36 94 48 83 50 Z"
            fill="url(#ayur-green-grad)"
          />
          {/* Secondary leaf vein */}
          <path
            d="M76 45 Q85 36 91 30"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />
        </g>

        {/* Traditional Ayurvedic Mortar Bowl */}
        <g id="mortar-bowl">
          <path
            d="M34 50 L86 50 C85 68 76 80 60 80 C44 80 35 68 34 50 Z"
            fill="url(#ayur-green-grad)"
            filter="url(#ayur-glow)"
          />
          {/* Mortar Top Rim highlight */}
          <ellipse
            cx="60"
            cy="50"
            rx="26"
            ry="4.5"
            fill="#2dd4bf"
            fillOpacity="0.4"
          />
        </g>

        {/* Supportive Cupped Healing Hands Cradling the Mortar */}
        <g id="healing-hands">
          {/* Left embracing hand */}
          <path
            d="M26 49 C24 64 26 80 43 92 C51 98 58 102 60 103 C58 101 51 96 46 90 C34 76 34 60 36 51 C34 56 31 66 35 77 C32 68 30 57 32 50 C29 48 27 48 26 49 Z"
            fill="url(#ayur-hands-grad)"
          />
          <path
            d="M33 50 C31 66 35 83 49 93 C55 98 60 102 60 102 C57 97 53 91 49 84 C41 71 42 59 44 51 C39 58 40 70 47 79 C42 69 40 59 41 50 C37 50 34 50 33 50 Z"
            fill="url(#ayur-green-grad)"
          />

          {/* Right embracing hand */}
          <path
            d="M94 49 C96 64 94 80 77 92 C69 98 62 102 60 103 C62 101 69 96 74 90 C86 76 86 60 84 51 C86 56 89 66 85 77 C88 68 90 57 88 50 C91 48 93 48 94 49 Z"
            fill="url(#ayur-hands-grad)"
          />
          <path
            d="M87 50 C89 66 85 83 71 93 C65 98 60 102 60 102 C63 97 67 91 71 84 C79 71 78 59 76 51 C81 58 80 70 73 79 C78 69 80 59 79 50 C83 50 86 50 87 50 Z"
            fill="url(#ayur-green-grad)"
          />

          {/* Under-cradle connecting stem */}
          <path
            d="M58 80 L62 80 L61 97 L59 97 Z"
            fill="url(#ayur-green-grad)"
          />
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className={`text-lg font-bold tracking-tight ${textColor} leading-tight`}>
            IP-SAKTI <span className="text-[#14b8a6] font-medium">Sahayak</span>
          </span>
        </div>
      )}
    </div>
  );
};
