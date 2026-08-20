const fs = require('fs');
let c = fs.readFileSync('src/app/api/games/[pin]/route.ts', 'utf8');
c = c.replace('select("id, status, round, logos")', 'select("id, status, round, logos, players")');
c = c.replace('logos: unknown;', 'logos: unknown;\n  players: string[];');
c = c.replace('questions: orderedQuestions,', 'questions: orderedQuestions,\n      players: game.players || [],');
fs.writeFileSync('src/app/api/games/[pin]/route.ts', c);
