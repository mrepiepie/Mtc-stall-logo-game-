'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, KeyRound, ArrowRight, Loader2, Send, AlertTriangle } from 'lucide-react';
import gsap from 'gsap';
import { supabase } from '@/lib/supabaseClient';
import { DeBugger } from '@/components/ui/de-bugger';
import { SoundEffects } from '@/components/SoundEffects';

const JOKES_FAST = [
  { text: "Woah that was quick.. calm down twin", emoji: "💀" },
  { text: "Bro is literally a human scanner", emoji: "🤯" },
  { text: "Are you cheating?!", emoji: "🤨" },
  { text: "Speedforce activated", emoji: "⚡" },
  { text: "Bro has 20/20 vision", emoji: "👀" },
  { text: "Unreal reaction time", emoji: "🚀" },
];
const JOKES_MID = [
  { text: "Solid pace, but I've seen faster", emoji: "🥱" },
  { text: "Not bad, but don't get cocky", emoji: "🤡" },
  { text: "Acceptable... barely.", emoji: "🙄" },
  { text: "Average behavior.", emoji: "😐" },
  { text: "You're doing okay sweetie", emoji: "💅" },
  { text: "Nothing to brag about", emoji: "🤷‍♂️" },
];
const JOKES_SLOW = [
  { text: "Fighting for your life out here", emoji: "🥵" },
  { text: "Bro was sweating bullets", emoji: "😰" },
  { text: "My grandma types faster...", emoji: "👵" },
  { text: "Did you fall asleep?", emoji: "😴" },
  { text: "Barely made it out alive", emoji: "🤕" },
  { text: "Bro is playing in slow motion", emoji: "🐌" },
];
const JOKES_FAIL = [
  { text: "Bro was literally sleeping", emoji: "😴" },
  { text: "Is your keyboard even plugged in?", emoji: "⌨️" },
  { text: "Embarrassing tbh", emoji: "🤦‍♂️" },
  { text: "You're getting cooked out here", emoji: "🍳" },
  { text: "0 points. 0 aura.", emoji: "💀" },
  { text: "My screen froze... yeah right.", emoji: "🥶" },
  { text: "HURRY UP TWIN! TIME IS TICKING...", emoji: "👽" }
];

