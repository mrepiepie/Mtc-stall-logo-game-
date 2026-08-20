const fs = require('fs');
let c = fs.readFileSync('src/components/ProjectorView.tsx', 'utf8');

c = c.replace(
  "}, [timeLeft, game.status, game.round, onNextRound, onShowLeaderboard, onEndGame, showAnswer]);",
  "// eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [timeLeft, game.status, game.round, showAnswer]);"
);

c = c.replace(
  "}, [game.status, countdown, game.gamePin]);",
  "// eslint-disable-next-line react-hooks/exhaustive-deps\n    }, [game.status, countdown, game.gamePin]);"
);

fs.writeFileSync('src/components/ProjectorView.tsx', c);
console.log('done');
