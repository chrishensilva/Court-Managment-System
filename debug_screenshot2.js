import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  await page.evaluate(() => {
    document.body.style.backgroundColor = '#00ff00';
    
    // Outline everything to find out what is the white box!
    const hero = document.querySelector('.hero-section');
    if (hero) hero.style.border = '10px solid red';
    
    const marketingApp = document.querySelector('.marketing-app');
    if (marketingApp) marketingApp.style.border = '10px solid blue';

    const loginWrapper = document.querySelector('.login-page-wrapper');
    if (loginWrapper) loginWrapper.style.border = '10px solid magenta';

    const root = document.querySelector('#root');
    if (root) root.style.border = '10px solid yellow';

    // What has the white background?!
    const elements = document.querySelectorAll('*');
    for (const el of elements) {
      const style = window.getComputedStyle(el);
      if (style.backgroundColor === 'rgb(255, 255, 255)' && style.borderRadius !== '0px') {
        el.style.border = '10px solid cyan';
      }
    }
  });
  
  await page.screenshot({ path: 'snapshot_borders.png' });
  await browser.close();
})();
