const fs = require('fs');
let code = fs.readFileSync('src/components/PixelatedImage.tsx', 'utf-8');

const oldMath = `    // Calculate scaled dimensions
    const scaledWidth = Math.ceil(width / pixelSize);
    const scaledHeight = Math.ceil(height / pixelSize);`;

const newMath = `    // Map pixelSize (1-12) to a guaranteed grid resolution.
    // If pixelSize=12, we want a very blurry 10x10 grid.
    // If pixelSize=2, we want a clear 75x75 grid.
    const blocksTarget = Math.max(8, Math.floor(150 / pixelSize));
    
    const ratio = width / height;
    let scaledWidth = blocksTarget;
    let scaledHeight = blocksTarget;
    
    if (ratio > 1) {
      scaledHeight = Math.max(4, Math.floor(blocksTarget / ratio));
    } else {
      scaledWidth = Math.max(4, Math.floor(blocksTarget * ratio));
    }`;

code = code.replace(oldMath, newMath);

fs.writeFileSync('src/components/PixelatedImage.tsx', code);
console.log('Fixed native resolution scaling!');
