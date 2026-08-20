const fs = require('fs');
let code = fs.readFileSync('src/app/join/page.tsx', 'utf8');

// Add import
if (!code.includes('import { useRouter }')) {
  code = code.replace('import { useState, useEffect } from "react";', 'import { useState, useEffect } from "react";\nimport { useRouter } from "next/navigation";');
}

// Add initialization
if (!code.includes('const router = useRouter();')) {
  code = code.replace('export default function JoinPage() {', 'export default function JoinPage() {\n  const router = useRouter();');
}

fs.writeFileSync('src/app/join/page.tsx', code);
console.log('done');
