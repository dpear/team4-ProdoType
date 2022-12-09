const puppeteer = require('puppeteer');
const assert = require('assert')
const dayjs = require('dayjs')
let browser = null;
let extensionPage = null;

async function boot() {
    const pathToExtension = require('path').join(__dirname, 'refactoring');
    browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXEC_PATH,
        headless: false,
        args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
            '--no-sandbox'
        ],
    });
    const backgroundPageTarget = await browser.waitForTarget(
        target => target.type() === 'background_page'
    );
    const backgroundPage = await backgroundPageTarget.page();

    const targets = await browser.targets();
    extensionTarget = targets.find(target => target.url().includes('chrome-extension'));
    const partialExtensionUrl = extensionTarget.url() || '';
    const [, , extensionID] = partialExtensionUrl.split('/');

    const extensionPopupHtml = 'index.html'
    extensionPage = await browser.newPage();
    await extensionPage.goto(`chrome-extension://${extensionID}/${extensionPopupHtml}`);
}

describe('Extension UI Testing', function() {
    // Load Chrome Extension
    this.timeout(20000);
    before(async function() {
        await boot();
    });

    describe('Create Task Page', async function() {
        before(async function() {
            // Make Create Task Visible
            await extensionPage.$eval('#timeline', element => element.style.display = 'block');
            await extensionPage.$eval('#create_dialog_wrapper', element => element.style.display = 'block');
            // Set Date Input to Testing Mode
            await extensionPage.$eval('#form-date', element => element.testing = true)
        });

        // Reset Form and Submit Button For each Test
        beforeEach(async function() {
            await extensionPage.$eval('#form', element => element.reset())
            await extensionPage.$eval('#form-submit', element => element.disabled = true)
            await extensionPage.$eval('#form-submit', element => element.title = "Fill all Fields")
        })

        // Submit Button should be enabled when all inputs are filled
        it('Submit Enabled on all Inputs', async function() {
            await extensionPage.type('#form-title', 'Example Title')
            await extensionPage.type('#form-time', '3');
            await extensionPage.type('#form-date', dayjs().add(0, 'day').format('MMDDYYYY'));
            await extensionPage.select('#form-tag', "Sports");
            const isDisabled = await extensionPage.$eval('#form-submit', element => element.disabled)
            const mouseText = await extensionPage.$eval('#form-submit', element => element.title)
            assert.equal(isDisabled, false);
            assert.equal(mouseText, "Add Task");
        })

        // Submit Button should be disabled when there is no title
        it('Submit Disabled: No Title', async function() {
            await extensionPage.type('#form-time', '3');
            await extensionPage.type('#form-date', dayjs().add(0, 'day').format('MMDDYYYY'));
            await extensionPage.select('#form-tag', "Sports");
            const isDisabled = await extensionPage.$eval('#form-submit', element => element.disabled)
            const mouseText = await extensionPage.$eval('#form-submit', element => element.title)
            assert.equal(isDisabled, true);
            assert.equal(mouseText, "Fill all Fields");
        })

        // Submit Button should be disabled when there is no time
        it('Submit Disabled: No Time', async function() {
            await extensionPage.type('#form-title', 'Example Title')
            await extensionPage.type('#form-date', dayjs().add(0, 'day').format('MMDDYYYY'));
            await extensionPage.select('#form-tag', "Sports");
            const isDisabled = await extensionPage.$eval('#form-submit', element => element.disabled)
            const mouseText = await extensionPage.$eval('#form-submit', element => element.title)
            assert.equal(isDisabled, true);
            assert.equal(mouseText, "Fill all Fields");
        })

        // Submit Button should be disabled when there is no date
        it('Submit Disabled: No Date', async function() {
            await extensionPage.type('#form-title', 'Example Title')
            await extensionPage.type('#form-time', '3');
            await extensionPage.select('#form-tag', "Sports");
            const isDisabled = await extensionPage.$eval('#form-submit', element => element.disabled)
            const mouseText = await extensionPage.$eval('#form-submit', element => element.title)
            assert.equal(isDisabled, true);
            assert.equal(mouseText, "Fill all Fields");
        })

        // Submit Button should be disabled when there is no Tag
        it('Submit Disabled: No Tag', async function() {
            await extensionPage.type('#form-title', 'Example Title')
            await extensionPage.type('#form-time', '3');
            await extensionPage.type('#form-date', dayjs().add(0, 'day').format('MMDDYYYY'));
            const isDisabled = await extensionPage.$eval('#form-submit', element => element.disabled)
            const mouseText = await extensionPage.$eval('#form-submit', element => element.title)
            assert.equal(isDisabled, true);
            assert.equal(mouseText, "Fill all Fields");
        })

        // Submit Button should be disabled when there is a long title
        it('Submit Disabled: Long Title', async function() {
            await extensionPage.type('#form-title', 'This Title is Longer than Twenty Five Characters')
            await extensionPage.type('#form-time', '3');
            await extensionPage.type('#form-date', dayjs().add(0, 'day').format('MMDDYYYY'));
            await extensionPage.select('#form-tag', "Sports");
            const isDisabled = await extensionPage.$eval('#form-submit', element => element.disabled)
            const mouseText = await extensionPage.$eval('#form-submit', element => element.title)
            assert.equal(isDisabled, true);
            assert.equal(mouseText, "Enter Title less than 25 Characters");
        })

        // Submit Button should be disabled when there is an invalid time
        it('Submit Disabled: Time lower than Min', async function() {
            await extensionPage.type('#form-title', 'Example Title')
            await extensionPage.type('#form-time', '0');
            await extensionPage.type('#form-date', dayjs().add(0, 'day').format('MMDDYYYY'));
            await extensionPage.select('#form-tag', "Sports");
            const isDisabled = await extensionPage.$eval('#form-submit', element => element.disabled)
            const mouseText = await extensionPage.$eval('#form-submit', element => element.title)
            assert.equal(isDisabled, true);
            assert.equal(mouseText, "Enter Valid Pomodoro Number between 1 and 8");
        })

        // Submit Button should be disabled when there is an invalid time
        it('Submit Disabled: Time higher than Max', async function() {
            await extensionPage.type('#form-title', 'Example Title')
            await extensionPage.type('#form-time', '9');
            await extensionPage.type('#form-date', dayjs().add(0, 'day').format('MMDDYYYY'));
            await extensionPage.select('#form-tag', "Sports");
            const isDisabled = await extensionPage.$eval('#form-submit', element => element.disabled)
            const mouseText = await extensionPage.$eval('#form-submit', element => element.title)
            assert.equal(isDisabled, true);
            assert.equal(mouseText, "Enter Valid Pomodoro Number between 1 and 8");
        })

        // Submit Button should be disabled when there is an invalid date
        it('Submit Disabled: Invalid Date', async function() {
            await extensionPage.type('#form-title', 'Example Title')
            await extensionPage.type('#form-time', '3');
            await extensionPage.type('#form-date', dayjs().add(-1, 'day').format('MMDDYYYY'));
            await extensionPage.select('#form-tag', "Sports");
            const isDisabled = await extensionPage.$eval('#form-submit', element => element.disabled)
            const mouseText = await extensionPage.$eval('#form-submit', element => element.title)
            assert.equal(isDisabled, true);
            assert.equal(mouseText, "Enter Valid Date");
        })

        // Submit Button should be disabled when the tag chosen is the default
        it('Submit Disabled: Invalid Tag', async function() {
            await extensionPage.type('#form-title', 'Example Title')
            await extensionPage.type('#form-time', '3');
            await extensionPage.type('#form-date', dayjs().add(0, 'day').format('MMDDYYYY'));
            await extensionPage.select('#form-tag', "Tag");
            const isDisabled = await extensionPage.$eval('#form-submit', element => element.disabled)
            const mouseText = await extensionPage.$eval('#form-submit', element => element.title)
            assert.equal(isDisabled, true);
            assert.equal(mouseText, "Fill all Fields");
        })

        // Check that form resets each Test by Running First Test
        it('Form Reset on each Test', async function() {
            await extensionPage.type('#form-title', 'Example Title')
            await extensionPage.type('#form-time', '3');
            await extensionPage.type('#form-date', dayjs().add(0, 'day').format('MMDDYYYY'));
            await extensionPage.select('#form-tag', "Sports");
            const isDisabled = await extensionPage.$eval('#form-submit', element => element.disabled)
            const mouseText = await extensionPage.$eval('#form-submit', element => element.title)
            assert.equal(isDisabled, false);
            assert.equal(mouseText, "Add Task");
        })
    });

    // after(async function() {
    //     await browser.close();
    // });
});