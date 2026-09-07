import React from 'react';

export const AyurvedaBackground: React.FC = () => {
  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Background SVG Pattern: Leaves + AI Neural Network Constellation Dots */}
      <svg
        className="w-full h-full opacity-[0.45] dark:opacity-[0.35] transition-opacity duration-300"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          {/* Tileable Leaf & AI Dots Grid Pattern */}
          <pattern
            id="ayurveda-ai-pattern"
            width="180"
            height="180"
            patternUnits="userSpaceOnUse"
          >
            {/* Subtle connecting AI neural network lines */}
            <path
              d="M30 30 L90 50 L150 20 M90 50 L120 120 L40 140 M120 120 L160 160 M40 140 L30 30"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeDasharray="2 3"
              className="text-teal-600/30 dark:text-teal-400/20"
              fill="none"
            />

            {/* AI constellation dots / neural nodes */}
            <circle cx="30" cy="30" r="2" className="fill-teal-600/50 dark:fill-teal-300/40" />
            <circle cx="90" cy="50" r="2.5" className="fill-emerald-500/60 dark:fill-teal-200/50" />
            <circle cx="150" cy="20" r="1.75" className="fill-teal-700/50 dark:fill-teal-400/40" />
            <circle cx="120" cy="120" r="2.25" className="fill-teal-500/60 dark:fill-emerald-400/50" />
            <circle cx="40" cy="140" r="2" className="fill-emerald-600/50 dark:fill-teal-300/40" />
            <circle cx="160" cy="160" r="1.5" className="fill-teal-600/40 dark:fill-teal-400/30" />

            {/* Micro AI pulsed node center */}
            <circle cx="90" cy="50" r="4.5" className="stroke-teal-500/30 dark:stroke-teal-400/30" strokeWidth="0.5" fill="none" />

            {/* Botanical Leaf Motif 1: Elegant pointed leaf */}
            <g transform="translate(60, 75) rotate(-25) scale(0.65)">
              <path
                d="M0 0 C-10 -15 -5 -35 15 -45 C25 -25 20 -5 0 0 Z"
                className="fill-teal-800/10 dark:fill-teal-300/10 stroke-teal-700/30 dark:stroke-teal-400/25"
                strokeWidth="0.8"
              />
              <path
                d="M0 0 Q10 -25 15 -45"
                className="stroke-teal-600/25 dark:stroke-teal-300/20"
                strokeWidth="0.5"
                strokeLinecap="round"
              />
              {/* Secondary vein with AI node tip */}
              <circle cx="15" cy="-45" r="1.5" className="fill-emerald-400/60 dark:fill-emerald-300/60" />
            </g>

            {/* Botanical Leaf Motif 2: Bilateral paired leaf */}
            <g transform="translate(135, 70) rotate(40) scale(0.55)">
              <path
                d="M0 0 C-8 -12 -3 -28 12 -36 C20 -20 16 -4 0 0 Z"
                className="fill-emerald-800/10 dark:fill-emerald-300/10 stroke-emerald-700/30 dark:stroke-emerald-400/25"
                strokeWidth="0.8"
              />
              <path
                d="M0 0 Q8 -20 12 -36"
                className="stroke-emerald-600/25 dark:stroke-emerald-300/20"
                strokeWidth="0.5"
                strokeLinecap="round"
              />
              <circle cx="12" cy="-36" r="1.5" className="fill-teal-400/60 dark:fill-teal-300/60" />
            </g>
          </pattern>

          {/* Radial depth gradient overlay */}
          <radialGradient id="ai-bg-radial" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.06" />
            <stop offset="60%" stopColor="#042f2e" stopOpacity="0.02" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Pattern fill */}
        <rect width="100%" height="100%" fill="url(#ayurveda-ai-pattern)" />
        {/* Glow tint fill */}
        <rect width="100%" height="100%" fill="url(#ai-bg-radial)" />
      </svg>
    </div>
  );
};
