const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

code = code.replace(
  'className="flex items-center gap-3 bg-white p-2 pr-6 rounded-full shadow-sm border border-zinc-100"',
  'className="flex items-center gap-3 bg-[#f4f0e6] p-2 pr-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none"'
);

code = code.replace(
  'className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg drop-shadow-sm"',
  'className="bg-red-600 text-white w-10 h-10 border-4 border-black flex items-center justify-center font-black text-lg"'
);

code = code.replace(
  'className="font-bold text-zinc-800 tracking-tight"',
  'className="font-black text-black uppercase tracking-widest"'
);

code = code.replace(
  'className="flex items-center gap-2 text-zinc-600 bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-200 shadow-sm"',
  'className="flex items-center gap-2 text-black bg-[#f4f0e6] px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none"'
);

code = code.replace(
  'className="h-6 w-px bg-zinc-200 hidden sm:block"',
  'className="h-6 w-px hidden"' // Hide the separator since brutalism borders separate them visually
);

code = code.replace(
  'className="text-sm font-bold text-zinc-500 hidden sm:block"',
  'className="text-sm font-black text-black hidden sm:block bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"'
);

code = code.replace(
  'className="text-zinc-900 ml-2 font-mono text-xl"',
  'className="text-red-600 ml-2 font-mono text-xl"'
);

code = code.replace(
  'className="text-zinc-400 hover:text-red-500 transition-colors bg-white p-2 rounded-full border border-zinc-200 shadow-sm"',
  'className="text-black hover:bg-red-600 hover:text-white transition-colors bg-[#f4f0e6] p-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none"'
);

code = code.replace(
  '<span>Target {currentIndex + 1} of {logos.length}</span>',
  '<span className="bg-black text-white px-3 py-1 font-black uppercase">Target {currentIndex + 1} of {logos.length}</span>'
);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed Header / Scoreboard styling!');
