const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const oldEffect = `    useEffect(() => {
      const shuffled = [...LOGOS].sort(() => Math.random() - 0.5).slice(0, 10);
      setLogos(shuffled);
    }, []);`;

const newEffect = `    useEffect(() => {
      // 1. Get previously seen logos from sessionStorage
      let seenStr = sessionStorage.getItem('seenLogos');
      let seen = seenStr ? JSON.parse(seenStr) : [];
      
      // 2. Filter available logos
      let available = LOGOS.filter(l => !seen.includes(l.name));
      
      // 3. If we don't have enough questions for a full round, reset the pool!
      if (available.length < 10) {
        seen = [];
        available = [...LOGOS];
      }
      
      // 4. Shuffle and pick 10
      const shuffled = available.sort(() => Math.random() - 0.5).slice(0, 10);
      
      // 5. Save the newly seen logos to session storage
      const newSeen = [...seen, ...shuffled.map(l => l.name)];
      sessionStorage.setItem('seenLogos', JSON.stringify(newSeen));
      
      setLogos(shuffled);
    }, []);`;

code = code.replace(oldEffect, newEffect);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Replaced useEffect with pool exhaustion logic!');
