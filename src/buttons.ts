import {
	Execute,
	SetPC,
	LineNumbers,
	UpdateDisplay,
	SetReg,
	SetALU,
} from './main';

export function GetOrCrash(thingID: string): HTMLInputElement {
	const thing = document.getElementById(thingID) as HTMLInputElement;
	if (!thing) {
		alert(`The id ${thingID} was not found.`);
		throw new Error(`The id ${thingID} was not found.`);
	}
	return thing;
}

export let Executing = false;
export function StopExec() {
	Executing = false;
}

// Play Button
export const delayUpperLimit = 2000;
GetOrCrash('play_button').onclick = () => {
	if (Executing) StopExec();
	else {
		Executing = true;
		playLoop();
	}
};
const speed = GetOrCrash('speed') as HTMLInputElement;
function playLoop() {
	if (Executing) {
		Execute();
		const delay = -1 * Number.parseInt(speed.value) + delayUpperLimit;
		window.setTimeout(playLoop, delay);
	}
}

// Exec Button
GetOrCrash('exec_button').onclick = () => {
	StopExec();
	let running = 0;
	Executing = true;
	while (Executing) {
		if (running++ > 2000) {
			alert('Loops não podem superar 2000 execuções! Há um loop infinito.');
			throw new Error('Tem um loop infinito ai!');
		}
		Execute();
	}
};

// Next Button
GetOrCrash('next_button').onclick = () => {
	StopExec();
	Execute();
};

// Reset Button
export function Reset() {
	StopExec();
	SetPC(0);
	for (const line of LineNumbers) {
		line.classList.remove('invalid');
		line.classList.remove('executing');
	}
	SetReg('R0', 0);
	SetReg('R1', 0);
	SetReg('R2', 0);
	SetReg('R3', 0);
	SetALU(0);
	UpdateDisplay();
}
GetOrCrash('reset_button').onclick = () => {
	Reset();
};
