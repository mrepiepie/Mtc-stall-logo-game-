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

let content = `export const LOGOS = [\n`;
companies.forEach(company => {
  const name = company.replace(/-/g, ' ');
  content += `  { id: '${company}', name: '${name}', path: '/logos/${company}.png', difficulty: 'medium', points: 100 },\n`;
});
content += `];\n`;

fs.writeFileSync('src/data/logos.ts', content);
console.log('Updated src/data/logos.ts');
