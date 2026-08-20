const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Remove it from AdminPage
const badBlock = `  // Poll for players
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

code = code.replace(badBlock, '');

// 2. Put it in AdminDashboard
const target = `  const [gameError, setGameError] = useState("");
  const [isPinCopied, setIsPinCopied] = useState(false);`;

const newTarget = `  const [gameError, setGameError] = useState("");
  const [isPinCopied, setIsPinCopied] = useState(false);

  // Poll for players
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

code = code.replace(target, newTarget);

fs.writeFileSync('src/app/admin/page.tsx', code);
console.log('done');
