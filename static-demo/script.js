// Tokens and timing (copied from TSX)
const TOKENS = [
  "Structured Thinking",
  "Intuitive UX",
  "Systems-Oriented",
  "Clear Interactions",
  "Detail-Oriented",
  "Problem Solver",
];

const TIMING = {
  ENTER: 900,
  HOLD: 1800,
  GLOW_IN: 360,
  GLOW_OUT: 500,
  EXIT: 900,
  DESATURATE: 900,
};

let currentIndex = 0;
let timeouts = [];

const tokenEl = document.getElementById("token");
const gridBg = document.getElementById("gridBg");

function clearTimeouts() {
  timeouts.forEach(t => clearTimeout(t));
  timeouts = [];
}

function setPhase(phase) {
  tokenEl.className = "tag";
  switch (phase) {
    case "enter":
      tokenEl.classList.add("tag--entering");
      break;
    case "hold-glow-in":
      tokenEl.classList.add("tag--active", "tag--glow-in");
      break;
    case "hold":
      tokenEl.classList.add("tag--active", "tag--glowing");
      break;
    case "hold-glow-out":
      tokenEl.classList.add("tag--active", "tag--glow-out");
      break;
    case "exit":
      tokenEl.classList.add("tag--exiting");
      break;
    default:
      tokenEl.classList.add("tag--idle");
  }
}

function runCycle() {
  clearTimeouts();
  tokenEl.textContent = TOKENS[currentIndex];

  // ENTER
  setPhase("enter");
  timeouts.push(setTimeout(() => {
    // GLOW-IN
    setPhase("hold-glow-in");
    timeouts.push(setTimeout(() => {
      // HOLD
      setPhase("hold");
      timeouts.push(setTimeout(() => {
        // GLOW-OUT
        setPhase("hold-glow-out");
        timeouts.push(setTimeout(() => {
          // EXIT
          setPhase("exit");
          gridBg.classList.add("bg-dim");

          // After exit → next token → restart cycle
          timeouts.push(setTimeout(() => {
            gridBg.classList.remove("bg-dim");
            currentIndex = (currentIndex + 1) % TOKENS.length;
            runCycle();
          }, TIMING.EXIT));

        }, TIMING.GLOW_OUT));
      }, TIMING.HOLD - TIMING.GLOW_IN - TIMING.GLOW_OUT));
    }, TIMING.GLOW_IN));
  }, TIMING.ENTER));
}

// initial delay like TSX
timeouts.push(setTimeout(runCycle, 300));

window.addEventListener("beforeunload", clearTimeouts);

