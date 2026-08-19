const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'logos');
const files = fs.readdirSync(dir);

const companies = [
  'apple', 'google', 'microsoft', 'amazon', 'netflix', 'spotify', 'tesla', 'meta', 'nike', 'adidas',
  'mcdonalds', 'starbucks', 'kfc', 'burgerking', 'wendys', 'coca-cola', 'pepsi', 'redbull', 'monsterenergy',
  'sony', 'nintendo', 'xbox', 'playstation', 'samsung', 'lg', 'intel', 'nvidia', 'amd', 'cisco', 'ibm',
  'toyota', 'ford', 'honda', 'chevrolet', 'bmw', 'mercedes-benz', 'audi', 'porsche', 'ferrari', 'lamborghini',
  'uber', 'lyft', 'airbnb', 'tiktok', 'instagram', 'snapchat', 'pinterest', 'twitter', 'linkedin', 'reddit',
  'visa', 'mastercard', 'paypal', 'stripe', 'fedex', 'ups', 'dhl', 'boeing', 'airbus', 'spacex'
];

companies.forEach(company => {
  const companyFiles = files.filter(f => f.startsWith(`${company}.`));
  
  if (companyFiles.length > 1) {
    // We have duplicates! Keep the one that was downloaded recently (not at 12:XX PM)
    companyFiles.forEach(f => {
      const stat = fs.statSync(path.join(dir, f));
      const hours = new Date(stat.mtime).getHours();
      
      // If the file was created at 12 PM (the favicon scraper), delete it
      if (hours === 12) {
        fs.unlinkSync(path.join(dir, f));
        console.log(`Deleted old favicon: ${f}`);
      }
    });
  }
});

// Now that old duplicates are deleted, let's remap logos.ts
const newFiles = fs.readdirSync(dir);
let tsContent = `export const LOGOS = [\n`;

companies.forEach((company, index) => {
  const name = company.replace(/-/g, ' ');
  const actualFile = newFiles.find(f => f.startsWith(`${company}.`));
  const ext = actualFile ? path.extname(actualFile) : '.png';
  tsContent += `  { id: '${company}', name: '${name}', url: '/logos/${company}${ext}', difficulty: 'medium', points: 100 },\n`;
});

tsContent += `];\n`;
fs.writeFileSync('src/data/logos.ts', tsContent);
console.log('Cleaned up duplicates and remapped!');
