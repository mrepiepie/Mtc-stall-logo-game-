const fs = require('fs');
let c = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

c = c.replace(
  "setCreatedGame(prev => prev ? { ...prev, status: 'playing' } : null);",
  "setCreatedGame(prev => prev ? { ...prev, status: 'countdown' } : null);"
);

c = c.replace(
  "setCreatedGame(prev => prev ? { ...prev, round: nextRound, status: 'playing' } : null);",
  "setCreatedGame(prev => prev ? { ...prev, round: nextRound, status: 'countdown' } : null);"
);

if (!c.includes("onCountdownComplete=")) {
  c = c.replace(
    "<ProjectorView",
    `<ProjectorView 
        onCountdownComplete={async () => {
          await fetch('/api/games/set_status', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ pin: createdGame.gamePin, status: 'playing' }) });
          setCreatedGame(prev => prev ? { ...prev, status: 'playing' } : null);
        }}`
  );
}

fs.writeFileSync('src/app/admin/page.tsx', c);
console.log('done');
