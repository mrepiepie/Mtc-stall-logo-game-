const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

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

code = code.replace('          </header>', newBubble);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Inserted bubble successfully!');
