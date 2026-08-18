const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const countdownJsx = `      {/* COUNTDOWN SCREEN */}
      {step === 'countdown' && (
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-6">
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-8 drop-shadow-sm">Initializing</h2>
            <AnimatedCounter value={countdownValue} fontSize={100} />
          </div>
        </div>
      )}

      {/* GAME */}`;

code = code.replace('{/* GAME */}', countdownJsx);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Added countdown JSX!');
