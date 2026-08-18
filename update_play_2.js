const fs = require("fs");
let code = fs.readFileSync("src/app/play/page.tsx", "utf-8");

code = code.replace(
  '<div className="bg-white p-10 rounded-3xl border border-zinc-200 shadow-2xl flex flex-col items-center max-w-sm w-full text-center relative overflow-hidden">',
  '<div className="bg-[#f4f0e6] p-10 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center max-w-sm w-full text-center relative overflow-hidden rounded-none">'
);
code = code.replace(
  '<h2 className="text-3xl font-bold tracking-tight mb-2 text-zinc-900">Game Over!</h2>',
  '<h2 className="text-4xl font-black uppercase tracking-tight mb-2 text-black">Game Over!</h2>'
);
code = code.replace(
  '<div className="w-full mb-8 p-6 bg-zinc-50 rounded-2xl border border-zinc-100/50">',
  '<div className="w-full mb-8 p-6 bg-white rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">'
);
code = code.replace(
  '<div className="text-6xl font-black text-blue-600 tracking-tighter">{totalScore}</div>',
  '<div className="text-6xl font-black text-red-600 tracking-tighter">{totalScore}</div>'
);
code = code.replace(
  /className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-base py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm"/g,
  'className="w-full bg-black hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] text-white font-black uppercase text-base py-4 px-6 rounded-none border-4 border-black transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"'
);

code = code.replace(
  '<div className="logo-container w-full h-[40vh] min-h-[250px] max-h-[450px] bg-white rounded-[2rem] border border-zinc-200 shadow-xl overflow-hidden relative flex items-center justify-center p-4 sm:p-8 mb-6 transition-all">',
  '<div className="logo-container w-full h-[40vh] min-h-[250px] max-h-[450px] bg-[#f4f0e6] rounded-none border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative flex items-center justify-center p-4 sm:p-8 mb-6 transition-all">'
);

code = code.replace(
  /className="guess-input w-full bg-white border-2 border-zinc-200 rounded-2xl px-6 py-4 sm:py-5 text-xl sm:text-2xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-500\/10 focus:border-blue-500 transition-all shadow-md disabled:opacity-50 text-center placeholder:text-zinc-300"/g,
  'className="guess-input w-full bg-white border-4 border-black rounded-none px-6 py-4 sm:py-5 text-xl sm:text-2xl font-black focus:outline-none focus:bg-yellow-50 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 text-center placeholder:text-zinc-400 placeholder:font-bold"'
);

code = code.replace(
  /className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-50 disabled:opacity-50 border-2 border-zinc-100 rounded-2xl py-3 sm:py-4 transition-all text-base sm:text-lg font-bold text-zinc-600 hover:text-zinc-900 shadow-sm"/g,
  'className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 border-4 border-black rounded-none py-3 sm:py-4 transition-all text-base sm:text-lg font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase"'
);

code = code.replace(
  /className="flex gap-4 sm:gap-6 bg-white p-2 rounded-2xl shadow-sm border border-zinc-100 w-full sm:w-auto"/g,
  'className="flex gap-4 sm:gap-6 bg-[#f4f0e6] p-2 rounded-none border-4 border-black w-full sm:w-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"'
);
code = code.replace(
  /className="flex gap-4 sm:gap-6 bg-white p-2 rounded-2xl shadow-sm border border-zinc-100 shrink-0"/g,
  'className="flex gap-4 sm:gap-6 bg-[#f4f0e6] p-2 rounded-none border-4 border-black shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"'
);

// fix absolute inset-0 bg-white/90
code = code.replace(
  /className="absolute inset-0 bg-white\/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-in fade-in duration-200"/g,
  'className="absolute inset-0 bg-[#f4f0e6]/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-in fade-in duration-200"'
);

fs.writeFileSync("src/app/play/page.tsx", code);
console.log("Updated remaining brutalist classes.");
