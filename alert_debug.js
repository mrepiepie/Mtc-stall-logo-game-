const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const oldFetch = `      fetch('/api/scores', {
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

const newFetch = `      fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, email: playerEmail, score: totalScore })
      })
      .then(res => {
        if (!res.ok) throw new Error('API Status: ' + res.status);
        return res.json();
      })
      .then(data => {
        if (data.rank !== undefined) {
          setFinalRank(data.rank);
          setFinalPercentile(data.percentile);
        } else {
          alert('API returned success but no rank: ' + JSON.stringify(data));
        }
      })
      .catch(err => {
        alert('Fetch totally crashed: ' + err.message);
      })
      .finally(() => {
        setTimeout(() => setIsSubmitting(false), 1500);
      });`;

code = code.replace(oldFetch, newFetch);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Added alert debugger');
