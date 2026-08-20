const fs=require('fs');
let c=fs.readFileSync('src/app/join/page.tsx','utf8');
c=c.replace(/setStep\('enter_code'\);/g, "setStep('form');");
fs.writeFileSync('src/app/join/page.tsx', c);
