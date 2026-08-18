const fs = require("fs");
let code = fs.readFileSync("src/app/play/page.tsx", "utf-8");

// Replace top level div
code = code.replace(
  '<div className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col font-sans relative selection:bg-blue-200">',
  '<div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans relative selection:bg-red-500 overflow-hidden">'
);

// Replace background pattern
code = code.replace(
  '<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>',
  '<div className="absolute inset-0 bg-[radial-gradient(#333_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none z-0"></div>'
);

// Replace Mascot (make it brutalist if we want, or keep it. I will keep it for now but brutalist)
code = code.replace(
  '<div className="bg-white rounded-3xl shadow-2xl border-2 border-zinc-100 p-6 flex items-center gap-6 min-w-[300px]">',
  '<div className="bg-[#f4f0e6] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-6 flex items-center gap-6 min-w-[300px] rounded-none">'
);
code = code.replace(
  '<div className="text-zinc-500 font-medium">Time is ticking... ⏰</div>',
  '<div className="text-black font-bold uppercase tracking-wider">Time is ticking... ⏰</div>'
);

// We must replace the whole step === "intro" block!
const introBlockTarget = `      {/* INTRO SCREEN (Sequential Centered Layout) */}
      {step === 'intro' && (
        <div className="intro-container relative z-10 flex flex-col items-center justify-center min-h-screen p-6 md:p-12 overflow-hidden">
          
          {/* Parallax Orbs (Invisible initially) */}
          <div className={\`parallax-layer-1 absolute w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] top-10 left-10 pointer-events-none scale-0 opacity-0\`}></div>
          <div className={\`parallax-layer-2 absolute w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] bottom-10 right-10 pointer-events-none scale-0 opacity-0\`}></div>

          <div className="w-full h-full flex items-center justify-center relative z-20">
            
            {/* RULES PANEL */}
            {introStep === 1 && (
              <div className="rules-panel flex flex-col items-center w-full max-w-3xl absolute">
                <div className="rules-panel-item text-center">
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-zinc-900 mb-6 leading-tight">
                    Welcome to <span className="text-blue-600">Logo Game.</span>
                  </h1>
                  <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
                    Identify highly pixelated logos. Precision and speed yield the highest scores.
                  </p>
                </div>

                <div className="rules-panel-item space-y-6 bg-white p-8 rounded-3xl border border-zinc-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] w-full max-w-2xl text-left">
                  <div className="flex gap-4 items-start">
                    <div className="p-2 bg-zinc-100 text-zinc-600 rounded-lg shrink-0 mt-1"><CheckCircle2 className="w-5 h-5" /></div>
                    <div>
                      <div className="font-semibold text-zinc-900 text-lg">+100 Base Points</div>
                      <div className="text-zinc-500">Awarded for correctly identifying a logo.</div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-1"><Timer className="w-5 h-5" /></div>
                    <div>
                      <div className="font-semibold text-zinc-900 text-lg">10s Speed Bonus</div>
                      <div className="text-zinc-500">Earn +10 points for every second left on the clock.</div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="p-2 bg-zinc-100 text-zinc-600 rounded-lg shrink-0 mt-1"><Eye className="w-5 h-5" /></div>
                    <div>
                      <div className="font-semibold text-zinc-900 text-lg">-20 Pts to Clarify</div>
                      <div className="text-zinc-500">Reduce pixelation if stuck, but it costs base points.</div>
                    </div>
                  </div>
                </div>

                <div className="rules-panel-item mt-10 flex items-center justify-center gap-4 text-zinc-500 font-medium animate-pulse">
                  <span>Press <kbd className="bg-white border border-zinc-200 px-3 py-1.5 rounded-lg text-zinc-900 shadow-sm font-sans font-bold mx-1">Enter</kbd> to acknowledge</span>
                </div>
              </div>
            )}
            
            {/* REGISTRATION FORM */}
            {introStep === 2 && (
              <div className="form-panel w-full max-w-lg absolute">
                <div className="bg-white p-10 md:p-12 rounded-3xl border border-zinc-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full relative overflow-hidden">
                  <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center bg-blue-50 p-4 rounded-full text-blue-600 mb-6">
                      <User className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Registration</h2>
                    <p className="text-zinc-500">Enter your details to record your score.</p>
                  </div>
                  
                  <form onSubmit={handleRegSubmit} className="space-y-6">
                    <div className="space-y-2 text-left">
                      <label className="block text-sm font-semibold text-zinc-700 ml-1">Full Name</label>
                      <input 
                        ref={nameInputRef}
                        type="text" 
                        value={playerName}
                        onChange={e => setPlayerName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-lg"
                        required
                        maxLength={30}
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="block text-sm font-semibold text-zinc-700 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        value={playerEmail}
                        onChange={e => setPlayerEmail(e.target.value)}
                        placeholder="student@university.edu"
                        className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-lg"
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-lg py-5 px-6 rounded-2xl transition-all shadow-md mt-8 group"
                    >
                      Proceed to Game
                      <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-colors">
                        <CornerDownLeft className="w-5 h-5" />
                      </div>
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      )`;

