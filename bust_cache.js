const fs = require('fs');
let code = fs.readFileSync('src/app/api/games/[pin]/route.ts', 'utf8');

if (!code.includes('export const dynamic')) {
  code = `export const dynamic = 'force-dynamic';\n\n` + code;
}

fs.writeFileSync('src/app/api/games/[pin]/route.ts', code);
console.log('done api');

// Also update the client fetch in admin to include cache: 'no-store' just in case
let adminCode = fs.readFileSync('src/app/admin/page.tsx', 'utf8');
adminCode = adminCode.replace(
  /fetch\(\`\/api\/games\/\$\{createdGame\.gamePin\}\`\)/g,
  "fetch(`/api/games/${createdGame.gamePin}?t=${Date.now()}`, { cache: 'no-store' })"
);
fs.writeFileSync('src/app/admin/page.tsx', adminCode);
console.log('done admin');

// Also update the client fetch in join
let joinCode = fs.readFileSync('src/app/join/page.tsx', 'utf8');
joinCode = joinCode.replace(
  /fetch\(\`\/api\/games\/\$\{gameCode\}\`\)/g,
  "fetch(`/api/games/${gameCode}?t=${Date.now()}`, { cache: 'no-store' })"
);
fs.writeFileSync('src/app/join/page.tsx', joinCode);
console.log('done join');
