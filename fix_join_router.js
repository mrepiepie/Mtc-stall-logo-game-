const fs = require('fs');
let code = fs.readFileSync('src/app/join/page.tsx', 'utf8');

if (!code.includes('import { useRouter }')) {
  code = code.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport { useRouter } from 'next/navigation';");
}

fs.writeFileSync('src/app/join/page.tsx', code);
