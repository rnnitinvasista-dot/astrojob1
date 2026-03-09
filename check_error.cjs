const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5173');
    await new Promise(resolve => setTimeout(resolve, 3000));
    const html = await page.content();
    fs.writeFileSync('rendered.html', html);
    console.log("Saved to rendered.html");
  } catch(e) {
    console.log("Failed to load:", e);
  }
  
  await browser.close();
})();
