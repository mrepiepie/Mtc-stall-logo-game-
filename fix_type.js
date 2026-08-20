const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

code = code.replace(/questions: Question\[\];\r?\n\s*\};/, 'questions: Question[];\n  players?: string[];\n};');
code = code.replace(/questions: result\.questions as Question\[\],\r?\n\s*\}\);/, 'questions: result.questions as Question[],\n          players: [],\n        });');

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('done');
