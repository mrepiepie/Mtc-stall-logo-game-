const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const oldBlanks = `{currentLogo.name.split('').map((char, i) => (
                          <span key={i} className={char === ' ' ? 'w-4' : ''}>
                            {char === ' ' ? ' ' : (char === '-' ? '-' : '_')}
                          </span>
                        ))}`;

const newBlanks = `{(() => {
                          const norm = guess.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                          let idx = 0;
                          return currentLogo.name.split('').map((char, i) => {
                            if (char === ' ') return <span key={i} className="w-4"> </span>;
                            if (char === '-') return <span key={i}>-</span>;
                            const displayChar = idx < norm.length ? norm[idx++] : '_';
                            return <span key={i} className={displayChar !== '_' ? 'text-blue-600' : ''}>{displayChar}</span>;
                          });
                        })()}`;

if (code.includes(oldBlanks)) {
  code = code.replace(oldBlanks, newBlanks);
  fs.writeFileSync('src/app/play/page.tsx', code);
  console.log('Replaced blanks logic successfully!');
} else {
  console.log('Failed to find old blanks logic!');
}
