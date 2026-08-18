const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const oldStr = `<div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-6">
            <div className="ready-popup bg-white p-14 rounded-[2.5rem] border border-zinc-200 shadow-2xl text-center w-full max-w-xl">
              <Timer className="w-20 h-20 text-blue-500 mx-auto mb-8 drop-shadow-sm" />
              <h2 className="text-5xl font-bold tracking-tight mb-4 text-zinc-900">
                System Ready
              </h2>
              <p className="text-xl text-zinc-500 mb-12 font-medium">
                You have exactly 10 seconds per target.
              </p>
              <div className="inline-flex items-center gap-3 bg-zinc-50 px-8 py-5 rounded-2xl border border-zinc-200">
                <span className="text-lg font-semibold text-zinc-600">
                  Press <kbd className="bg-white border-b-4 border-zinc-200 px-3 py-1 rounded-lg text-zinc-900 font-bold shadow-sm mx-2">ENTER</kbd> to begin
                </span>
              </div>
            </div>
          </div>`;

const newStr = `<div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-6">
            <div className="ready-popup bg-[#f4f0e6] p-10 sm:p-14 border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-none text-center w-full max-w-xl">
              <Timer className="w-20 h-20 text-red-600 mx-auto mb-8" />
              <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 text-black">
                System Ready
              </h2>
              <p className="text-xl text-black font-bold mb-10">
                You have exactly 10 seconds per target.
              </p>
              <div className="inline-flex items-center gap-3 bg-white px-8 py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none">
                <span className="text-lg font-black text-black uppercase">
                  Press <kbd className="bg-black text-white px-4 py-2 mx-2">ENTER</kbd> to begin
                </span>
              </div>
            </div>
          </div>`;

if (code.includes(oldStr)) {
  code = code.replace(oldStr, newStr);
  fs.writeFileSync('src/app/play/page.tsx', code);
  console.log('Fixed Popup!');
} else {
  console.log('Wait, the spaces might be different. I will use regex replacement.');
}