const newIntroBlock = `      {/* INTRO SCREEN (Sequential Centered Layout) */}
      {step === 'intro' && (
        <div className="intro-container relative z-10 flex flex-col items-center justify-center min-h-screen p-6 md:p-12 overflow-hidden">
          
          <div className="parallax-layer-1 absolute inset-0 z-0 opacity-0 scale-50 pointer-events-none flex items-center justify-center">
            {/* Retro arcade DeBugger animation in the background */}
            <div className="scale-[2] sm:scale-[3] opacity-30 mix-blend-screen w-full h-full relative">
              <DeBugger />
            </div>
          </div>

          <div className="w-full h-full flex items-center justify-center relative z-20">
            
            {/* RULES PANEL */}
            {introStep === 1 && (
              <div className="rules-panel absolute z-10 max-w-2xl w-full flex flex-col items-center px-4">
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 uppercase drop-shadow-sm text-center">
                  Welcome to <span className="text-red-600 block sm:inline">Logo Run.</span>
                </h1>
                <p className="text-zinc-400 text-lg md:text-xl font-medium mb-10 text-center max-w-lg">
                  Identify highly pixelated logos. Precision and speed yield the highest scores.
                </p>
                
                <div className="bg-[#f4f0e6] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none w-full flex flex-col relative overflow-hidden">
                  <div className="bg-black text-white p-4 border-b-4 border-black font-black uppercase tracking-widest text-center">
                    Rules of Engagement
                  </div>

                  <div className="flex flex-col p-4 sm:p-8 gap-6 text-left">
                    <div className="flex items-start gap-4">
                      <div className="bg-black text-[#f4f0e6] p-3 border-2 border-black">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-black text-lg uppercase tracking-wider">+100 Base Points</h3>
                        <p className="text-black/70 font-bold">Awarded for correctly identifying a logo.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-red-600 text-white p-3 border-2 border-black">
                        <Timer className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-black text-lg uppercase tracking-wider">10s Speed Bonus</h3>
                        <p className="text-black/70 font-bold">Earn +10 points for every second left on the clock.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-black text-[#f4f0e6] p-3 border-2 border-black">
                        <Eye className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-black text-lg uppercase tracking-wider">-20 Pts to Clarify</h3>
                        <p className="text-black/70 font-bold">Reduce pixelation if stuck, but it costs base points.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rules-panel-item mt-12 text-zinc-400 font-bold uppercase tracking-widest text-sm sm:text-base flex items-center gap-4 bg-black px-8 py-4 border-4 border-[#333]">
                  Press 
                  <span className="bg-white text-black px-4 py-1.5 font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all cursor-pointer" onClick={handleRulesNext}>
                    ENTER
                  </span> 
                  to acknowledge
                </div>
              </div>
            )}
            
            {/* REGISTRATION FORM */}
            {introStep === 2 && (
              <div className="form-panel parallax-layer-2 absolute z-20 max-w-md w-full opacity-0 scale-75 pointer-events-auto px-4 flex flex-col justify-center items-center h-full">
                <div className="bg-[#f4f0e6] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none w-full p-8 sm:p-10 flex flex-col items-center">
                  <h2 className="text-3xl font-black text-black uppercase mb-8 tracking-tight text-center">Operative Details</h2>
                  <form onSubmit={handleRegSubmit} className="w-full flex flex-col gap-5 text-left">
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="playerName" className="font-bold text-black uppercase tracking-wider text-sm">Codename</label>
                      <input
                        id="playerName"
                        ref={nameInputRef}
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your alias"
                        className="w-full bg-white border-4 border-black px-5 py-4 font-black text-black focus:outline-none focus:bg-yellow-50 placeholder:text-zinc-400 placeholder:font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none"
                        required
                        autoComplete="off"
                        maxLength={30}
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="playerEmail" className="font-bold text-black uppercase tracking-wider text-sm">Email</label>
                      <input
                        id="playerEmail"
                        type="email"
                        value={playerEmail}
                        onChange={(e) => setPlayerEmail(e.target.value)}
                        placeholder="student@university.edu"
                        className="w-full bg-white border-4 border-black px-5 py-4 font-black text-black focus:outline-none focus:bg-yellow-50 placeholder:text-zinc-400 placeholder:font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none"
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={!playerName.trim() || !playerEmail.trim()}
                      className="w-full bg-red-600 text-white font-black text-xl py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-wider mt-4"
                    >
                      Initialize Run
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      )`;

if (code.includes(introBlockTarget)) {
  code = code.replace(introBlockTarget, newIntroBlock);
  fs.writeFileSync("src/app/play/page.tsx", code);
  console.log("Successfully updated Intro Block");
} else {
  console.log("Target Intro Block not found! Need to investigate.");
}
