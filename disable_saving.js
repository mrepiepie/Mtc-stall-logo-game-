const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const oldSubmit = `    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_name: playerName, score: totalScore }),
      });
      if (res.ok) {
        const data = await res.json();
        setFinalRank(data.rank);
        setFinalPercentile(data.percentile);
      }
    } catch (err) {
      console.error(err);
    }`;

const newSubmit = `    // --- TESTING MODE: Prevent saving to Supabase ---
    console.log("Testing Mode: Score of", totalScore, "was NOT saved to Supabase!");
    setFinalRank(1);
    setFinalPercentile(99);
    
    /*
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_name: playerName, score: totalScore }),
      });
      if (res.ok) {
        const data = await res.json();
        setFinalRank(data.rank);
        setFinalPercentile(data.percentile);
      }
    } catch (err) {
      console.error(err);
    }
    */`;

code = code.replace(oldSubmit, newSubmit);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Disabled score saving for testing!');
