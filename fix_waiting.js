const fs = require('fs');
let c = fs.readFileSync('src/components/ProjectorView.tsx', 'utf8');

c = c.replace(
  "if (game.status === 'countdown') {",
  `if (game.status === 'waiting') {
    return (
      <div className="w-full min-h-[calc(100vh-6rem)] bg-[#f4f0e6] border-4 border-black p-4 md:p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center">
        <h2 className="text-4xl font-black uppercase text-black mb-8 tracking-widest animate-pulse">Waiting to Start...</h2>
      </div>
    );
  }

  if (game.status === 'countdown') {`
);

fs.writeFileSync('src/components/ProjectorView.tsx', c);
console.log('done');
