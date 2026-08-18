const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const tailDivs = `                {/* Brutalist Speech Bubble Triangle Pointing Up */}
                <div className="absolute -top-4 right-[50px] w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[16px] border-b-black"></div>
                <div className="absolute -top-3 right-[50px] w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[16px] border-b-[#f4f0e6] z-10"></div>`;

code = code.replace(tailDivs, '');

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Removed tail!');
