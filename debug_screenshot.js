import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  // Set the background of the body to BRIGHT GREEN to see if it shows through.
  await page.evaluate(() => {
    document.body.style.backgroundColor = '#00ff00';
    const hero = document.querySelector('.hero-section');
    if (hero) hero.style.backgroundColor = '#ff0000'; // BRIGHT RED
  });
  
  await page.screenshot({ path: 'snapshot_debug.png' });
  await browser.close();
})();
