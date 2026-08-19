const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// The function starts with:
//   const handleGuess = (e: React.FormEvent) => {
//     e.preventDefault();

const exactOld = \`  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameStatus !== 'playing') {\`;

const exactNew = \`  const handleGuess = (e?: React.FormEvent, explicitGuess?: string) => {
    if (e && e.preventDefault) e.preventDefault();
    const activeGuess = explicitGuess !== undefined ? explicitGuess : guess;
    if (gameStatus !== 'playing') {\`;

if (code.includes(exactOld)) {
  code = code.replace(exactOld, exactNew);
} else {
  // Try with \r\n
  const oldCRLF = "  const handleGuess = (e: React.FormEvent) => {\\r\\n    e.preventDefault();\\r\\n    if (gameStatus !== 'playing') {";
  const newCRLF = "  const handleGuess = (e?: React.FormEvent, explicitGuess?: string) => {\\r\\n    if (e && e.preventDefault) e.preventDefault();\\r\\n    const activeGuess = explicitGuess !== undefined ? explicitGuess : guess;\\r\\n    if (gameStatus !== 'playing') {";
  code = code.replace(oldCRLF, newCRLF);
}

// Now replace usages of \`guess\` INSIDE handleGuess
// Specifically:
// if (!guess.trim()) return;
// const normGuess = normalize(guess);
code = code.replace(
  'if (!guess.trim()) return;',
  'if (!activeGuess.trim()) return;'
);
code = code.replace(
  'const normGuess = normalize(guess);',
  'const normGuess = normalize(activeGuess);'
);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed precisely!');
