const fs = require('fs');
let c = fs.readFileSync('src/app/join/page.tsx', 'utf8');

const targetEffect = `  // Supabase realtime subscription
  useEffect(() => {
    if (!gameCode || step === 'form') return;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase
      .channel(\`game-\${gameCode}\`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'active_game',
          filter: \`id=eq.\${gameCode}\`,
        },
        (payload) => {
          const newStatus = payload.new.status;
          const newRound = payload.new.round;
          
          if (newStatus && newStatus !== step) {
            setStep(newStatus);
          }
          if (newRound && newRound !== round) {
            setRound(newRound);
            setHasGuessed(false);
            setGuess('');
            setGuessResult(null);
            setJoke(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameCode, step, round]);`;

const replacementEffect = `  // Supabase realtime subscription
  useEffect(() => {
    if (!gameCode || step === 'form') return;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase
      .channel(\`game-\${gameCode}\`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'active_game',
          filter: \`id=eq.\${gameCode}\`,
        },
        (payload) => {
          const newStatus = payload.new.status;
          const newRound = payload.new.round;
          const newPlayers = payload.new.players || [];
          
          // Check if player was kicked
          if (step === 'waiting' && !newPlayers.includes(playerName)) {
            setStep('form');
            setError('YOU WERE KICKED FROM THE LOBBY');
            setGameCode('');
            return;
          }
          
          if (newStatus && newStatus !== step) {
            setStep(newStatus);
          }
          if (newRound && newRound !== round) {
            setRound(newRound);
            setHasGuessed(false);
            setGuess('');
            setGuessResult(null);
            setJoke(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameCode, step, round, playerName]);`;

c = c.replace(targetEffect, replacementEffect);
fs.writeFileSync('src/app/join/page.tsx', c);
console.log('done');
