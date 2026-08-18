const fs = require('fs');

const logos = [
  { name: 'Apple', id: 'apple', color: '000000' },
  { name: 'Google', id: 'google', color: '4285F4' },
  { name: 'McDonalds', id: 'mcdonalds', color: 'FFC72C' },
  { name: 'Nike', id: 'nike', color: '000000' },
  { name: 'Netflix', id: 'netflix', color: 'E50914' },
  { name: 'Spotify', id: 'spotify', color: '1DB954' },
  { name: 'Adidas', id: 'adidas', color: '000000' },
  { name: 'PlayStation', id: 'playstation', color: '003791' },
  { name: 'Target', id: 'target', color: 'CC0000' },
  { name: 'Intel', id: 'intel', color: '0068B5' },
  { name: 'Nvidia', id: 'nvidia', color: '76B900' },
  { name: 'Tesla', id: 'tesla', color: 'E31937' },
  { name: 'Discord', id: 'discord', color: '5865F2' },
  { name: 'Twitch', id: 'twitch', color: '9146FF' },
  { name: 'Github', id: 'github', color: '181717' }
];

async function run() {
  const result = [];
  for (const logo of logos) {
    try {
      const res = await fetch(`https://cdn.simpleicons.org/${logo.id}/${logo.color}`);
      if (!res.ok) throw new Error(res.statusText);
      let svg = await res.text();
      // Ensure SVG has width and height for canvas rendering
      if (!svg.includes('width=')) {
        svg = svg.replace('<svg ', '<svg width="512" height="512" ');
      }
      
      const b64 = Buffer.from(svg).toString('base64');
      const dataUri = `data:image/svg+xml;base64,${b64}`;
      result.push({ name: logo.name, url: dataUri });
      console.log(`Success: ${logo.name} (${logo.color})`);
    } catch (e) {
      console.log(`Failed: ${logo.name}`, e.message);
    }
  }

  fs.writeFileSync('src/data/logos.ts', `export const LOGOS = ${JSON.stringify(result, null, 2)};`);
}
run();
