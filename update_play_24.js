const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// 1. Replace step state to include countdown
if (!code.includes("'countdown'")) {
  code = code.replace(
    /const \[step, setStep\] = useState<'intro' \| 'popup' \| 'game'>\('intro'\);/g,
    "const [step, setStep] = useState<'intro' | 'popup' | 'countdown' | 'game'>('intro');\n  const [countdownValue, setCountdownValue] = useState(3);"
  );
}

// 2. Change the enter key down logic
code = code.replace(
  /onComplete: \(\) => \{\s*setStep\('game'\);\s*gsap\.fromTo\('\.game-container', \{ opacity: 0, y: 20 \}, \{ opacity: 1, y: 0, duration: 0\.4 \}\);\s*\}/g,
  "onComplete: () => { setStep('countdown'); }"
);

// 3. Add the countdown useEffect
const countdownEffect = `    // Countdown logic
    useEffect(() => {
      if (step === 'countdown') {
        setCountdownValue(3);
        const timer = setInterval(() => {
          setCountdownValue(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setStep('game');
              gsap.fromTo('.game-container', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      }
    }, [step]);

    useEffect(() => {
      if (step !== 'game' || gameStatus !== 'playing') return;`;
      
code = code.replace(
  /useEffect\(\(\) => \{\s*if \(step !== 'game' \|\| gameStatus !== 'playing'\) return;/g,
  countdownEffect
);

// 4. Add the JSX for countdown
const countdownJsx = `      {/* COUNTDOWN SCREEN */}
      {step === 'countdown' && (
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-6">
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-8 drop-shadow-sm">Initializing</h2>
            <AnimatedCounter value={countdownValue} fontSize={100} />
          </div>
        </div>
      )}

      {/* GAME BOARD */}`;

if (!code.includes("step === 'countdown' && (")) {
  code = code.replace(
    /\{\/\* GAME BOARD \*\/\}/g,
    countdownJsx
  );
}

// 5. Update the button onClick
const oldBtn = /<div className="inline-flex items-center gap-3 bg-white px-8 py-5 border-4 border-black shadow-\[6px_6px_0px_0px_rgba\(0,0,0,1\)\] rounded-none">\s*<span className="text-lg font-black text-black uppercase">\s*Press <kbd className="bg-black text-white px-4 py-2 mx-2">ENTER<\/kbd> to begin\s*<\/span>\s*<\/div>/g;

const newBtn = `<div 
                className="inline-flex items-center gap-3 bg-white px-8 py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none cursor-pointer hover:bg-zinc-100 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                onClick={() => {
                  gsap.to('.ready-popup', { 
                    scale: 0.95, opacity: 0, duration: 0.3, 
                    onComplete: () => setStep('countdown')
                  });
                }}
              >
                <span className="text-lg font-black text-black uppercase pointer-events-none">
                  Press <kbd className="bg-black text-white px-4 py-2 mx-2">ENTER</kbd> or Click to begin
                </span>
              </div>`;

code = code.replace(oldBtn, newBtn);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed Countdown missing issue FOR REAL THIS TIME!');
