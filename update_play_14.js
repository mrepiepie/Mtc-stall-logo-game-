const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// I will find the mascot div block
const oldStr1 = '<div className="text-black font-bold uppercase tracking-wider">Time is ticking... ⏰</div>';
const newStr1 = '<div className="text-black font-bold uppercase tracking-wider flex items-center gap-2">Time is ticking... <img src={`${NOTO_BASE}/1f47d/512.webp`} className="w-8 h-8 inline-block drop-shadow-sm" alt="alien" /></div>';

if (code.includes(oldStr1)) {
  code = code.replace(oldStr1, newStr1);
} else {
  // Try regex in case of encoding issues
  code = code.replace(
    /<div className="text-black font-bold uppercase tracking-wider">Time is ticking... [^<]+<\/div>/,
    newStr1
  );
}

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Alien emoji added!');
