const fs = require('fs');
let code = fs.readFileSync('src/components/PixelatedImage.tsx', 'utf8');

code = code.replace("img.crossOrigin = 'anonymous';", "");

fs.writeFileSync('src/components/PixelatedImage.tsx', code);
console.log('done');
