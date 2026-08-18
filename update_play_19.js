const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const oldMascot = `<div className="bg-[#f4f0e6] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-6 flex items-center gap-6 min-w-[300px] rounded-none">
            <div className="flex-1">
              <div className="font-black text-red-500 text-xl uppercase tracking-widest mb-1">Hurry Up Twin!</div>
              <div className="text-black font-bold uppercase tracking-wider flex items-center gap-2">Time is ticking... <img src={\`\${NOTO_BASE}/1f47d/512.webp\`} className="w-8 h-8 inline-block drop-shadow-sm" alt="alien" /></div>
            </div>
            <img src={\`\${NOTO_BASE}/1f61d/512.webp\`} className="w-20 h-20 drop-shadow-md transform hover:scale-110 transition-transform" alt="Mascot" />
          </div>`;

const newMascot = `<div className="bg-[#f4f0e6] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-6 flex items-center gap-6 min-w-[300px] rounded-none">
            <div className="flex-1">
              <div className="font-black text-red-500 text-xl uppercase tracking-widest mb-1">Hurry Up Twin!</div>
              <div className="text-black font-bold uppercase tracking-wider">Time is ticking...</div>
            </div>
            <img src={\`\${NOTO_BASE}/1f47d/512.webp\`} className="w-20 h-20 drop-shadow-md transform hover:scale-110 transition-transform" alt="Mascot" />
          </div>`;

if (code.includes(oldMascot)) {
  code = code.replace(oldMascot, newMascot);
  fs.writeFileSync('src/app/play/page.tsx', code);
  console.log('Fixed Alien Mascot!');
} else {
  // Regex fallback just in case
  code = code.replace(
    /<div className="text-black font-bold uppercase tracking-wider flex items-center gap-2">Time is ticking... <img[^>]+><\/div>/,
    '<div className="text-black font-bold uppercase tracking-wider">Time is ticking...</div>'
  );
  code = code.replace(
    /<img src=\{`\$\{NOTO_BASE\}\/1f61d\/512\.webp`\} className="w-20 h-20 drop-shadow-md transform hover:scale-110 transition-transform" alt="Mascot" \/>/,
    '<img src={`${NOTO_BASE}/1f47d/512.webp`} className="w-20 h-20 drop-shadow-md transform hover:scale-110 transition-transform" alt="Mascot" />'
  );
  fs.writeFileSync('src/app/play/page.tsx', code);
  console.log('Fixed Alien Mascot with regex!');
}
