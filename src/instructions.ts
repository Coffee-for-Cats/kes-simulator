import { GetOrCrash, Reset } from './buttons';
import { ALU, Lines, GetReg, SetReg, SetPC, SetALU, PC } from './main';

function ValidateReg(...regs: string[]) {
	for (const reg of regs) {
		if (
			reg[0] !== 'R' ||
			Number.parseInt(reg[1]) > 3 ||
			Number.parseInt(reg[1]) < 0
		) {
			console.log('Erro na syntaxe do registrador.');
			throw new Error(`Error at line ${PC}`);
		}
	}
}

function ValidateMem(...mems: string[]) {
	for (const mem of mems) {
		if (Number.isNaN(Number.parseInt(mem)))
			throw new Error(`Error at line ${PC}`);
		if (Number.parseInt(mem) < 0 || Number.parseInt(mem) > 31) {
			console.log('Erro na syntaxe da memória.');
			throw new Error(`Error at line ${PC}`);
		}
	}
}

// Almost Unused
export function HALT() {
	console.log('halted!');
	Reset();
	SetPC(-1);
}

export function NOP() {
	console.log('noped!');
}

export function LOAD([reg, mem]: string[]) {
	ValidateReg(reg);
	ValidateMem(mem);
	const content = Lines()[Number.parseInt(mem)] || '0';
	const content_int = Number.parseInt(content);
	if (Number.isNaN(content_int)) {
		throw new Error(`Error at line ${PC}`);
	}
	SetReg(reg, content_int);
}

export function MOVE([reg1, reg2]: string[]) {
	ValidateReg(reg1, reg2);

	const temp = GetReg(reg1);
	SetReg(reg1, GetReg(reg2) ?? 0);
	SetReg(reg2, temp || 0);
}

export function STORE([mem, reg]: string[]) {
	ValidateReg(reg);
	ValidateMem(mem);

	const tempLines = Lines();
	tempLines[Number.parseInt(mem)] = `${GetReg(reg)}`;
	GetOrCrash('input').value = tempLines.join('\n');
}

// Math operations
export function ADD([reg1, reg2, reg3]: string[]) {
	ValidateReg(reg1, reg2, reg3);

	const sum = GetReg(reg2) + GetReg(reg3);
	if (Number.isNaN(sum)) throw new Error(`Error at line ${PC}`);
	SetReg(reg1, sum);

	SetALU(sum);
}

export function SUB([reg1, reg2, reg3]: string[]) {
	ValidateReg(reg1, reg2, reg3);

	const sub = GetReg(reg1) - GetReg(reg2);
	if (Number.isNaN(sub)) throw new Error(`Error at line ${PC}`);
	// if (sub < 0) throw new Error(`Error at line ${PC}`);
	SetReg(reg1, sub);

	SetALU(sub);
}

// Bytewise operations
export function AND([reg1, reg2, reg3]: string[]) {
	ValidateReg(reg1, reg2, reg3);

	const bin1: string = GetReg(reg2).toString(2).padStart(16);
	const bin2: string = GetReg(reg3).toString(2).padStart(16);
	let bin3 = '';
	for (let i = 0; i < bin1.length; i++) {
		bin3 += bin1[i] === '1' && bin2[i] === '1' ? '1' : '0';
	}
	const result = Number.parseInt(bin3, 2);
	SetReg(reg1, result);
	SetALU(result);
}

export function OR([reg1, reg2, reg3]: string[]) {
	ValidateReg(reg1, reg2, reg3);

	const bin1: string = GetReg(reg2).toString(2).padStart(16);
	const bin2: string = GetReg(reg3).toString(2).padStart(16);
	let bin3 = '';
	for (let i = 0; i < bin1.length; i++) {
		bin3 += bin1[i] === '1' || bin2[i] === '1' ? '1' : '0';
	}
	const result = Number.parseInt(bin3, 2);
	SetReg(reg1, result);
	SetALU(Number.parseInt(bin3, 2));
}

// Control flow operations
export function BRANCH([mem]: string[]) {
	ValidateMem(mem);
	// -1 because the PC is always increased after every Execute().
	SetPC(Number.parseInt(mem) - 1);
}

export function BZERO([mem]: string[]) {
	ValidateMem(mem);
	if (ALU === 0) {
		SetPC(Number.parseInt(mem) - 1);
	}
}

export function BNEG([mem]: string[]) {
	ValidateMem(mem);
	if (ALU < 0) {
		SetPC(Number.parseInt(mem) - 1);
	}
}
