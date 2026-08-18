const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// 1. Make DeBugger visible on screen 1:
code = code.replace(
  '<div className="parallax-layer-1 absolute inset-0 z-0 opacity-0 scale-50 pointer-events-none flex items-center justify-center">',
  '<div className="parallax-layer-1 absolute inset-0 z-0 opacity-100 scale-100 pointer-events-none flex items-center justify-center">'
);

// 2. Reduce vertical spacing on rules-panel
// Title mb-4 -> mb-2
code = code.replace(
  '<h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 uppercase drop-shadow-sm text-center">',
  '<h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2 uppercase drop-shadow-sm text-center">'
);
// Paragraph mb-10 -> mb-6
code = code.replace(
  '<p className="text-zinc-400 text-lg md:text-xl font-medium mb-10 text-center max-w-lg">',
  '<p className="text-zinc-400 text-base md:text-lg font-medium mb-6 text-center max-w-lg">'
);

// Rules Card padding p-4 sm:p-8 -> p-4 sm:p-6, gap-6 -> gap-4
code = code.replace(
  '<div className="flex flex-col p-4 sm:p-8 gap-6 text-left">',
  '<div className="flex flex-col p-4 sm:p-5 gap-4 text-left">'
);

// Enter button mt-12 -> mt-6
code = code.replace(
  '<div className="rules-panel-item mt-12 text-zinc-400 font-bold uppercase tracking-widest text-sm sm:text-base flex items-center gap-4 bg-black px-8 py-4 border-4 border-[#333]">',
  '<div className="rules-panel-item mt-6 text-zinc-400 font-bold uppercase tracking-widest text-sm sm:text-base flex items-center gap-4 bg-black px-6 py-3 border-4 border-[#333]">'
);

// Intro container min-h-screen -> h-screen
code = code.replace(
  '<div className="intro-container relative z-10 flex flex-col items-center justify-center min-h-screen p-6 md:p-12 overflow-hidden">',
  '<div className="intro-container relative z-10 flex flex-col items-center justify-center h-screen p-4 md:p-8 overflow-hidden">'
);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed spacing and DeBugger visibility');
