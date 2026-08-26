"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { MoveRight, Users, User, Gamepad2 } from "lucide-react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

function AnimatedHero() {
  const router = useRouter();
  const [titleNumber, setTitleNumber] = useState(0);
  const buttonRef1 = useRef(null);
  const buttonRef2 = useRef(null);
  
  const titles = useMemo(
    () => ["brands", "startups", "MNCs", "mascots", "tech giants"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  // GSAP Entrance Animation for buttons
  useEffect(() => {
    gsap.fromTo(
      [buttonRef1.current, buttonRef2.current],
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.5)", delay: 0.2 }
    );
  }, []);

  return (
    <div className="w-full relative h-full flex flex-col justify-center pl-8 lg:pl-16 xl:pl-24 py-6">
      <div className="relative z-10 flex flex-col items-start justify-center">
        {/* MTC Top Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="text-[#4fc3f7] font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">
            Microsoft Tech Club <span className="mx-2 text-zinc-500">?</span> BITS Pilani Dubai
          </div>
        </div>

        <div className="flex gap-2 flex-col w-full">
          <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] max-w-3xl tracking-tighter text-left font-black leading-[1.05] text-white drop-shadow-sm">
            <span className="block">Can you guess the</span>
            <span className="relative flex w-full justify-start overflow-hidden text-left pb-1 pt-1 text-red-600 h-[1.2em]">
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute font-black uppercase"
                  initial={{ opacity: 0, y: "-100" }}
                  transition={{ type: "spring", stiffness: 50 }}
                  animate={
                    titleNumber === index
                      ? { y: 0, opacity: 1 }
                      : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                  }
                >
                  {title}
                </motion.span>
              ))}
            </span>
          </h1>

          <p className="text-lg md:text-xl leading-relaxed tracking-tight text-zinc-400 max-w-xl text-left mt-2 font-medium">
            Test your visual recognition skills. Identify highly pixelated logos of famous companies, startups, and products before the time runs out.
          </p>
        </div>

        {/* Brutalist Action Buttons */}
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
        </div>
        
        {/* MTC Promotion Box - Brutalist Dark */}
        <div className="mt-10 w-full max-w-lg bg-[#111] text-white p-5 lg:p-6 border-4 border-[#333] text-left relative overflow-hidden group hover:border-[#555] transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2 tracking-tight uppercase flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-red-500" />
              Inspired by the tech?
            </h3>
            <p className="text-sm text-zinc-400 font-medium mb-4">Wanna learn how to build all these things? Join MTC and level up.</p>
            
            <details className="group/details">
              <summary className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 text-sm font-bold hover:bg-zinc-200 transition-colors uppercase tracking-wider border-2 border-transparent hover:border-black cursor-pointer list-none">
                Join MTC Today <MoveRight className="w-4 h-4 group-open/details:hidden" />
              </summary>
              <div className="mt-4 bg-white p-4 border-4 border-black inline-block animate-in fade-in zoom-in duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <img src="/mtc-qr.png" alt="MTC QR Code" className="w-48 h-48 object-contain" />
              </div>
            </details>
          </div>
        </div>

      </div>
    </div>
  );
}

export { AnimatedHero };
