const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

code = code.replace(
  /className="flex items-center gap-3 sm:gap-4 text-lg sm:text-xl font-bold text-blue-700 bg-blue-50\/80 backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border border-blue-200 shadow-sm mx-4 text-center"/g,
  'className="flex items-center gap-3 bg-white px-6 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none text-center mx-4"'
);

code = code.replace(
  /className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-sm flex-shrink-0"/g,
  'className="w-10 h-10 drop-shadow-sm flex-shrink-0"'
);

code = code.replace(
  /<div className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-4 sm:mb-6">Correct<\/div>/g,
  '<div className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tighter mb-4">Correct</div>'
);

code = code.replace(
  /<CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mb-4 sm:mb-6 drop-shadow-sm" \/>/g,
  '<CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-green-600 mb-4" />'
);

// And for Wrong
code = code.replace(
  /<XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 mb-4 drop-shadow-sm" \/>/g,
  '<XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-600 mb-4" />'
);

code = code.replace(
  /<div className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-3">Time Expired<\/div>/g,
  '<div className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tighter mb-3">Time Expired</div>'
);

code = code.replace(
  /<div className="text-zinc-500 font-bold text-lg sm:text-xl">Target was <span className="text-zinc-900">\{currentLogo\.name\}<\/span><\/div>/g,
  '<div className="bg-black text-white px-6 py-3 border-4 border-black font-black uppercase tracking-widest text-lg sm:text-xl shadow-[6px_6px_0px_0px_rgba(255,0,0,1)] mt-2">Target was {currentLogo.name}</div>'
);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Targeted replacements executed!');
