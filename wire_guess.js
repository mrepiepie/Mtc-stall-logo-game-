const fs = require('fs');
let code = fs.readFileSync('src/app/join/page.tsx', 'utf-8');

const oldSubmit = `  const submitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) return;
    
    // In real multiplayer, this would send the guess to Supabase
    setHasGuessed(true);
  };`;

const newSubmit = `  const submitGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim() || !playerName) return;
    
    // Fire guess up to the cloud for the Admin Panel to read!
    const { error } = await supabase
      .from('multiplayer_guesses')
      .insert([{
        player_name: playerName,
        guess: guess.trim(),
        round: 1
      }]);

    if (error) {
      console.error('Submission failed:', error);
      alert('Network error: Could not submit answer!');
      return;
    }
    
    setHasGuessed(true);
  };`;

code = code.replace(oldSubmit, newSubmit);

fs.writeFileSync('src/app/join/page.tsx', code);
console.log('Wired up guessing system!');
