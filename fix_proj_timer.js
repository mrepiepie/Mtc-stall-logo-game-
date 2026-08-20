const fs = require('fs');
let c = fs.readFileSync('src/components/ProjectorView.tsx', 'utf8');

c = c.replace(
  "setTimeout(() => {\n          onShowLeaderboard();",
  "setTimeout(() => {\n          onShowLeaderboard();"
);
c = c.replace("}, 5000);", "}, 2500);");
c = c.replace("}, 10000);", "}, 4000);");

fs.writeFileSync('src/components/ProjectorView.tsx', c);
console.log('done');
