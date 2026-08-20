const fs = require('fs');
let c = fs.readFileSync('src/app/join/page.tsx', 'utf8');

c = c.replace(
  "const [step, setStep] = useState<'form' | 'waiting' | 'playing' | 'leaderboard'>('form');",
  "const [step, setStep] = useState<'form' | 'waiting' | 'countdown' | 'playing' | 'leaderboard'>('form');\n  const [countdown, setCountdown] = useState(3);"
);

c = c.replace(
  "// Local timer synced loosely when playing state starts\n  useEffect(() => {",
  "// Local timer synced loosely when playing state starts\n  useEffect(() => {\n    if (step === 'countdown' && countdown > 0) {\n      const timerId = setInterval(() => setCountdown(prev => prev - 1), 1000);\n      return () => clearInterval(timerId);\n    }\n"
);
c = c.replace("[step, timeLeft]);", "[step, timeLeft, countdown]);");

c = c.replace(
  "if (newStatus === 'playing' && step !== 'playing') {",
  "if (newStatus === 'countdown' && step !== 'countdown') {\n            setStep('countdown');\n            setCountdown(3);\n          } else if (newStatus === 'playing' && step !== 'playing') {"
);

c = c.replace(
  "filter: `id=eq=${gameCode}`",
  "filter: `id=eq.${gameCode}`" // VERY IMPORTANT BUGFIX!
);

const countdownJSX = `
      {step === 'countdown' && (
        <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
          <div className="bg-[#f4f0e6] border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-none w-full p-10 flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl font-black text-black uppercase tracking-widest mb-4">Get Ready...</h2>
            <div className="text-[10rem] leading-none font-black text-red-600 animate-[bounce_1s_infinite]">
              {countdown > 0 ? countdown : 'GO!'}
            </div>
          </div>
        </div>
      )}
`;

c = c.replace(
  "{step === 'waiting' && (",
  countdownJSX + "\n      {step === 'waiting' && ("
);

fs.writeFileSync('src/app/join/page.tsx', c);
console.log('done');
