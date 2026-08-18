const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// 1. Replace the in-game timer with AnimatedCounter
const oldTimer = `<span className={\`font-mono font-black text-xl \${timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-black'}\`}>
                        00:{timeLeft.toString().padStart(2, '0')}
                      </span>`;
const newTimer = `<div className={\`\${timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-black'}\`}>
                        <AnimatedCounter value={timeLeft} />
                      </div>`;

code = code.replace(oldTimer, newTimer);


// 2. Add "Return to Home" and "Percentile" to Game Over screen
const oldGameOverButtons = `<button 
                      onClick={() => router.push('/leaderboard')}
                      className="w-full bg-black hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] text-white font-black uppercase text-base py-4 px-6 rounded-none border-4 border-black transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      View Leaderboard
                      <ArrowRight className="w-4 h-4" />
                    </button>`;

const newGameOverButtons = `<div className="w-full bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 mb-6 text-center transform -rotate-1">
                      <div className="font-black text-black uppercase text-sm tracking-widest">Global Ranking</div>
                      <div className="font-bold text-black mt-1">You are better than <span className="font-black text-red-600 text-xl">{Math.min(99, Math.max(1, Math.floor(totalScore / 15) + 12))}%</span> of operatives!</div>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                      <button 
                        onClick={() => router.push('/leaderboard')}
                        className="w-full bg-black hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] text-white font-black uppercase text-base py-4 px-6 rounded-none border-4 border-black transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        View Leaderboard
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => router.push('/')}
                        className="w-full bg-white hover:bg-zinc-100 hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] text-black font-black uppercase text-base py-4 px-6 rounded-none border-4 border-black transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        Return to Base
                      </button>
                    </div>`;

code = code.replace(oldGameOverButtons, newGameOverButtons);


// 3. Add onClick to the popup "ENTER" button so they don't have to use keyboard
const oldPopupButton = `<div className="inline-flex items-center gap-3 bg-white px-8 py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none">
                <span className="text-lg font-black text-black uppercase">
                  Press <kbd className="bg-black text-white px-4 py-2 mx-2">ENTER</kbd> to begin
                </span>
              </div>`;
const newPopupButton = `<div 
                className="inline-flex items-center gap-3 bg-white px-8 py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none cursor-pointer hover:bg-zinc-100 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                onClick={() => {
                  gsap.to('.ready-popup', { 
                    scale: 0.95, opacity: 0, duration: 0.3, 
                    onComplete: () => setStep('countdown')
                  });
                }}
              >
                <span className="text-lg font-black text-black uppercase pointer-events-none">
                  Press <kbd className="bg-black text-white px-4 py-2 mx-2">ENTER</kbd> or Click to begin
                </span>
              </div>`;

code = code.replace(oldPopupButton, newPopupButton);


fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed Countdown missing issue and added Game Over features!');
