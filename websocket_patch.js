const fs = require('fs');
let code = fs.readFileSync('src/app/join/page.tsx', 'utf-8');

// 1. Add Supabase import
const importSection = `import { ArrowRight, Loader2, KeyRound, User, AlertTriangle, Send } from 'lucide-react';`;
const newImportSection = `import { ArrowRight, Loader2, KeyRound, User, AlertTriangle, Send } from 'lucide-react';\nimport { supabase } from '@/lib/supabaseClient';`;
code = code.replace(importSection, newImportSection);

// 2. Add WebSocket logic inside a useEffect that triggers when step is 'waiting'
const useEfxSearch = `  const submitGuess = (e: React.FormEvent) => {`;
const websocketLogic = `  // --- REALTIME WEBSOCKET TUNNEL ---
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
        (payload) => {
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
  }, [step]);\n\n  const submitGuess = (e: React.FormEvent) => {`;

code = code.replace(useEfxSearch, websocketLogic);

// 3. Remove the fake MTC123 code validation and fake setTimeout
const fakeJoinLogic = `    if (gameCode !== 'MTC123' && gameCode !== 'MARIO1') {
      setError('INVALID MISSION CODE');
      
      const el = document.querySelector('.code-input-wrapper');
      if (el) {
        gsap.to(el, { x: [-10, 10, -10, 10, 0], duration: 0.4, ease: 'power2.inOut' });
      }
      return;
    }

    setIsJoining(true);
    setTimeout(() => {
      setIsJoining(false);
      setStep('waiting');
    }, 1500);`;

const realJoinLogic = `    // Any code is accepted for now
    setIsJoining(true);
    
    // In the future, we will insert the player into a "lobby_players" table here so Deekshita can see them on the big screen!
    
    setTimeout(() => {
      setIsJoining(false);
      setStep('waiting');
    }, 800);`;

code = code.replace(fakeJoinLogic, realJoinLogic);

fs.writeFileSync('src/app/join/page.tsx', code);
console.log('Added WebSocket logic!');
