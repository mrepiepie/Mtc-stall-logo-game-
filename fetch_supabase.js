const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// Add import
if (!code.includes("import { supabase }")) {
  code = code.replace("import { LOGOS } from '@/data/logos';", "import { LOGOS } from '@/data/logos';\nimport { supabase } from '@/lib/supabaseClient';");
}

// Modify useEffect to fetch from Supabase
const oldEffect = `  useEffect(() => {
    const shuffled = [...LOGOS].sort(() => Math.random() - 0.5).slice(0, 10);
    setLogos(shuffled);
  }, []);`;

const newEffect = `  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*');
          
        if (error || !data || data.length === 0) {
          console.warn("Failed to fetch from DB, falling back to local LOGOS array", error);
          const shuffled = [...LOGOS].sort(() => Math.random() - 0.5).slice(0, 10);
          setLogos(shuffled);
        } else {
          // Map DB columns to our expected format
          const mappedLogos = data.map(q => ({
            id: q.id.toString(),
            name: q.answer,
            url: q.image_url,
            difficulty: q.difficulty || 'medium',
            points: 100
          }));
          const shuffled = mappedLogos.sort(() => Math.random() - 0.5).slice(0, 10);
          setLogos(shuffled);
        }
      } catch (err) {
        console.error(err);
        const shuffled = [...LOGOS].sort(() => Math.random() - 0.5).slice(0, 10);
        setLogos(shuffled);
      }
    };
    
    fetchQuestions();
  }, []);`;

code = code.replace(oldEffect, newEffect);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Updated to fetch from Supabase');
