const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

const invalidSyntax = `      
          <img src={\`\${NOTO_BASE}/1f47d/512.webp\`} className="w-20 h-20 drop-shadow-md transform hover:scale-110 transition-transform" alt="Mascot" />
        </div>
      </div>`;

if (code.includes(invalidSyntax)) {
  code = code.replace(invalidSyntax, '');
  fs.writeFileSync('src/app/play/page.tsx', code);
  console.log('Cleaned up the floating mascot junk!');
} else {
  // Let's use regex
  code = code.replace(/\s*<img src=\{`\$\{NOTO_BASE\}\/1f47d\/512\.webp`\} className="w-20 h-20 drop-shadow-md transform hover:scale-110 transition-transform" alt="Mascot" \/>\s*<\/div>\s*<\/div>\s*/g, '\n\n');
  fs.writeFileSync('src/app/play/page.tsx', code);
  console.log('Cleaned up the floating mascot junk with regex!');
}
