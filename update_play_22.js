const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

code = code.replace(
  /if \(timeLeft <= 4 && gameStatus === 'playing'\)/g,
  "if (timeLeft <= 4 && timeLeft > 0 && gameStatus === 'playing')"
);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed mascot conditionally!');
