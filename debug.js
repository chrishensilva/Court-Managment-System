import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  const data = await page.evaluate(() => {
    const hero = document.querySelector('.hero-section');
    if (!hero) return 'No hero section found!';
    const styles = window.getComputedStyle(hero);
    const h1 = hero.querySelector('h1');
    const h1Styles = h1 ? window.getComputedStyle(h1) : null;
    
    return {
      heroVisible: hero.offsetHeight > 0,
      heroHeight: hero.offsetHeight,
      heroBackground: styles.backgroundColor,
      h1Color: h1Styles ? h1Styles.color : 'No h1',
      rootPrimary: getComputedStyle(document.documentElement).getPropertyValue('--color-primary'),
      marketingAppPrimary: getComputedStyle(document.querySelector('.marketing-app')).getPropertyValue('--color-primary')
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
