const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// 1. Fix the "popping every second" animation bug by using a class flag
const oldEffect = `    useEffect(() => {
      if (step !== 'game') return;
      if (timeLeft <= 4 && timeLeft > 0 && gameStatus === 'playing') {
        gsap.fromTo(mascotRef.current, { x: -20, opacity: 0, scale: 0.8 }, { x: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)', visibility: 'visible', overwrite: true });
      } else {
        gsap.to(mascotRef.current, { x: -20, opacity: 0, scale: 0.8, duration: 0.3, ease: 'back.in(1.5)', overwrite: true, onComplete: () => {
          if (mascotRef.current) mascotRef.current.style.visibility = 'hidden';
        }});
      }
    }, [timeLeft, gameStatus, step]);`;

const newEffect = `    useEffect(() => {
      if (step !== 'game') return;
      if (timeLeft <= 4 && timeLeft > 0 && gameStatus === 'playing') {
        if (!mascotRef.current?.classList.contains('is-showing')) {
          mascotRef.current?.classList.add('is-showing');
          gsap.fromTo(mascotRef.current, { y: -20, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)', visibility: 'visible', overwrite: true });
        }
      } else {
        if (mascotRef.current?.classList.contains('is-showing')) {
          mascotRef.current?.classList.remove('is-showing');
          gsap.to(mascotRef.current, { y: -20, opacity: 0, scale: 0.8, duration: 0.3, ease: 'back.in(1.5)', overwrite: true, onComplete: () => {
            if (mascotRef.current) mascotRef.current.style.visibility = 'hidden';
          }});
        }
      }
    }, [timeLeft, gameStatus, step]);`;

code = code.replace(oldEffect, newEffect);

// 2. Move the speech bubble to the far right, under the Score/Exit area
const oldBubble = `{/* Mascot GSAP Speech Bubble attached to timer */}
                      <div 
                        ref={mascotRef}
                        className="absolute top-0 bottom-0 my-auto left-[calc(100%+24px)] h-fit z-50 opacity-0 invisible"
                      >
                        {/* Brutalist Speech Bubble Triangle Pointing Left */}
                        <div className="absolute top-0 bottom-0 my-auto -left-4 w-0 h-0 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-r-[16px] border-r-black"></div>
                        <div className="absolute top-0 bottom-0 my-auto -left-3 w-0 h-0 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-r-[16px] border-r-[#f4f0e6] z-10"></div>
                        
                        <div className="bg-[#f4f0e6] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-4 flex flex-col items-center justify-center min-w-[240px] rounded-none relative z-0">
                          <img src={\`\${NOTO_BASE}/1f47d/512.webp\`} className="w-16 h-16 drop-shadow-md mb-2 animate-[bounce_1s_infinite]" alt="Mascot" />
                          <div className="font-black text-red-600 text-lg uppercase tracking-widest text-center leading-tight">Hurry Up Twin!</div>
                          <div className="text-black font-black uppercase tracking-wider text-sm mt-1 text-center">Time is ticking...</div>
                        </div>
                      </div>`;

// Delete the old bubble from inside the Timer relative div
code = code.replace(oldBubble, "");

// Append the new bubble inside the header, right after the end of the top-right controls
const newBubble = `
              {/* Mascot GSAP Speech Bubble dropping from top right */}
              <div 
                ref={mascotRef}
                className="absolute top-[120%] right-8 z-50 opacity-0 invisible origin-top-right"
              >
                {/* Brutalist Speech Bubble Triangle Pointing Up */}
                <div className="absolute -top-4 right-[50px] w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[16px] border-b-black"></div>
                <div className="absolute -top-3 right-[50px] w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[16px] border-b-[#f4f0e6] z-10"></div>
                
                <div className="bg-[#f4f0e6] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-4 flex flex-col items-center justify-center min-w-[240px] rounded-none relative z-0">
                  <img src={\`\${NOTO_BASE}/1f47d/512.webp\`} className="w-16 h-16 drop-shadow-md mb-2 animate-[bounce_1s_infinite]" alt="Mascot" />
                  <div className="font-black text-red-600 text-lg uppercase tracking-widest text-center leading-tight">Hurry Up Twin!</div>
                  <div className="text-black font-black uppercase tracking-wider text-sm mt-1 text-center">Time is ticking...</div>
                </div>
              </div>
            </header>`;

code = code.replace('            </header>', newBubble);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed animation loop and repositioned bubble under header!');
