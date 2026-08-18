const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

code = code.replace(
  /\{jokeContent\.text\}\s*<img/g,
  '<span className="text-lg sm:text-xl font-black uppercase text-black">{jokeContent.text}</span>\n                            <img'
);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed span!');
