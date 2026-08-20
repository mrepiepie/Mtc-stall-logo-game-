const fs = require('fs');
let c = fs.readFileSync('src/components/ProjectorView.tsx', 'utf8');

const oldTimer = `  // Playing timer logic
  useEffect(() => {
    if (game.status !== 'playing') return;

    if (timeLeft > 0) {
      const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0 && !showAnswer) {
      setShowAnswer(true);
      
      // Show answer for 5 seconds, then transition to leaderboard
      setTimeout(() => {
        onShowLeaderboard();
        
        // Show leaderboard for 10 seconds, then next round or end game
        setTimeout(() => {
          if (game.round >= 10) {
            onEndGame();
          } else {
            onNextRound(game.round + 1);
          }
        }, 4000);

      }, 2500);
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, game.status, game.round, showAnswer]);`;

const newTimer = `  // Playing timer logic
  useEffect(() => {
    if (game.status !== 'playing') return;

    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [game.status, game.round]);

  // Handle transition when time is up
  useEffect(() => {
    if (game.status === 'playing' && timeLeft === 0 && !showAnswer) {
      setShowAnswer(true);
      setTimeout(() => {
        onShowLeaderboard();
        setTimeout(() => {
          if (game.round >= 10) {
            onEndGame();
          } else {
            onNextRound(game.round + 1);
          }
        }, 4000);
      }, 2500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, game.status, showAnswer]);`;

c = c.replace(oldTimer, newTimer);

// Also fix the countdown timer!
const oldCountdown = `  // Countdown logic
  useEffect(() => {
    if (game.status === 'countdown') {
      if (countdown > 0) {
        const timerId = setInterval(() => setCountdown(prev => prev - 1), 1000);
        return () => clearInterval(timerId);
      } else {
        onCountdownComplete();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [game.status, countdown, game.gamePin]);`;

const newCountdown = `  // Countdown logic
  useEffect(() => {
    if (game.status !== 'countdown') return;

    const timerId = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [game.status, game.round]);

  // Handle countdown complete
  useEffect(() => {
    if (game.status === 'countdown' && countdown === 0) {
      onCountdownComplete();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown, game.status]);`;

c = c.replace(oldCountdown, newCountdown);

fs.writeFileSync('src/components/ProjectorView.tsx', c);
console.log('done');
