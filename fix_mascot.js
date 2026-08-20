const fs = require('fs');
let c = fs.readFileSync('src/app/join/page.tsx', 'utf8');

c = c.replace(
  "if (step !== 'playing' || hasGuessed) {",
  "if (step !== 'playing' || hasGuessed || timeLeft <= 0) {"
);

fs.writeFileSync('src/app/join/page.tsx', c);
console.log('done');
