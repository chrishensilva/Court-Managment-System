import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  const whiteBoxes = await page.evaluate(() => {
    const list = [];
    const elements = document.querySelectorAll('*');
    for (const el of elements) {
      const style = window.getComputedStyle(el);
      if (style.backgroundColor === 'rgb(255, 255, 255)' && style.borderRadius !== '0px') {
        list.push({
          tag: el.tagName,
          className: el.className,
          id: el.id,
          width: el.offsetWidth,
          height: el.offsetHeight
        });
      }
    }
    return list;
  });
  
  console.log(JSON.stringify(whiteBoxes, null, 2));
  await browser.close();
})();
