const lineNumbers = document.querySelector(".line-numbers");

lineNumbers.innerHTML = Array(32)
  .fill("<span></span>")
  .join('');

const lineNumberArray = document.getElementById("line-numbers").children;
function addErrorIndicator(RC) {
  console.log(lineNumberArray[RC]);
  lineNumberArray[RC].classList.add('invalid');
  linesWithErrors.push(RC);
}
let linesWithErrors = []

input.addEventListener('input', e => {
  linesWithErrors.forEach(line => {
    lineNumberArray[line].classList.remove('invalid');
  })
  linesWithErrors = []
})