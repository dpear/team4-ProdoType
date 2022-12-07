const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('before:browser:launch', (browser, launchOptions) => {
        // supply the absolute path to an unpacked extension's folder
        // NOTE: extensions cannot be loaded in headless Chrome
        launchOptions.extensions.push('C:/Users/devgu/OneDrive - UC San Diego/Coursework/Grad/Fall 2022/CSE 210/team4-ProdoType/refactoring')
        return launchOptions
      })
    },
  },
});
