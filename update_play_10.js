const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// I will just replace class names manually!
code = code.replace(
  'className="ready-popup bg-white p-14 rounded-[2.5rem] border border-zinc-200 shadow-2xl text-center w-full max-w-xl"',
  'className="ready-popup bg-[#f4f0e6] p-10 sm:p-14 border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-none text-center w-full max-w-xl"'
);

code = code.replace(
  'className="w-20 h-20 text-blue-500 mx-auto mb-8 drop-shadow-sm"',
  'className="w-20 h-20 text-red-600 mx-auto mb-8"'
);

code = code.replace(
  'className="text-5xl font-bold tracking-tight mb-4 text-zinc-900"',
  'className="text-5xl font-black uppercase tracking-tighter mb-4 text-black"'
);

code = code.replace(
  'className="text-xl text-zinc-500 mb-12 font-medium"',
  'className="text-xl text-black font-bold mb-10"'
);

code = code.replace(
  'className="inline-flex items-center gap-3 bg-zinc-50 px-8 py-5 rounded-2xl border border-zinc-200"',
  'className="inline-flex items-center gap-3 bg-white px-8 py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none"'
);

code = code.replace(
  'className="text-lg font-semibold text-zinc-600"',
  'className="text-lg font-black text-black uppercase"'
);

code = code.replace(
  'className="bg-white border-b-4 border-zinc-200 px-3 py-1 rounded-lg text-zinc-900 font-bold shadow-sm mx-2"',
  'className="bg-black text-white px-4 py-2 mx-2"'
);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed Popup with partial string replacement!');
