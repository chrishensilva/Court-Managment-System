import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  const whiteBoxClass = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    for (const el of elements) {
      const style = window.getComputedStyle(el);
      // Look for the huge box
      if (style.backgroundColor === 'rgb(255, 255, 255)' && style.borderRadius !== '0px' && el.offsetHeight > 1000) {
         return el.className;
      }
    }
    return 'Not found';
  });
  
  console.log('The big white box has classes:', whiteBoxClass);
  await browser.close();
})();
