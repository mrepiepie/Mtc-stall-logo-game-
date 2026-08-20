const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

if (!code.includes("import { ProjectorView }")) {
  code = `import { ProjectorView } from '@/components/ProjectorView';\n` + code;
}

const target = '  return (\n    <main className="relative min-h-screen overflow-hidden bg-[#111111] px-4 py-6 text-white sm:px-6 lg:px-10 \nlg:py-8">';
// Wait, the newlines might not match perfectly.
const regex = /  return \(\s*<main className="relative min-h-screen/m;

const insert = `  if (createdGame && createdGame.status !== 'waiting') {
    return (
      <ProjectorView 
        game={createdGame} 
        onNextRound={async (nextRound) => {
          await fetch('/api/games/update_round', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ pin: createdGame.gamePin, round: nextRound }) });
          setCreatedGame(prev => prev ? { ...prev, round: nextRound, status: 'playing' } : null);
        }}
        onEndGame={async () => {
          await fetch('/api/games/end', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ pin: createdGame.gamePin }) });
          setCreatedGame(prev => prev ? { ...prev, status: 'gameover' } : null);
        }}
      />
    );
  }

`;

code = code.replace(regex, insert + '$&');

// Also update the fetch inside the interval to grab the full game including scores!
// Wait, `fetch(\`/api/games/\${createdGame.gamePin}?t=\${Date.now()}\`)`
code = code.replace(
  'setCreatedGame(prev => prev ? { ...prev, players: data.players, status: data.status } : null);',
  'setCreatedGame(prev => prev ? { ...prev, players: data.players, status: data.status, round: data.round, scores: data.scores } : null);'
);

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('done');
