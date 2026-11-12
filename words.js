const wordsEl = document.getElementById("outWords");

const ones = [
  "", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen"
];

const tens = [
  "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy",
  "eighty", "ninety"
];

function below1000(n) {
  let text = "";

  if (n >= 100) {
    text += ones[Math.floor(n / 100)] + " hundred";
    n = n % 100;
    if (n > 0) text += " and ";
  }

  if (n >= 20) {
    text += tens[Math.floor(n / 10)];
    if (n % 10 > 0) text += "-" + ones[n % 10];
  } else if (n > 0) {
    text += ones[n];
  }

  return text;
}

function numberToWords(n) {
  if (n === 0) return "zero";

  const scales = ["", " thousand", " million", " billion", " trillion"];
  const original = n;
  const parts = [];
  let i = 0;

  while (n > 0) {
    const chunk = n % 1000;

    if (chunk > 0) {
      let words = below1000(chunk) + scales[i];
      if (i === 0 && chunk < 100 && original >= 1000) {
        words = "and " + words;
      }
      parts.unshift(words);
    }

    n = Math.floor(n / 1000);
    i++;
  }

  return parts.join(", ");
}

function updateWords() {
  const totalText = document.getElementById("grandTotal").textContent;
  const total = Number(totalText.replace(/[^0-9.]/g, "")) || 0;

  const naira = Math.floor(total);
  const kobo = Math.round((total - naira) * 100);

  let text = numberToWords(naira) + " naira";
  if (kobo > 0) text += " and " + numberToWords(kobo) + " kobo";
  text += " only";

  text = text.charAt(0).toUpperCase() + text.slice(1);
  wordsEl.textContent = "Amount in words: " + text;
}

document.addEventListener("input", updateWords);
document.addEventListener("click", updateWords);

updateWords();