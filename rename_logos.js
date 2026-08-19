const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'logos');
const files = fs.readdirSync(dir);

const companyMap = {
  'mercedes-benz': ['benz', 'mercedes'],
  'coca-cola': ['coca cola', 'cocacola'],
  'monsterenergy': ['monster']
};

const companies = [
  'apple', 'google', 'microsoft', 'amazon', 'netflix', 'spotify', 'tesla', 'meta', 'nike', 'adidas',
  'mcdonalds', 'starbucks', 'kfc', 'burgerking', 'wendys', 'coca-cola', 'pepsi', 'redbull', 'monsterenergy',
  'sony', 'nintendo', 'xbox', 'playstation', 'samsung', 'lg', 'intel', 'nvidia', 'amd', 'cisco', 'ibm',
  'toyota', 'ford', 'honda', 'chevrolet', 'bmw', 'mercedes-benz', 'audi', 'porsche', 'ferrari', 'lamborghini',
  'uber', 'lyft', 'airbnb', 'tiktok', 'instagram', 'snapchat', 'pinterest', 'twitter', 'linkedin', 'reddit',
  'visa', 'mastercard', 'paypal', 'stripe', 'fedex', 'ups', 'dhl', 'boeing', 'airbus', 'spacex'
];

// 1. Rename user files to exact company names
files.forEach(f => {
  if (f === '.DS_Store' || f.startsWith('.')) return;
  
  let lower = f.toLowerCase();
  lower = lower.replace(' logo', '');
  lower = lower.replace('.jpeg', '.jpg');
  
  // Try to match to our array
  let matchedCompany = companies.find(c => lower.startsWith(c));
  
  if (!matchedCompany) {
    if (lower.includes('benz')) matchedCompany = 'mercedes-benz';
    if (lower.includes('coca')) matchedCompany = 'coca-cola';
    if (lower.includes('monster')) matchedCompany = 'monsterenergy';
    if (lower.includes('chevorlet')) matchedCompany = 'chevrolet'; // typo fix
  }
  
  if (matchedCompany) {
    const ext = path.extname(f).toLowerCase();
    const newName = `${matchedCompany}${ext}`;
    
    // Only rename if it's not already correct, OR if it's one of the user's new files (they usually have " logo" or are JPGs)
    if (f !== newName) {
      fs.renameSync(path.join(dir, f), path.join(dir, newName));
      console.log(`Renamed ${f} -> ${newName}`);
    }
  }
});
