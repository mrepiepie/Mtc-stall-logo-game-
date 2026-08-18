const fs = require('fs');
const https = require('https');
const path = require('path');

const logos = [
  { name: 'Apple', domain: 'apple.com' },
  { name: 'Google', domain: 'google.com' },
  { name: 'Microsoft', domain: 'microsoft.com' },
  { name: 'McDonalds', domain: 'mcdonalds.com' },
  { name: 'Nike', domain: 'nike.com' },
  { name: 'Amazon', domain: 'amazon.com' },
  { name: 'Starbucks', domain: 'starbucks.com' },
  { name: 'Netflix', domain: 'netflix.com' },
  { name: 'Spotify', domain: 'spotify.com' },
  { name: 'Adidas', domain: 'adidas.com' },
  { name: 'Tesla', domain: 'tesla.com' },
  { name: 'Meta', domain: 'meta.com' },
  { name: 'Disney', domain: 'disney.com' },
  { name: 'Marvel', domain: 'marvel.com' },
  { name: 'PlayStation', domain: 'playstation.com' },
];

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

async function run() {
  const logosData = [];
  for (const logo of logos) {
    const url = `https://logo.clearbit.com/${logo.domain}?size=512`;
    const dest = path.join(__dirname, 'public', 'logos', `${logo.name.toLowerCase()}.png`);
    try {
      await download(url, dest);
      console.log(`Downloaded ${logo.name}`);
      logosData.push({ name: logo.name, url: `/logos/${logo.name.toLowerCase()}.png` });
    } catch (e) {
      console.error(`Failed ${logo.name}`, e);
    }
  }

  // Write the new logos.ts
  const tsContent = `export const LOGOS = ${JSON.stringify(logosData, null, 2)};\n`;
  fs.writeFileSync(path.join(__dirname, 'src', 'data', 'logos.ts'), tsContent);
  console.log('Updated logos.ts');
}

run();
