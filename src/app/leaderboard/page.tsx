'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, ArrowLeft, Gamepad2, MoveRight } from 'lucide-react';
import gsap from 'gsap';
import { supabase } from "@/lib/supabaseClient";

export default function LeaderboardPage() {
  const [scores, setScores] = useState<{id: string, name: string, score: number, date: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = () => {
      fetch('/api/scores')
        .then(res => res.json())
        .then(data => {
          setScores(data);
          setLoading(false);
        });
    };

    fetchScores();

    const channel = supabase
      .channel('public:scores')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, () => {
        fetchScores();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!loading && scores.length > 0) {
      gsap.fromTo('.score-item', 
        { opacity: 0, x: -20 }, 
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' }
      );
    }
  }, [loading, scores]);

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Dot Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#333_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
      
      <div className="w-full max-w-3xl relative z-10 flex flex-col gap-8">
        
        <header className="flex justify-between items-center bg-[#f4f0e6] border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4">
            <Link href="/" className="bg-black text-white p-2 border-2 border-black hover:bg-zinc-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-black flex items-center gap-3">
              <Trophy className="w-6 h-6 md:w-8 md:h-8 text-black" />
              Global Standings
            </h1>
          </div>
          
          <Link href="/play" className="bg-red-600 text-white font-bold text-xs md:text-sm px-4 py-3 border-2 border-black hover:bg-red-500 transition-colors flex items-center gap-2 uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
            <Gamepad2 className="w-4 h-4 hidden sm:block" />
            Play Again
          </Link>
        </header>

        <div className="bg-[#f4f0e6] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col relative rounded-none overflow-hidden">
          {/* Header Row */}
          <div className="bg-black text-white px-4 py-3 md:px-6 md:py-4 flex text-xs md:text-sm font-bold uppercase tracking-widest border-b-4 border-black">
            <div className="w-16 md:w-20 text-center text-zinc-400">Rank</div>
            <div className="flex-1 text-red-500">Operative</div>
            <div className="w-24 text-right text-zinc-400">Score</div>
          </div>

          <div className="flex flex-col bg-[#f4f0e6]">
            {loading ? (
              <div className="p-16 text-center text-black font-black uppercase tracking-widest text-xl animate-pulse">Loading intel...</div>
            ) : scores.length === 0 ? (
              <div className="p-16 text-center text-zinc-500 font-bold uppercase tracking-widest">No scores recorded yet.</div>
            ) : (
              scores.map((s, idx) => (
                <div key={s.id} className="score-item flex px-4 py-3 md:px-6 md:py-4 items-center border-b-2 border-black/10 last:border-0 hover:bg-black/5 transition-colors">
                  <div className="w-16 md:w-20 flex justify-center">
                    <div className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-black text-sm md:text-base border-2 border-black ${
                      idx === 0 ? 'bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' :
                      idx === 1 ? 'bg-zinc-300 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' :
                      idx === 2 ? 'bg-amber-500 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' :
                      'bg-transparent text-black'
                    }`}>
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-1 font-black text-black uppercase tracking-widest text-sm md:text-lg truncate pl-2">{s.name}</div>
                  <div className="w-24 text-right font-black tabular-nums text-black text-base md:text-xl">{s.score.toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MTC Promotion Box - Brutalist Dark */}
        <div className="w-full bg-[#111] text-white p-5 lg:p-6 border-4 border-[#333] text-left relative overflow-hidden group hover:border-[#555] transition-colors shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl md:text-2xl font-black mb-2 tracking-tighter uppercase flex items-center gap-2 text-white">
                  <Gamepad2 className="w-6 h-6 text-red-500" />
                  Inspired by the tech?
                </h3>
                <p className="text-sm md:text-base text-zinc-400 font-bold tracking-wide uppercase">
                  Wanna learn how to build all these things? Join MTC and level up.
                </p>
              </div>
              <a 
                href="/mtc-qr.png" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-4 text-sm font-black hover:bg-zinc-200 transition-colors uppercase tracking-widest border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] whitespace-nowrap"
              >
                Join MTC Today <MoveRight className="w-5 h-5" />
              </a>
          </div>
        </div>

      </div>
    </div>
  );
}
