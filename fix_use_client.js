const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

if (code.startsWith("import { ProjectorView }")) {
  code = code.replace("import { ProjectorView } from '@/components/ProjectorView';\n\"use client\";", "\"use client\";\nimport { ProjectorView } from '@/components/ProjectorView';");
}

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('done');
