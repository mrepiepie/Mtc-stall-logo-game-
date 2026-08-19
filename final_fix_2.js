const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// 1. Revert timer to not depixelate. 
// At 7dc3882, the timer is:
//     const timerId = setInterval(() => {
//       setTimeLeft(prev => prev - 1);
//       setPixelSize(prev => Math.max(1, prev - 3));
//     }, 1000);
// Let's replace it properly.
const oldTimerRegex = /const timerId = setInterval\(\(\) => \{[\s\S]*?\}, 1000\);/;
code = code.replace(oldTimerRegex, 'const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);');

// 2. Inject Button UI
const buttonUI = `                    </form>

                    <button 
                      type="button"
                      onClick={handleHint}
                      disabled={pixelSize <= 5 || gameStatus !== 'playing'}
                      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 border-4 border-black rounded-none py-3 sm:py-4 transition-all text-base sm:text-lg font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase mt-4"
                    >
                      <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                      REVEAL -20 POINTS
                    </button>
                  </div>
                </div>
              )}
            </main>`;

const lastFormIdx = code.lastIndexOf('</form>');
if (lastFormIdx !== -1) {
  const startToForm = code.substring(0, lastFormIdx);
  const endPart = code.substring(lastFormIdx);
  const newEndPart = endPart.replace(/<\/form>[\s\S]*?<\/main>/, buttonUI);
  code = startToForm + newEndPart;
}

fs.writeFileSync('src/app/play/page.tsx', code);
