const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

code = code.replace(/if \(newTime <= 5\) \{/, 'if (newTime <= 6) {');

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Changed auto-depixelate trigger to 6 seconds');
