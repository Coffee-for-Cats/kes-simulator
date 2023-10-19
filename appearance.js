const lineNumbers = document.querySelector(".line-numbers");

lineNumbers.innerHTML = Array(32)
  .fill("<span></span>")
  .join('');