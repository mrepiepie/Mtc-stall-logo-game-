const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// Use a regex to match the fetch block flexibly
const fetchRegex = /fetch\('\/api\/scores'[\s\S]*?\.finally\(\(\) => \{[\s\S]*?setTimeout\(\(\) => setIsSubmitting\(false\), 1500\);\s*\}\);/;

const newFetch = `fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, email: playerEmail, score: totalScore })
      })
      .then(res => res.json())
      .then(data => {
        if (data.rank) setFinalRank(data.rank);
        if (data.percentile) setFinalPercentile(data.percentile);
      })
      .catch(console.error)
      .finally(() => {
        setTimeout(() => setIsSubmitting(false), 1500);
      });`;

code = code.replace(fetchRegex, newFetch);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed fetch block permanently!');
