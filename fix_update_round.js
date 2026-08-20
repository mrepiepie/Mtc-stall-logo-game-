const fs = require('fs');
let c = fs.readFileSync('src/app/api/games/update_round/route.ts', 'utf8');
c = c.replace('status: "playing"', 'status: "countdown"');
fs.writeFileSync('src/app/api/games/update_round/route.ts', c);
