const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const oldRanking = /<div className="w-full bg-yellow-300 border-4 border-black shadow-\[4px_4px_0px_0px_rgba\(0,0,0,1\)\] p-4 mb-6 text-center transform -rotate-1">[\s\S]*?<\/div>\s*<\/div>/;

const newRanking = `<div className="w-full bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 mb-6 text-center transform -rotate-1">
                      <div className="font-black text-black uppercase text-sm tracking-widest">Global Ranking</div>
                      <div className="font-bold text-black mt-2 text-lg">You're better than <span className="font-black text-red-600 text-xl">{Math.min(99, Math.max(1, Math.floor(totalScore / 15) + 12))}%</span> of the participants today!</div>
                      <div className="font-black text-black text-2xl mt-2 bg-white inline-block px-4 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Rank: #{Math.max(1, 300 - Math.floor(totalScore / 5))}
                      </div>
                    </div>`;

code = code.replace(oldRanking, newRanking);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed Game Over rankings!');
