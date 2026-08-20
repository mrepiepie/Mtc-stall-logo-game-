const fs = require('fs');
let c = fs.readFileSync('src/app/api/games/join/route.ts', 'utf8');

const target = `    // 2. Append player (make sure it's an array)
    const currentPlayers = Array.isArray(game.players) ? game.players : [];`;

const injection = `    // 2. Append player (make sure it's an array)
    const currentPlayers = Array.isArray(game.players) ? game.players : [];
    
    if (currentPlayers.length >= 10) {
      return NextResponse.json(
        { success: false, error: "Lobby is full (Max 10)" },
        { status: 403 }
      );
    }`;

c = c.replace(target, injection);
fs.writeFileSync('src/app/api/games/join/route.ts', c);
console.log('done');
