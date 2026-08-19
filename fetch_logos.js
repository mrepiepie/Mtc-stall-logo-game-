const fs = require('fs');
const https = require('https');
const path = require('path');

const companies = [
  'apple', 'google', 'microsoft', 'amazon', 'netflix', 'spotify', 'tesla', 'meta', 'nike', 'adidas',
  'mcdonalds', 'starbucks', 'kfc', 'burgerking', 'wendys', 'coca-cola', 'pepsi', 'redbull', 'monsterenergy',
  'sony', 'nintendo', 'xbox', 'playstation', 'samsung', 'lg', 'intel', 'nvidia', 'amd', 'cisco', 'ibm',
  'toyota', 'ford', 'honda', 'chevrolet', 'bmw', 'mercedes-benz', 'audi', 'porsche', 'ferrari', 'lamborghini',
  'uber', 'lyft', 'airbnb', 'tiktok', 'instagram', 'snapchat', 'pinterest', 'twitter', 'linkedin', 'reddit',
  'visa', 'mastercard', 'paypal', 'stripe', 'fedex', 'ups', 'dhl', 'boeing', 'airbus', 'spacex'
];

const logosDir = path.join(__dirname, 'public', 'logos');

if (!fs.existsSync(logosDir)){
    fs.mkdirSync(logosDir, { recursive: true });
}

console.log('Downloading 60 logos...');

companies.forEach((company, index) => {
  const url = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${company}.com&size=256`;
  const file = fs.createWriteStream(path.join(logosDir, `${company}.png`));
  
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      if (index === companies.length - 1) {
        console.log('Finished downloading all logos!');
      }
    });
  }).on('error', (err) => {
    fs.unlink(path.join(logosDir, `${company}.png`));
    console.error(`Error downloading ${company}: ${err.message}`);
  });
});
