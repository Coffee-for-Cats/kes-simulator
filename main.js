const input = document.getElementById("input");

let mainMemory = [];
const registers = {
  'R0': '',
  'R1': '',
  'R2': '',
  'R3': ''
}
let RC = 0;

function getAssemblyLines() {
  return input.value.split('\n');
}

async function execute() {
  mainMemory = getAssemblyLines()

  while (RC <= 31) {
    const line = mainMemory[RC];

    //
    try {
      match(line);
    } catch {
      error();
    }

    // To do:
    // Atualizar a textarea usando o mainMemory.

    console.log(`RC: ${RC} | R0: ${registers.R0} R1: ${registers.R1} R2: ${registers.R2} R3: ${registers.R3}`);
  }
}

function match(l) {
  const line = l.toUpperCase();
  
  // pega o comenado principal.
  const command = line.split(' ')[0];
  // pega todo o resto.
  const values = line.split(' ').slice(1);

  // console.log(`Command: ${command} | values: ${values}`);
  
  switch (command.toUpperCase()) {
    case 'HALT': {
      console.log("Halted!");
      RC = 32;
      break;
    }
    case 'LOAD': {
      const [reg, mem] = values;
      if ( invalidReg(reg) || invalidMem(mem) ) error();
      registers[reg] = parseInt(mainMemory[mem]);
      RC++;
      break;
    }
    case 'MOVE': {
      const [reg1, reg2] = values;
      if (invalidReg(reg1) || invalidReg(reg2)) error();
      registers[reg1] = registers[reg2];
      break;
    }
    case 'STORE': {
      const [mem, reg] = values;
      if (invalidMem(mem) || invalidReg(reg)) error();
      mainMemory[mem] = registers[reg];
      break;
    }
    default: {
      error()
    }
  }
}

function error() {
  //console.clear();
  console.error(`Problema na linha ${RC}`);
  RC = 32;
}

function invalidReg(reg) {
  return (!(reg == 'R0' || reg == 'R1' || reg == 'R2' || reg == 'R3'))
}

function invalidMem(mem) {
  return mem < 0 || mem > 31
}