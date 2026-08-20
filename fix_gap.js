const fs = require('fs');

let c = fs.readFileSync('src/components/ProjectorView.tsx', 'utf8');
c = c.replace(/min-h-\[calc\(100vh-6rem\)\]/g, 'min-h-screen');
fs.writeFileSync('src/components/ProjectorView.tsx', c);

console.log('done');
