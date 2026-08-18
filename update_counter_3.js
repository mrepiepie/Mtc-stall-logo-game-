const fs = require('fs');
let code = fs.readFileSync('src/components/ui/animated-counter.tsx', 'utf-8');

code = code.replace(
  'className="relative w-[1ch] tabular-nums"',
  'className="relative w-[1ch] tabular-nums overflow-hidden"'
);

fs.writeFileSync('src/components/ui/animated-counter.tsx', code);
console.log('Fixed AnimatedCounter digit overflow!');
