const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// Completely remove the grayscale GSAP animation from handleTimeOut
code = code.replace(/gsap\.to\('\.logo-container canvas', \{ filter: 'grayscale\(100%\) opacity\(50%\)', duration: 0\.5 \}\);/g, '// No grayscale filter wanted');

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Removed grayscale entirely');
