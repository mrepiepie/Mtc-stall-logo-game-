const fs = require('fs');
let code = fs.readFileSync('src/app/join/page.tsx', 'utf8');

// Replace the handleJoin method
const regexJoin = /const handleJoin = \(e: React\.FormEvent\) => \{[\s\S]*?fetch\(\`\/api\/games\/\$\{gameCode\}\`\)[\s\S]*?\}\);/;
const newJoin = `const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameCode || !playerName) {
      setError('PLEASE ENTER CODE AND NAME');
      gsap.fromTo('.code-input-wrapper', { x: -6 }, { x: 0, duration: 0.1, yoyo: true, repeat: 4 });
      return;
    }

    setError('');
    setIsJoining(true);

    fetch('/api/games/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: gameCode, playerName })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          setIsJoining(false);
          setError(data.error || 'INVALID CODE');
          gsap.fromTo('.code-input-wrapper', { x: -6 }, { x: 0, duration: 0.1, yoyo: true, repeat: 4 });
          return;
        }

        setIsJoining(false);
        setStep('waiting');
        gsap.fromTo('.waiting-container', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.2)' });
      })
      .catch(err => {
        setIsJoining(false);
        setError('NETWORK ERROR');
        gsap.fromTo('.code-input-wrapper', { x: -6 }, { x: 0, duration: 0.1, yoyo: true, repeat: 4 });
      });
  };`;

code = code.replace(regexJoin, newJoin);

// Replace the Fake timer with a polling mechanism
const regexPoll = /\/\/ Fake timer for prototyping the "Playing" state[\s\S]*?\}, \[step, router\]\);/;
const newPoll = `// Poll the server to see if game started
  useEffect(() => {
    if (step !== 'waiting') return;
    
    const interval = setInterval(() => {
      fetch(\`/api/games/\${gameCode}\`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.status === 'playing') {
            clearInterval(interval);
            setStep('playing');
            // Navigate to play screen, maybe pass pin in query params or just go there.
            // For now, since multiplayer synced state isn't strictly defined on the play page,
            // we will just route them to the game.
            setTimeout(() => {
              router.push(\`/play?pin=\${gameCode}&player=\${playerName}\`);
            }, 1000);
          }
        })
        .catch(console.error);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [step, gameCode, playerName, router]);`;

code = code.replace(regexPoll, newPoll);

fs.writeFileSync('src/app/join/page.tsx', code);
console.log('done');
