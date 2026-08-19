const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// The signature is on one line:
code = code.replace(
  'const handleGuess = (e: React.FormEvent) => {',
  'const handleGuess = (e?: React.FormEvent, explicitGuess?: string) => {'
);

code = code.replace(
  'e.preventDefault();',
  'if (e && e.preventDefault) e.preventDefault();\\n      const activeGuess = explicitGuess !== undefined ? explicitGuess : guess;'
);

fs.writeFileSync('src/app/play/page.tsx', code.replace(/\\n/g, '\n'));
console.log('Fixed handleGuess signature robustly!');
