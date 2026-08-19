const fs = require('fs');
let code = fs.readFileSync('src/app/join/page.tsx', 'utf-8');

// 1. Ensure supabase is imported
if (!code.includes("import { supabase }")) {
  code = code.replace(/import gsap from 'gsap';/, "import gsap from 'gsap';\nimport { supabase } from '@/lib/supabaseClient';");
}

// 2. Fix 'payload' implicitly has 'any' type
code = code.replace(/\(payload\) => \{/, "(payload: any) => {");

fs.writeFileSync('src/app/join/page.tsx', code);
console.log("Fixed TS");
