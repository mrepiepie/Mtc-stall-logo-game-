const fs = require('fs');
let c = fs.readFileSync('src/app/api/games/join/route.ts', 'utf8');
c = c.replace("|| ''", "|| '?'");
fs.writeFileSync('src/app/api/games/join/route.ts', c);
console.log('done');
