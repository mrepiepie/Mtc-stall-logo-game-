const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const newEffect = `        // Bounce the text in
        gsap.fromTo('.rules-panel-item', 
          { y: 50, opacity: 0, scale: 0.95 }, 
          { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.5)' }
        );

        // Spring the DeBugger animation in at the same time
        gsap.fromTo('.parallax-layer-1',
          { opacity: 0, scale: 0.2, y: 100 },
          { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: 'elastic.out(1, 0.5)', delay: 0.1 }
        );`;

// We use string replacement
const oldStr = `gsap.fromTo('.rules-panel-item', 
          { y: 30, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        );`;

code = code.replace(oldStr, newEffect);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Done replacement!');
