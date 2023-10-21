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

const speed = 800;
function startWalking() {
  if (RC > 31) RC = 0;
  walk();
}

function walk() {
  mainMemory = getAssemblyLines();
  step();
  if (RC <= 31) {
    window.setTimeout(walk, speed)
  }
}

function reset() {
  registers['R0'] = 0;
  registers['R1'] = 0;
  registers['R2'] = 0;
  registers['R3'] = 0;

  RC = 0;
  ALU = 0;

  updateVarPlacer();
  updateExecLine();
}