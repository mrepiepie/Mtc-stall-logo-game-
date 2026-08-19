const fs = require('fs');
let code = fs.readFileSync('src/app/join/page.tsx', 'utf-8');

const oldEffect = `  // --- REALTIME WEBSOCKET TUNNEL ---
  useEffect(() => {
    if (step !== 'waiting') return;

    // Subscribe to changes on the active_game table
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'active_game',
          filter: 'id=eq=1'
        },
        (payload: any) => {
          console.log('Realtime Event Received!', payload);
          // When the admin changes status to 'playing', instantly start the game!
          if (payload.new.status === 'playing') {
            setStep('playing');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [step]);`;

const newEffect = `  // --- REALTIME WEBSOCKET TUNNEL ---
  useEffect(() => {
    // Only connect if we are in the waiting room OR actively playing
    if (step !== 'waiting' && step !== 'playing') return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'active_game',
          filter: 'id=eq=1'
        },
        (payload: any) => {
          console.log('Realtime Event Received!', payload);
          
          // 1. Start the game
          if (payload.new.status === 'playing' && payload.old.status !== 'playing') {
            setStep('playing');
          }
          
          // 2. Next Round (Reset the input box for the next logo!)
          if (payload.new.round > payload.old.round) {
            setGuess('');
            setHasGuessed(false);
          }
          
          // 3. Game Over
          if (payload.new.status === 'finished') {
            setStep('round_over');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [step]);`;

code = code.replace(oldEffect, newEffect);

fs.writeFileSync('src/app/join/page.tsx', code);
console.log('Fixed websocket lifecycle and added round logic!');
