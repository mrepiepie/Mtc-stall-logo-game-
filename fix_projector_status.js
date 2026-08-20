const fs = require('fs');
let c = fs.readFileSync('src/components/ProjectorView.tsx', 'utf8');

c = c.replace(
  "onEndGame: () => void",
  "onEndGame: () => void,\n  onCountdownComplete: () => void"
);

const oldCountdownLogic = `        // Transition to playing!
        fetch('/api/games/set_status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: game.gamePin, status: 'playing' })
        });`;

c = c.replace(oldCountdownLogic, "        onCountdownComplete();");

fs.writeFileSync('src/components/ProjectorView.tsx', c);
console.log('done');
