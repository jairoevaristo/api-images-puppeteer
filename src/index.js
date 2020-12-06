const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline-sync');

const liveServer = require('live-server');

var params = {
  port: 8181,
  host: "0.0.0.0",
  root: "./",
  open: true,
  ignore: 'scss,my/templates',
  file: "index.html",
  wait: 1000,
  mount: [['/components', './node_modules']],
  logLevel: 2,
  middleware: [function(req, res, next) { next(); }]
};

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

liveServer.start(params);