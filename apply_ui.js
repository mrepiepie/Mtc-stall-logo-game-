const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const exactFind = `<div><p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</p><p className="font-black uppercase text-[#008f5a]">Waiting</p></div>
                  <button type="button" onClick={handleCopyPin} className="flex items-center justify-center gap-2 border-2 border-black bg-[#f4f0e6] px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors hover:bg-yellow-300 sm:col-start-2">
                    <Copy className="h-4 w-4" />
                    {isPinCopied ? "Copied" : "Copy PIN"}
                  </button>
                </div>`;

const exactReplace = `<div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</p>
                    <p className={\`font-black uppercase \${createdGame.status === 'playing' ? 'text-blue-600' : 'text-[#008f5a]'}\`}>
                      {createdGame.status === 'timed_out' ? 'Timed Out' : createdGame.status}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:col-start-2">
                    <button type="button" onClick={handleCopyPin} className="flex items-center justify-center gap-2 border-2 border-black bg-[#f4f0e6] px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors hover:bg-yellow-300">
                      <Copy className="h-4 w-4" />
                      {isPinCopied ? "Copied" : "Copy PIN"}
                    </button>
                    {createdGame.status === 'waiting' && (
                      <button 
                        type="button" 
                        onClick={async () => {
                          await fetch('/api/games/start', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ pin: createdGame.gamePin }) });
                          setCreatedGame(prev => prev ? { ...prev, status: 'playing' } : null);
                        }}
                        className="flex items-center justify-center gap-2 border-2 border-black bg-red-600 text-white px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors hover:bg-red-500"
                      >
                        Start Lobby
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t-2 border-black/20 pt-4">
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-zinc-500">Players Joined ({createdGame.players?.length || 0})</p>
                  <div className="flex flex-wrap gap-2">
                    {createdGame.players?.map((p, i) => (
                      <span key={i} className="bg-yellow-300 border-2 border-black px-2 py-1 text-xs font-bold uppercase">{p}</span>
                    ))}
                    {(!createdGame.players || createdGame.players.length === 0) && (
                      <span className="text-sm font-bold text-zinc-400">Waiting for players...</span>
                    )}
                  </div>
                </div>`;

// Only replace if not already present
if (!code.includes("Start Lobby")) {
  code = code.replace(exactFind, exactReplace);
  
  // Make sure players exists in type
  if (!code.includes("players?: string[];")) {
    code = code.replace(
      'questions: Question[];\n};', 
      'questions: Question[];\n  players?: string[];\n};'
    );
  }
  
  // Make sure it's initialized
  if (!code.includes("players: [],")) {
    code = code.replace(
      'questions: result.questions as Question[],\n        });',
      'questions: result.questions as Question[],\n          players: [],\n        });'
    );
  }
  
  fs.writeFileSync('src/app/admin/page.tsx', code);
  console.log('updated');
} else {
  console.log('already has start lobby');
}
