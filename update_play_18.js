const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const oldCheck = `<div className="bg-green-50 p-4 rounded-full mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>`;
const newCheck = `<div className="bg-[#f4f0e6] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 rounded-none mb-6">
                      <CheckCircle2 className="w-10 h-10 text-black" />
                    </div>`;

code = code.replace(oldCheck, newCheck);

const oldP = `<p className="text-zinc-500 font-medium mb-8">Your final score has been saved.</p>`;
const newP = `<p className="text-black font-bold uppercase tracking-widest mb-8">Run sequence terminated.</p>`;

code = code.replace(oldP, newP);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed Game Over check mark!');
