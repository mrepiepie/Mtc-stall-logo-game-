const fs = require('fs');
let c = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const oldPoll = `          .then(data => {
            if (data.success && data.players) {
              setCreatedGame(prev => prev ? { ...prev, players: data.players, status: data.status, round: data.round, scores: data.scores } : null);
            }
          })`;

const newPoll = `          .then(data => {
            if (data.success && data.players) {
              setCreatedGame(prev => {
                if (!prev) return null;
                if (data.round < prev.round) return prev;
                if (data.round === prev.round && prev.status === 'countdown' && data.status === 'leaderboard') return prev;
                if (data.round === prev.round && prev.status === 'playing' && data.status === 'countdown') return prev;
                return { ...prev, players: data.players, status: data.status, round: data.round, scores: data.scores };
              });
            }
          })`;

c = c.replace(oldPoll, newPoll);
fs.writeFileSync('src/app/admin/page.tsx', c);
console.log('done');
