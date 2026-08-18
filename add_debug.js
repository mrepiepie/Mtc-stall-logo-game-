const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// Capture error state
if (!code.includes('const [fetchError')) {
  code = code.replace(
    /const \[finalPercentile, setFinalPercentile\] = useState<number \| null>\(null\);/,
    "const [finalPercentile, setFinalPercentile] = useState<number | null>(null);\n  const [fetchError, setFetchError] = useState<string | null>(null);"
  );
}

// Update fetch to catch errors
const oldFetch = `      fetch('/api/scores', {
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

const newFetch = `      fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, email: playerEmail, score: totalScore })
      })
      .then(res => res.json().then(data => ({ status: res.status, ok: res.ok, data })))
      .then(({ status, ok, data }) => {
        if (!ok) {
          setFetchError(data.error || 'Status ' + status);
        } else {
          if (data.rank) setFinalRank(data.rank);
          if (data.percentile) setFinalPercentile(data.percentile);
          setFetchError('Success but no rank? ' + JSON.stringify(data));
        }
      })
      .catch(err => {
        console.error(err);
        setFetchError(err.message);
      })
      .finally(() => {
        setTimeout(() => setIsSubmitting(false), 1500);
      });`;

code = code.replace(oldFetch, newFetch);

// Show error in UI
const oldUi = `Global Ranking</div>`;
const newUi = `Global Ranking</div>\n{fetchError && finalRank === null && <div className="text-red-500 text-xs font-mono">{fetchError}</div>}`;
code = code.replace(oldUi, newUi);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Added debug info to UI!');
