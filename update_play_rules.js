const fs = require('fs');
let code = fs.readFileSync('src/app/play/page.tsx', 'utf-8');

// 1. Force exactly 10 questions per round
code = code.replace(
  'const shuffled = [...LOGOS].sort(() => Math.random() - 0.5);',
  'const shuffled = [...LOGOS].sort(() => Math.random() - 0.5).slice(0, 10);'
);

// 2. Change initial logo points to pull from the current logo instead of hardcoded 100
// Wait, actually I can just change the useState to initialize with currentLogo points? No, logos is empty initially.
// Let's modify handleNext to pull points.
code = code.replace(
  'setLogoPoints(100);',
  'setLogoPoints(logos[prev + 1]?.points || 100);'
);

// We also need to set the first logo's points when the game starts.
// But wait, the easiest way to handle points dynamically is to NOT store `logoPoints` in state, but store `hintPenalty` in state.
// But since the code already uses `logoPoints`, let's just make it pull the points from `currentLogo` dynamically.
// Right now, `handleHint` reduces `logoPoints`: `setLogoPoints(prev => Math.max(10, prev - 20));`

// 3. Update the scoring formula
const oldScoreLogic = `        setGameStatus('correct');
        const timeBonus = timeLeft * 10;
        setTotalScore(prev => prev + logoPoints + timeBonus);`;

const newScoreLogic = `        setGameStatus('correct');
        // New formula: max_points * (time_remaining / 10)
        // logoPoints acts as the max_points (it starts at 100 or higher and decreases if they use hints)
        // We use Math.round to avoid weird decimals
        const maxPoints = currentLogo?.points || logoPoints;
        const earnedPoints = Math.round(maxPoints * (timeLeft / TIMER_SECONDS));
        setTotalScore(prev => prev + Math.max(1, earnedPoints));`;

code = code.replace(oldScoreLogic, newScoreLogic);

fs.writeFileSync('src/app/play/page.tsx', code);
console.log('Applied single player rules!');
