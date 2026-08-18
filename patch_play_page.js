const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// 1. Add states for real rank and percentile
if (!code.includes('const [finalRank')) {
  code = code.replace(
    /const \[isSubmitting, setIsSubmitting\] = useState\(false\);/,
    "const [isSubmitting, setIsSubmitting] = useState(false);\n  const [finalRank, setFinalRank] = useState<number | null>(null);\n  const [finalPercentile, setFinalPercentile] = useState<number | null>(null);"
  );
}

// 2. Capture the response in fetch
const oldFetch = `      fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, email: playerEmail, score: totalScore })
      })
      .catch(console.error)
      .finally(() => {
        // Simulate a tiny bit of extra loading so the user actually sees the beautiful animation
        setTimeout(() => setIsSubmitting(false), 1500);
      });`;

const newFetch = `      fetch('/api/scores', {
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

code = code.replace(oldFetch, newFetch);

// 3. Update the UI to use the real values or fallback to fake if it's still loading/null
const oldUiPercentile = `You're better than <span className="font-black text-red-600 text-xl">{Math.min(99, Math.max(1, Math.floor(totalScore / 15) + 12))}%</span> of the participants today!`;
const newUiPercentile = `You're better than <span className="font-black text-red-600 text-xl">{finalPercentile !== null ? finalPercentile : Math.min(99, Math.max(1, Math.floor(totalScore / 15) + 12))}%</span> of the participants today!`;

const oldUiRank = `Rank: #{Math.max(1, 300 - Math.floor(totalScore / 5))}`;
const newUiRank = `Rank: #{finalRank !== null ? finalRank : Math.max(1, 300 - Math.floor(totalScore / 5))}`;

code = code.replace(oldUiPercentile, newUiPercentile);
code = code.replace(oldUiRank, newUiRank);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Play page patched with real rankings!');
