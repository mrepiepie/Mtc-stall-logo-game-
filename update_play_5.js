const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// Add rules-panel-item class to title and card
code = code.replace(
  '<h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2 uppercase drop-shadow-sm text-center">',
  '<div className="rules-panel-item flex flex-col items-center"><h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2 uppercase drop-shadow-sm text-center">'
);
code = code.replace(
  '<p className="text-zinc-400 text-base md:text-lg font-medium mb-6 text-center max-w-lg">\n                  Identify highly pixelated logos. Precision and speed yield the highest scores.\n                </p>',
  '<p className="text-zinc-400 text-base md:text-lg font-medium mb-6 text-center max-w-lg">\n                  Identify highly pixelated logos. Precision and speed yield the highest scores.\n                </p></div>'
);

code = code.replace(
  '<div className="bg-[#f4f0e6] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none w-full flex flex-col relative overflow-hidden">',
  '<div className="rules-panel-item bg-[#f4f0e6] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none w-full flex flex-col relative overflow-hidden">'
);

// Switch parallax-layer-1 back to opacity 0 and scale 50 so it can animate in!
code = code.replace(
  '<div className="parallax-layer-1 absolute inset-0 z-0 opacity-100 scale-100 pointer-events-none flex items-center justify-center">',
  '<div className="parallax-layer-1 absolute inset-0 z-0 opacity-0 scale-50 pointer-events-none flex items-center justify-center">'
);

const oldEffect = `    // Parallax Effect & Initial Intro Anim
    useEffect(() => {
      if (step === 'intro') {
        gsap.fromTo('.rules-panel-item', 
          { y: 30, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        );

        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const xPos = (clientX / window.innerWidth - 0.5) * 40;
          const yPos = (clientY / window.innerHeight - 0.5) * 40;
          gsap.to('.parallax-layer-1', { x: xPos, y: yPos, duration: 1, ease: 'power2.out' });
          gsap.to('.parallax-layer-2', { x: xPos * -1.5, y: yPos * -1.5, duration: 1, ease: 'power2.out' });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
      }
    }, [step]);`;

const newEffect = `    // Parallax Effect & Initial Intro Anim
    useEffect(() => {
      if (step === 'intro') {
        // Bounce the text in
        gsap.fromTo('.rules-panel-item', 
          { y: 50, opacity: 0, scale: 0.95 }, 
          { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.5)' }
        );

        // Spring the DeBugger animation in at the same time
        gsap.fromTo('.parallax-layer-1',
          { opacity: 0, scale: 0.2, y: 100 },
          { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: 'elastic.out(1, 0.5)', delay: 0.1 }
        );

        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const xPos = (clientX / window.innerWidth - 0.5) * 40;
          const yPos = (clientY / window.innerHeight - 0.5) * 40;
          gsap.to('.parallax-layer-1', { x: xPos, y: yPos, duration: 1, ease: 'power2.out' });
          gsap.to('.parallax-layer-2', { x: xPos * -1.5, y: yPos * -1.5, duration: 1, ease: 'power2.out' });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
      }
    }, [step]);`;

if (code.includes(oldEffect)) {
  code = code.replace(oldEffect, newEffect);
  fs.writeFileSync('src/app/play/page.tsx', code);
  console.log("Updated GSAP animation!");
} else {
  console.log("Could not find old effect block. Wait, lets try replacing without comments.");
}
