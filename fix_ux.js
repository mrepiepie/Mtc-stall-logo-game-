const fs = require('fs');

// 1. Fix Canvas Ghost Bug
let pxCode = fs.readFileSync('src/components/PixelatedImage.tsx', 'utf-8');
const clearCanvasCode = `  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (!imgElement) {
      // CLEAR THE CANVAS ENTIRELY to prevent ghosting!
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // Set canvas dimensions`;
pxCode = pxCode.replace(`  useEffect(() => {
    if (!imgElement || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions`, clearCanvasCode);
fs.writeFileSync('src/components/PixelatedImage.tsx', pxCode);

// 2. Fix Input Auto-submit and Wrong Answer Reveal
let playCode = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// Auto-submit logic inside onChange
const oldOnChange = `onChange={e => { setGuess(e.target.value); setCloseGuessWarning(false); }}`;
const newOnChange = `onChange={e => {
                          const val = e.target.value;
                          setGuess(val);
                          setCloseGuessWarning(false);
                          
                          // Auto-submit if they got it right!
                          const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
                          if (normalize(val) === normalize(currentLogo.name)) {
                            // Fake a form event to submit
                            handleGuess({ preventDefault: () => {} } as any);
                          }
                        }}`;
playCode = playCode.replace(oldOnChange, newOnChange);

// Reveal correct answer on timeout
const oldInput = `<input 
                      ref={guessInputRef}`;
const newInput = `<input 
                      ref={guessInputRef}
                      value={gameStatus === 'wrong' ? currentLogo.name : guess}`;
// We already have value={guess} further down, so we need to replace the entire input definition safely
// Actually, let's just replace `value={guess}` directly!
playCode = playCode.replace('value={guess}', "value={gameStatus === 'wrong' ? currentLogo.name : guess}");

// Change the background color if it's wrong to a contrasting color
playCode = playCode.replace(
  'className="w-full bg-white border-4 border-black',
  'className={`w-full border-4 border-black ${gameStatus === "wrong" ? "bg-red-500 text-white placeholder-transparent" : "bg-white text-black"} '
);
// We also need to add back the missing closing quote for the classname. It was:
// className="w-full bg-white border-4 border-black rounded-none px-6 py-4 ...
// So let's replace `bg-white text-black`
// Wait, the original class was `guess-input w-full bg-white border-4 border-black rounded-none px-6 py-4 sm:py-5 text-xl sm:text-2xl font-black text-black focus:outline-none focus:bg-yellow-50 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 text-center placeholder:text-zinc-400 placeholder:font-bold`

playCode = playCode.replace(
  'className="guess-input w-full bg-white border-4 border-black rounded-none px-6 py-4 sm:py-5 text-xl sm:text-2xl font-black text-black',
  'className={`guess-input w-full border-4 border-black rounded-none px-6 py-4 sm:py-5 text-xl sm:text-2xl font-black ${gameStatus === "wrong" ? "bg-red-500 text-white" : "bg-white text-black"}`'
);

// We need to fix the closing brace for className. The original string had a `"` at the end of the long string.
// Let's just use regex for the whole className property.
const oldClassName = `className="guess-input w-full bg-white border-4 border-black rounded-none px-6 py-4 sm:py-5 text-xl sm:text-2xl font-black text-black focus:outline-none focus:bg-yellow-50 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 text-center placeholder:text-zinc-400 placeholder:font-bold"`;
const newClassName = `className={\`guess-input w-full border-4 border-black rounded-none px-6 py-4 sm:py-5 text-xl sm:text-2xl font-black focus:outline-none focus:bg-yellow-50 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center placeholder:text-zinc-400 placeholder:font-bold \${gameStatus === 'wrong' ? 'bg-red-500 text-white opacity-100' : 'bg-white text-black disabled:opacity-50'}\`}`;
playCode = playCode.replace(oldClassName, newClassName);

// Increase timeout delay explicitly to 2.5 seconds just in case!
playCode = playCode.replace('setTimeout(handleNext, 2000);', 'setTimeout(handleNext, 2500);');

fs.writeFileSync('src/app/play/page.tsx', playCode);
console.log('Fixed ghost image, auto-submit, and wrong answer reveal!');
