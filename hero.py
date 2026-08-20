import re

with open('src/components/ui/animated-hero.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

old_buttons = """        {/* Brutalist Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-xl">
          <button 
            ref={buttonRef1}
            onClick={() => router.push('/play')}
            className="group relative flex-1 bg-[#f4f0e6] text-black font-black text-xl px-8 py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all flex items-center justify-center gap-3 uppercase tracking-wider overflow-hidden"
          >
            <User className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform" />
            Single Player
            {/* Mario visual flair */}
            <span className="absolute -bottom-2 -right-2 text-3xl opacity-50 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300">🍄</span>
          </button>

          <button 
            ref={buttonRef2}
            onClick={() => router.push('/join')}
            className="group relative flex-1 bg-red-600 text-white font-black text-xl px-8 py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all flex items-center justify-center gap-3 uppercase tracking-wider overflow-hidden"
          >
            <Users className="w-6 h-6 text-[#f4f0e6] group-hover:scale-110 transition-transform" />
            Multiplayer
            {/* Mario visual flair */}
            <span className="absolute -bottom-2 -right-2 text-3xl opacity-50 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300">⭐</span>
          </button>
        </div>"""

new_buttons = """        {/* Brutalist Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-xl flex-wrap">
          <button 
            ref={buttonRef1}
            onClick={() => router.push('/play')}
            className="group relative flex-1 bg-[#f4f0e6] text-black font-black text-xl px-4 py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all flex items-center justify-center gap-3 uppercase tracking-wider overflow-hidden min-w-[200px]"
          >
            <User className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform" />
            Single Player
            {/* Mario visual flair */}
            <span className="absolute -bottom-2 -right-2 text-3xl opacity-50 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300">🍄</span>
          </button>

          <button 
            ref={buttonRef2}
            onClick={() => router.push('/join')}
            className="group relative flex-1 bg-red-600 text-white font-black text-xl px-4 py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all flex items-center justify-center gap-3 uppercase tracking-wider overflow-hidden min-w-[200px]"
          >
            <Users className="w-6 h-6 text-[#f4f0e6] group-hover:scale-110 transition-transform" />
            Multiplayer
            {/* Mario visual flair */}
            <span className="absolute -bottom-2 -right-2 text-3xl opacity-50 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300">⭐</span>
          </button>
          
          <button 
            onClick={() => window.open('/admin', '_blank')}
            className="group relative flex-none bg-[#111] text-zinc-400 font-bold text-sm px-6 py-5 border-4 border-zinc-800 hover:border-zinc-500 hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest sm:w-auto w-full"
          >
            Admin <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>"""

code = code.replace(old_buttons, new_buttons)

with open('src/components/ui/animated-hero.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
