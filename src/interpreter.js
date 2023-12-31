const input = document.getElementById("input");

let mainMemory = Array(32);
Object.seal(mainMemory);
const registers = {
  'R0': 0,
  'R1': 0,
  'R2': 0,
  'R3': 0
};
Object.seal(registers);
let RC = 0;
let ALU = 0;

let callstack = 0;

function step() {
  mainMemory = getAssemblyLines();

  // adiciona um marcador azul à linha sendo executada.
  updateExecLine();

  const line = mainMemory[RC];

  try {
    match(line);
  } catch {
    error();
  }

  RC++;

  // To do:
  // Atualizar a textarea usando o mainMemory.
  input.value = mainMemory
    .toString()
    .replace(/,/g, '\n')
    .toUpperCase();
  
  updateVarPlacer();
}

function getAssemblyLines() {
  return input.value.split('\n');
}

function match(l) {
  const line = l.toUpperCase();

  // pega o comenado principal.
  const command = line.split(' ')[0];
  // pega todo o resto, vulgo argumentos.
  const values = line.split(' ').slice(1);

  switch (command.toUpperCase()) {
    case 'HALT': {
      console.log("Halted!");
      RC = 31;
      break;
    }
    case 'NOP': {
      console.log("Noped!");
      break;
    }
    case 'LOAD': {
      const [reg, mem] = values;
      validadeReg(reg); validateMem(mem);
      registers[reg] = parseInt(mainMemory[mem]);
      break;
    }
    case 'MOVE': {
      const [reg1, reg2] = values;
      validadeReg(reg1, reg2);
      registers[reg1] = registers[reg2];
      break;
    }
    case 'STORE': {
      const [mem, reg] = values;
      validateMem(mem); validadeReg(reg);
      mainMemory[mem] = registers[reg];
      break;
    }
    case 'ADD': {
      const [reg1, reg2, reg3] = values;
      validadeReg(reg1, reg2, reg3);
      ALU = registers[reg2] + registers[reg3];
      registers[reg1] = ALU;
      break;
    }
    case 'SUB': {
      const [reg1, reg2, reg3] = values;
      validadeReg(reg1, reg2, reg3);
      ALU = registers[reg2] - registers[reg3];
      console.log(ALU);
      registers[reg1] = ALU;
      break;
    }
    case 'AND': {
      const [reg1, reg2, reg3] = values;
      validadeReg(reg1, reg2, reg3);
      ALU = registers[reg2] == 1 && registers[reg3] == 1;
      registers[reg1] = ALU;
      break;
    }
    case 'OR': {
      const [reg1, reg2, reg3] = values;
      validadeReg(reg1, reg2, reg3);
      ALU = registers[reg2] == 1 || registers[reg3] == 1;
      registers[reg1] = ALU;
      break;
    }
    case 'BRANCH': {
      validateRecursion();
      const [mem] = values;
      validateMem(mem);
      RC = mem - 1;
      break;
    }
    case 'BZERO': {
      validateRecursion();
      const [mem] = values;
      validateMem(mem);
      if (ALU == 0) RC = mem - 1;
      break;
    }
    case 'BNEG': {
      validateRecursion();
      const [mem] = values;
      validateMem(mem);
      if (ALU < 0) RC = mem - 1;
      break;
    }
    default: {
      error()
    }
  }
}

function error() {
  // adiciona uma marcação na linha onde há erro.
  addErrorIndicator(RC);
  throw new Error(`Problema na linha ${RC}`);
}

function validadeReg(...regs) {
  // console.log(regs);
  regs.forEach(reg => {
    if (!(reg == 'R0' || reg == 'R1' || reg == 'R2' || reg == 'R3')) {
      error()
    }
  });
}

function validateMem(...mems) {
  mems.forEach(mem => {
    if (mem < 0 || mem > 31) {
      // console.error("Endereço de memória inválido!");
      error();
    };
  })
}

function validateRecursion() {
  callstack++;
  if (callstack > 1200) {
    alert("Você criou um loop longo de mais! Programa parado.");
    callstack = 0;
    error()
  }
}