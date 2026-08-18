const fs = require('fs');
let code = fs.readFileSync('src/app/api/scores/route.ts', 'utf-8');

code = code.replace(
  "const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';",
  "const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';"
);

code = code.replace(
  "const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';",
  "const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';"
);

fs.writeFileSync('src/app/api/scores/route.ts', code);
console.log('Fixed build error!');
