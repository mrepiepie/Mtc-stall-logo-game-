const fs = require('fs');
let code = fs.readFileSync('src/app/api/games/[pin]/route.ts', 'utf8');

code = code.replace('select("id, status, round, logos, players")', 'select("id, status, round, logos, players, scores")');

fs.writeFileSync('src/app/api/games/[pin]/route.ts', code);
console.log('done');
