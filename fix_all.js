const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// 1. Lower pixelSize difficulty
code = code.replace('const [pixelSize, setPixelSize] = useState(12);', 'const [pixelSize, setPixelSize] = useState(8);');

// 2. Fix the Image load popup glitch (set image to null when src changes)
code = fs.readFileSync('src/components/PixelatedImage.tsx', 'utf-8');
code = code.replace(
  "useEffect(() => {\n    const img = new Image();",
  "useEffect(() => {\n    setImgElement(null);\n    const img = new Image();"
);
fs.writeFileSync('src/components/PixelatedImage.tsx', code);

// Reload play/page.tsx
code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// 3. Delay handleTimeOut and reveal the image completely
const oldTimeOut = `  const handleTimeOut = () => {
    setGameStatus('wrong');
    // No grayscale filter wanted
    setTimeout(handleNext, 800);
  };`;

const newTimeOut = `  const handleTimeOut = () => {
    setGameStatus('wrong');
    setPixelSize(1); // fully reveal the image
    setTimeout(handleNext, 2000); // 2 second delay for student to read
  };`;
code = code.replace(oldTimeOut, newTimeOut);

// 4. Inject Blanks Hint UI robustly!
const formStart = '<form onSubmit={handleGuess} className="relative">';
const formIndex = code.indexOf(formStart);
if (formIndex !== -1) {
  const injection = `
                    <div className="flex justify-center mb-6">
                      <div className="flex gap-1 sm:gap-2 text-2xl sm:text-3xl font-mono font-black text-black tracking-widest bg-[#f4f0e6] px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {currentLogo.name.split('').map((char, i) => (
                          <span key={i} className={char === ' ' ? 'w-4' : ''}>
                            {char === ' ' ? ' ' : (char === '-' ? '-' : '_')}
                          </span>
                        ))}
                      </div>
                    </div>`;
  
  code = code.substring(0, formIndex + formStart.length) + injection + code.substring(formIndex + formStart.length);
}

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed everything robustly!');
