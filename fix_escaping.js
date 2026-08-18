const fs = require('fs');
let code = fs.readFileSync('src/app/join/page.tsx', 'utf-8');

// The file has literal backslashes escaping the template literal inside className.
// We need to un-escape them.
code = code.replace(/className=\{\\\`/g, 'className={`');
code = code.replace(/transition-all\\\`\}/g, 'transition-all`}');
code = code.replace(/\\\$\{error/g, '${error');

fs.writeFileSync('src/app/join/page.tsx', code);
console.log('Fixed escaping!');
