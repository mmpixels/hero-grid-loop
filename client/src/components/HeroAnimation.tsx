import { useEffect, useState, useRef } from "react";

// Token list - easily customizable
const TOKENS = [
  "Structured Thinking",
  "Intuitive UX",
  "Systems-Oriented",
  "Clear Interactions",
  "Detail-Oriented",
  "Problem Solver",
];

// Animation timing constants (in milliseconds)
const TIMING = {
  ENTER: 900, // Entrance animation duration
  HOLD: 1800, // Hold at center duration
  GLOW_IN: 360, // Glow fade-in at start of hold
  GLOW_OUT: 500, // Glow fade-out at end of hold
  EXIT: 900, // Exit animation duration
  DESATURATE: 900, // Desaturation during exit
} as const;

// Total cycle time per token
const CYCLE_TIME = TIMING.ENTER + TIMING.HOLD + TIMING.EXIT;

type AnimationPhase =
  | "enter"
  | "hold-glow-in"
  | "hold"
  | "hold-glow-out"
  | "exit"
  | "idle";

export const HeroAnimation = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<AnimationPhase>("idle");
  const [bgDim, setBgDim] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const currentToken = TOKENS[currentIndex];

  useEffect(() => {
    // Start the animation cycle
    const runCycle = () => {
      // Enter phase
      setPhase("enter");

      // After enter, start glow-in (beginning of hold)
      timeoutRef.current = window.setTimeout(() => {
        setPhase("hold-glow-in");

        // After glow-in, maintain hold
        timeoutRef.current = window.setTimeout(() => {
          setPhase("hold");

          // Before hold ends, start glow-out
          timeoutRef.current = window.setTimeout(
            () => {
              setPhase("hold-glow-out");

              // After glow-out, start exit
              timeoutRef.current = window.setTimeout(() => {
                setPhase("exit");
                setBgDim(true); // Dim background during exit

                // After exit completes, move to next token
                timeoutRef.current = window.setTimeout(() => {
                  setPhase("enter");
                  setBgDim(false);
                  setCurrentIndex((prev) => (prev + 1) % TOKENS.length);
                }, TIMING.EXIT);
              }, TIMING.GLOW_OUT);
            },
            TIMING.HOLD - TIMING.GLOW_IN - TIMING.GLOW_OUT,
          );
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
      case "enter":
        return `${baseClasses} tag--entering`;
      case "hold-glow-in":
        return `${baseClasses} tag--active tag--glow-in`;
      case "hold":
        return `${baseClasses} tag--active tag--glowing`;
      case "hold-glow-out":
        return `${baseClasses} tag--active tag--glow-out`;
      case "exit":
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
          transition: "opacity 0.6s ease-in-out",
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
      {/* <div className="sr-only" aria-live="polite">
        Current focus: {currentToken}
      </div> */}

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
          background-image: url('/perspective-grid.png');
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
        /* Responsive tag base */
.tag {
  position: relative;
  /* responsive font size: min 18px, preferred 2vw, max 28px */
  font-size: clamp(20px, 2vw, 28px);
  /* padding scaled by font-size */
  padding: 0.8em 2.6em;
  border-radius: 0.625em;
  background-color: rgba(0, 123, 167, 0.25); /* stronger fill - keeps color */
  color: #282626;
  font-family: noto-sans, sans-serif;
  font-weight: 500;
  letter-spacing: -0.01em;
  white-space: nowrap;
  will-change: transform, opacity, filter, box-shadow;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  transform-origin: center center;
  /* ensure hardware acceleration path for transform */
  transform: translate3d(0,0,0);
  /* <-- ADD THIS: smooth transitions for glow/scale */
  transition:
    transform 360ms cubic-bezier(0.2, 0.85, 0.24, 1),
    box-shadow 420ms cubic-bezier(0.2, 0.85, 0.24, 1),
    filter 420ms cubic-bezier(0.2, 0.85, 0.24, 1),
    opacity 180ms ease-in-out;
}

/* Soft underlay to mask the grid and add depth */
.tag::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.02),
    rgba(0,0,0,0.04)
  ); /* subtle inner grad for depth */
  pointer-events: none;
  z-index: -1;
  box-shadow: none;
}

/* Idle / translated state uses em units so it scales */
.tag--idle {
  opacity: 0;
  transform: translate3d(0, 1.6em, 0); /* 1.6em -> scales with font-size */
}

/* Active visible state */
.tag--active {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

/* Glow animation states use keyframes defined below */
.tag--entering {
  animation: tag-enter 900ms cubic-bezier(.0,0,.2,1) forwards;
}

.tag--glow-in {
  animation: tag-glow-in 360ms cubic-bezier(0.2, 0.85, 0.24, 1) ease-out forwards;
}

.tag--glowing {
  /* stronger appearance while glowing */
  filter: brightness(1.12) saturate(1.06); /* softened a bit */
  /* box-shadow uses em so it scales with the tag */
   box-shadow:
    0 1.0em 2.4em rgba(0,123,167,0.20),
    0 0.2em 0.5em rgba(0,123,167,0.10);
  transform: scale(1.03);
}

.tag--glow-out {
  animation: tag-glow-out 500ms cubic-bezier(0.2, 0.85, 0.24, 1) ease-in forwards; /* slower fade-out */
}

.tag--exiting {
  animation: tag-exit 300ms cubic-bezier(.4,0,1,1) forwards;
  filter: saturate(0.95);
}

/* Keyframes - use em units for translation & box-shadow so they scale */
@keyframes tag-enter {
  0% {
    opacity: 0;
    transform: translate3d(0, 1.4em, 0) scale(0.96);
  }
  60% {
    opacity: 1;
    transform: translate3d(0, -0.12em, 0) scale(1.03); /* small overshoot */
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}

@keyframes tag-glow-in {
  0% {
    /* no glow */
    transform: scale(1);
    box-shadow: 0 0 0 rgba(0,123,167,0);
    filter: brightness(1) saturate(1);
  45% {
    transform: scale(1.015);
    box-shadow: 0 0.5em 1.0em rgba(0,123,167,0.10);
    filter: brightness(1.06) saturate(1.03);
  }
  80% {
    transform: scale(1.025);
    box-shadow: 0 0.85em 1.8em rgba(0,123,167,0.14);
    filter: brightness(1.10) saturate(1.04);
  }
  100% {
    transform: scale(1.03);
    box-shadow: 0 1.0em 2.4em rgba(0,123,167,0.16);
    filter: brightness(1.12) saturate(1.06);
  }
}

@keyframes tag-glow-out {
  0% {
    transform: scale(1.03);
    box-shadow: 0 1.0em 2.6em rgba(0,123,167,0.16);
    filter: brightness(1.12) saturate(1.06);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(0,123,167,0);
    filter: brightness(1) saturate(1);
  }
}

@keyframes tag-exit {
  0% {
    transform: scale(1.03);
    box-shadow: 0 1.0em 2.4em rgba(0,123,167,0.16);
    filter: brightness(1.12) saturate(1.06);
  }
  45% {
    transform: scale(1.02);
    box-shadow: 0 0.7em 1.4em rgba(0,123,167,0.10);
    filter: brightness(1.07) saturate(1.03);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(0,123,167,0);
    filter: brightness(1) saturate(1);
  }
}

/* Tablet adjustments */
@media (max-width: 768px) {
  .tag {
    /* slightly smaller on tablets via clamp will already scale,
       but reduce padding a touch if desired */
    padding: 0.55em 1em;
  }
}

/* Mobile adjustments */
@media (max-width: 480px) {
  .hero-grid-wrap {
    min-height: 500px;
  }
  .tag {
    /* clamp already shrinks to the min (14px). If you want even smaller:
       font-size: clamp(16px, 3.5vw, 20px); */
    padding: 0.8em 1.8em;
    /* avoid setting a hard transform scale here — we use em-based values above */
  }
  .tag--idle {
    transform: translate3d(0, 1em, 0); /* smaller idle offset on tiny screens */
  }
}

/* Reduced motion - prefer crossfade only */
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
    transition: opacity 0.25s ease-in-out;
  }

  .tag--glowing,
  .tag--active {
    filter: none !important;
    box-shadow: none !important;
    transform: none !important;
  }
}
      `}</style>
    </div>
  );
};
