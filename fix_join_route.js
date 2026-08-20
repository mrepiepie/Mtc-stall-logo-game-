const fs = require('fs');
let c = fs.readFileSync('src/app/api/games/join/route.ts', 'utf8');

c = c.replace(
  '.select("id, status, players")',
  '.select("id, status, players, logos")'
);

c = c.replace(
  'return NextResponse.json({ success: true, gamePin: pin });',
  `const { data: qs } = await supabase.from('questions').select('id, answer');
    const formats = (game.logos || []).map(id => qs?.find(q => q.id === id)?.answer || '');
    return NextResponse.json({ success: true, gamePin: pin, formats });`
);

fs.writeFileSync('src/app/api/games/join/route.ts', c);
console.log('done');
