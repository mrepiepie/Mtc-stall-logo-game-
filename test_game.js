const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/play');
  
  // click 'Start' or wait for game to start
  // The game starts with 'Ready to get roasted?' etc.
  // Wait for the input box
  try {
    await page.waitForSelector('.guess-input', { timeout: 10000 });
    
    // We don't know the exact logo since it's random.
    // Let's dump the current blanks to see the target length!
    const blanks = await page.$$eval('.font-mono span', spans => spans.map(s => s.textContent).join(''));
    console.log('Blanks:', blanks);
    
    // Wait for timeout to see what happens
    console.log('Waiting for timeout...');
    await page.waitForTimeout(11000); // 10s timer
    
    // Read the input box value
    const inputVal = await page.$eval('.guess-input', el => el.value);
    console.log('Timeout reveal value:', inputVal);
    
  } catch (err) {
    console.error(err);
  }

  await browser.close();
})();
