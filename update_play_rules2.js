const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// Replace the buggy score logic
const buggyScore = `        const maxPoints = currentLogo?.points || logoPoints;
        const earnedPoints = Math.round(maxPoints * (timeLeft / TIMER_SECONDS));`;

const fixedScore = `        // If the user used a hint, logoPoints is already reduced.
        // We use that as the base, then apply the speed multiplier.
        const basePoints = logoPoints; // It's initialized to 100 or currentLogo.points, and reduced by hints
        const earnedPoints = Math.round(basePoints * (timeLeft / TIMER_SECONDS));`;

code = code.replace(buggyScore, fixedScore);

// Add useEffect to initialize logoPoints correctly for the first logo
code = code.replace(
  'const [logoPoints, setLogoPoints] = useState(100);',
  'const [logoPoints, setLogoPoints] = useState(100);\n\n    useEffect(() => {\n      if (logos.length > 0 && currentIndex === 0) {\n        setLogoPoints(logos[0].points || 100);\n      }\n    }, [logos]);'
);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Fixed scoring formula!');
