const fs = require('fs');

// Read the logos file
let code = fs.readFileSync('src/data/logos.ts', 'utf-8');

// The file exports LOGOS. It is a JS array of objects.
// Since it's TS but actually valid JS syntax for the array, we can extract it or regex it.
// Let's just use string replacement to add points.
// Find every `"name": "Something",` or `"url": "Something"` and ensure there is a points.

// Better way: evaluate it, modify it, write it back.
const dataMatch = code.match(/export const LOGOS = (\[[\s\S]*?\]);/);
if (dataMatch) {
  try {
    const logos = eval(dataMatch[1]);
    const updatedLogos = logos.map(logo => {
      // Assign random points: 50, 100, or 150
      const pointsOptions = [50, 100, 150];
      const randomPoints = pointsOptions[Math.floor(Math.random() * pointsOptions.length)];
      return {
        ...logo,
        points: logo.points || randomPoints
      };
    });
    
    const newArrayString = JSON.stringify(updatedLogos, null, 2);
    const newCode = code.replace(dataMatch[1], newArrayString);
    fs.writeFileSync('src/data/logos.ts', newCode);
    console.log('Added points to logos.ts');
  } catch (e) {
    console.error('Failed to eval:', e);
  }
} else {
  console.log('Could not find LOGOS array');
}
