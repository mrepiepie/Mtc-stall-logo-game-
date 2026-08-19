const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// 1. Change starting pixelSize to 12
code = code.replace(/const \[pixelSize, setPixelSize\] = useState\(30\);/, 'const [pixelSize, setPixelSize] = useState(12);');

// 2. Adjust timer logic to drop by 2 instead of 6 since we start at 12
code = code.replace(/setPixelSize\(p => Math\.max\(1, p - 6\)\);/, 'setPixelSize(p => Math.max(1, p - 2));');

// 3. Make sure resetting for the next round sets it back to 12
code = code.replace(/setPixelSize\(30\);/g, 'setPixelSize(12);');

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed pixel sizes');
