const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

code = code.replace(/filter: 'none', opacity: 1, scale: 1/g, 'clearProps: "all"');

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed gsap filter reset');
