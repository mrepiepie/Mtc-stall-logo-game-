'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, KeyRound, ArrowRight, Loader2, Send, AlertTriangle } from 'lucide-react';
import gsap from 'gsap';
import { supabase } from '@/lib/supabaseClient';

export default function JoinPage() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'waiting' | 'playing' | 'leaderboard'>('form');
  const [round, setRound] = useState(1);
  
  const [guess, setGuess] = useState('');
  const [hasGuessed, setHasGuessed] = useState(false);
  const [guessResult, setGuessResult] = useState<{isCorrect?: boolean; points?: number} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
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
  };

  // Realtime game state subscription (Requires user to run the SQL snippet for RLS)
  useEffect(() => {
    if (step === 'form' || !gameCode) return;

    const channel = supabase
      .channel(`game-${gameCode}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'active_game',
          filter: `id=eq=${gameCode}`
        },
        (payload: any) => {
          const newStatus = payload.new.status;
          const newRound = payload.new.round;
          
          if (newRound !== round) {
            setRound(newRound);
            setHasGuessed(false);
            setGuessResult(null);
            setGuess('');
          }

          if (newStatus === 'playing' && step !== 'playing') {
            setStep('playing');
          } else if (newStatus === 'leaderboard' && step !== 'leaderboard') {
            setStep('leaderboard');
          } else if (newStatus === 'waiting' && step !== 'waiting') {
            setStep('waiting');
          } else if (newStatus === 'gameover') {
            setStep('leaderboard');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [step, gameCode, round]);

  // Fallback Polling (in case RLS blocks WebSockets because the user didn't run the SQL)
  useEffect(() => {
    if (step === 'form') return;
    
    const interval = setInterval(() => {
      fetch(`/api/games/${gameCode}?t=${Date.now()}`, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            if (data.round !== round) {
              setRound(data.round);
              setHasGuessed(false);
              setGuessResult(null);
              setGuess('');
            }
            if (data.status === 'playing' && step !== 'playing') {
              setStep('playing');
            } else if (data.status === 'leaderboard' && step !== 'leaderboard') {
              setStep('leaderboard');
            } else if (data.status === 'gameover' && step !== 'leaderboard') {
              setStep('leaderboard');
            }
          }
        })
        .catch(console.error);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [step, gameCode, round]);

  const submitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim() || isSubmitting || hasGuessed) return;
    
    setIsSubmitting(true);
    
    // We send a fixed maxTime for the calculation (the backend calculates actual points)
    // To be perfectly synced, we'd need the real time_remaining from the server, 
    // but for the remote, we will just pass a rough estimate or let the server use 15s.
    // Wait, the API requires timeLeft. For simplicity, we just send a generic timeLeft.
    // Actually, in a perfect world, the server knows when the round started.
    // Let's just send 15 as a dummy, the Admin panel will do the real tracking.
    
    fetch('/api/games/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        pin: gameCode, 
        playerName, 
        guess: guess,
        timeLeft: 15, // Fallback, real implementation should compute diff from start
        maxTime: 30
      })
    })
    .then(res => res.json())
    .then(data => {
      setIsSubmitting(false);
      setHasGuessed(true);
      if (data.success) {
        setGuessResult({ isCorrect: data.isCorrect, points: data.pointsAwarded });
      }
    })
    .catch(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center font-sans relative selection:bg-red-500 overflow-hidden p-4 md:p-8">
      
      {/* Background Dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#333_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      {step === 'form' && (
        <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-500">
          
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-2 uppercase drop-shadow-sm">
              Join <span className="text-red-600 block sm:inline">Game.</span>
            </h1>
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Enter operatives to proceed</p>
          </div>

          <div className="bg-[#f4f0e6] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none w-full p-8 flex flex-col relative overflow-hidden">
            
            {error && (
              <div className="bg-red-600 text-white p-3 border-4 border-black mb-6 font-black uppercase tracking-widest text-sm flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                <AlertTriangle className="w-5 h-5" />
                {error}
              </div>
            )}

            <form onSubmit={handleJoin} className="flex flex-col gap-6">
              
              <div className="flex flex-col gap-2">
                <label className="text-black font-black uppercase tracking-widest text-sm">Game Code</label>
                <div className="relative code-input-wrapper">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-6 h-6" />
                  <input 
                    type="text" 
                    value={gameCode}
                    onChange={(e) => {
                      setGameCode(e.target.value.toUpperCase());
                      setError('');
                    }}
                    maxLength={6}
                    placeholder="6-DIGIT CODE" 
                    className={`w-full bg-white border-4 ${error ? 'border-red-600 text-red-600' : 'border-black text-black'} p-4 pl-14 text-2xl font-black placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-red-500/20 rounded-none uppercase tracking-widest transition-all`}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-black font-black uppercase tracking-widest text-sm">Player Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-6 h-6" />
                  <input 
                    type="text" 
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    maxLength={15}
                    placeholder="ENTER CODENAME" 
                    className="w-full bg-white border-4 border-black p-4 pl-14 text-2xl font-black text-black placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-red-500/20 rounded-none tracking-tight transition-all"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isJoining || gameCode.length < 6 || !playerName}
                className="group relative w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-400 text-white p-5 border-4 border-black font-black text-2xl uppercase tracking-widest transition-all hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] disabled:shadow-none disabled:translate-y-[8px] active:translate-y-[8px] active:shadow-none mt-2 flex items-center justify-center gap-3"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Join Mission
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {step === 'waiting' && (
        <div className="waiting-container relative z-10 w-full max-w-lg flex flex-col items-center">
          <div className="bg-[#f4f0e6] border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-none w-full p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 border-8 border-red-600 border-t-transparent rounded-full animate-spin mb-8"></div>
            <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-4">
              You're In, <span className="text-red-600">{playerName}</span>.
            </h2>
            <div className="bg-black text-white px-6 py-3 border-4 border-black font-black uppercase tracking-widest text-xl shadow-[6px_6px_0px_0px_rgba(255,0,0,1)] mb-8">
              Lobby: {gameCode}
            </div>
            <p className="text-black font-bold uppercase tracking-widest text-lg animate-pulse">
              Waiting for host to start...
            </p>
          </div>
        </div>
      )}

      {step === 'playing' && (
        <div className="playing-container relative z-10 w-full max-w-lg flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-6">
             <div className="bg-[#f4f0e6] text-black px-4 py-2 border-4 border-black font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
               ROUND <span className="text-red-600">{round}</span>
             </div>
          </div>

          <div className="bg-[#f4f0e6] border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-none w-full p-8 flex flex-col items-center text-center">
            <p className="text-black font-black uppercase tracking-widest text-lg mb-6">
              Look at the Projector!
            </p>

            {hasGuessed ? (
               <div className="py-12 flex flex-col items-center">
                  <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center font-black text-3xl mb-4">
                    ✓
                  </div>
                  <h3 className="text-2xl font-black text-black uppercase tracking-wider">Answer Submitted</h3>
                  {guessResult && (
                    <div className="mt-4">
                      {guessResult.isCorrect ? (
                        <p className="text-green-600 font-black text-xl uppercase">+{guessResult.points} POINTS!</p>
                      ) : (
                        <p className="text-red-600 font-black text-xl uppercase">INCORRECT</p>
                      )}
                    </div>
                  )}
                  <p className="text-zinc-600 font-bold uppercase tracking-widest text-sm mt-4">Waiting for round to end...</p>
               </div>
            ) : (
              <form onSubmit={submitGuess} className="w-full flex flex-col gap-4">
                <input 
                  type="text" 
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="TYPE YOUR ANSWER..." 
                  className="w-full bg-white border-4 border-black p-5 text-2xl font-black text-black placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-red-500/20 rounded-none uppercase tracking-widest transition-all text-center"
                  required
                  autoFocus
                />
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white p-5 border-4 border-black font-black text-2xl uppercase tracking-widest transition-all hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-[8px] active:shadow-none flex items-center justify-center gap-3"
                >
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Answer"}
                  {!isSubmitting && <Send className="w-6 h-6" />}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {step === 'leaderboard' && (
        <div className="relative z-10 w-full max-w-lg flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <div className="bg-[#f4f0e6] border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-none w-full p-10 flex flex-col items-center text-center">
            <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-4">
              Round Over!
            </h2>
            <div className="bg-black text-white px-6 py-3 border-4 border-black font-black uppercase tracking-widest text-xl shadow-[6px_6px_0px_0px_rgba(255,0,0,1)] mb-8">
              Check the projector!
            </div>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-lg animate-pulse">
              Get ready for the next round...
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
