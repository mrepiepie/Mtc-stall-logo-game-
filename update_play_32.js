const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// 1. Add background box to the Countdown's AnimatedCounter
code = code.replace(
  '<AnimatedCounter value={countdownValue} fontSize={100} />',
  '<AnimatedCounter value={countdownValue} fontSize={100} className="bg-[#f4f0e6] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] px-6 py-2" />'
);

// 2. Change Mascot bubble to point Left and sit on the Right
const oldBubble = `{/* Mascot GSAP Speech Bubble attached to timer */}
                      <div 
                        ref={mascotRef}
                        className="absolute top-[140%] left-1/2 -translate-x-1/2 z-50 opacity-0 invisible"
                      >
                        {/* Brutalist Speech Bubble Triangle Pointing Up */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[16px] border-b-black"></div>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[16px] border-b-[#f4f0e6] z-10"></div>`;

const newBubble = `{/* Mascot GSAP Speech Bubble attached to timer */}
                      <div 
                        ref={mascotRef}
                        className="absolute top-0 bottom-0 my-auto left-[calc(100%+24px)] h-fit z-50 opacity-0 invisible"
                      >
                        {/* Brutalist Speech Bubble Triangle Pointing Left */}
                        <div className="absolute top-0 bottom-0 my-auto -left-4 w-0 h-0 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-r-[16px] border-r-black"></div>
                        <div className="absolute top-0 bottom-0 my-auto -left-3 w-0 h-0 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-r-[16px] border-r-[#f4f0e6] z-10"></div>`;

code = code.replace(oldBubble, newBubble);

// 3. Change GSAP to slide in from right (x) instead of top (y)
const oldGsapUp = "gsap.fromTo(mascotRef.current, { y: -20, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)', visibility: 'visible', overwrite: true });";
const newGsapUp = "gsap.fromTo(mascotRef.current, { x: -20, opacity: 0, scale: 0.8 }, { x: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)', visibility: 'visible', overwrite: true });";

const oldGsapDown = "gsap.to(mascotRef.current, { y: -20, opacity: 0, scale: 0.8, duration: 0.3, ease: 'back.in(1.5)', overwrite: true, onComplete: () => {";
const newGsapDown = "gsap.to(mascotRef.current, { x: -20, opacity: 0, scale: 0.8, duration: 0.3, ease: 'back.in(1.5)', overwrite: true, onComplete: () => {";

code = code.replace(oldGsapUp, newGsapUp);
code = code.replace(oldGsapDown, newGsapDown);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed Bubble placement and counter box!');
