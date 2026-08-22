'use client';
import { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { PixelatedImage } from '@/components/PixelatedImage';
import gsap from 'gsap';
import { Eye, CheckCircle2, Timer, XCircle, LogOut, ArrowRight, CornerDownLeft, User } from 'lucide-react';
import { MessageLoading } from '@/components/ui/message-loading';
import { DeBugger } from '@/components/ui/de-bugger';
import { AnimatedCounter } from '@/components/ui/animated-counter';

const TIMER_SECONDS = 10;
const READY_TITLES = [
  "Are you down for the challenge?",
  "Ready to get roasted?",
  "Hope you know your logos...",
  "Don't embarrass yourself.",
  "Time to prove your worth.",
  "Prepare for pixelated pain.",
  "Try not to cry.",
  "Let's see what you got.",
  "Good luck, you'll need it.",
  "No pressure. Just kidding, lots of pressure."
];
const NOTO_BASE = "https://fonts.gstatic.com/s/e/notoemoji/latest";

const JOKES_FAST = [
  { text: "Woah that was quick.. calm down twin", emoji: `${NOTO_BASE}/1f480/512.webp` },
  { text: "Bro is literally a human scanner", emoji: `${NOTO_BASE}/1f92f/512.webp` },
  { text: "Are you cheating?!", emoji: `${NOTO_BASE}/1f928/512.webp` },
  { text: "Speedforce activated", emoji: `${NOTO_BASE}/26a1/512.webp` },
  { text: "Bro has 20/20 vision", emoji: `${NOTO_BASE}/1f440/512.webp` },
  { text: "Unreal reaction time", emoji: `${NOTO_BASE}/1f680/512.webp` },
];
const JOKES_MID = [
  { text: "Solid pace, but I've seen faster", emoji: `${NOTO_BASE}/1f971/512.webp` },
  { text: "Not bad, but don't get cocky", emoji: `${NOTO_BASE}/1f921/512.webp` },
  { text: "Acceptable... barely.", emoji: `${NOTO_BASE}/1f644/512.webp` },
  { text: "Average behavior.", emoji: `${NOTO_BASE}/1f610/512.webp` },
  { text: "You're doing okay sweetie", emoji: `${NOTO_BASE}/1f485/512.webp` },
  { text: "Nothing to brag about", emoji: `${NOTO_BASE}/1f937/512.webp` },
];
const JOKES_SLOW = [
  { text: "Fighting for your life out here", emoji: `${NOTO_BASE}/1f975/512.webp` },
  { text: "Bro was sweating bullets", emoji: `${NOTO_BASE}/1f630/512.webp` },
  { text: "My grandma types faster...", emoji: `${NOTO_BASE}/1f475/512.webp` },
  { text: "Did you fall asleep?", emoji: `${NOTO_BASE}/1f634/512.webp` },
  { text: "Barely made it out alive", emoji: `${NOTO_BASE}/1f915/512.webp` },
  { text: "Bro is playing in slow motion", emoji: `${NOTO_BASE}/1f40c/512.webp` },
];
const JOKES_FAIL = [
  { text: "Bro was literally sleeping", emoji: `${NOTO_BASE}/1f634/512.webp` },
  { text: "Is your keyboard even plugged in?", emoji: `${NOTO_BASE}/1f928/512.webp` },
  { text: "Embarrassing tbh", emoji: `${NOTO_BASE}/1f921/512.webp` },
  { text: "You're getting cooked out here", emoji: `${NOTO_BASE}/1f373/512.webp` },
  { text: "0 points. 0 aura.", emoji: `${NOTO_BASE}/1f480/512.webp` },
  { text: "My screen froze... yeah right.", emoji: `${NOTO_BASE}/1f976/512.webp` },
  { text: "HURRY UP TWIN! TIME IS TICKING...", emoji: `${NOTO_BASE}/1f47d/512.webp` }
];

export default function PlayPage() {
  const router = useRouter();

  // App State
  const [step, setStep] = useState<'intro' | 'popup' | 'countdown' | 'game'>('intro');
  const [countdownValue, setCountdownValue] = useState(3);
  const [readyTitle, setReadyTitle] = useState(READY_TITLES[0]);
  const [introStep, setIntroStep] = useState<1 | 2>(1); // 1 = Rules, 2 = Form
  
  // Form State
  const [playerName, setPlayerName] = useState('');
  const [playerEmail, setPlayerEmail] = useState('');
  
  // Game State
  const [logos, setLogos] = useState<{ id: string | number, url: string, name: string, points: number }[]>([]);
  const [playCount, setPlayCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pixelSize, setPixelSize] = useState(12);
  const [logoPoints, setLogoPoints] = useState(100);

    useEffect(() => {
      if (logos.length > 0 && currentIndex === 0) {
        setLogoPoints(logos[0].points || 100);
      }
    }, [logos, currentIndex]);
  const [totalScore, setTotalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [guess, setGuess] = useState('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'correct' | 'wrong' | 'gameover'>('playing');
  const [nextTimer, setNextTimer] = useState<number | null>(null);
  const [jokeContent, setJokeContent] = useState<{text: string, emoji: string} | null>(null);
  
  // Game Over States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalRank, setFinalRank] = useState<number | null>(null);
  const [finalPercentile, setFinalPercentile] = useState<number | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [closeGuessWarning, setCloseGuessWarning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const guessInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.questions) {
          const allQuestions = data.questions.map((q: any) => ({
             id: q.id,
             url: q.image_url,
             name: q.answer,
             points: 100
          }));
          
          const seenStr = localStorage.getItem('mtcSeenLogos') || '[]';
          let seen = JSON.parse(seenStr);
          
          let unseen = allQuestions.filter((q: any) => !seen.includes(q.id));
          if (unseen.length < 10) {
             seen = [];
             unseen = allQuestions;
          }
          
          const shuffled = unseen.sort(() => Math.random() - 0.5).slice(0, 10);
          
          const newSeen = [...seen, ...shuffled.map((q: any) => q.id)];
          localStorage.setItem('mtcSeenLogos', JSON.stringify(newSeen));
          
          setLogos(shuffled);
        }
      })
      .catch(console.error);
  }, [playCount]);

  // Helper for Skribbl-style "Close" guessing
  const levenshtein = (a: string, b: string) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) == a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, 
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
          );
        }
      }
    }
    return matrix[b.length][a.length];
  };

  // Parallax Effect & Initial Intro Anim
  useEffect(() => {
    if (step === 'intro') {
      gsap.fromTo('.rules-panel-item', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 40;
        const yPos = (clientY / window.innerHeight - 0.5) * 40;
        gsap.to('.parallax-layer-1', { x: xPos, y: yPos, duration: 1, ease: 'power2.out' });
        gsap.to('.parallax-layer-2', { x: xPos * -1.5, y: yPos * -1.5, duration: 1, ease: 'power2.out' });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [step]);

  const handleRulesNext = () => {
    gsap.to('.rules-panel', { 
      opacity: 0, 
      scale: 0.95, 
      duration: 0.5, 
      ease: 'power3.inOut',
      onComplete: () => {
        setIntroStep(2);
        setTimeout(() => {
          gsap.to('.parallax-layer-1, .parallax-layer-2', { opacity: 1, scale: 1, duration: 1.5, ease: 'elastic.out(1, 0.5)' });
          gsap.fromTo('.form-panel', 
            { opacity: 0, y: 30, scale: 1.05 }, 
            { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
          );
          nameInputRef.current?.focus();
        }, 50);
      }
    });
  };

  useEffect(() => {
    if (step === 'intro' && introStep === 1) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') handleRulesNext();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [step, introStep]);

  const handleRegSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !playerEmail.trim()) return;
    
    gsap.to('.intro-container', { 
      opacity: 0, y: -30, duration: 0.5, ease: 'power3.in',
      onComplete: () => {
        setStep('popup');
        setTimeout(() => {
          gsap.fromTo('.ready-popup', { scale: 0.9, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' });
        }, 50);
      }
    });
  };

  useEffect(() => {
    if (step !== 'popup') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        gsap.to('.ready-popup', { 
          scale: 0.95, opacity: 0, duration: 0.3, 
          onComplete: () => { setStep('countdown'); }
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step]);

      // Countdown logic
    useEffect(() => {
      if (step === 'countdown') {
        setCountdownValue(3);
        const timer = setInterval(() => {
          setCountdownValue(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setStep('game');
              gsap.fromTo('.game-container', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      }
    }, [step]);

    useEffect(() => {
      if (step !== 'game' || gameStatus !== 'playing') return;
    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 6) {
          setPixelSize(p => Math.max(1, p - 2));
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, gameStatus, step]);

  useEffect(() => {
      if (step !== 'game') return;
      if (timeLeft <= 4 && timeLeft > 0 && gameStatus === 'playing') {
        if (!mascotRef.current?.classList.contains('is-showing')) {
          mascotRef.current?.classList.add('is-showing');
          gsap.fromTo(mascotRef.current, { y: -20, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)', visibility: 'visible', overwrite: true });
        }
      } else {
        if (mascotRef.current?.classList.contains('is-showing')) {
          mascotRef.current?.classList.remove('is-showing');
          gsap.to(mascotRef.current, { y: -20, opacity: 0, scale: 0.8, duration: 0.3, ease: 'back.in(1.5)', overwrite: true, onComplete: () => {
            if (mascotRef.current) mascotRef.current.style.visibility = 'hidden';
          }});
        }
      }
    }, [timeLeft, gameStatus, step]);

  useEffect(() => {
    if (step === 'game' && gameStatus === 'playing' && guessInputRef.current) {
      guessInputRef.current.focus();
    }
  }, [step, gameStatus]);

  
  useEffect(() => {
    if (nextTimer === null) return;
    if (nextTimer > 0) {
      const id = setTimeout(() => setNextTimer(prev => prev! - 1), 1000);
      return () => clearTimeout(id);
    } else {
      handleNext();
    }
  }, [nextTimer]);
  
  const handleTimeOut = () => {
    setGameStatus('wrong');
    const randomJoke = JOKES_FAIL[Math.floor(Math.random() * JOKES_FAIL.length)];
    setJokeContent(randomJoke);
    // No grayscale filter wanted
    setPixelSize(1);
    setNextTimer(2);
  };

  const handleGuess = (e?: React.FormEvent, explicitGuess?: string) => {
    if (e && e.preventDefault) e.preventDefault();
    const activeGuess = explicitGuess !== undefined ? explicitGuess : guess;
    if (gameStatus !== 'playing') {
      if (nextTimer !== null) {
        setNextTimer(null);
        handleNext();
      }
      return;
    }
    if (!activeGuess.trim()) return;

    setCloseGuessWarning(false);
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normGuess = normalize(activeGuess);
    const normTarget = normalize(currentLogo.name);
    const isCorrect = normGuess === normTarget;

    if (isCorrect) {
      setGameStatus('correct');
      const timeBonus = timeLeft * 10;
      setTotalScore(prev => prev + logoPoints + timeBonus);
      
      let pool = JOKES_SLOW;
      if (timeLeft >= 7) pool = JOKES_FAST;
      else if (timeLeft >= 4) pool = JOKES_MID;
      const randomJoke = pool[Math.floor(Math.random() * pool.length)];
      setJokeContent(randomJoke);

      gsap.to('.logo-container canvas', { scale: 1.02, duration: 0.4, ease: 'power2.out' });
      setNextTimer(2); 
    } else {
      const dist = levenshtein(normGuess, normTarget);
      if (dist <= 2 && normGuess.length > 2) {
        setCloseGuessWarning(true);
        gsap.fromTo('.guess-input', { x: -3 }, { x: 0, duration: 0.1, yoyo: true, repeat: 3 });
      } else {
        gsap.fromTo('.guess-input', { x: -5 }, { x: 0, duration: 0.2, ease: 'bounce.out' });
        setGuess('');
      }
    }
  };

  const handleNext = () => {
    setNextTimer(null);
    setCurrentIndex(prev => {
      if (prev < logos.length - 1) {
        setPixelSize(12);
        setLogoPoints(logos[prev + 1]?.points || 100);
        setTimeLeft(TIMER_SECONDS);
        setGuess('');
        setCloseGuessWarning(false);
        setGameStatus('playing');
        setJokeContent(null);
        gsap.fromTo('.game-content', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
        return prev + 1;
      } else {
        setGameStatus('gameover');
        return prev;
      }
    });
  };

  useEffect(() => {
    if (gameStatus === 'gameover') {
      setIsSubmitting(true);
      fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, email: playerEmail, score: totalScore })
      })
      .then(res => res.json())
      .then(data => {
        if (data.rank) setFinalRank(data.rank);
        if (data.percentile) setFinalPercentile(data.percentile);
      })
      .catch(console.error)
      .finally(() => {
        setTimeout(() => setIsSubmitting(false), 1500);
      });
    }
  }, [gameStatus, playerName, playerEmail, totalScore]);

  const currentLogo = logos[currentIndex];
  
  if (!currentLogo && (step === 'game' || step === 'countdown')) {
    return <div className="flex h-screen items-center justify-center bg-[#111111] text-white font-bold tracking-widest uppercase">Loading Secure Data...</div>;
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans relative selection:bg-red-500 overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(#333_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none z-0"></div>



      {/* INTRO SCREEN (Sequential Centered Layout) */}
      {step === 'intro' && (
        <div className="intro-container relative z-10 flex flex-col items-center justify-center h-screen p-4 md:p-8 overflow-hidden">
          
          <div className="parallax-layer-1 absolute inset-0 z-0 opacity-100 scale-100 pointer-events-none flex items-center justify-center">
            {/* Retro arcade DeBugger animation in the background */}
            <div className="scale-[2] sm:scale-[3] opacity-30 mix-blend-screen w-full h-full relative">
              <DeBugger />
            </div>
          </div>

          <div className="w-full h-full flex items-center justify-center relative z-20">
            
            {/* RULES PANEL */}
            {introStep === 1 && (
              <div className="rules-panel absolute z-10 max-w-2xl w-full flex flex-col items-center px-4">
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2 uppercase drop-shadow-sm text-center">
                  Welcome to <span className="text-red-600 block sm:inline">Logo Run.</span>
                </h1>
                <p className="text-zinc-400 text-base md:text-lg font-medium mb-6 text-center max-w-lg">
                  Identify highly pixelated logos. Precision and speed yield the highest scores.
                </p>
                
                <div className="bg-[#f4f0e6] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none w-full flex flex-col relative overflow-hidden">
                  <div className="bg-black text-white p-4 border-b-4 border-black font-black uppercase tracking-widest text-center">
                    Rules of Engagement
                  </div>

                  <div className="flex flex-col p-4 sm:p-5 gap-4 text-left">
                    <div className="flex items-start gap-4">
                      <div className="bg-black text-[#f4f0e6] p-3 border-2 border-black">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-black text-lg uppercase tracking-wider">+100 Base Points</h3>
                        <p className="text-black/70 font-bold">Awarded for correctly identifying a logo.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-red-600 text-white p-3 border-2 border-black">
                        <Timer className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-black text-lg uppercase tracking-wider">10s Speed Bonus</h3>
                        <p className="text-black/70 font-bold">Earn +10 points for every second left on the clock.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-black text-[#f4f0e6] p-3 border-2 border-black">
                        <Eye className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-black text-lg uppercase tracking-wider">-20 Pts to Clarify</h3>
                        <p className="text-black/70 font-bold">Reduce pixelation if stuck, but it costs base points.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rules-panel-item mt-6 text-zinc-400 font-bold uppercase tracking-widest text-sm sm:text-base flex items-center gap-4 bg-black px-6 py-3 border-4 border-[#333]">
                  Press 
                  <span className="bg-white text-black px-4 py-1.5 font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all cursor-pointer" onClick={handleRulesNext}>
                    ENTER
                  </span> 
                  to acknowledge
                </div>
              </div>
            )}
            
            {/* REGISTRATION FORM */}
            {introStep === 2 && (
              <div className="form-panel parallax-layer-2 absolute z-20 max-w-md w-full opacity-0 scale-75 pointer-events-auto px-4 flex flex-col justify-center items-center h-full">
                <div className="bg-[#f4f0e6] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none w-full p-8 sm:p-10 flex flex-col items-center">
                  <h2 className="text-3xl font-black text-black uppercase mb-8 tracking-tight text-center">Operative Details</h2>
                  <form onSubmit={handleRegSubmit} className="w-full flex flex-col gap-5 text-left">
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="playerName" className="font-bold text-black uppercase tracking-wider text-sm">Codename</label>
                      <input
                        id="playerName"
                        ref={nameInputRef}
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your alias"
                        className="w-full bg-white border-4 border-black px-5 py-4 font-black text-black focus:outline-none focus:bg-yellow-50 placeholder:text-zinc-400 placeholder:font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none"
                        required
                        autoComplete="off"
                        maxLength={30}
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="playerEmail" className="font-bold text-black uppercase tracking-wider text-sm">Email</label>
                      <input
                        id="playerEmail"
                        type="email"
                        value={playerEmail}
                        onChange={(e) => setPlayerEmail(e.target.value)}
                        placeholder="student@university.edu"
                        className="w-full bg-white border-4 border-black px-5 py-4 font-black text-black focus:outline-none focus:bg-yellow-50 placeholder:text-zinc-400 placeholder:font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none"
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={!playerName.trim() || !playerEmail.trim()}
                      className="w-full bg-red-600 text-white font-black text-xl py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-wider mt-4"
                    >
                      Initialize Run
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* POPUP READY */}
      {step === 'popup' && (
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-6">
          <div className="ready-popup bg-[#f4f0e6] p-10 sm:p-14 border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-none text-center w-full max-w-xl">
            <Timer className="w-20 h-20 text-red-600 mx-auto mb-8" />
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-4 text-black">
                {readyTitle}
              </h2>
            <p className="text-xl text-black font-bold mb-10">
              You have exactly 10 seconds per target.
            </p>
            <div 
                className="inline-flex items-center gap-3 bg-white px-8 py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none cursor-pointer hover:bg-zinc-100 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                onClick={() => {
                  gsap.to('.ready-popup', { 
                    scale: 0.95, opacity: 0, duration: 0.3, 
                    onComplete: () => setStep('countdown')
                  });
                }}
              >
                <span className="text-lg font-black text-black uppercase pointer-events-none">
                  Press <kbd className="bg-black text-white px-4 py-2 mx-2">ENTER</kbd> or Click to begin
                </span>
              </div>
          </div>
        </div>
      )}

            {/* COUNTDOWN SCREEN */}
      {step === 'countdown' && (
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-6">
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-8 drop-shadow-sm">Initializing</h2>
            <AnimatedCounter value={countdownValue} fontSize={100} className="bg-[#f4f0e6] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] px-6 py-2" />
          </div>
        </div>
      )}

      {/* GAME */}
      {step === 'game' && (
        <div className="game-container flex flex-col min-h-screen z-10 relative">
          <header className="w-full px-8 py-5 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-zinc-200 relative z-30">
            <div className="font-bold text-zinc-900 flex items-center gap-4 text-lg">
              Logo Game
              <span className="text-xs px-3 py-1 bg-zinc-100 text-zinc-500 rounded-md font-mono hidden sm:inline-block border border-zinc-200">OP: {playerName}</span>
            </div>
            
            {gameStatus !== 'gameover' && (
              <div className="flex items-center gap-6">
                <div className="relative">
                    <div className="flex items-center gap-2 text-black bg-[#f4f0e6] px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none z-40 relative">
                      <Timer className={`w-6 h-6 ${timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-black'}`} />
                      <div className={`${timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-black'}`}>
                        <AnimatedCounter value={timeLeft} fontSize={24} />
                      </div>
                    </div>
                    
                    
                  </div>
                <div className="h-6 w-px hidden"></div>
                <div className="text-sm font-black text-black hidden sm:block bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  SCORE <span className="text-red-600 ml-2 font-mono text-xl">{totalScore}</span>
                </div>
                <button 
                  onClick={() => setGameStatus('gameover')}
                  className="ml-2 flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Exit
                </button>
              </div>
            )}

              {/* Mascot GSAP Speech Bubble dropping from top right */}
              <div 
                ref={mascotRef}
                className="absolute top-[120%] right-8 z-50 opacity-0 invisible origin-top-right"
              >

                
                <div className="bg-[#f4f0e6] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-4 flex flex-col items-center justify-center min-w-[240px] rounded-none relative z-0">
                  <img src={`${NOTO_BASE}/1f47d/512.webp`} className="w-16 h-16 drop-shadow-md mb-2 animate-[bounce_1s_infinite]" alt="Mascot" />
                  <div className="font-black text-red-600 text-lg uppercase tracking-widest text-center leading-tight">Hurry Up Twin!</div>
                  <div className="text-black font-black uppercase tracking-wider text-sm mt-1 text-center">Time is ticking...</div>
                </div>
              </div>
          </header>

            <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-6 w-full max-w-5xl mx-auto">
              {gameStatus === 'gameover' ? (
                <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-500 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  
                  {isSubmitting ? (
                    <div className="py-12 flex flex-col items-center space-y-6">
                      <MessageLoading />
                      <div className="space-y-2">
                        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Saving Score...</h2>
                        <p className="text-zinc-500 text-sm font-medium">Adding your score to the leaderboard.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-[#f4f0e6] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 sm:p-4 rounded-none mb-4">
                        <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-1 text-black">Game Over!</h2>
                      <p className="text-sm sm:text-base text-black font-bold uppercase tracking-widest mb-4 sm:mb-6">Run sequence terminated.</p>
                      
                      <div className="w-full mb-4 sm:mb-6 p-4 sm:p-6 bg-white rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="text-[10px] sm:text-xs text-zinc-400 font-bold uppercase tracking-widest mb-1">Final Score</div>
                        <div className="text-5xl sm:text-6xl font-black text-red-600 tracking-tighter">{totalScore}</div>
                      </div>
                      
                      <div className="w-full bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 sm:p-4 mb-4 sm:mb-6 text-center transform -rotate-1">
                        <div className="font-black text-black uppercase text-xs sm:text-sm tracking-widest">Global Ranking</div>
  {fetchError && finalRank === null && <div className="text-red-500 text-xs font-mono">{fetchError}</div>}
                        <div className="font-bold text-black mt-2 text-base sm:text-lg">You're better than <span className="font-black text-red-600 text-lg sm:text-xl">{finalPercentile !== null ? finalPercentile : Math.min(99, Math.max(1, Math.floor(totalScore / 15) + 12))}%</span> of participants!</div>
                        <div className="font-black text-black text-xl sm:text-2xl mt-2 bg-white inline-block px-4 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          Rank: #{finalRank !== null ? finalRank : Math.max(1, 300 - Math.floor(totalScore / 5))}
                        </div>
                      </div>
  
                      <div className="flex flex-col gap-2 sm:gap-4 w-full">
                        <button 
                          onClick={() => {
                            setStep('popup');
                            setGameStatus('playing');
                            setTotalScore(0);
                            setCurrentIndex(0);
                            setGuess('');
                            setCloseGuessWarning(false);
                            setPlayCount(c => c + 1);
                          }}
                          className="w-full bg-red-600 hover:bg-red-500 hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] text-white font-black uppercase text-sm sm:text-base py-3 sm:py-4 px-4 sm:px-6 rounded-none border-4 border-black transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        >
                          Play Again
                        </button>
                        
                        <button 
                          onClick={() => router.push('/leaderboard')}
                          className="w-full bg-black hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] text-white font-black uppercase text-sm sm:text-base py-3 sm:py-4 px-4 sm:px-6 rounded-none border-4 border-black transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        >
                          View Leaderboard
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        
                        <button 
                          onClick={() => router.push('/')}
                          className="w-full bg-white hover:bg-zinc-100 hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] text-black font-black uppercase text-sm sm:text-base py-3 sm:py-4 px-4 sm:px-6 rounded-none border-4 border-black transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        >
                          Return to Base
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
              <div className="game-content w-full flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-3 text-sm font-bold text-zinc-400 uppercase tracking-widest">
                  <span className="bg-black text-white px-3 py-1 font-black uppercase">Target {currentIndex + 1} of {logos.length}</span>
                </div>

                <div className="logo-container w-full h-[40vh] min-h-[250px] max-h-[450px] bg-[#f4f0e6] rounded-none border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative flex items-center justify-center p-4 sm:p-8 mb-6 transition-all">
                  <PixelatedImage 
                    src={currentLogo.url} 
                    pixelSize={gameStatus === 'playing' ? pixelSize : 1} 
                    className="w-full h-full object-contain"
                  />
                  
                  {gameStatus === 'correct' && (
                    <div className="absolute inset-0 bg-[#f4f0e6]/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-in fade-in duration-200">
                      <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-green-600 mb-4" />
                      <div className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tighter mb-4">Correct</div>
                      {jokeContent && (
                        <div className="flex items-center gap-3 bg-white px-6 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none text-center mx-4">
                          <span className="text-lg sm:text-xl font-black uppercase text-black">{jokeContent.text}</span>
                            <img src={jokeContent.emoji} className="w-10 h-10 drop-shadow-sm flex-shrink-0" alt="emoji" />
                        </div>
                      )}
                    </div>
                  )}

                  {gameStatus === 'wrong' && (
                    <div className="absolute inset-0 bg-[#f4f0e6]/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-in fade-in duration-200">
                      <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-600 mb-4" />
                      <div className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tighter mb-3">Time Expired</div>
                      <div className="bg-black text-white px-6 py-3 border-4 border-black font-black uppercase tracking-widest text-lg sm:text-xl shadow-[6px_6px_0px_0px_rgba(255,0,0,1)] my-2 mb-4">Target was {currentLogo.name}</div>
                      {jokeContent && (
                        <div className="flex items-center gap-3 bg-white px-6 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none text-center mx-4">
                          <span className="text-lg sm:text-xl font-black uppercase text-black">{jokeContent.text}</span>
                          <img src={jokeContent.emoji} className="w-10 h-10 drop-shadow-sm flex-shrink-0" alt="emoji" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="w-full max-w-2xl space-y-3 sm:space-y-4">
                  <form onSubmit={handleGuess} className="relative">
                    <div className="flex justify-center mb-6">
                      <div className="flex gap-1 sm:gap-2 text-2xl sm:text-3xl font-mono font-black text-black tracking-widest bg-[#f4f0e6] px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {(() => {
                          const norm = guess.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                          let idx = 0;
                          return currentLogo.name.split('').map((char, i) => {
                            if (char === ' ') return <span key={i} className="w-4"> </span>;
                            if (char === '-') return <span key={i}>-</span>;
                            const displayChar = idx < norm.length ? norm[idx++] : '_';
                            return <span key={i} className={displayChar !== '_' ? 'text-blue-600' : ''}>{displayChar}</span>;
                          });
                        })()}
                      </div>
                    </div>
                    <input 
                      ref={guessInputRef}
                      type="text" 
                      value={gameStatus === 'wrong' ? currentLogo.name : guess}
                      onChange={e => {
                          const val = e.target.value;
                          setGuess(val);
                          setCloseGuessWarning(false);
                          const normTarget = currentLogo.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                          if (val.toLowerCase().replace(/[^a-z0-9]/g, '') === normTarget) {
                            handleGuess(undefined, val);
                          }
                        }}
                      placeholder="Type the brand name and press Enter..."
                      className={`guess-input w-full border-4 border-black rounded-none px-6 py-4 sm:py-5 text-xl sm:text-2xl font-black focus:outline-none focus:bg-yellow-50 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center placeholder:text-zinc-400 placeholder:font-bold ${gameStatus === 'wrong' ? 'bg-red-500 text-white opacity-100' : 'bg-white text-black disabled:opacity-50'}`}
                      disabled={gameStatus !== 'playing'}
                      autoFocus
                    />
                    {closeGuessWarning && (
                      <div className="absolute -bottom-8 left-0 right-0 text-center animate-in fade-in slide-in-from-top-2">
                        <span className="bg-yellow-100 text-yellow-800 text-sm font-bold px-4 py-1.5 rounded-full">
                          Almost there! You are very close.
                        </span>
                      </div>
                    )}
                                      </form>
                  </div>
                </div>
              )}
            </main>
        </div>
      )}
    </div>
  );
}






