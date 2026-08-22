"use client";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, MoveRight } from "lucide-react";
import gsap from "gsap";

export default function Home() {
  const [scores, setScores] = useState<{id: string, name: string, score: number, date: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/scores')
      .then(res => res.json())
      .then(data => {
        setScores(data.slice(0, 7)); // Top 7 to ensure it fits 100vh
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading && scores.length > 0) {
      gsap.fromTo('.home-score-item', 
        { opacity: 0, x: 20 }, 
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' }
      );
    }
  }, [loading, scores]);

  return (
    <div className="h-screen bg-[#111111] flex flex-col xl:flex-row relative overflow-hidden">
      <button onClick={() => window.open("/admin", "_blank")} className="fixed top-4 right-4 md:top-8 md:right-8 z-[100] group bg-[#111] text-zinc-400 hover:text-white font-bold text-xs px-4 py-2 border-2 border-zinc-800 hover:border-zinc-500 transition-all flex items-center gap-2 uppercase tracking-widest cursor-pointer">Admin <MoveRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></button>
      {/* Dot Pattern Background matching Rooftop Run */}
      <div className="absolute inset-0 bg-[radial-gradient(#333_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
      
      {/* LEFT: Hero Content */}
      <div className="w-full xl:w-[55%] h-full relative z-20 flex items-center">
        <AnimatedHero />
      </div>

      {/* RIGHT: Brutalist Leaderboard Panel */}
      <div className="w-full xl:w-[45%] h-full relative z-10 p-4 lg:p-8 flex flex-col justify-center">
        <div className="max-w-xl w-full mx-auto">
          
          <div className="bg-[#f4f0e6] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col relative rounded-none max-h-[85vh]">
            
            {/* Brutalist Header */}
            <div className="bg-black text-white p-4 lg:p-5 flex items-center justify-between border-b-4 border-black">
              <h2 className="text-lg md:text-xl font-black uppercase tracking-widest flex items-center gap-3">
                <Trophy className="w-5 h-5 text-[#f4f0e6]" />
                Top Operatives
              </h2>
              <Link href="/leaderboard" className="text-[10px] sm:text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-[0.2em] flex items-center gap-1 group">
                View All <MoveRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {loading ? (
              <div className="p-10 text-center text-zinc-600 font-bold uppercase tracking-widest text-sm">Loading scores...</div>
            ) : scores.length === 0 ? (
              <div className="p-10 text-center text-zinc-600 font-bold uppercase tracking-widest text-sm">No scores recorded yet.</div>
            ) : (
              <div className="flex flex-col p-2 lg:p-3 bg-[#f4f0e6] overflow-y-auto">
                {scores.map((score, index) => (
                  <div 
                    key={score.id}
                    className="home-score-item flex items-center justify-between px-3 py-2.5 lg:py-3 border-b-2 border-black/10 last:border-0 hover:bg-black/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className={`w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center font-black text-xs lg:text-sm border-2 border-black ${
                        index === 0 ? 'bg-yellow-400 text-black' :
                        index === 1 ? 'bg-zinc-300 text-black' :
                        index === 2 ? 'bg-amber-500 text-black' :
                        'bg-transparent text-black'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="font-bold text-black uppercase tracking-wider truncate max-w-[120px] sm:max-w-[180px] text-sm lg:text-base">
                        {score.name}
                      </div>
                    </div>
                    <div className="font-black text-black tabular-nums text-base lg:text-lg">
                      {score.score.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
