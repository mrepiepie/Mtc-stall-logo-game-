const fs = require('fs');
let c = fs.readFileSync('src/components/ProjectorView.tsx', 'utf8');

c = c.replace(
  `export function ProjectorView({ 
  game, 
  onNextRound, 
  onShowLeaderboard,
  onEndGame 
}:`,
  `export function ProjectorView({ 
  game, 
  onNextRound, 
  onShowLeaderboard,
  onEndGame,
  onCountdownComplete
}:`
);

fs.writeFileSync('src/components/ProjectorView.tsx', c);
console.log('done');
