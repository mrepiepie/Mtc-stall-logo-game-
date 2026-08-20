const fs = require('fs');
let c = fs.readFileSync('src/components/ProjectorView.tsx', 'utf8');

c = c.replace(
  "className={\\`w-12 h-12",
  "className={`w-12 h-12"
);

c = c.replace(
  ": 'bg-white'}\\`}",
  ": 'bg-white'}`}"
);

fs.writeFileSync('src/components/ProjectorView.tsx', c);
console.log('done');
