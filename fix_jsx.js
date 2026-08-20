const fs = require('fs');
let c = fs.readFileSync('src/app/join/page.tsx', 'utf8');

c = c.replace(/className=\{\\`/g, "className={`");
c = c.replace(/transition-all\\`\}/g, "transition-all`}");
c = c.replace(/\\\$/g, "$");

fs.writeFileSync('src/app/join/page.tsx', c);
console.log('done');
