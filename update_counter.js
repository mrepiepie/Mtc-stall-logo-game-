const fs = require('fs');
let code = fs.readFileSync('src/components/ui/animated-counter.tsx', 'utf-8');

code = code.replace(
  'className="flex space-x-3 overflow-hidden rounded-none bg-[#f4f0e6] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-1 leading-none font-black"',
  'className="flex space-x-3 overflow-hidden rounded-none bg-[#f4f0e6] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-1 leading-none font-black text-black"'
);

fs.writeFileSync('src/components/ui/animated-counter.tsx', code);
console.log('Fixed text color in AnimatedCounter!');
