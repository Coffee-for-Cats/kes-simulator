function stepOnce() {
  if (RC > 31) RC = 0;
  step();
}

async function execute() {
  RC = 0;
  mainMemory = getAssemblyLines()

  while (RC < 31) {
    step();
  }
}

let playing = false;
const speed = document.getElementById("speed");
function play() {
  playing = !playing;
  if (RC > 31) RC = 0;
  walk();
}

const delayUpperLimit = 2000;
function walk() {
  if (!playing) return;
  mainMemory = getAssemblyLines();
  step();
  if (RC <= 31) {
    const delay = (-1 * speed.value) + delayUpperLimit;
    window.setTimeout(walk, delay)
  }
}

function reset() {
  registers.R0 = 0;
  registers.R1 = 0;
  registers.R2 = 0;
  registers.R3 = 0;

  RC = 0;
  ALU = 0;

  updateVarPlacer();
  updateExecLine();
}