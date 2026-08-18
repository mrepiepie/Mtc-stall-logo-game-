'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, ArrowLeft, RotateCcw } from 'lucide-react';
import gsap from 'gsap';

export default function LeaderboardPage() {
  const [scores, setScores] = useState<{id: string, name: string, score: number, date: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/scores')
      .then(res => res.json())
      .then(data => {
        setScores(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading && scores.length > 0) {
      gsap.fromTo('.score-item', 
        { opacity: 0, y: 10 }, 
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [loading, scores]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col items-center py-12 px-6 font-sans">
      <div className="w-full max-w-3xl">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-100">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900">
              Leaderboard
            </h1>
          </div>
          
          <Link href="/play" className="px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium shadow-sm">
            <RotateCcw className="w-4 h-4" />
            Play Again
          </Link>
        </header>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-zinc-500 font-medium">Loading scores...</div>
          ) : scores.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 font-medium">No scores yet today.</div>
          ) : (
            <div className="divide-y divide-zinc-100">
              <div className="flex px-6 py-4 bg-zinc-50/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                <div className="w-12 text-center">Rank</div>
                <div className="flex-1">Player</div>
                <div className="w-24 text-right">Score</div>
              </div>
              {scores.map((s, idx) => (
                <div key={s.id} className="score-item flex px-6 py-4 items-center hover:bg-zinc-50 transition-colors">
                  <div className="w-12 text-center font-medium">
                    {idx === 0 ? <span className="text-yellow-600 font-bold">1</span> :
                     idx === 1 ? <span className="text-zinc-400 font-bold">2</span> :
                     idx === 2 ? <span className="text-amber-700 font-bold">3</span> : 
                     <span className="text-zinc-400">{idx + 1}</span>}
                  </div>
                  <div className="flex-1 font-medium text-zinc-900">{s.name}</div>
                  <div className="w-24 text-right font-mono font-medium text-zinc-900">{s.score}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
