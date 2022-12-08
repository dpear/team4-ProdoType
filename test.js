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

describe('Extension UI Testing', function() {
    this.timeout(20000); // default is 2 seconds and that may not be enough to boot browsers and pages.
    before(async function() {
      await boot();
    });
  
    describe('Home Page', async function() {
      it('Greet Message', async function() {
        
        const element = await extensionPage.waitForSelector('#focus-header > span:nth-child(2)');
        await element.click(); 

        // const inputElement = await extensionPage.$('[data-test-input]');
        // assert.ok(inputElement, 'Input is not rendered');
  
        // await extensionPage.type('[data-test-input]', 'Gokul Kathirvel');
        // await extensionPage.click('[data-test-greet-button]');
  
        // const greetMessage  = await extensionPage.$eval('#greetMsg', element => element.textContent)
        // assert.equal(greetMessage, 'Hello, Gokul Kathirvel!', 'Greeting message is not shown');
      })
    });
  
    after(async function() {
      await browser.close();
    });
});

(async () => {
  const pathToExtension = require('path').join(__dirname, 'refactoring');
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
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
  const element = await extensionPage.waitForSelector('#focus-header > span:nth-child(2)');
  await element.click(); 

//   describe('Home Page', async function() {
//     it('Greet Message', async function() {
//         const element = await extensionPage.waitForSelector('#focus-header > span:nth-child(2)');
//         await element.click(); 
        
//         //   const inputElement = await extensionPage.$('[data-test-input]');
//     //   assert.ok(inputElement, 'Input is not rendered');
  
//     //   await extensionPage.type('[data-test-input]', 'Gokul Kathirvel');
//     //   await extensionPage.click('[data-test-greet-button]');
  
//     //   const greetMessage  = await extensionPage.$eval('#greetMsg', element => element.textContent)
//     //   assert.equal(greetMessage, 'Hello, Gokul Kathirvel!', 'Greeting message is not shown');
//     })
  });

//   await extensionPage.click('#timeline')
  // Test the background page as you would any other page.
//   await browser.close();
})();
