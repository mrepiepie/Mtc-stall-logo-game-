const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');
code = code.replace(
  'import { DeBugger } from "@/components/ui/de-bugger";',
  'import { DeBugger } from "@/components/ui/de-bugger";\nimport { AnimatedCounter } from "@/components/ui/animated-counter";'
);
fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Added AnimatedCounter import!');
