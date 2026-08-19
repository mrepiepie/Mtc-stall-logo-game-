const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// 1. handleTimeOut
code = code.replace(
  `setTimeout(handleNext, 2000); // 2 second delay for student to read`,
  `setTimeout(handleNext, 2500); // 2.5 second delay for student to read`
);

// 2. Auto Submit
const oldOnChange = `onChange={e => { setGuess(e.target.value); setCloseGuessWarning(false); }}`;
const newOnChange = `onChange={e => {
                          const val = e.target.value;
                          setGuess(val);
                          setCloseGuessWarning(false);
                          const normTarget = currentLogo.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                          if (val.toLowerCase().replace(/[^a-z0-9]/g, '') === normTarget) {
                            handleGuess({ preventDefault: () => {} } as any);
                          }
                        }}`;
code = code.replace(oldOnChange, newOnChange);

// 3. Input Value
code = code.replace(
  `value={guess}`,
  `value={gameStatus === 'wrong' ? currentLogo.name : guess}`
);

// 4. Input ClassName
const oldClassName = `className="guess-input w-full bg-white border-4 border-black rounded-none px-6 py-4 sm:py-5 text-xl sm:text-2xl font-black text-black focus:outline-none focus:bg-yellow-50 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 text-center placeholder:text-zinc-400 placeholder:font-bold"`;
const newClassName = `className={\`guess-input w-full border-4 border-black rounded-none px-6 py-4 sm:py-5 text-xl sm:text-2xl font-black focus:outline-none focus:bg-yellow-50 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center placeholder:text-zinc-400 placeholder:font-bold \${gameStatus === 'wrong' ? 'bg-red-500 text-white opacity-100' : 'bg-white text-black disabled:opacity-50'}\`}`;
code = code.replace(oldClassName, newClassName);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed page.tsx properly');
