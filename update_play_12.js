const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const READY_TITLES = `const READY_TITLES = [
  "Are you down for the challenge?",
  "Ready to get roasted?",
  "Hope you know your logos...",
  "Don't embarrass yourself.",
  "Time to prove your worth.",
  "Prepare for pixelated pain.",
  "Try not to cry.",
  "Let's see what you got.",
  "Good luck, you'll need it.",
  "No pressure. Just kidding, lots of pressure."
];`;

if (!code.includes('READY_TITLES')) {
  code = code.replace(
    'const TIMER_SECONDS = 10;',
    `const TIMER_SECONDS = 10;\n${READY_TITLES}`
  );
}

if (!code.includes('const [readyTitle')) {
  code = code.replace(
    "const [step, setStep] = useState<'intro' | 'popup' | 'game'>('intro');",
    "const [step, setStep] = useState<'intro' | 'popup' | 'game'>('intro');\n  const [readyTitle, setReadyTitle] = useState(READY_TITLES[0]);"
  );
}

// In handleRegSubmit
const regSubmitOld = `      gsap.to('.intro-container', { 
        opacity: 0, y: -30, duration: 0.5, ease: 'power3.in',
        onComplete: () => {
          setStep('popup');`;

const regSubmitNew = `      gsap.to('.intro-container', { 
        opacity: 0, y: -30, duration: 0.5, ease: 'power3.in',
        onComplete: () => {
          setReadyTitle(READY_TITLES[Math.floor(Math.random() * READY_TITLES.length)]);
          setStep('popup');`;

if (code.includes(regSubmitOld)) {
  code = code.replace(regSubmitOld, regSubmitNew);
}

// In the JSX
const jsxOld = `<h2 className="text-5xl font-black uppercase tracking-tighter mb-4 text-black">
                System Ready
              </h2>`;
const jsxNew = `<h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-4 text-black">
                {readyTitle}
              </h2>`;

if (code.includes(jsxOld)) {
  code = code.replace(jsxOld, jsxNew);
}

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Added random funny titles!');
