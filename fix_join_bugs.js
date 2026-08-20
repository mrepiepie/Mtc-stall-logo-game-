const fs = require('fs');
let c = fs.readFileSync('src/app/join/page.tsx', 'utf8');

const replacementJokes = `
const JOKES_FAST = [
  { text: "Woah that was quick.. calm down twin", emoji: "💀" },
  { text: "Bro is literally a human scanner", emoji: "🤯" },
  { text: "Are you cheating?!", emoji: "🤨" },
  { text: "Speedforce activated", emoji: "⚡" },
  { text: "Bro has 20/20 vision", emoji: "👀" },
  { text: "Unreal reaction time", emoji: "🚀" },
];
const JOKES_MID = [
  { text: "Solid pace, but I've seen faster", emoji: "🥱" },
  { text: "Not bad, but don't get cocky", emoji: "🤡" },
  { text: "Acceptable... barely.", emoji: "🙄" },
  { text: "Average behavior.", emoji: "😐" },
  { text: "You're doing okay sweetie", emoji: "💅" },
  { text: "Nothing to brag about", emoji: "🤷‍♂️" },
];
const JOKES_SLOW = [
  { text: "Fighting for your life out here", emoji: "🥵" },
  { text: "Bro was sweating bullets", emoji: "😰" },
  { text: "My grandma types faster...", emoji: "👵" },
  { text: "Did you fall asleep?", emoji: "😴" },
  { text: "Barely made it out alive", emoji: "🤕" },
  { text: "Bro is playing in slow motion", emoji: "🐌" },
];
const JOKES_FAIL = [
  { text: "Bro was literally sleeping", emoji: "😴" },
  { text: "Is your keyboard even plugged in?", emoji: "⌨️" },
  { text: "Embarrassing tbh", emoji: "🤦‍♂️" },
  { text: "You're getting cooked out here", emoji: "🍳" },
  { text: "0 points. 0 aura.", emoji: "💀" },
  { text: "My screen froze... yeah right.", emoji: "🥶" },
  { text: "HURRY UP TWIN! TIME IS TICKING...", emoji: "👽" }
];
`;

c = c.replace(/const JOKES_FAST = \[[\s\S]*?const JOKES_FAIL = \[[\s\S]*?\];/g, replacementJokes.trim());

// Remove NOTO_BASE
c = c.replace("const NOTO_BASE = 'https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u';", "");

// Fix Mascot emoji rendering
c = c.replace(
  /<img src={\`\${NOTO_BASE}\/1f47d\/512\.webp\`} className="w-16 h-16 drop-shadow-md mb-2 animate-\[bounce_1s_infinite\]" alt="Mascot" \/>/g,
  '<div className="text-6xl drop-shadow-md mb-2 animate-[bounce_1s_infinite]">👽</div>'
);

// Fix Joke emoji rendering
c = c.replace(
  /<img src={joke\.emoji} className="w-10 h-10 drop-shadow-sm flex-shrink-0" alt="emoji" \/>/g,
  '<span className="text-4xl drop-shadow-sm flex-shrink-0">{joke.emoji}</span>'
);

// Disable input when time is up
c = c.replace(
  /placeholder="TYPE YOUR ANSWER\.\.\."/g,
  'placeholder={timeLeft <= 0 ? "TIME IS UP!" : "TYPE YOUR ANSWER..."}'
);
c = c.replace(
  /disabled={isSubmitting}/g,
  'disabled={isSubmitting || timeLeft <= 0}'
);

fs.writeFileSync('src/app/join/page.tsx', c);
console.log('done');
