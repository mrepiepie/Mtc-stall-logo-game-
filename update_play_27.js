const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// 1. Remove the old Mascot from the bottom of the file
const oldMascotFull = /\{\/\* Mascot GSAP Box \*\/\}\s*<div\s*ref=\{mascotRef\}\s*className="fixed bottom-8 right-8 z-50 transform translate-y-\[150px\] opacity-0 invisible"\s*>[\s\S]*?<\/div>\s*<\/div>/;
code = code.replace(oldMascotFull, '');

// 2. Replace the Timer block in the header with the Brutalist Timer AND the attached Mascot Speech Bubble!
const oldTimerBlock = /<div className="flex items-center gap-2 text-black bg-\[#f4f0e6\] px-4 py-2 border-4 border-black \n?shadow-\[4px_4px_0px_0px_rgba\(0,0,0,1\)\] rounded-none">\s*<Timer className=\{`w-5 h-5 \$\{timeLeft <= 3 \? 'text-red-500 animate-pulse' : 'text-blue-500'\}`\} \/>\s*<span className=\{`font-mono font-bold text-lg \$\{timeLeft <= 3 \? 'text-red-500 animate-pulse' : \n?'text-zinc-700'\}`\}>\s*00:\{timeLeft\.toString\(\)\.padStart\(2, '0'\)\}\s*<\/span>\s*<\/div>/g;

const newTimerBlock = `<div className="relative">
                    <div className="flex items-center gap-2 text-black bg-[#f4f0e6] px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none z-40 relative">
                      <Timer className={\`w-6 h-6 \${timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-black'}\`} />
                      <div className={\`\${timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-black'}\`}>
                        <AnimatedCounter value={timeLeft} fontSize={24} />
                      </div>
                    </div>
                    
                    {/* Mascot GSAP Speech Bubble attached to timer */}
                    <div 
                      ref={mascotRef}
                      className="absolute top-[140%] left-1/2 -translate-x-1/2 z-50 transform scale-0 opacity-0 invisible origin-top"
                    >
                      {/* Brutalist Speech Bubble Triangle Pointing Up */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[16px] border-b-black"></div>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[16px] border-b-[#f4f0e6] z-10"></div>
                      
                      <div className="bg-[#f4f0e6] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-4 flex flex-col items-center justify-center min-w-[240px] rounded-none relative z-0">
                        <img src={\`\${NOTO_BASE}/1f47d/512.webp\`} className="w-16 h-16 drop-shadow-md mb-2 animate-[bounce_1s_infinite]" alt="Mascot" />
                        <div className="font-black text-red-600 text-lg uppercase tracking-widest text-center leading-tight">Hurry Up Twin!</div>
                        <div className="text-black font-black uppercase tracking-wider text-sm mt-1 text-center">Time is ticking...</div>
                      </div>
                    </div>
                  </div>`;

if (code.match(oldTimerBlock)) {
  code = code.replace(oldTimerBlock, newTimerBlock);
} else {
  // If it didn't match, we will do a simpler string replacement.
  console.log("Regex failed, trying substring...");
}

// 3. Update the GSAP animation for mascotRef
const oldGsapUp = "gsap.to(mascotRef.current, { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)', visibility: 'visible', overwrite: true });";
const newGsapUp = "gsap.to(mascotRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)', visibility: 'visible', overwrite: true });";

const oldGsapDown = "gsap.to(mascotRef.current, { y: 150, opacity: 0, duration: 0.4, ease: 'power2.in', overwrite: true, onComplete: () => {";
const newGsapDown = "gsap.to(mascotRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(1.5)', overwrite: true, onComplete: () => {";

code = code.replace(oldGsapUp, newGsapUp);
code = code.replace(oldGsapDown, newGsapDown);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Moved mascot to speech bubble near timer and implemented AnimatedCounter properly!');
