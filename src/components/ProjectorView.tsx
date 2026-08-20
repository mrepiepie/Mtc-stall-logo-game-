'use client';

import { useState, useEffect } from 'react';
import { PixelatedImage } from '@/components/PixelatedImage';
import { Users, Timer, Trophy } from 'lucide-react';

export function ProjectorView({ 
  game, 
  onNextRound, 
  onShowLeaderboard,
  onEndGame 
}: { 
  game: any, 
  onNextRound: (nextRound: number) => void,
  onShowLeaderboard: () => void,
  onEndGame: () => void 
}) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [showAnswer, setShowAnswer] = useState(false);
  const currentQuestion = game.questions[game.round - 1];

  useEffect(() => {
    if (game.status !== 'playing') return;

    if (timeLeft > 0) {
      const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0 && !showAnswer) {
      setShowAnswer(true);
      
      // Show answer for 5 seconds, then transition to leaderboard
      setTimeout(() => {
        onShowLeaderboard();
        
        // Show leaderboard for 10 seconds, then next round or end game
        setTimeout(() => {
          if (game.round >= 10) {
            onEndGame();
          } else {
            onNextRound(game.round + 1);
          }
        }, 10000);

      }, 5000);
    }
  }, [timeLeft, game.status, game.round, onNextRound, onShowLeaderboard, onEndGame, showAnswer]);

  // Reset timer when round changes
  useEffect(() => {
    if (game.status === 'playing') {
      setTimeLeft(10);
      setShowAnswer(false);
    }
  }, [game.round, game.status]);

  if (game.status === 'leaderboard' || game.status === 'gameover') {
    // Calculate leaderboard from game.scores
    const scores = game.scores || {};
    const leaderboard = Object.keys(scores)
      .map(name => ({ name, score: scores[name] }))
      .sort((a, b) => b.score - a.score);

    return (
      <div className="w-full h-full min-h-[60vh] bg-[#f4f0e6] border-4 border-black p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
        <h2 className="text-6xl font-black uppercase tracking-tighter mb-8">
          {game.status === 'gameover' ? 'Final Standings' : `Round ${game.round} Leaderboard`}
        </h2>
        
        <div className="w-full max-w-2xl flex flex-col gap-4">
          {leaderboard.length === 0 ? (
            <div className="text-2xl font-bold text-center text-zinc-500 uppercase">No points awarded yet!</div>
          ) : (
            leaderboard.slice(0, 5).map((player, i) => (
              <div key={player.name} className="flex justify-between items-center bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 flex items-center justify-center border-4 border-black font-black text-xl ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-zinc-300' : i === 2 ? 'bg-amber-600' : 'bg-white'}`}>
                    #{i + 1}
                  </div>
                  <span className="text-3xl font-black uppercase">{player.name}</span>
                </div>
                <span className="text-3xl font-black text-red-600">{player.score}</span>
              </div>
            ))
          )}
        </div>

        {game.status === 'leaderboard' && (
          <div className="mt-12 text-2xl font-bold uppercase animate-pulse">
            Next round starting soon...
          </div>
        )}
      </div>
    );
  }

  // Playing Mode
  return (
    <div className="w-full h-full min-h-[60vh] bg-white border-4 border-black p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
      
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="bg-[#f4f0e6] border-4 border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
          <Users className="w-6 h-6" />
          <span className="text-2xl font-black uppercase">{game.players?.length || 0} Operatives</span>
        </div>
        
        <div className="bg-red-600 text-white border-4 border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
          <Timer className="w-6 h-6" />
          <span className="text-4xl font-black">{timeLeft}</span>
        </div>
        
        <div className="bg-black text-white border-4 border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-2xl font-black uppercase">Round {game.round}/10</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-4xl flex-1 bg-[#f4f0e6] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden p-8">
        
        {currentQuestion && (
          <PixelatedImage 
            src={currentQuestion.image_url} 
            pixelSize={showAnswer ? 1 : Math.max(1, timeLeft <= 6 ? timeLeft * 2 : 12)}
            className="w-full h-[50vh] object-contain transition-all duration-1000"
          />
        )}

        {showAnswer && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
            <h3 className="text-3xl font-bold uppercase text-zinc-500 mb-2">The Answer Is</h3>
            <h2 className="text-7xl font-black uppercase tracking-tighter text-red-600 border-4 border-black bg-white px-8 py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
              {currentQuestion?.answer}
            </h2>
          </div>
        )}

      </div>

    </div>
  );
}
