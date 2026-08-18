const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const oldMascotEffect = `if (timeLeft <= 4 && gameStatus === 'playing') {
        gsap.to(mascotRef.current, { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)', visibility: 'visible' });
      } else {`;
const newMascotEffect = `if (timeLeft <= 4 && timeLeft > 0 && gameStatus === 'playing') {
        gsap.to(mascotRef.current, { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)', visibility: 'visible', overwrite: true });
      } else {
        gsap.to(mascotRef.current, { y: 150, opacity: 0, duration: 0.4, ease: 'power2.in', overwrite: true, onComplete: () => {`;

code = code.replace(oldMascotEffect, newMascotEffect);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed mascot flickering logic!');
