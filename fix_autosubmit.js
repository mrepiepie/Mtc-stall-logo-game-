const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// Update handleGuess signature and usages of \`guess\` inside it
const oldHandleGuess = `  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameStatus !== 'playing') {
      if (nextTimer !== null) {
        setNextTimer(null);
        handleNext();
      }
      return;
    }
    if (!guess.trim()) return;

    setCloseGuessWarning(false);
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normGuess = normalize(guess);`;

const newHandleGuess = `  const handleGuess = (e?: React.FormEvent, explicitGuess?: string) => {
    if (e && e.preventDefault) e.preventDefault();
    
    const activeGuess = explicitGuess !== undefined ? explicitGuess : guess;
    
    if (gameStatus !== 'playing') {
      if (nextTimer !== null) {
        setNextTimer(null);
        handleNext();
      }
      return;
    }
    if (!activeGuess.trim()) return;

    setCloseGuessWarning(false);
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normGuess = normalize(activeGuess);`;

code = code.replace(oldHandleGuess, newHandleGuess);

// Update the auto-submit in onChange to pass explicitGuess
const oldOnChange = `if (val.toLowerCase().replace(/[^a-z0-9]/g, '') === normTarget) {
                            handleGuess({ preventDefault: () => {} } as any);
                          }`;
const newOnChange = `if (val.toLowerCase().replace(/[^a-z0-9]/g, '') === normTarget) {
                            handleGuess(undefined, val);
                          }`;

code = code.replace(oldOnChange, newOnChange);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed auto-submit state bug!');
