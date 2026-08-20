const fs = require('fs');
let c = fs.readFileSync('src/components/ProjectorView.tsx', 'utf8');

c = c.replace(
  "\\`Round \\${game.round} Leaderboard\\`",
  "`Round ${game.round} Leaderboard`"
);

fs.writeFileSync('src/components/ProjectorView.tsx', c);
console.log('done');
