const fs = require('fs');
let code = fs.readFileSync('src/app/join/page.tsx', 'utf8');

// Replace the WebSocket tunnel
const wsRegex = /\/\/ --- REALTIME WEBSOCKET TUNNEL ---[\s\S]*?\.subscribe\(\);[\s\S]*?return \(\) => \{[\s\S]*?supabase\.removeChannel\(channel\);[\s\S]*?\};[\s\S]*?\}, \[step\]\);/;
const newWs = `// --- REALTIME WEBSOCKET TUNNEL ---
  useEffect(() => {
    if (step !== 'waiting' || !gameCode) return;

    // Subscribe to changes on the active_game table for THIS specific PIN
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'active_game',
          filter: \`id=eq=\${gameCode}\`
        },
        (payload: any) => {
          console.log('Realtime Event Received!', payload);
          // When the admin changes status to 'playing', teleport them!
          if (payload.new.status === 'playing') {
             router.push(\`/play?pin=\${gameCode}&player=\${playerName}\`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [step, gameCode, playerName, router]);`;

code = code.replace(wsRegex, newWs);
fs.writeFileSync('src/app/join/page.tsx', code);
console.log('done');
