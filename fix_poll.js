const fs = require('fs');
let c = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

c = c.replace(
  "if (!createdGame || createdGame.status !== 'waiting') return;",
  "if (!createdGame || createdGame.status === 'timed_out' || createdGame.status === 'gameover') return;"
);

// We should also increase MAX_POLLS since the game runs longer than the waiting room
c = c.replace("const MAX_POLLS = 300;", "const MAX_POLLS = 1800; // 1 hour");

fs.writeFileSync('src/app/admin/page.tsx', c);
console.log('done');
