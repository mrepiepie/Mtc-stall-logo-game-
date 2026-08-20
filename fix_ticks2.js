const fs = require('fs');
let c = fs.readFileSync('src/app/join/page.tsx', 'utf8');

c = c.replace(
  "\\`game-\\${gameCode}\\`",
  "`game-${gameCode}`"
);

c = c.replace(
  "\\`id=eq.\\${gameCode}\\`",
  "`id=eq.${gameCode}`"
);

fs.writeFileSync('src/app/join/page.tsx', c);
console.log('done');
