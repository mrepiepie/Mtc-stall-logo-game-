const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// 1. Remove the hint button
const buttonUI = /<button[\s\S]*?onClick=\{handleHint\}[\s\S]*?REVEAL -20 POINTS[\s\S]*?<\/button>/;
code = code.replace(buttonUI, '');

// 2. Remove the handleHint function
const hintFunction = /const handleHint = \(\) => \{[\s\S]*?setTimeout\(\(\) => guessInputRef.current\?.focus\(\), 10\);\s*\}\s*\};/;
code = code.replace(hintFunction, '');

// 3. Change the timer back to the 5-second delay auto-depixelate
const oldTimerRegex = /const timerId = setInterval\(\(\) => setTimeLeft\(prev => prev - 1\), 1000\);/;
const newTimer = `const timerId = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 5) {
          setPixelSize(p => Math.max(1, p - 6));
        }
        return newTime;
      });
    }, 1000);`;
code = code.replace(oldTimerRegex, newTimer);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Restored 5-second auto-depixelate!');
