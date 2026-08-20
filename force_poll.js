const fs = require('fs');
let code = fs.readFileSync('src/app/join/page.tsx', 'utf8');

const wsRegex = /\/\/ --- REALTIME WEBSOCKET TUNNEL ---[\s\S]*?\}, \[step, gameCode, playerName, router\]\);/;

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

      fetch(\`/api/games/\${gameCode}?t=\${Date.now()}\`, { cache: 'no-store' })
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

code = code.replace(wsRegex, joinNewPoll);

// Wait, the client-side fetch cache-busting from bust_cache.js didn't apply to WebSockets.
// Let's ensure bust_cache logic isn't messing this up.
// Actually, `joinNewPoll` has the cache busting included!

fs.writeFileSync('src/app/join/page.tsx', code);
console.log('done');
