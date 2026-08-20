const fs = require('fs');

// --- UPDATE ADMIN PAGE ---
let adminCode = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const adminOldPoll = `  // Poll for players
  useEffect(() => {
    if (!createdGame) return;
    const interval = setInterval(() => {
      fetch(\`/api/games/\${createdGame.gamePin}\`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.players) {
            setCreatedGame(prev => prev ? { ...prev, players: data.players, status: data.status } : null);
          }
        })
        .catch(console.error);
    }, 2000);
    return () => clearInterval(interval);
  }, [createdGame?.gamePin]);`;

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

      fetch(\`/api/games/\${createdGame.gamePin}\`)
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

adminCode = adminCode.replace(adminOldPoll, adminNewPoll);
fs.writeFileSync('src/app/admin/page.tsx', adminCode);

// --- UPDATE JOIN PAGE ---
let joinCode = fs.readFileSync('src/app/join/page.tsx', 'utf8');

const joinOldPoll = `// Poll the server to see if game started
  useEffect(() => {
    if (step !== 'waiting') return;
    
    const interval = setInterval(() => {
      fetch(\`/api/games/\${gameCode}\`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.status === 'playing') {
            clearInterval(interval);
            setStep('playing');
            setTimeout(() => {
              router.push(\`/play?pin=\${gameCode}&player=\${playerName}\`);
            }, 1000);
          }
        })
        .catch(console.error);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [step, gameCode, playerName, router]);`;

const joinNewPoll = `// Poll the server to see if game started (with 10 min timeout)
  useEffect(() => {
    if (step !== 'waiting') return;
    
    let pollCount = 0;
    const MAX_POLLS = 300; // 10 minutes

    const interval = setInterval(() => {
      pollCount++;
      if (pollCount >= MAX_POLLS) {
        clearInterval(interval);
        setError('LOBBY TIMED OUT (HOST AFK)');
        setStep('enter_code');
        gsap.fromTo('.code-input-wrapper', { x: -6 }, { x: 0, duration: 0.1, yoyo: true, repeat: 4 });
        return;
      }

      fetch(\`/api/games/\${gameCode}\`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.status === 'playing') {
            clearInterval(interval);
            setStep('playing');
            setTimeout(() => {
              router.push(\`/play?pin=\${gameCode}&player=\${playerName}\`);
            }, 1000);
          }
        })
        .catch(console.error);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [step, gameCode, playerName, router]);`;

joinCode = joinCode.replace(joinOldPoll, joinNewPoll);
fs.writeFileSync('src/app/join/page.tsx', joinCode);

console.log('done');