export default function JoinPage() {
  const router = useRouter();
  const mascotRef = useRef<HTMLDivElement>(null);

  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'waiting' | 'countdown' | 'playing' | 'leaderboard'>('form');
  const [countdown, setCountdown] = useState(3);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(10);
  const [formats, setFormats] = useState<string[]>([]);
  
  const [guess, setGuess] = useState('');
  const [hasGuessed, setHasGuessed] = useState(false);
  const [guessResult, setGuessResult] = useState<{isCorrect?: boolean; points?: number} | null>(null);
  const [joke, setJoke] = useState<{text: string, emoji: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    
    const trimmedName = playerName.trim();
    const trimmedCode = gameCode.trim();

    if (!trimmedCode || !trimmedName) {
      setError('PLEASE ENTER CODE AND NAME');
      gsap.fromTo('.code-input-wrapper', { x: -6 }, { x: 0, duration: 0.1, yoyo: true, repeat: 4 });
      return;
    }

    setError('');
    setIsJoining(true);
    
    // Update local state to trimmed versions so realtime payload matches
    setPlayerName(trimmedName);
    setGameCode(trimmedCode.toUpperCase());

    fetch('/api/games/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: trimmedCode.toUpperCase(), playerName: trimmedName })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          setIsJoining(false);
          setError(data.error || 'INVALID CODE');
          gsap.fromTo('.code-input-wrapper', { x: -6 }, { x: 0, duration: 0.1, yoyo: true, repeat: 4 });
          return;
        }

        if (data.formats) setFormats(data.formats);
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

  // Auto-submit when typing correct answer
  useEffect(() => {
    if (step === 'playing' && guess && formats[round - 1] && !hasGuessed && !isSubmitting) {
      const target = formats[round - 1].replace(/ /g, '').toLowerCase();
      const current = guess.replace(/ /g, '').toLowerCase();
      if (target === current) {
        submitGuess();
      }
    }
  }, [guess, formats, round, hasGuessed, isSubmitting, step]);

  // Auto-submit when typing correct answer
  useEffect(() => {
    if (step === 'playing' && guess && formats[round - 1] && !hasGuessed && !isSubmitting) {
      const target = formats[round - 1].replace(/ /g, '').toLowerCase();
      const current = guess.replace(/ /g, '').toLowerCase();
      if (target === current) {
        submitGuess();
      }
    }
  }, [guess, formats, round, hasGuessed, isSubmitting, step]);

  // Fallback to fetch formats if they are missing
  useEffect(() => {
    if (step !== 'form' && formats.length === 0 && gameCode) {
      fetch(`/api/games/${gameCode}`)
        .then(r => r.json())
        .then(d => {
          if (d.success && d.questions) {
            setFormats(d.questions.map((q: any) => q.answer));
          }
        })
        .catch(console.error);
    }
  }, [step, formats.length, gameCode]);

  // Local timer synced loosely when playing state starts
  useEffect(() => {
    if (step === 'countdown') {
      const timerId = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerId);
    }

    if (step === 'playing') {
      const timerId = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [step, round]);

  // Mascot trigger
  useEffect(() => {
    if (step !== 'playing' || hasGuessed || timeLeft <= 0) {
      if (mascotRef.current?.classList.contains('is-showing')) {
        mascotRef.current?.classList.remove('is-showing');
        gsap.to(mascotRef.current, { y: -20, opacity: 0, scale: 0.8, duration: 0.3, ease: 'back.in(1.5)', overwrite: true, onComplete: () => {
          if (mascotRef.current) mascotRef.current.style.visibility = 'hidden';
        }});
      }
      return;
    }

    if (timeLeft <= 4 && timeLeft > 0) {
      if (!mascotRef.current?.classList.contains('is-showing')) {
        mascotRef.current?.classList.add('is-showing');
        gsap.fromTo(mascotRef.current, { y: -20, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)', visibility: 'visible', overwrite: true });
      }
    }
  }, [timeLeft, step, hasGuessed]);

  // Realtime game state subscription
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
          filter: `id=eq.${gameCode}`
        },
        (payload: any) => {
          const newStatus = payload.new.status;
          const newRound = payload.new.round;
            const newPlayers = payload.new.players || [];
            
            // Handle Kicking
            const isStillInLobby = newPlayers.some((p: string) => p.trim().toLowerCase() === playerName.trim().toLowerCase());
            if (step === 'waiting' && !isStillInLobby) {
              setStep('form');
              setError('YOU WERE KICKED FROM THE LOBBY');
              setGameCode('');
              return;
            }
          
          if (newRound !== round) {
            setRound(newRound);
            setHasGuessed(false);
            setGuessResult(null);
            setJoke(null);
            setGuess('');
            setTimeLeft(10); // reset local timer
          }

          if (newStatus === 'countdown' && step !== 'countdown') {
            setStep('countdown');
            setCountdown(3);
          } else if (newStatus === 'playing' && step !== 'playing') {
            setStep('playing');
            setTimeLeft(10);
          } else if (newStatus === 'leaderboard' && step !== 'leaderboard') {
            setStep('leaderboard');
          } else if (newStatus === 'waiting' && step !== 'waiting') {
            setStep('waiting');
          } else if (newStatus === 'gameover') {
              setStep('form');
              setError('GAME OVER! Check your standings on the projector. Thanks for playing!');
              setGameCode('');
              return;
            } else if (newStatus === 'crashed') {
              setStep('form');
              setError('HOST DISCONNECTED. The admin panel closed. Start a new lobby.');
              setGameCode('');
              return;
            }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [step, gameCode, round, playerName]);

  const submitGuess = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!guess.trim() || isSubmitting || hasGuessed) return;
    
    setIsSubmitting(true);
    const timeSubmitted = timeLeft;
    
    fetch('/api/games/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        pin: gameCode, 
        playerName, 
        guess: guess,
        timeLeft: timeSubmitted, 
        maxTime: 10
      })
    })
    .then(res => res.json())
      .then(data => {
        setIsSubmitting(false);
        setHasGuessed(true);
        
        let newJoke;
        if (data.success && data.isCorrect) {
          window.dispatchEvent(new CustomEvent('play-sound-success'));
          if (timeSubmitted >= 7) newJoke = JOKES_FAST[Math.floor(Math.random() * JOKES_FAST.length)];
        else if (timeSubmitted >= 4) newJoke = JOKES_MID[Math.floor(Math.random() * JOKES_MID.length)];
        else newJoke = JOKES_SLOW[Math.floor(Math.random() * JOKES_SLOW.length)];
      } else {
        newJoke = JOKES_FAIL[Math.floor(Math.random() * JOKES_FAIL.length)];
      }
      setJoke(newJoke);

      if (data.success) {
        setGuessResult({ isCorrect: data.isCorrect, points: data.pointsAwarded });
      } else {
        setGuessResult({ isCorrect: false, points: 0 });
      }
    })
    .catch(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center font-sans relative selection:bg-red-500 overflow-hidden p-4 md:p-8">
      <SoundEffects />
      
      {/* Background Dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#333_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      {/* Retro arcade DeBugger animation in the background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="scale-[2] sm:scale-[3] opacity-20 mix-blend-screen w-full h-full relative">
          <DeBugger />
        </div>
      </div>

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
                className="group relative overflow-hidden w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-400 text-white p-5 border-4 border-black font-black text-2xl uppercase tracking-widest transition-all hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] disabled:shadow-none disabled:translate-y-[8px] active:translate-y-[8px] active:shadow-none mt-2 flex items-center justify-center gap-3"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin z-10" />
                    <span className="z-10">Connecting...</span>
                  </>
                ) : (
                  <>
                    <span className="z-10">Join Mission</span>
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform z-10" />
                    <span className="absolute -bottom-2 -right-2 text-4xl opacity-50 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300">🍄</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {step === 'countdown' && (
        <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
          <div className="bg-[#f4f0e6] border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-none w-full p-10 flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl font-black text-black uppercase tracking-widest mb-4">Get Ready...</h2>
            <div className="text-[10rem] leading-none font-black text-red-600 animate-[bounce_1s_infinite]">
              {countdown > 0 ? countdown : 'GO!'}
            </div>
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
             <div className="bg-[#f4f0e6] text-black px-4 py-2 border-4 border-black font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
               ⏱ <span className="text-red-600">{timeLeft}s</span>
             </div>
             <div className="bg-[#f4f0e6] text-black px-4 py-2 border-4 border-black font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
               ROUND <span className="text-red-600">{round}</span>
             </div>
          </div>

          {/* Mascot GSAP Speech Bubble dropping from top right */}
          <div 
            ref={mascotRef}
            className="fixed top-4 right-4 md:top-12 md:right-12 z-50 opacity-0 invisible origin-top-right"
          >
            <div className="bg-[#f4f0e6] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-4 flex flex-col items-center justify-center min-w-[200px] rounded-none relative z-0">
              <img src="https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f47d.png" className="w-16 h-16 drop-shadow-md mb-2 animate-[bounce_1s_infinite]" alt="Mascot" />
              <div className="font-black text-red-600 text-lg uppercase tracking-widest text-center leading-tight">Hurry Up Twin!</div>
              <div className="text-black font-black uppercase tracking-wider text-sm mt-1 text-center">Time is ticking...</div>
            </div>
          </div>

          <div className="bg-[#f4f0e6] border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-none w-full p-8 flex flex-col items-center text-center relative">
            <p className="text-black font-black uppercase tracking-widest text-lg mb-6">
              Look at the Projector!
            </p>

            {hasGuessed ? (
               <div className="py-8 flex flex-col items-center">
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

                  {joke && (
                    <div className="flex items-center justify-center gap-3 bg-white px-6 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none text-center mx-4 mt-6 max-w-full">
                      <span className="text-lg font-black uppercase text-black">{joke.text}</span>
                      <span className="text-4xl drop-shadow-sm flex-shrink-0">{joke.emoji}</span>
                    </div>
                  )}

                  <p className="text-zinc-600 font-bold uppercase tracking-widest text-sm mt-8">Waiting for round to end...</p>
               </div>
            ) : (
              <form onSubmit={submitGuess} className="w-full flex flex-col gap-4 relative">
                {formats[round - 1] && (
                  <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-2 pointer-events-none">
                    {formats[round - 1].split('').map((char, i) => {
                      if (char === ' ') {
                        return <div key={i} className="w-4 md:w-6"></div>;
                      }
                      
                      const expectedNoSpaces = formats[round - 1].replace(/ /g, '');
                      let nonSpaceIdx = 0;
                      for(let j = 0; j < i; j++) {
                        if (formats[round - 1][j] !== ' ') nonSpaceIdx++;
                      }
                      
                      const rawGuess = guess.replace(/ /g, '');
                      const guessChar = rawGuess[nonSpaceIdx] || '';
                      const isFilled = guessChar !== '';
                      const isCorrect = rawGuess.toLowerCase() === expectedNoSpaces.toLowerCase();
                      
                      return (
                        <div key={i} className={`w-8 h-10 md:w-10 md:h-12 border-b-4 flex items-center justify-center font-black text-2xl uppercase transition-all duration-150 ${isFilled ? (isCorrect ? 'border-green-600 text-green-600 -translate-y-1' : 'border-red-600 text-red-600 -translate-y-1') : 'border-black text-black'}`}>
                          {guessChar}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <input 
                  type="text" 
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder={timeLeft <= 0 ? "TIME IS UP!" : "TYPE YOUR ANSWER..."}
                  className="w-full bg-white border-4 border-black p-5 text-2xl font-black text-black placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-red-500/20 rounded-none uppercase tracking-widest transition-all text-center"
                  required
                  autoFocus
                  disabled={isSubmitting || timeLeft <= 0}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
                
                <button 
                  type="submit"
                  disabled={isSubmitting || timeLeft <= 0}
                  className="group relative overflow-hidden w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-400 text-white p-5 border-4 border-black font-black text-2xl uppercase tracking-widest transition-all hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-[8px] active:shadow-none flex items-center justify-center gap-3 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:translate-y-[2px]"
                >
                  <span className="z-10">{isSubmitting ? <Loader2 className="w-6 h-6 animate-spin inline" /> : "Submit Answer"}</span>
                  {!isSubmitting && <Send className="w-6 h-6 z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  <span className="absolute -bottom-2 -left-2 text-4xl opacity-50 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300">⭐</span>
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
