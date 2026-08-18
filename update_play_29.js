const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// 1. Fix the class list for mascotRef
code = code.replace(
  'className="absolute top-[140%] left-1/2 -translate-x-1/2 z-50 transform scale-0 opacity-0 invisible origin-top"',
  'className="absolute top-[140%] left-1/2 -translate-x-1/2 z-50 opacity-0 invisible"'
);

// 2. Fix the GSAP animation to use y instead of scale, to prevent transform override bugs
const oldGsapUp = "gsap.to(mascotRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)', visibility: 'visible', overwrite: true });";
const newGsapUp = "gsap.fromTo(mascotRef.current, { y: -20, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)', visibility: 'visible', overwrite: true });";

const oldGsapDown = "gsap.to(mascotRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(1.5)', overwrite: true, onComplete: () => {";
const newGsapDown = "gsap.to(mascotRef.current, { y: -20, opacity: 0, scale: 0.8, duration: 0.3, ease: 'back.in(1.5)', overwrite: true, onComplete: () => {";

code = code.replace(oldGsapUp, newGsapUp);
code = code.replace(oldGsapDown, newGsapDown);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed mascot GSAP animation issue!');
