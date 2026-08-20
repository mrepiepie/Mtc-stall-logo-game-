const fs = require('fs');

// 1. Fix ProjectorView Pixelation Ease
let projSrc = fs.readFileSync('src/components/ProjectorView.tsx', 'utf8');
projSrc = projSrc.replace(
  'pixelSize={showAnswer ? 1 : Math.max(1, timeLeft <= 6 ? (timeLeft * 2) : 12)}',
  'pixelSize={showAnswer ? 1 : Math.max(1, timeLeft)}'
);
fs.writeFileSync('src/components/ProjectorView.tsx', projSrc);

// 2. Fix join/page.tsx formats fetching and handling
let joinSrc = fs.readFileSync('src/app/join/page.tsx', 'utf8');

const oldFallback = `  // Fallback to fetch formats if they are missing
  useEffect(() => {
    if (step === 'waiting' && formats.length === 0 && gameCode) {
      fetch(\`/api/games/\${gameCode}\`)
        .then(r => r.json())
        .then(d => {
          if (d.success && d.questions) {
            setFormats(d.questions.map((q: any) => q.answer));
          }
        })
        .catch(console.error);
    }
  }, [step, formats.length, gameCode]);`;

const newFallback = `  // Fallback to fetch formats if they are missing
  useEffect(() => {
    if (step !== 'form' && formats.length === 0 && gameCode) {
      fetch(\`/api/games/\${gameCode}\`)
        .then(r => r.json())
        .then(d => {
          if (d.success && d.questions) {
            setFormats(d.questions.map((q: any) => q.answer));
          }
        })
        .catch(console.error);
    }
  }, [step, formats.length, gameCode]);`;

joinSrc = joinSrc.replace(oldFallback, newFallback);
fs.writeFileSync('src/app/join/page.tsx', joinSrc);

console.log('done');
