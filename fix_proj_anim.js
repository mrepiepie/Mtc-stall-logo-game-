const fs = require('fs');
let c = fs.readFileSync('src/components/ProjectorView.tsx', 'utf8');

c = c.replace(
  'div key={player.name} className="flex justify-between items-center bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"',
  'div key={player.name} className="flex justify-between items-center bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-8 fade-in duration-500 fill-mode-both" style={{ animationDelay: `${i * 150}ms` }}'
);

fs.writeFileSync('src/components/ProjectorView.tsx', c);
console.log('done');
