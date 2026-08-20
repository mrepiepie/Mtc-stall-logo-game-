const fs = require('fs');
let c = fs.readFileSync('src/app/join/page.tsx', 'utf8');

const oldTimer = `  // Local timer synced loosely when playing state starts
  useEffect(() => {
    if (step === 'countdown' && countdown > 0) {
      const timerId = setInterval(() => setCountdown(prev => prev - 1), 1000);
      return () => clearInterval(timerId);
    }

    if (step === 'playing' && timeLeft > 0) {
      const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timerId);
    }
  }, [step, timeLeft, countdown]);`;

const newTimer = `  // Local timer synced loosely when playing state starts
  useEffect(() => {
    if (step === 'countdown') {
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
    }

    if (step === 'playing') {
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
    }
  }, [step, round]);`;

c = c.replace(oldTimer, newTimer);

fs.writeFileSync('src/app/join/page.tsx', c);
console.log('done');
