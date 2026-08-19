const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const oldInput = `<form onSubmit={handleGuess} className="relative">
                    <input 
                      ref={guessInputRef}`;

const newInput = `<form onSubmit={handleGuess} className="relative">
                    <div className="flex justify-center mb-6">
                      <div className="flex gap-1 sm:gap-2 text-2xl sm:text-3xl font-mono font-black text-black tracking-widest bg-[#f4f0e6] px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {currentLogo.name.split('').map((char, i) => (
                          <span key={i} className={char === ' ' ? 'w-4' : ''}>
                            {char === ' ' ? ' ' : (char === '-' ? '-' : '_')}
                          </span>
                        ))}
                      </div>
                    </div>
                    <input 
                      ref={guessInputRef}`;

if (code.includes('<form onSubmit={handleGuess} className="relative">')) {
  code = code.replace(oldInput, newInput);
  fs.writeFileSync('src/app/play/page.tsx', code);
  console.log('Successfully injected blanks hint!');
} else {
  console.log('Failed to find form tag!');
}
