const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// 1. Update the timer useEffect
const oldEffect = `      const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timerId);
  }, [timeLeft, gameStatus, step]);`;

const newEffect = `      const timerId = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setPixelSize(prev => Math.max(1, prev - 3));
      }, 1000);
      return () => clearInterval(timerId);
  }, [timeLeft, gameStatus, step]);`;

code = code.replace(oldEffect, newEffect);

// 2. Remove the Hint button HTML block
// We will regex match the button block.
const hintButtonRegex = /<button\s+type="button"\s+onClick=\{handleHint\}[\s\S]*?<\/button>/;
code = code.replace(hintButtonRegex, '');

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Added auto-depixelate and removed hint button!');
