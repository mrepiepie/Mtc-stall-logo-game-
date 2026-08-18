const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// Replace the top header area to be brutalist
// Specifically: Target 1 of 26, Timer, Score
const oldHeaderRegex = /<div className="w-full flex justify-between items-center mb-3 text-sm font-bold text-zinc-400 uppercase tracking-widest">[\s\S]*?<\/div>\s*<\/div>/;

const newHeader = `<div className="w-full flex justify-between items-center mb-3 text-sm font-black uppercase tracking-widest">
                  <span className="bg-black text-white px-3 py-1 border-2 border-black">Target {currentIndex + 1} of {logos.length}</span>
                </div>

                {gameStatus !== 'gameover' && (
                  <div className="w-full flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 bg-[#f4f0e6] px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <Timer className={\`w-6 h-6 \${timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-black'}\`} />
                      <span className={\`font-mono font-black text-xl \${timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-black'}\`}>
                        00:{timeLeft.toString().padStart(2, '0')}
                      </span>
                    </div>
                    
                    <div className="text-base font-black text-black bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center">
                      SCORE <span className="text-red-600 ml-3 font-mono text-xl">{totalScore}</span>
                    </div>
                  </div>
                )}`;

// wait, the structure in the file is:
// <div className="w-full flex justify-between items-center mb-3 text-sm font-bold text-zinc-400 uppercase tracking-widest">
//   <span>Target {currentIndex + 1} of {logos.length}</span>
// </div>
// 
// BUT wait, in my file, the timer is OUTSIDE the `w-full flex justify-between`! Wait, let's look at `PlayPage.tsx` closely.
