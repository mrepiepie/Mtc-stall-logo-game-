const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const oldStr = 'className="guess-input w-full bg-white border-4 border-black rounded-none px-6 py-4 sm:py-5 text-xl sm:text-2xl font-black focus:outline-none focus:bg-yellow-50 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 text-center placeholder:text-zinc-400 placeholder:font-bold"';
const newStr = 'className="guess-input w-full bg-white border-4 border-black rounded-none px-6 py-4 sm:py-5 text-xl sm:text-2xl font-black text-black focus:outline-none focus:bg-yellow-50 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 text-center placeholder:text-zinc-400 placeholder:font-bold"';

code = code.replace(oldStr, newStr);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed text color on guess input!');
