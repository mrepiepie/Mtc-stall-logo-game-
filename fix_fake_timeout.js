const fs = require('fs');
let code = fs.readFileSync('src/app/join/page.tsx', 'utf-8');

// Replace the specific fake timeout block
code = code.replace(/\/\/ PROTOTYPE ONLY: Fake the host starting the game after 4 seconds[\s\S]*?\}, 4000\);/, '');

fs.writeFileSync('src/app/join/page.tsx', code);
console.log('Removed fake 4000ms timeout!');
