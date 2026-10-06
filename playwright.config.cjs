const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:4173', browserName: 'chromium', channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' },
  webServer: { command: 'npm start', url: 'http://127.0.0.1:4173', reuseExistingServer: true },
  reporter: 'list',
});
