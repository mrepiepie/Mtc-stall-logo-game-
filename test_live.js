async function testLive() {
  const baseUrl = 'https://mtc-stall-logo-game.vercel.app';
  console.log('1. Creating game...');
  const createRes = await fetch(`${baseUrl}/api/games/create`, { method: 'POST' });
  const createData = await createRes.json();
  console.log('Create result:', createData);
  
  if (!createData.success) return;
  const pin = createData.gamePin;

  console.log('\n2. Joining game...');
  const joinRes = await fetch(`${baseUrl}/api/games/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin, playerName: 'AI_Tester' })
  });
  console.log('Join result:', await joinRes.json());

  console.log('\n3. Starting game...');
  const startRes = await fetch(`${baseUrl}/api/games/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin })
  });
  console.log('Start result:', await startRes.json());

  console.log('\n4. Fetching game state to get Question 1 answer...');
  const stateRes = await fetch(`${baseUrl}/api/games/${pin}`);
  const stateData = await stateRes.json();
  console.log('State result round 1:', stateData.status, 'Players:', stateData.players);
  
  const q1 = stateData.questions[0];
  console.log('Question 1 answer is:', q1.answer);

  console.log('\n5. Submitting correct guess...');
  const guessRes = await fetch(`${baseUrl}/api/games/guess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      pin, 
      playerName: 'AI_Tester', 
      guess: q1.answer, 
      timeLeft: 20, 
      maxTime: 30 
    })
  });
  console.log('Guess result:', await guessRes.json());

  console.log('\n6. Fetching final state to see scores...');
  const finalStateRes = await fetch(`${baseUrl}/api/games/${pin}`);
  const finalState = await finalStateRes.json();
  console.log('Final Scores:', finalState.scores);

  console.log('\n7. Ending game...');
  await fetch(`${baseUrl}/api/games/end`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin })
  });
  console.log('Test complete!');
}
testLive().catch(console.error);
