// test.js

// const puppeteer = require('puppeteer');
// const extensionPath = './extension.zip'

// let browser = await puppeteer.launch({
//     headless: false, // extension are allowed only in head-full mode
//     args: [
//         `--disable-extensions-except=${extensionPath}`,
//         `--load-extension=${extensionPath}`
//     ]
// });

// const puppeteer = require('puppeteer');
// const extensionPath = './'

// (async () => {
//     const browser = await puppeteer.launch({ 
//         headless: false,
//         args: [
//             `--disable-extensions-except=${extensionPath}`,
//             `--load-extension=${extensionPath}`
//         ] 
//     });
//     const page = await browser.newPage();
// //   await page.goto('https://example.com');
// //   await page.screenshot({ path: 'example.png' });
    
// //   await browser.close();
// })();

const puppeteer = require('puppeteer');
const extensionName = 'Focus Screen Chrome Extension Development';

(async () => {
  const pathToExtension = require('path').join(__dirname, 'refactoring');
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ],
  });
  const backgroundPageTarget = await browser.waitForTarget(
    target => target.type() === 'background_page'
  );
  const backgroundPage = await backgroundPageTarget.page();

//   const targets = await browser.targets();
//   console.log(targets)
//   const extensionTarget = targets.find(({ _targetInfo }));
//   print(_targetInfo.extensionName);
//   => {
//     return _targetInfo.name === extensionName && _targetInfo.type === 'background_page';
//   });
    
  const targets = await browser.targets();
  extensionTarget = targets.find(target => target.url().includes('chrome-extension'));
  const partialExtensionUrl = extensionTarget.url() || '';
  const [, , extensionID] = partialExtensionUrl.split('/');

  const extensionPopupHtml = 'index.html'
  const extensionPage = await browser.newPage();
  await extensionPage.goto(`chrome-extension://${extensionID}/${extensionPopupHtml}`);

  // TODO: Use extensionPage to access DOM and write UI Tests HERE
  
//   await extensionPage.click('#timeline')
  // Test the background page as you would any other page.
//   await browser.close();
})();
