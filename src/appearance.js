const lineNumbers = document.querySelector(".line-numbers");

lineNumbers.innerHTML = Array(32)
  .fill("<span></span>")
  .join('');

const lineNumberArray = document.getElementById("line-numbers").children;
function addErrorIndicator(RC) {
  //console.log(lineNumberArray[RC]);
  if (RC < 31) {
    lineNumberArray[RC].classList.add('invalid');
    linesWithErrors.push(RC);
  }
}
let linesWithErrors = []
input.addEventListener('input', e => {
  linesWithErrors.forEach(line => {
    lineNumberArray[line].classList.remove('invalid');
  })
  linesWithErrors = []
})

let latestExecutedLine = 0;
function updateExecLine() {
  lineNumberArray[latestExecutedLine].classList.remove('executing');
  if (RC < 31) {
    lineNumberArray[RC].classList.add('executing');
    latestExecutedLine = RC;
  }
}

const varPlacer = document.getElementById("var-placer");

function updateVarPlacer() {
  varPlacer.innerText =
    `PC: ${RC} | ALU: ${ALU || 0} | R0: ${registers.R0 || 0} R1: ${registers.R1 || 0} R2: ${registers.R2 || 0} R3: ${registers.R3 || 0}`;
}