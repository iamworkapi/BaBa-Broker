const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function twoDigitsToWords(n) {
  if (n < 20) return ONES[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return TENS[tens] + (ones ? ' ' + ONES[ones] : '');
}

function threeDigitsToWords(n) {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  let str = '';
  if (hundreds) str += ONES[hundreds] + ' Hundred';
  if (rest) str += (str ? ' ' : '') + twoDigitsToWords(rest);
  return str;
}

// Converts a whole number into words using the Indian numbering system
// (Crore / Lakh / Thousand), e.g. 4000000 -> "Forty Lakh".
export function numberToIndianWords(value) {
  let num = Math.round(Number(value) || 0);
  if (num === 0) return 'Zero';
  if (num < 0) return 'Minus ' + numberToIndianWords(-num);

  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = num;

  const parts = [];
  if (crore) parts.push(threeDigitsToWords(crore) + ' Crore');
  if (lakh) parts.push(twoDigitsToWords(lakh) + ' Lakh');
  if (thousand) parts.push(twoDigitsToWords(thousand) + ' Thousand');
  if (hundred) parts.push(threeDigitsToWords(hundred));

  return parts.join(' ');
}

// Extracts the digits from a formatted currency string (e.g. "₹ 40,00,000")
// and returns the Indian-words amount, or '' if there are no digits to convert.
export function rupeesInWords(rawValue) {
  const digits = String(rawValue ?? '').replace(/[^\d]/g, '');
  if (!digits || Number(digits) <= 0) return '';
  return `${numberToIndianWords(Number(digits))} Rupees Only`;
}
