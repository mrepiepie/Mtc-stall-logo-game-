const fs = require('fs');
let c = fs.readFileSync('src/components/ProjectorView.tsx', 'utf8');

// 1. Import gsap at the top if not exists
if (!c.includes('import gsap')) {
  c = c.replace(/import { useState, useEffect, useRef } from 'react';/, "import { useState, useEffect, useRef } from 'react';\nimport { gsap } from 'gsap';");
}

// 2. Leaderboard array size
c = c.replace(/const leaderboard = Object\.entries\(game\.scores || \{\}\)\n\s*\.map\(\(\[name, score\]\) => \(\{ name, score: score as number \}\)\)\n\s*\.sort\(\(a, b\) => b\.score - a\.score\)\n\s*\.slice\(0, 5\);/, 
  "const leaderboard = Object.entries(game.scores || {})\n    .map(([name, score]) => ({ name, score: score as number }))\n    .sort((a, b) => b.score - a.score)\n    .slice(0, 10);");

// 3. Leaderboard effect
const targetEffect = `  // Leaderboard timer
  useEffect(() => {
    if (game.status === 'leaderboard') {
      const timer = setTimeout(() => {
        if (roundRef.current >= 10) {
          callbacksRef.current.onEndGame();
        } else {
          callbacksRef.current.onNextRound(roundRef.current + 1);
        }
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [game.status]);`;

const newEffect = `  // Leaderboard timer & Animation
  useEffect(() => {
    if (game.status === 'leaderboard') {
      gsap.fromTo('.leaderboard-row', 
        { y: 60, opacity: 0, rotateX: -15, scale: 0.9 },
        { y: 0, opacity: 1, rotateX: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.2)' }
      );
      
      const timer = setTimeout(() => {
        if (roundRef.current >= 10) {
          callbacksRef.current.onEndGame();
        } else {
          callbacksRef.current.onNextRound(roundRef.current + 1);
        }
      }, 5000); // Wait 5s to allow for 10 items to animate
      return () => clearTimeout(timer);
    }
  }, [game.status]);`;

c = c.replace(targetEffect, newEffect);

// 4. Update the Leaderboard UI Container to handle 10 items nicely (2 columns)
const targetUI = `<div className="w-full max-w-2xl flex flex-col gap-4">
            {leaderboard.map((player, i) => (
              <div key={player.name} className="flex justify-between items-center bg-white border-4 border-black p-3 md:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={\`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-4 border-black font-black text-lg md:text-xl \${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-zinc-300' : i === 2 ? 'bg-amber-600' : 'bg-white'}\`}>
                    #{i + 1}
                  </div>
                  <span className="text-2xl md:text-3xl font-black uppercase truncate max-w-[150px]">{player.name}</span>
                </div>
                <span className="text-2xl md:text-3xl font-black text-red-600">{player.score}</span>
              </div>
            ))}
          </div>`;

const newUI = `<div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {leaderboard.map((player, i) => (
              <div key={player.name} className="leaderboard-row flex justify-between items-center bg-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3">
                  <div className={\`w-10 h-10 flex flex-shrink-0 items-center justify-center border-4 border-black font-black text-lg \${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-zinc-300' : i === 2 ? 'bg-amber-600' : 'bg-white'}\`}>
                    #{i + 1}
                  </div>
                  <span className="text-xl md:text-2xl font-black uppercase truncate max-w-[200px]">{player.name}</span>
                </div>
                <span className="text-xl md:text-2xl font-black text-red-600">{player.score}</span>
              </div>
            ))}
          </div>`;

c = c.replace(targetUI, newUI);
fs.writeFileSync('src/components/ProjectorView.tsx', c);
console.log('done');
