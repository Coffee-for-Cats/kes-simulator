var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// src/line-numbers.ts
var LineNumbers = document.querySelector(".line-numbers");
if (!LineNumbers) {
  throw new Error("Class line-numbers don't exist");
}
LineNumbers.innerHTML = Array(32).fill("<span></span>").join("");

// src/buttons.ts
function GetOrCrash(thingID) {
  const thing = document.getElementById(thingID);
  if (!thing) {
    alert(`The id ${thingID} was not found.`);
    throw new Error(`The id ${thingID} was not found.`);
  }
  return thing;
}
function StopExec() {
  Executing = false;
}
function playLoop() {
  if (Executing) {
    Execute();
    const delay = -1 * Number.parseInt(speed.value) + delayUpperLimit;
    window.setTimeout(playLoop, delay);
  }
}
function Reset() {
  StopExec();
  SetPC(0);
  for (const line of LineNumbers2) {
    line.classList.remove("invalid");
    line.classList.remove("executing");
  }
  SetReg("R0", 0);
  SetReg("R1", 0);
  SetReg("R2", 0);
  SetReg("R3", 0);
  SetALU(0);
  UpdateDisplay();
}
var Executing = false;
var delayUpperLimit = 2000;
GetOrCrash("play_button").onclick = () => {
  if (Executing)
    StopExec();
  else {
    Executing = true;
    playLoop();
  }
};
var speed = GetOrCrash("speed");
GetOrCrash("exec_button").onclick = () => {
  StopExec();
  let running = 0;
  Executing = true;
  while (Executing) {
    if (running++ > 2000) {
      alert("Loops n\xE3o podem superar 2000 execu\xE7\xF5es! H\xE1 um loop infinito.");
      throw new Error("Tem um loop infinito ai!");
    }
    Execute();
  }
};
GetOrCrash("next_button").onclick = () => {
  StopExec();
  Execute();
};
GetOrCrash("reset_button").onclick = () => {
  Reset();
};

