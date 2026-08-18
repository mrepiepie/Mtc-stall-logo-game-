const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const oldStr = `        setIntroStep(2);
        gsap.to('.parallax-layer-1, .parallax-layer-2', { opacity: 1, scale: 1, duration: 1.5, ease: 'elastic.out(1, 0.5)' });
        gsap.fromTo('.form-panel', 
          { opacity: 0, y: 30, scale: 1.05 }, 
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
        );
        setTimeout(() => nameInputRef.current?.focus(), 100);
      }
    });`;

const newStr = `        setIntroStep(2);
        setTimeout(() => {
          gsap.to('.parallax-layer-1, .parallax-layer-2', { opacity: 1, scale: 1, duration: 1.5, ease: 'elastic.out(1, 0.5)' });
          gsap.fromTo('.form-panel', 
            { opacity: 0, y: 30, scale: 1.05 }, 
            { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
          );
          nameInputRef.current?.focus();
        }, 50);
      }
    });`;

code = code.replace(oldStr, newStr);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed GSAP timing!');
