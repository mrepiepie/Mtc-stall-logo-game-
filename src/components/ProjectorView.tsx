'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { PixelatedImage } from '@/components/PixelatedImage';
import { Users, Timer, Trophy, X } from 'lucide-react';

export function ProjectorView({ 
  game, 
  onNextRound, 
  onShowLeaderboard,
  onEndGame,
  onCountdownComplete
}: { 
  game: any, 
  onNextRound: (nextRound: number) => void,
  onShowLeaderboard: () => void,
  onEndGame: () => void,
  onCountdownComplete: () => void 
}) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [countdown, setCountdown] = useState(3);
  const [showAnswer, setShowAnswer] = useState(false);
  const currentQuestion = game.questions[game.round - 1];

  // Local refs to prevent stale closures and infinite re-renders
  const roundRef = useRef(game.round);
  const callbacksRef = useRef({ onNextRound, onShowLeaderboard, onEndGame, onCountdownComplete });
  
  useEffect(() => { 
    roundRef.current = game.round; 
  }, [game.round]);
  
  useEffect(() => { 
    callbacksRef.current = { onNextRound, onShowLeaderboard, onEndGame, onCountdownComplete }; 
  }, [onNextRound, onShowLeaderboard, onEndGame, onCountdownComplete]);

  // Preload images
  useEffect(() => {
    if (game?.questions && Array.isArray(game.questions)) {
      game.questions.forEach((q: any) => {
        if (q.image_url) {
          const img = new Image();
          img.src = q.image_url;
        }
      });
    }
  }, [game?.questions]);

  // Robust timer machine
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    let answerTimeout: NodeJS.Timeout;

    if (game.status === 'countdown') {
      setCountdown(3);
      timerId = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerId);
            callbacksRef.current.onCountdownComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } 
    else if (game.status === 'playing') {
      setTimeLeft(10);
      setShowAnswer(false);
      timerId = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerId);
            setShowAnswer(true);
            
            // Wait 2.5s to show answer
            answerTimeout = setTimeout(() => {
              callbacksRef.current.onShowLeaderboard();
            }, 2500);
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timerId);
      clearTimeout(answerTimeout);
    };
  }, [game.status]); // ONLY game.status dictates the timer cycle

  // Leaderboard phase timeout
  useEffect(() => {
    let leaderboardTimeout: NodeJS.Timeout;
    if (game.status === 'leaderboard') {
      leaderboardTimeout = setTimeout(() => {
        if (roundRef.current >= 10) {
          callbacksRef.current.onEndGame();
        } else {
          callbacksRef.current.onNextRound(roundRef.current + 1);
        }
      }, 4000);
    }
    return () => clearTimeout(leaderboardTimeout);
  }, [game.status]);

if (game.status === 'waiting') {
    return (
      <div className="w-full min-h-screen bg-[#f4f0e6] border-4 border-black p-4 md:p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center">
        <h2 className="text-4xl font-black uppercase text-black mb-8 tracking-widest animate-pulse">Waiting to Start...</h2>
      </div>
    );
  }

  if (game.status === 'countdown') {
    return (
      <div className="w-full min-h-screen bg-white border-4 border-black p-4 md:p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center">
        <h2 className="text-4xl font-black uppercase text-black mb-8 tracking-widest">Get Ready...</h2>
        <div className="text-[12rem] leading-none font-black text-red-600 animate-[bounce_1s_infinite]">
          {countdown > 0 ? countdown : 'GO!'}
        </div>
      </div>
    );
  }

if (game.status === 'leaderboard' || game.status === 'gameover') {
    const scores = game.scores || {};
    const leaderboard = Object.keys(scores)
      .map(name => ({ name, score: scores[name] }))
      .sort((a, b) => b.score - a.score);

    return (
      <div className="w-full min-h-screen bg-[#f4f0e6] border-4 border-black p-4 md:p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-black">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 text-center">
          {game.status === 'gameover' ? 'Final Standings' : `Round ${game.round} Leaderboard`}
        </h2>
        
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {leaderboard.slice(0, 10).map((player, i) => (
              <div key={player.name} className="leaderboard-row flex justify-between items-center bg-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-8 fade-in duration-500 fill-mode-both" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 flex flex-shrink-0 items-center justify-center border-4 border-black font-black text-lg ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-zinc-300' : i === 2 ? 'bg-amber-600' : 'bg-white'}`}>
                    #{i + 1}
                  </div>
                  <span className="text-xl md:text-2xl font-black uppercase truncate max-w-[200px]">{player.name}</span>
                </div>
                <span className="text-xl md:text-2xl font-black text-red-600">{player.score}</span>
              </div>
            ))}
          </div>

        {game.status === 'leaderboard' && (
          <div className="mt-12 text-2xl font-bold uppercase animate-pulse">
            Next round starting soon...
          </div>
        )}
        {game.status === 'gameover' && (
          <button 
            onClick={() => window.location.reload()} 
            className="absolute top-4 right-4 md:top-8 md:right-8 bg-red-600 text-white p-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all z-50 flex items-center justify-center group"
            title="End Game and Return to Lobby"
          >
            <X className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform" />
          </button>
        )}
      </div>
    );
  }

  // Playing Mode
  return (
    <div className="w-full min-h-screen bg-white border-4 border-black p-4 md:p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-black">
      
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-4 md:mb-8">
        <div className="bg-[#f4f0e6] border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
          <Users className="w-5 h-5 md:w-6 md:h-6" />
          <span className="text-xl md:text-2xl font-black uppercase">{game.players?.length || 0} Operatives</span>
        </div>
        
        <div className="bg-red-600 text-white border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
          <Timer className="w-5 h-5 md:w-6 md:h-6" />
          <span className="text-3xl md:text-4xl font-black">{timeLeft}</span>
        </div>
        
        <div className="bg-black text-white border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-xl md:text-2xl font-black uppercase">Round {game.round}/10</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-4xl flex-1 bg-[#f4f0e6] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center p-4 md:p-8">
        
        {currentQuestion && (
          <PixelatedImage 
            src={currentQuestion.image_url} 
            pixelSize={showAnswer ? 1 : Math.max(1, timeLeft)}
            className="w-full max-h-[50vh] object-contain transition-all duration-1000"
          />
        )}

        {showAnswer && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
            <h3 className="text-2xl md:text-3xl font-bold uppercase text-zinc-500 mb-2">The Answer Is</h3>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-red-600 border-4 border-black bg-white px-6 md:px-8 py-3 md:py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
              {currentQuestion?.answer}
            </h2>
          </div>
        )}

      </div>

    </div>
  );
}
