import re

with open('src/app/play/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Replace the JOKES arrays entirely
new_jokes = """const NOTO_BASE = "https://fonts.gstatic.com/s/e/notoemoji/latest";

const JOKES_FAST = [
  { text: "Woah that was quick.. calm down twin", emoji: `${NOTO_BASE}/1f480/512.webp` },
  { text: "Bro is literally a human scanner", emoji: `${NOTO_BASE}/1f92f/512.webp` },
  { text: "Are you cheating?!", emoji: `${NOTO_BASE}/1f928/512.webp` },
  { text: "Speedforce activated", emoji: `${NOTO_BASE}/26a1/512.webp` },
  { text: "Bro has 20/20 vision", emoji: `${NOTO_BASE}/1f440/512.webp` },
  { text: "Unreal reaction time", emoji: `${NOTO_BASE}/1f680/512.webp` },
];
const JOKES_MID = [
  { text: "Solid pace, but I've seen faster", emoji: `${NOTO_BASE}/1f971/512.webp` },
  { text: "Not bad, but don't get cocky", emoji: `${NOTO_BASE}/1f921/512.webp` },
  { text: "Acceptable... barely.", emoji: `${NOTO_BASE}/1f644/512.webp` },
  { text: "Average behavior.", emoji: `${NOTO_BASE}/1f610/512.webp` },
  { text: "You're doing okay sweetie", emoji: `${NOTO_BASE}/1f485_1f3fc/512.webp` },
  { text: "Nothing to brag about", emoji: `${NOTO_BASE}/1f937_1f3fd_200d_2642_fe0f/512.webp` },
];
const JOKES_SLOW = [
  { text: "Fighting for your life out here", emoji: `${NOTO_BASE}/1f975/512.webp` },
  { text: "Bro was sweating bullets", emoji: `${NOTO_BASE}/1f630/512.webp` },
  { text: "My grandma types faster...", emoji: `${NOTO_BASE}/1f475_1f3fc/512.webp` },
  { text: "Did you fall asleep?", emoji: `${NOTO_BASE}/1f634/512.webp` },
  { text: "Barely made it out alive", emoji: `${NOTO_BASE}/1f915/512.webp` },
  { text: "Bro is playing in slow motion", emoji: `${NOTO_BASE}/1f40c/512.webp` },
];
const JOKES_FAIL = [
  { text: "Bro was literally sleeping", emoji: `${NOTO_BASE}/1f634/512.webp` },
  { text: "Is your keyboard even plugged in?", emoji: `${NOTO_BASE}/2328_fe0f/512.webp` },
  { text: "Embarrassing tbh", emoji: `${NOTO_BASE}/1f926_1f3fc_200d_2642_fe0f/512.webp` },
  { text: "You're getting cooked out here", emoji: `${NOTO_BASE}/1f373/512.webp` },
  { text: "0 points. 0 aura.", emoji: `${NOTO_BASE}/1f480/512.webp` },
  { text: "My screen froze... yeah right.", emoji: `${NOTO_BASE}/1f976/512.webp` },
  { text: "HURRY UP TWIN! TIME IS TICKING...", emoji: `${NOTO_BASE}/1f47d/512.webp` }
];"""

code = re.sub(r'const NOTO_BASE = "https://fonts\.gstatic\.com.*?\];', new_jokes, code, flags=re.DOTALL)

# 2. Modify handleTimeOut
old_timeout = """  const handleTimeOut = () => {
    setGameStatus('wrong');
    // No grayscale filter wanted
    setPixelSize(1);
    setNextTimer(2);
  };"""

new_timeout = """  const handleTimeOut = () => {
    setGameStatus('wrong');
    const randomJoke = JOKES_FAIL[Math.floor(Math.random() * JOKES_FAIL.length)];
    setJokeContent(randomJoke);
    setPixelSize(1);
    setNextTimer(2);
  };"""

code = code.replace(old_timeout, new_timeout)

# 3. Add joke rendering to the 'wrong' state
old_wrong_ui = """                    {gameStatus === 'wrong' && (
                      <div className="absolute inset-0 bg-[#f4f0e6]/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-in fade-in duration-200">
                        <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-600 mb-4" />
                        <div className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tighter mb-3">Time Expired</div>
                        <div className="bg-black text-white px-6 py-3 border-4 border-black font-black uppercase tracking-widest text-lg sm:text-xl shadow-[6px_6px_0px_0px_rgba(255,0,0,1)] mt-2">Target was {currentLogo.name}</div>
                      </div>
                    )}"""

new_wrong_ui = """                    {gameStatus === 'wrong' && (
                      <div className="absolute inset-0 bg-[#f4f0e6]/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-in fade-in duration-200">
                        <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-600 mb-4" />
                        <div className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tighter mb-3">Time Expired</div>
                        <div className="bg-black text-white px-6 py-3 border-4 border-black font-black uppercase tracking-widest text-lg sm:text-xl shadow-[6px_6px_0px_0px_rgba(255,0,0,1)] my-4">Target was {currentLogo.name}</div>
                        {jokeContent && (
                          <div className="flex items-center gap-3 bg-white px-6 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none text-center mx-4">
                            <span className="text-lg sm:text-xl font-black uppercase text-black">{jokeContent.text}</span>
                            <img src={jokeContent.emoji} className="w-10 h-10 drop-shadow-sm flex-shrink-0" alt="emoji" />
                          </div>
                        )}
                      </div>
                    )}"""

code = code.replace(old_wrong_ui, new_wrong_ui)

with open('src/app/play/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Python script completed.")
