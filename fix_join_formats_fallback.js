const fs = require('fs');
let c = fs.readFileSync('src/app/join/page.tsx', 'utf8');

const target = `  // Local timer synced loosely when playing state starts`;

const injection = `  // Fallback to fetch formats if they are missing
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
  }, [step, formats.length, gameCode]);

  // Local timer synced loosely when playing state starts`;

c = c.replace(target, injection);
fs.writeFileSync('src/app/join/page.tsx', c);
console.log('done');
