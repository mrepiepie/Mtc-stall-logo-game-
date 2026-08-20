const fs = require('fs');
let c = fs.readFileSync('src/app/join/page.tsx', 'utf8');

c = c.replace(
  "const [timeLeft, setTimeLeft] = useState(10);",
  "const [timeLeft, setTimeLeft] = useState(10);\n  const [formats, setFormats] = useState<string[]>([]);"
);

c = c.replace(
  "setIsJoining(false);\n        setStep('waiting');",
  "if (data.formats) setFormats(data.formats);\n        setIsJoining(false);\n        setStep('waiting');"
);

const mascotOld = `          {/* Mascot GSAP Speech Bubble dropping from top right */}
          <div 
            ref={mascotRef}
            className="absolute -top-4 -right-4 md:-right-12 z-50 opacity-0 invisible origin-top-right"
          >
            <div className="bg-[#f4f0e6] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-4 flex flex-col items-center justify-center min-w-[200px] rounded-none relative z-0">
              <div className="text-6xl drop-shadow-md mb-2 animate-[bounce_1s_infinite]">👽</div>`;

const mascotNew = `          {/* Mascot GSAP Speech Bubble dropping from top right */}
          <div 
            ref={mascotRef}
            className="fixed top-4 right-4 md:top-12 md:right-12 z-50 opacity-0 invisible origin-top-right"
          >
            <div className="bg-[#f4f0e6] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-4 flex flex-col items-center justify-center min-w-[200px] rounded-none relative z-0">
              <img src="https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f47d.png" className="w-16 h-16 drop-shadow-md mb-2 animate-[bounce_1s_infinite]" alt="Mascot" />`;

c = c.replace(mascotOld, mascotNew);

const inputOld = `<form onSubmit={submitGuess} className="w-full flex flex-col gap-4">
                <input 
                  type="text" 
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder={timeLeft <= 0 ? "TIME IS UP!" : "TYPE YOUR ANSWER..."}
                  className={\`w-full bg-white border-4 border-black p-5 text-2xl font-black text-black placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-red-500/20 rounded-none uppercase tracking-widest transition-all text-center\`}`;

const inputNew = `<form onSubmit={submitGuess} className="w-full flex flex-col gap-4">
                {formats[round - 1] && (
                  <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-2 pointer-events-none">
                    {formats[round - 1].split('').map((char, i) => {
                      const isSpace = char === ' ';
                      const isFilled = guess.length > i;
                      const guessChar = guess[i] || '';
                      
                      if (isSpace) return <div key={i} className="w-3 md:w-4" />;
                      
                      return (
                        <div key={i} className={\`w-8 h-10 md:w-10 md:h-12 border-b-4 flex items-center justify-center font-black text-xl md:text-2xl uppercase transition-all duration-150 \${isFilled ? 'border-red-600 text-red-600 -translate-y-1' : 'border-black text-black'}\`}>
                          {guessChar}
                        </div>
                      );
                    })}
                  </div>
                )}
                <input 
                  type="text" 
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder={timeLeft <= 0 ? "TIME IS UP!" : "TYPE YOUR ANSWER..."}
                  className={\`w-full bg-white border-4 border-black p-5 text-2xl font-black text-black placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-red-500/20 rounded-none uppercase tracking-widest transition-all text-center \${formats[round - 1] ? 'text-transparent caret-black' : ''}\`}`;

c = c.replace(inputOld, inputNew);

fs.writeFileSync('src/app/join/page.tsx', c);
console.log('done');
