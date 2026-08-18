const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

code = code.replace(
  /<h2 className="text-5xl font-black uppercase tracking-tighter mb-4 text-black">\s*System Ready\s*<\/h2>/g,
  '<h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-4 text-black">\n                {readyTitle}\n              </h2>'
);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed hardcoded System Ready!');
