const fs = require('fs');
let c = fs.readFileSync('src/app/join/page.tsx', 'utf8');

const targetForm = `<form onSubmit={submitGuess} className="w-full flex flex-col gap-4">
                <input 
                  type="text" 
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder={timeLeft <= 0 ? "TIME IS UP!" : "TYPE YOUR ANSWER..."}
                  className="w-full bg-white border-4 border-black p-5 text-2xl font-black text-black placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-red-500/20 rounded-none uppercase tracking-widest transition-all text-center"
                  required
                  autoFocus
                  disabled={isSubmitting || timeLeft <= 0}
                />`;

const replacedForm = `<form onSubmit={submitGuess} className="w-full flex flex-col gap-4 relative">
                {formats[round - 1] && (
                  <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-2">
                    {formats[round - 1].split('').map((char, i) => {
                      if (char === ' ') {
                        return <div key={i} className="w-4"></div>;
                      }
                      
                      // Count non-space characters before this index to map the guess correctly
                      // (assuming user might not type spaces)
                      const expectedNoSpaces = formats[round - 1].replace(/ /g, '');
                      let nonSpaceIdx = 0;
                      for(let j = 0; j < i; j++) {
                        if (formats[round - 1][j] !== ' ') nonSpaceIdx++;
                      }
                      
                      const rawGuess = guess.replace(/ /g, '');
                      const guessChar = rawGuess[nonSpaceIdx] || '';
                      const isFilled = guessChar !== '';
                      
                      return (
                        <div key={i} className={\`w-8 h-10 md:w-10 md:h-12 border-b-4 flex items-center justify-center font-black text-2xl uppercase transition-all duration-150 \${isFilled ? 'border-red-600 text-red-600 -translate-y-1' : 'border-black text-black'}\`}>
                          {guessChar}
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="relative">
                  <input 
                    type="text" 
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder={timeLeft <= 0 ? "TIME IS UP!" : "TYPE YOUR ANSWER..."}
                    className={\`w-full bg-white border-4 border-black p-5 text-2xl font-black placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-red-500/20 rounded-none uppercase tracking-widest transition-all text-center \${formats[round - 1] ? 'text-transparent caret-black absolute inset-0 opacity-0 z-10 cursor-text' : 'text-black'}\`}
                    required
                    autoFocus
                    disabled={isSubmitting || timeLeft <= 0}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  {formats[round - 1] && (
                    <div className="w-full bg-white border-4 border-black p-5 text-2xl font-black text-transparent opacity-50 text-center uppercase tracking-widest">
                      {formats[round - 1]}
                    </div>
                  )}
                </div>`;

c = c.replace(targetForm, replacedForm);
fs.writeFileSync('src/app/join/page.tsx', c);
console.log('done');
