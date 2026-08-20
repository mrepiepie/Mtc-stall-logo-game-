const fs = require('fs');
let c = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const oldPlayers = `                <div className="mt-4 border-t-2 border-black/20 pt-4">
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-zinc-500">Players Joined ({createdGame.players?.length || 0})</p>
                  <div className="flex flex-wrap gap-2">
                    {createdGame.players?.map((p: string, i: number) => (
                      <span key={i} className="bg-yellow-300 border-2 border-black px-2 py-1 text-xs font-bold uppercase">{p}</span>
                    ))}
                    {(!createdGame.players || createdGame.players.length === 0) && (
                      <span className="text-sm font-bold text-zinc-400">Waiting for players...</span>
                    )}
                  </div>
                </div>`;

const newPlayers = `                <div className="mt-4 border-t-2 border-black/20 pt-4">
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-zinc-500">Players Joined ({createdGame.players?.length || 0}/10)</p>
                  <div className="flex flex-wrap gap-2">
                    {createdGame.players?.map((p: string, i: number) => (
                      <span key={i} className="group flex items-center gap-1 bg-yellow-300 border-2 border-black px-2 py-1 text-xs font-bold uppercase">
                        {p}
                        {createdGame.status === 'waiting' && (
                          <button 
                            type="button" 
                            onClick={async () => {
                              await fetch('/api/games/kick', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ pin: createdGame.gamePin, playerName: p }) });
                              setCreatedGame(prev => prev ? { ...prev, players: prev.players.filter(name => name !== p) } : null);
                            }} 
                            className="text-red-600 hover:bg-red-200 rounded px-1 ml-1" 
                            title="Kick Player"
                          >
                            ✕
                          </button>
                        )}
                      </span>
                    ))}
                    {(!createdGame.players || createdGame.players.length === 0) && (
                      <span className="text-sm font-bold text-zinc-400">Waiting for players...</span>
                    )}
                  </div>
                </div>`;

c = c.replace(oldPlayers, newPlayers);
fs.writeFileSync('src/app/admin/page.tsx', c);
console.log('done');
