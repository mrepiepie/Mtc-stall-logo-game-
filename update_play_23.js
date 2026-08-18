const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

code = code.replace(
  /gsap\.to\(mascotRef\.current, \{ y: 0, opacity: 1, duration: 0\.6, ease: 'back\.out\(1\.5\)', visibility: 'visible' \}\);/g,
  "gsap.to(mascotRef.current, { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)', visibility: 'visible', overwrite: true });"
);

code = code.replace(
  /gsap\.to\(mascotRef\.current, \{ y: 150, opacity: 0, duration: 0\.4, ease: 'power2\.in', onComplete: \(\) => \{/g,
  "gsap.to(mascotRef.current, { y: 150, opacity: 0, duration: 0.4, ease: 'power2.in', overwrite: true, onComplete: () => {"
);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed mascot overwrite true!');
