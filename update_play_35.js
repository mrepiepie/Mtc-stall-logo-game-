const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

code = code.replace(
  /<CheckCircle2[\s\S]*?<\/div>\s*<\/div>\s*\)\}/g,
  `<CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-green-600 mb-4" />
                        <div className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tighter mb-4">Correct</div>
                        {jokeContent && (
                          <div className="flex items-center gap-3 bg-white px-6 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none text-center mx-4">
                            <span className="text-lg sm:text-xl font-black uppercase text-black">{jokeContent.text}</span>
                            <img src={jokeContent.emoji} className="w-10 h-10 drop-shadow-sm flex-shrink-0" alt="emoji" />
                          </div>
                        )}
                      </div>
                    )}`
);

code = code.replace(
  /<XCircle[\s\S]*?<\/div>\s*<\/div>\s*\)\}/g,
  `<XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-600 mb-4" />
                        <div className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tighter mb-3">Time Expired</div>
                        <div className="bg-black text-white px-6 py-3 border-4 border-black font-black uppercase tracking-widest text-lg sm:text-xl shadow-[6px_6px_0px_0px_rgba(255,0,0,1)]">Target was {currentLogo.name}</div>
                      </div>
                    )}`
);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Regex replace executed!');
