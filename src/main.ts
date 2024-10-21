import './line-numbers';
import './buttons';

import * as InstructionSet from './instructions';
import { Executing, GetOrCrash, Reset, StopExec } from './buttons';

export let PC = 0;
export function SetPC(pc: number) {
	PC = pc;
}

export let ALU = 0;
export function SetALU(alu: number) {
	ALU = alu;
}

const Regs = {
	R0: 0,
	R1: 0,
	R2: 0,
	R3: 0,
};
export type Key = 'R0' | 'R1' | 'R2' | 'R3';
export function GetReg(key: string) {
	return Regs[key as Key];
}
export function SetReg(key: string, value: number) {
	Regs[key as Key] = value;
	return Regs[key];
}

export function Execute() {
	for (const line of LineNumbers) line.classList.remove('invalid');
	const actualLine = Lines()[PC];

	try {
		const instruction = actualLine.toUpperCase().split(' ')[0];
		const params = actualLine.split(' ');
		params.shift();
		InstructionSet[instruction.trim()](params);
		PC++;
	} catch {
		for (const line of LineNumbers) line.classList.remove('executing');
		LineNumbers[PC].classList.add('invalid');
		StopExec();
		SetPC(0);
		UpdateDisplay();
	}

	UpdateDisplay();
}

export function Lines() {
	const textarea = document.getElementById('input') as HTMLTextAreaElement;
	if (!textarea || !textarea.value) {
		throw new Error("No textarea with id 'input'.");
	}
	return textarea.value.split('\n');
}

export const LineNumbers = GetOrCrash('line-numbers').children;

export function UpdateDisplay() {
	GetOrCrash('var-placer').textContent = `
    PC: ${PC} | ALU: ${ALU} | R0:${Regs.R0} R1:${Regs.R1} R2:${Regs.R2} R3:${Regs.R3}
  `;

	for (const line of LineNumbers) line.classList.remove('executing');
	LineNumbers[PC].classList.add('executing');
}
UpdateDisplay();