// src/instructions.ts
var exports_instructions = {};
__export(exports_instructions, {
  SUB: () => SUB,
  STORE: () => STORE,
  OR: () => OR,
  NOP: () => NOP,
  MOVE: () => MOVE,
  LOAD: () => LOAD,
  HALT: () => HALT,
  BZERO: () => BZERO,
  BRANCH: () => BRANCH,
  BNEG: () => BNEG,
  AND: () => AND,
  ADD: () => ADD
});
function ValidateReg(...regs) {
  for (const reg of regs) {
    if (reg[0] !== "R" || Number.parseInt(reg[1]) > 3 || Number.parseInt(reg[1]) < 0) {
      console.log("Erro na syntaxe do registrador.");
      throw new Error(`Error at line ${PC}`);
    }
  }
}
function ValidateMem(...mems) {
  for (const mem of mems) {
    if (Number.isNaN(Number.parseInt(mem)))
      throw new Error(`Error at line ${PC}`);
    if (Number.parseInt(mem) < 0 || Number.parseInt(mem) > 31) {
      console.log("Erro na syntaxe da mem\xF3ria.");
      throw new Error(`Error at line ${PC}`);
    }
  }
}
function HALT() {
  console.log("halted!");
  Reset();
  SetPC(-1);
}
function NOP() {
  console.log("noped!");
}
function LOAD([reg, mem]) {
  ValidateReg(reg);
  ValidateMem(mem);
  const content = Lines()[Number.parseInt(mem)] || "0";
  const content_int = Number.parseInt(content);
  if (Number.isNaN(content_int)) {
    throw new Error(`Error at line ${PC}`);
  }
  SetReg(reg, content_int);
}
function MOVE([reg1, reg2]) {
  ValidateReg(reg1, reg2);
  const temp = GetReg(reg1);
  SetReg(reg1, GetReg(reg2) ?? 0);
  SetReg(reg2, temp || 0);
}
function STORE([mem, reg]) {
  ValidateReg(reg);
  ValidateMem(mem);
  const tempLines = Lines();
  tempLines[Number.parseInt(mem)] = `${GetReg(reg)}`;
  GetOrCrash("input").value = tempLines.join("\n");
}
function ADD([reg1, reg2, reg3]) {
  ValidateReg(reg1, reg2, reg3);
  const sum = GetReg(reg2) + GetReg(reg3);
  if (Number.isNaN(sum))
    throw new Error(`Error at line ${PC}`);
  SetReg(reg1, sum);
  SetALU(sum);
}
function SUB([reg1, reg2, reg3]) {
  ValidateReg(reg1, reg2, reg3);
  const sub = GetReg(reg1) - GetReg(reg2);
  if (Number.isNaN(sub))
    throw new Error(`Error at line ${PC}`);
  SetReg(reg1, sub);
  SetALU(sub);
}
function AND([reg1, reg2, reg3]) {
  ValidateReg(reg1, reg2, reg3);
  const bin1 = GetReg(reg2).toString(2).padStart(16);
  const bin2 = GetReg(reg3).toString(2).padStart(16);
  let bin3 = "";
  for (let i = 0;i < bin1.length; i++) {
    bin3 += bin1[i] === "1" && bin2[i] === "1" ? "1" : "0";
  }
  const result = Number.parseInt(bin3, 2);
  SetReg(reg1, result);
  SetALU(result);
}
function OR([reg1, reg2, reg3]) {
  ValidateReg(reg1, reg2, reg3);
  const bin1 = GetReg(reg2).toString(2).padStart(16);
  const bin2 = GetReg(reg3).toString(2).padStart(16);
  let bin3 = "";
  for (let i = 0;i < bin1.length; i++) {
    bin3 += bin1[i] === "1" || bin2[i] === "1" ? "1" : "0";
  }
  const result = Number.parseInt(bin3, 2);
  SetReg(reg1, result);
  SetALU(Number.parseInt(bin3, 2));
}
function BRANCH([mem]) {
  ValidateMem(mem);
  SetPC(Number.parseInt(mem) - 1);
}
function BZERO([mem]) {
  ValidateMem(mem);
  if (ALU === 0) {
    SetPC(Number.parseInt(mem) - 1);
  }
}
function BNEG([mem]) {
  ValidateMem(mem);
  if (ALU < 0) {
    SetPC(Number.parseInt(mem) - 1);
  }
}

// src/main.ts
function SetPC(pc) {
  PC = pc;
}
function SetALU(alu) {
  ALU = alu;
}
function GetReg(key) {
  return Regs[key];
}
function SetReg(key, value) {
  Regs[key] = value;
  return Regs[key];
}
function Execute() {
  for (const line of LineNumbers2)
    line.classList.remove("invalid");
  const actualLine = Lines()[PC];
  try {
    const instruction = actualLine.toUpperCase().split(" ")[0];
    const params = actualLine.split(" ");
    params.shift();
    exports_instructions[instruction.trim()](params);
    PC++;
  } catch {
    for (const line of LineNumbers2)
      line.classList.remove("executing");
    LineNumbers2[PC].classList.add("invalid");
    StopExec();
    SetPC(0);
    UpdateDisplay();
  }
  UpdateDisplay();
}
function Lines() {
  const textarea = document.getElementById("input");
  if (!textarea || !textarea.value) {
    throw new Error("No textarea with id 'input'.");
  }
  return textarea.value.split("\n");
}
function UpdateDisplay() {
  GetOrCrash("var-placer").textContent = `
    PC: ${PC} | ALU: ${ALU} | R0:${Regs.R0} R1:${Regs.R1} R2:${Regs.R2} R3:${Regs.R3}
  `;
  for (const line of LineNumbers2)
    line.classList.remove("executing");
  LineNumbers2[PC].classList.add("executing");
}
var PC = 0;
var ALU = 0;
var Regs = {
  R0: 0,
  R1: 0,
  R2: 0,
  R3: 0
};
var LineNumbers2 = GetOrCrash("line-numbers").children;
UpdateDisplay();
export {
  UpdateDisplay,
  SetReg,
  SetPC,
  SetALU,
  PC,
  Lines,
  LineNumbers2 as LineNumbers,
  GetReg,
  Execute,
  ALU
};
