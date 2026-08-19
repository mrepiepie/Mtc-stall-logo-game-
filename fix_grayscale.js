const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const oldNext = `        setGameStatus('playing');
        setJokeContent(null);
        gsap.fromTo('.game-content', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
        return prev + 1;`;

const newNext = `        setGameStatus('playing');
        setJokeContent(null);
        // Reset the canvas filter from any previous timeouts
        gsap.set('.logo-container canvas', { filter: 'none', opacity: 1, scale: 1 });
        gsap.fromTo('.game-content', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
        return prev + 1;`;

code = code.replace(oldNext, newNext);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed grayscale bug!');
