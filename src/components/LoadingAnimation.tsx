import React from "react";

interface LoadingAnimationProps {
  isVisible: boolean;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="loader">
        {/* Gradient definitions */}
        <svg height="0" width="0" viewBox="0 0 64 64" className="absolute">
          <defs xmlns="http://www.w3.org/2000/svg">
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="2"
              x2="0"
              y1="62"
              x1="0"
              id="b"
            >
              <stop stopColor="#973BED" />
              <stop stopColor="#007CFF" offset="1" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="0"
              x2="0"
              y1="64"
              x1="0"
              id="c"
            >
              <stop stopColor="#FFC800" />
              <stop stopColor="#F0F" offset="1" />
              <animateTransform
                repeatCount="indefinite"
                keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
                keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
                dur="8s"
                values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
                type="rotate"
                attributeName="gradientTransform"
              />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="2"
              x2="0"
              y1="62"
              x1="0"
              id="d"
            >
              <stop stopColor="#00E0ED" />
              <stop stopColor="#00DA72" offset="1" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="2"
              x2="0"
              y1="62"
              x1="0"
              id="e"
            >
              <stop stopColor="#FF6B6B" />
              <stop stopColor="#4ECDC4" offset="1" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="2"
              x2="0"
              y1="62"
              x1="0"
              id="f"
            >
              <stop stopColor="#A8E6CF" />
              <stop stopColor="#88D8C0" offset="1" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="2"
              x2="0"
              y1="62"
              x1="0"
              id="g"
            >
              <stop stopColor="#FFD93D" />
              <stop stopColor="#FF6B6B" offset="1" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="2"
              x2="0"
              y1="62"
              x1="0"
              id="h"
            >
              <stop stopColor="#9B59B6" />
              <stop stopColor="#3498DB" offset="1" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="2"
              x2="0"
              y1="62"
              x1="0"
              id="i"
            >
              <stop stopColor="#E67E22" />
              <stop stopColor="#F39C12" offset="1" />
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="2"
              x2="0"
              y1="62"
              x1="0"
              id="j"
            >
              <stop stopColor="#4A90E2" />
              <stop stopColor="#B84AE2" offset="1" />
            </linearGradient>
          </defs>
        </svg>

        {/* S */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="48"
          width="48"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#b)"
            d="M 52,20 Q 52,8 40,8 L 24,8 Q 12,8 12,20 Q 12,32 24,32 L 40,32 Q 52,32 52,44 Q 52,56 40,56 L 24,56 Q 12,56 12,44"
            className="dash"
            id="s"
            pathLength="360"
          />
        </svg>

        {/* H */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="48"
          width="48"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#c)"
            d="M 16,8 L 16,56 M 48,8 L 48,56 M 16,32 L 48,32"
            className="dash"
            id="h1"
            pathLength="360"
          />
        </svg>

        {/* E */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="48"
          width="48"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#d)"
            d="M 12,8 L 12,56 M 12,8 L 48,8 M 12,32 L 40,32 M 12,56 L 48,56"
            className="dash"
            id="e"
            pathLength="360"
          />
        </svg>

        {/* N */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="48"
          width="48"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#e)"
            d="M 12,56 L 12,8 L 52,56 L 52,8"
            className="dash"
            id="n1"
            pathLength="360"
          />
        </svg>

        {/* G */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="48"
          width="48"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#f)"
            d="M 52,20 Q 52,8 32,8 Q 12,8 12,32 Q 12,56 32,56 Q 52,56 52,44 L 52,32 L 40,32"
            className="dash"
            id="g1"
            pathLength="360"
          />
        </svg>

        {/* H */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="48"
          width="48"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#g)"
            d="M 16,8 L 16,56 M 48,8 L 48,56 M 16,32 L 48,32"
            className="dash"
            id="h2"
            pathLength="360"
          />
        </svg>

        {/* A */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="48"
          width="48"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#h)"
            d="M 12,56 L 32,8 L 52,56 M 20,40 L 44,40"
            className="dash"
            id="a1"
            pathLength="360"
          />
        </svg>

        {/* O */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="48"
          width="48"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#i)"
            d="M 32,8 Q 52,8 52,32 Q 52,56 32,56 Q 12,56 12,32 Q 12,8 32,8"
            className="dash"
            id="o1"
            pathLength="360"
          />
        </svg>

        {/* Space separator */}
        <div className="space-separator"></div>
        
        {/* X */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="48"
          width="48"
          className="inline-block cyberpunk-x"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="10"
            stroke="url(#j)"
            d="M 12,12 L 52,52 M 52,12 L 12,52"
            className="dash cyberpunk-glow"
            id="x1"
            pathLength="360"
          />
        </svg>
      </div>

      <style jsx>{`
        .loader {
          display: flex;
          margin: 0.25em 0;
          gap: 0.1em;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 90vw;
          align-items: center;
        }
        
        .loader svg {
          width: 48px;
          height: 48px;
        }
        
        .space-separator {
          width: 20px;
          height: 48px;
          flex-shrink: 0;
        }
        
        .cyberpunk-x {
          filter: drop-shadow(0 0 8px #4A90E2);
        }
        
        .cyberpunk-glow {
          animation: dashArray 2s ease-in-out infinite,
            dashOffset 2s linear infinite;
        }
        
        @media (max-width: 768px) {
          .loader svg {
            width: 36px;
            height: 36px;
          }
          .space-separator {
            width: 15px;
            height: 36px;
          }
        }
        
        @media (max-width: 480px) {
          .loader svg {
            width: 32px;
            height: 32px;
          }
          .loader {
            gap: 0.05em;
          }
          .space-separator {
            width: 12px;
            height: 32px;
          }
        }

        .dash {
          animation: dashArray 2s ease-in-out infinite,
            dashOffset 2s linear infinite;
        }

        @keyframes dashArray {
          0% {
            stroke-dasharray: 0 1 359 0;
          }
          50% {
            stroke-dasharray: 0 359 1 0;
          }
          100% {
            stroke-dasharray: 359 1 0 0;
          }
        }

        @keyframes dashOffset {
          0% {
            stroke-dashoffset: 365;
          }
          100% {
            stroke-dashoffset: 5;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;
