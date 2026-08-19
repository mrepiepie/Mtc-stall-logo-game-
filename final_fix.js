const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const NOTO_BASE = 'const NOTO_BASE = "https://fonts.gstatic.com/s/e/notoemoji/latest";';
const JOKES_SLOW_END = '  ];\\r\\n  \\r\\n  export default function PlayPage() {';

const startIndex = code.indexOf(NOTO_BASE);
const endIndex = code.indexOf('export default function PlayPage() {');

const newJokes = \`const NOTO_BASE = "https://fonts.gstatic.com/s/e/notoemoji/latest";

const JOKES_FAST = [
  { text: "Woah that was quick.. calm down twin", emoji: \\\`\${NOTO_BASE}/1f480/512.webp\\\` },
  { text: "Bro is literally a human scanner", emoji: \\\`\${NOTO_BASE}/1f92f/512.webp\\\` },
  { text: "Are you cheating?!", emoji: \\\`\${NOTO_BASE}/1f928/512.webp\\\` },
  { text: "Speedforce activated", emoji: \\\`\${NOTO_BASE}/26a1/512.webp\\\` },
  { text: "Bro has 20/20 vision", emoji: \\\`\${NOTO_BASE}/1f440/512.webp\\\` },
  { text: "Unreal reaction time", emoji: \\\`\${NOTO_BASE}/1f680/512.webp\\\` },
];
const JOKES_MID = [
  { text: "Solid pace, but I've seen faster", emoji: \\\`\${NOTO_BASE}/1f971/512.webp\\\` },
  { text: "Not bad, but don't get cocky", emoji: \\\`\${NOTO_BASE}/1f921/512.webp\\\` },
  { text: "Acceptable... barely.", emoji: \\\`\${NOTO_BASE}/1f644/512.webp\\\` },
  { text: "Average behavior.", emoji: \\\`\${NOTO_BASE}/1f610/512.webp\\\` },
  { text: "You're doing okay sweetie", emoji: \\\`\${NOTO_BASE}/1f485_1f3fc/512.webp\\\` },
  { text: "Nothing to brag about", emoji: \\\`\${NOTO_BASE}/1f937_1f3fd_200d_2642_fe0f/512.webp\\\` },
];
const JOKES_SLOW = [
  { text: "Fighting for your life out here", emoji: \\\`\${NOTO_BASE}/1f975/512.webp\\\` },
  { text: "Bro was sweating bullets", emoji: \\\`\${NOTO_BASE}/1f630/512.webp\\\` },
  { text: "My grandma types faster...", emoji: \\\`\${NOTO_BASE}/1f475_1f3fc/512.webp\\\` },
  { text: "Did you fall asleep?", emoji: \\\`\${NOTO_BASE}/1f634/512.webp\\\` },
  { text: "Barely made it out alive", emoji: \\\`\${NOTO_BASE}/1f915/512.webp\\\` },
  { text: "Bro is playing in slow motion", emoji: \\\`\${NOTO_BASE}/1f40c/512.webp\\\` },
];
const JOKES_FAIL = [
  { text: "Bro was literally sleeping", emoji: \\\`\${NOTO_BASE}/1f634/512.webp\\\` },
  { text: "Is your keyboard even plugged in?", emoji: \\\`\${NOTO_BASE}/2328_fe0f/512.webp\\\` },
  { text: "Embarrassing tbh", emoji: \\\`\${NOTO_BASE}/1f926_1f3fc_200d_2642_fe0f/512.webp\\\` },
  { text: "You're getting cooked out here", emoji: \\\`\${NOTO_BASE}/1f373/512.webp\\\` },
  { text: "0 points. 0 aura.", emoji: \\\`\${NOTO_BASE}/1f480/512.webp\\\` },
  { text: "My screen froze... yeah right.", emoji: \\\`\${NOTO_BASE}/1f976/512.webp\\\` },
  { text: "HURRY UP TWIN! TIME IS TICKING...", emoji: \\\`\${NOTO_BASE}/1f47d/512.webp\\\` }
];

\`;

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + newJokes + code.substring(endIndex);
}

const timeoutRegex = /const handleTimeOut = \(\) => \\{[^}]*setNextTimer\\(2\\);\\r?\\n  \\};/s;

const newTimeout = \`const handleTimeOut = () => {
    setGameStatus('wrong');
    const randomJoke = JOKES_FAIL[Math.floor(Math.random() * JOKES_FAIL.length)];
    setJokeContent(randomJoke);
    setPixelSize(1);
    setNextTimer(2);
  };\`;

code = code.replace(timeoutRegex, newTimeout);

const wrongRegex = /<div className="bg-black text-white px-6 py-3 border-4 border-black font-black uppercase tracking-widest text-lg sm:text-xl shadow-\\[6px_6px_0px_0px_rgba\\(255,0,0,1\\)\\] mt-2">Target was \\{currentLogo\\.name\\}<\\/div>\\r?\\n\\s*<\\/div>\\r?\\n\\s*\\)}/m;

const newWrongRender = \`<div className="bg-black text-white px-6 py-3 border-4 border-black font-black uppercase tracking-widest text-lg sm:text-xl shadow-[6px_6px_0px_0px_rgba(255,0,0,1)] my-4">Target was {currentLogo.name}</div>
                      {jokeContent && (
                        <div className="flex items-center gap-3 bg-white px-6 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none text-center mx-4">
                          <span className="text-lg sm:text-xl font-black uppercase text-black">{jokeContent.text}</span>
                          <img src={jokeContent.emoji} className="w-10 h-10 drop-shadow-sm flex-shrink-0" alt="emoji" />
                        </div>
                      )}
                    </div>
                  )}\`;

code = code.replace(wrongRegex, newWrongRender);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('done');
