const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const regex = /<\\/form>\\s*<\\/div>\\s*<\\/div>\\s*\\)}/g;

// Replace only the second occurrence which is the game form
let matchCount = 0;
code = code.replace(regex, (match) => {
  matchCount++;
  if (matchCount === 2) {
    return \`<\\/form>
                    {nextTimer !== null && (
                      <div className="mt-4 flex justify-center animate-in fade-in zoom-in duration-300">
                        <button 
                          onClick={() => { setNextTimer(null); handleNext(); }}
                          className="bg-[#f4f0e6] border-4 border-black px-6 py-3 font-black text-black text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-colors cursor-pointer flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
                        >
                          <Timer className="w-5 h-5" />
                          <span>Next in {nextTimer}s</span>
                          <span className="opacity-50 mx-2">|</span>
                          <span>Press [Enter] to skip</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}\`;
  }
  return match;
});

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Added UI block');
