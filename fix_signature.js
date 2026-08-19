const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const oldHandle = `  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameStatus !== 'playing') {`;

const newHandle = `  const handleGuess = (e?: React.FormEvent, explicitGuess?: string) => {
    if (e && e.preventDefault) e.preventDefault();
    const activeGuess = explicitGuess !== undefined ? explicitGuess : guess;
    if (gameStatus !== 'playing') {`;

code = code.replace(oldHandle, newHandle);

const oldGuess = `const normGuess = normalize(guess);`;
const newGuess = `const normGuess = normalize(activeGuess);`;
code = code.replace(oldGuess, newGuess);

const oldTrim = `if (!guess.trim()) return;`;
const newTrim = `if (!activeGuess.trim()) return;`;
code = code.replace(oldTrim, newTrim);


fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed handleGuess signature!');
