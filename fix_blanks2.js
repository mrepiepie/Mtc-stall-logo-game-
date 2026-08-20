const fs = require('fs');
let c = fs.readFileSync('src/app/join/page.tsx', 'utf8');

// Since we already might have replaced it, let's restore it first if needed.
// I will just use regex to replace everything between <form onSubmit={submitGuess} className="w-full flex flex-col gap-4"> and </form>
const regex = /<form onSubmit={submitGuess} className="w-full flex flex-col gap-4(?:\srelative)?">[\s\S]*?<\/form>/;

const newForm = `<form onSubmit={submitGuess} className="w-full flex flex-col gap-4 relative">
                {formats[round - 1] && (
                  <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-2 pointer-events-none">
                    {formats[round - 1].split('').map((char, i) => {
                      if (char === ' ') {
                        return <div key={i} className="w-4 md:w-6"></div>;
                      }
                      
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
                
                <input 
                  type="text" 
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder={timeLeft <= 0 ? "TIME IS UP!" : "TYPE YOUR ANSWER..."}
                  className="w-full bg-white border-4 border-black p-5 text-2xl font-black text-black placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-red-500/20 rounded-none uppercase tracking-widest transition-all text-center"
                  required
                  autoFocus
                  disabled={isSubmitting || timeLeft <= 0}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
                
                <button 
                  type="submit"
                  disabled={isSubmitting || timeLeft <= 0}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-400 text-white p-5 border-4 border-black font-black text-2xl uppercase tracking-widest transition-all hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-[8px] active:shadow-none flex items-center justify-center gap-3 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:translate-y-[2px]"
                >
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Answer"}
                  {!isSubmitting && <Send className="w-6 h-6" />}
                </button>
              </form>`;

c = c.replace(regex, newForm);
fs.writeFileSync('src/app/join/page.tsx', c);
console.log('done');
