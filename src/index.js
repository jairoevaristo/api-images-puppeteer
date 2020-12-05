const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline-sync');

const search = readline.question('Qual Categoria Deseja Buscar Imagens: ');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.instagram.com/explore/tags/${search}/`);

  await page.waitForSelector('div.Nnq7C img');
  
  const photos = await page.evaluate(() => {
    const nodeList = document.querySelectorAll('div.Nnq7C img');
    const photos = [...nodeList];

    return photos.map(img => ({ photoURI: img.src }));
  });

  fs.writeFile('instagram.json', JSON.stringify(photos, null, 2), err => {
    if (err) throw Error('Internal Error');
  });

  await browser.close();
  console.log('Finish !');

})();