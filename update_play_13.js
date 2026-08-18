const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// 1. Add AnimatedCounter import
if (!code.includes('AnimatedCounter')) {
  code = code.replace(
    `import { DeBugger } from "@/components/ui/de-bugger";`,
    `import { DeBugger } from "@/components/ui/de-bugger";\nimport { AnimatedCounter } from "@/components/ui/animated-counter";`
  );
}

// 2. Add 'countdown' to step state
code = code.replace(
  "const [step, setStep] = useState<'intro' | 'popup' | 'game'>('intro');",
  "const [step, setStep] = useState<'intro' | 'popup' | 'countdown' | 'game'>('intro');\n  const [countdownValue, setCountdownValue] = useState(3);"
);

// 3. Update 'popup' enter key logic to go to 'countdown' instead of 'game'
const popupEffectOld = `    useEffect(() => {
      if (step !== 'popup') return;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          gsap.to('.ready-popup', { 
            scale: 0.95, opacity: 0, duration: 0.3, 
            onComplete: () => {
              setStep('game');
              gsap.fromTo('.game-container', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
            }
          });
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [step]);`;

const popupEffectNew = `    useEffect(() => {
      if (step !== 'popup') return;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          gsap.to('.ready-popup', { 
            scale: 0.95, opacity: 0, duration: 0.3, 
            onComplete: () => {
              setStep('countdown');
            }
          });
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [step]);

    // Countdown logic
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
    }, [step]);`;

code = code.replace(popupEffectOld, popupEffectNew);

// 4. Add countdown JSX right before game JSX
const gameJsxOld = `      {/* GAME BOARD */}`;
const gameJsxNew = `      {/* COUNTDOWN SCREEN */}
      {step === 'countdown' && (
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-6">
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-8 drop-shadow-sm">Initializing</h2>
            <AnimatedCounter value={countdownValue} />
          </div>
        </div>
      )}
      
      {/* GAME BOARD */}`;

code = code.replace(gameJsxOld, gameJsxNew);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Added Countdown!');
