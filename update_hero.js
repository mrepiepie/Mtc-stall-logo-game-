const fs = require('fs');
let code = fs.readFileSync('src/components/ui/animated-hero.tsx', 'utf8');

const regex = /<div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-xl">([\s\S]*?)<\/div>/;

const newButtons = `<div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-xl flex-wrap">
          <button 
            ref={buttonRef1}
            onClick={() => router.push('/play')}
            className="group relative flex-1 bg-[#f4f0e6] text-black font-black text-xl px-4 py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all flex items-center justify-center gap-3 uppercase tracking-wider overflow-hidden min-w-[200px]"
          >
            <User className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform" />
            Single Player
            <span className="absolute -bottom-2 -right-2 text-3xl opacity-50 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300">\\uD83C\\uDF44</span>
          </button>

          <button 
            ref={buttonRef2}
            onClick={() => router.push('/join')}
            className="group relative flex-1 bg-red-600 text-white font-black text-xl px-4 py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all flex items-center justify-center gap-3 uppercase tracking-wider overflow-hidden min-w-[200px]"
          >
            <Users className="w-6 h-6 text-[#f4f0e6] group-hover:scale-110 transition-transform" />
            Multiplayer
            <span className="absolute -bottom-2 -right-2 text-3xl opacity-50 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300">\\u2B50</span>
          </button>

          <button 
            onClick={() => window.open('/admin', '_blank')}
            className="group relative flex-none bg-[#111] text-zinc-400 font-bold text-sm px-6 py-5 border-4 border-zinc-800 hover:border-zinc-500 hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest sm:w-auto w-full"
          >
            Admin <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>`;

code = code.replace(regex, newButtons);
fs.writeFileSync('src/components/ui/animated-hero.tsx', code);
console.log('done');
