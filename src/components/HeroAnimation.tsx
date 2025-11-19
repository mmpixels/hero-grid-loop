import { useEffect, useState, useRef } from "react";

// Token list - easily customizable
const TOKENS = [
  "Structured Thinking",
  "Intuitive UX",
  "Systems-Oriented",
  "Clear Interactions",
  "Detail-Oriented",
  "Problem Solver"
];

// Animation timing constants (in milliseconds)
const TIMING = {
  ENTER: 900,        // Entrance animation duration
  HOLD: 1400,        // Hold at center duration
  GLOW_IN: 120,      // Glow fade-in at start of hold
  GLOW_OUT: 120,     // Glow fade-out at end of hold
  EXIT: 900,         // Exit animation duration
  DESATURATE: 900,   // Desaturation during exit
} as const;

// Total cycle time per token
const CYCLE_TIME = TIMING.ENTER + TIMING.HOLD + TIMING.EXIT;

type AnimationPhase = 'enter' | 'hold-glow-in' | 'hold' | 'hold-glow-out' | 'exit' | 'idle';

export const HeroAnimation = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [bgDim, setBgDim] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  
  const currentToken = TOKENS[currentIndex];

  useEffect(() => {
    // Start the animation cycle
    const runCycle = () => {
      // Enter phase
      setPhase('enter');
      
      // After enter, start glow-in (beginning of hold)
      timeoutRef.current = window.setTimeout(() => {
        setPhase('hold-glow-in');
        
        // After glow-in, maintain hold
        timeoutRef.current = window.setTimeout(() => {
          setPhase('hold');
          
          // Before hold ends, start glow-out
          timeoutRef.current = window.setTimeout(() => {
            setPhase('hold-glow-out');
            
            // After glow-out, start exit
            timeoutRef.current = window.setTimeout(() => {
              setPhase('exit');
              setBgDim(true); // Dim background during exit
              
              // After exit completes, move to next token
              timeoutRef.current = window.setTimeout(() => {
                setPhase('idle');
                setBgDim(false);
                setCurrentIndex((prev) => (prev + 1) % TOKENS.length);
              }, TIMING.EXIT);
            }, TIMING.GLOW_OUT);
          }, TIMING.HOLD - TIMING.GLOW_IN - TIMING.GLOW_OUT);
        }, TIMING.GLOW_IN);
      }, TIMING.ENTER);
    };

    // Start first cycle after a brief delay
    const initialDelay = window.setTimeout(runCycle, 300);

    return () => {
      window.clearTimeout(initialDelay);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex]);

  const getTagClassName = () => {
    const baseClasses = "tag";
    
    switch (phase) {
      case 'enter':
        return `${baseClasses} tag--entering`;
      case 'hold-glow-in':
        return `${baseClasses} tag--active tag--glow-in`;
      case 'hold':
        return `${baseClasses} tag--active tag--glowing`;
      case 'hold-glow-out':
        return `${baseClasses} tag--active tag--glow-out`;
      case 'exit':
        return `${baseClasses} tag--exiting`;
      default:
        return `${baseClasses} tag--idle`;
    }
  };

  return (
    <div className="hero-grid-wrap">
      {/* Static grid background - user will provide grid-perspective.png */}
      <div 
        className="grid-bg"
        style={{
          opacity: bgDim ? 0.9 : 1,
          transition: 'opacity 0.6s ease-in-out'
        }}
      />
      
      {/* Tag animation stage */}
      <div className="tag-stage">
        <div 
          className={getTagClassName()}
          aria-live="polite"
          aria-atomic="true"
        >
          {currentToken}
        </div>
      </div>

      {/* Accessible list for screen readers */}
      <div className="sr-only" aria-live="polite">
        Current focus: {currentToken}
      </div>

      <style>{`
        /* Container */
        .hero-grid-wrap {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
        }

        /* Static background grid - fixed, not animated */
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image: url('/grid-perspective.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          will-change: opacity;
        }

        /* Centered animation stage */
        .tag-stage {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        /* Tag styling - pill shape */
        .tag {
          position: relative;
          padding: 10px 18px;
          border-radius: 10px;
          background-color: rgba(0, 123, 167, 0.25);
          color: #022028;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 18px;
          font-weight: 500;
          letter-spacing: -0.01em;
          white-space: nowrap;
          will-change: transform, opacity;
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* Animation states */
        .tag--idle {
          opacity: 0;
          transform: translateY(30px);
        }

        .tag--entering {
          animation: tag-enter ${TIMING.ENTER}ms cubic-bezier(0, 0, 0.2, 1) forwards;
        }

        .tag--active {
          opacity: 1;
          transform: translateY(0);
        }

        .tag--glow-in {
          animation: tag-glow-in ${TIMING.GLOW_IN}ms ease-out forwards;
        }

        .tag--glowing {
          filter: brightness(1.25) saturate(1.1);
          box-shadow: 0 12px 30px rgba(0, 123, 167, 0.2);
          transform: scale(1.03);
        }

        .tag--glow-out {
          animation: tag-glow-out ${TIMING.GLOW_OUT}ms ease-in forwards;
        }

        .tag--exiting {
          animation: tag-exit ${TIMING.EXIT}ms cubic-bezier(0.4, 0, 1, 1) forwards;
          filter: saturate(0.95);
        }

        /* Tablet adjustments */
        @media (max-width: 768px) {
          .tag {
            font-size: 16px;
            padding: 9px 16px;
          }
        }

        /* Mobile adjustments */
        @media (max-width: 480px) {
          .hero-grid-wrap {
            min-height: 500px;
          }

          .tag {
            font-size: 14px;
            padding: 8px 14px;
            transform: scale(0.85);
          }

          .tag--idle {
            transform: translateY(18px) scale(0.85);
          }
        }

        /* Reduced motion - crossfade only */
        @media (prefers-reduced-motion: reduce) {
          .tag--entering,
          .tag--exiting,
          .tag--glow-in,
          .tag--glow-out {
            animation: none !important;
          }

          .tag--entering {
            opacity: 1;
            transform: none;
          }

          .tag--exiting {
            opacity: 0;
            transform: none;
            transition: opacity 0.3s ease-in-out;
          }

          .tag--glowing,
          .tag--active {
            filter: none !important;
            box-shadow: none !important;
            transform: none !important;
          }
        }

        /* Screen reader only */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </div>
  );
};
