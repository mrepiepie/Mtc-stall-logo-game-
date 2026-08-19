const fs = require('fs');
let code = fs.readFileSync('src/data/logos.ts', 'utf-8');

code = code.replace(/path: '/g, "url: '");

fs.writeFileSync('src/data/logos.ts', code);
console.log('Fixed url prop');
