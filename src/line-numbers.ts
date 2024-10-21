const LineNumbers = document.querySelector('.line-numbers');

if (!LineNumbers) {
	throw new Error("Class line-numbers don't exist");
}

LineNumbers.innerHTML = Array(32).fill('<span></span>').join('');
