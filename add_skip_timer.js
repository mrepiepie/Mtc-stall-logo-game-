const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// We will use standard string replacement for the chunks we know.

// 1. Add nextTimer state
if (!code.includes('nextTimer')) {
  code = code.replace(
    "const [gameStatus, setGameStatus] = useState<'playing' | 'correct' | 'wrong' | 'gameover'>('playing');",
    "const [gameStatus, setGameStatus] = useState<'playing' | 'correct' | 'wrong' | 'gameover'>('playing');\n  const [nextTimer, setNextTimer] = useState<number | null>(null);"
  );
}

// 2. Add useEffect for nextTimer
if (!code.includes('nextTimer > 0')) {
  const nextTimerEffect = `
  useEffect(() => {
    if (nextTimer === null) return;
    if (nextTimer > 0) {
      const id = setTimeout(() => setNextTimer(prev => prev! - 1), 1000);
      return () => clearTimeout(id);
    } else {
      handleNext();
    }
  }, [nextTimer]);
  `;
  code = code.replace("const handleTimeOut =", nextTimerEffect + "\n  const handleTimeOut =");
}

// 3. Update handleTimeOut to use nextTimer instead of setTimeout
const oldHandleTimeOut = `  const handleTimeOut = () => {
    setGameStatus('wrong');
    // No grayscale filter wanted
    setTimeout(handleNext, 800);
  };`;
const newHandleTimeOut = `  const handleTimeOut = () => {
    setGameStatus('wrong');
    setPixelSize(1);
    setNextTimer(3);
  };`;
if (code.includes(oldHandleTimeOut)) {
  code = code.replace(oldHandleTimeOut, newHandleTimeOut);
}

// 4. Update handleGuess to allow skipping
const oldHandleGuess = `    if (gameStatus !== 'playing' || !guess.trim()) return;`;
const newHandleGuess = `    if (gameStatus !== 'playing') {
      if (nextTimer !== null) {
        setNextTimer(null);
        handleNext();
      }
      return;
    }
    if (!guess.trim()) return;`;
if (code.includes(oldHandleGuess)) {
  code = code.replace(oldHandleGuess, newHandleGuess);
}

// 5. Update correct answer to use nextTimer
const oldCorrect = `      if (isCorrect) {
        setGameStatus('correct');
        const timeBonus = timeLeft * 10;
        setTotalScore(prev => prev + logoPoints + timeBonus);
        
        let pool = JOKES_SLOW;
        if (timeLeft >= 7) pool = JOKES_FAST;
        else if (timeLeft >= 4) pool = JOKES_MID;
        const randomJoke = pool[Math.floor(Math.random() * pool.length)];
        setJokeContent(randomJoke);
  
        gsap.to('.logo-container canvas', { scale: 1.02, duration: 0.4, ease: 'power2.out' });
        setTimeout(handleNext, 1200); 
      }`;
const newCorrect = `      if (isCorrect) {
        setGameStatus('correct');
        const timeBonus = timeLeft * 10;
        setTotalScore(prev => prev + logoPoints + timeBonus);
        
        let pool = JOKES_SLOW;
        if (timeLeft >= 7) pool = JOKES_FAST;
        else if (timeLeft >= 4) pool = JOKES_MID;
        const randomJoke = pool[Math.floor(Math.random() * pool.length)];
        setJokeContent(randomJoke);
  
        gsap.to('.logo-container canvas', { scale: 1.02, duration: 0.4, ease: 'power2.out' });
        setNextTimer(2);
      }`;
if (code.includes(oldCorrect)) {
  code = code.replace(oldCorrect, newCorrect);
}

// 6. Update handleNext to reset nextTimer
const oldNext = `          setCloseGuessWarning(false);
          setGameStatus('playing');`;
const newNext = `          setCloseGuessWarning(false);
          setGameStatus('playing');
          setNextTimer(null);`;
if (code.includes(oldNext)) {
  code = code.replace(oldNext, newNext);
}

// 7. Inject the UI banner for skipping below the form
const oldFormClose = `                    </form>
                  </div>
                </div>
              </div>
            </div>`;
const newFormClose = `                    </form>
                    {nextTimer !== null && (
                      <div className="mt-4 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-2">
                        <div className="bg-[#f4f0e6] border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center w-full max-w-sm cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => { setNextTimer(null); handleNext(); }}>
                          <h3 className="font-black text-black text-lg uppercase tracking-widest mb-1">Next in {nextTimer}s</h3>
                          <p className="font-bold text-zinc-500 text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                            <span>Press</span>
                            <span className="bg-black text-white px-2 py-0.5 rounded-sm">Enter</span>
                            <span>to skip</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>`;
if (code.includes(oldFormClose)) {
  code = code.replace(oldFormClose, newFormClose);
}

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Done!');
