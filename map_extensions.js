const fs = require('fs');
const path = require('path');

const companies = [
  'apple', 'google', 'microsoft', 'amazon', 'netflix', 'spotify', 'tesla', 'meta', 'nike', 'adidas',
  'mcdonalds', 'starbucks', 'kfc', 'burgerking', 'wendys', 'coca-cola', 'pepsi', 'redbull', 'monsterenergy',
  'sony', 'nintendo', 'xbox', 'playstation', 'samsung', 'lg', 'intel', 'nvidia', 'amd', 'cisco', 'ibm',
  'toyota', 'ford', 'honda', 'chevrolet', 'bmw', 'mercedes-benz', 'audi', 'porsche', 'ferrari', 'lamborghini',
  'uber', 'lyft', 'airbnb', 'tiktok', 'instagram', 'snapchat', 'pinterest', 'twitter', 'linkedin', 'reddit',
  'visa', 'mastercard', 'paypal', 'stripe', 'fedex', 'ups', 'dhl', 'boeing', 'airbus', 'spacex'
];

const dir = path.join(__dirname, 'public', 'logos');
const files = fs.readdirSync(dir);

let tsContent = `export const LOGOS = [\n`;
let sqlContent = `DELETE FROM public.questions;\nINSERT INTO public.questions (answer, image_url, difficulty) VALUES\n`;

companies.forEach((company, index) => {
  const name = company.replace(/-/g, ' ');
  
  // Find actual extension (it might be .jpg or .png)
  const actualFile = files.find(f => f.startsWith(`${company}.`));
  const ext = actualFile ? path.extname(actualFile) : '.png';
  
  tsContent += `  { id: '${company}', name: '${name}', url: '/logos/${company}${ext}', difficulty: 'medium', points: 100 },\n`;
  
  const vUrl = `https://mtc-stall-logo-game.vercel.app/logos/${company}${ext}`;
  sqlContent += `  ('${name}', '${vUrl}', 'medium')${index === companies.length - 1 ? ';' : ','}\n`;
});

tsContent += `];\n`;

fs.writeFileSync('src/data/logos.ts', tsContent);
fs.writeFileSync('update_questions.sql', sqlContent);
console.log('Done mapping extensions!');
