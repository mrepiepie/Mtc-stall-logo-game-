const fs = require('fs');
let code = fs.readFileSync('src/data/logos.ts', 'utf-8');

code = code.replace("id: 'monsterenergy', name: 'monsterenergy'", "id: 'monsterenergy', name: 'monster'");

fs.writeFileSync('src/data/logos.ts', code);
console.log('Renamed monster');
