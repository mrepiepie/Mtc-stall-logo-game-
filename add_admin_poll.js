const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const adminNewPoll = `  // Poll for players (with 10-minute auto-timeout to save limits)
  useEffect(() => {
    if (!createdGame || createdGame.status !== 'waiting') return;
    
    let pollCount = 0;
    const MAX_POLLS = 300; // 300 * 2s = 10 minutes

    const interval = setInterval(() => {
      pollCount++;
      if (pollCount >= MAX_POLLS) {
        clearInterval(interval);
        setCreatedGame(prev => prev ? { ...prev, status: 'timed_out' } : null);
        alert("Waiting room timed out after 10 minutes to save database requests. Please create a new game.");
        return;
      }

      fetch(\`/api/games/\${createdGame.gamePin}?t=\${Date.now()}\`, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.players) {
            setCreatedGame(prev => prev ? { ...prev, players: data.players, status: data.status } : null);
          }
        })
        .catch(console.error);
    }, 2000);
    return () => clearInterval(interval);
  }, [createdGame?.gamePin, createdGame?.status]);`;

// Insert it right before "const handleAccessSubmit ="
code = code.replace(
  '  const handleAccessSubmit =',
  adminNewPoll + '\n\n  const handleAccessSubmit ='
);

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('done');
