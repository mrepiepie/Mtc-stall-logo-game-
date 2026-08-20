const fs = require('fs');
let c = fs.readFileSync('src/app/join/page.tsx', 'utf8');

c = c.replace(
  "filter: 'id=eq.' + gameCode\n        }`\n        },",
  "filter: 'id=eq.' + gameCode\n        },"
);

fs.writeFileSync('src/app/join/page.tsx', c);
console.log('done');
