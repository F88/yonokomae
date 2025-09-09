import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  workers: process.env.CI ? 1 : 1,
  // fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['dot'],
    ['line'],
    ['list'],
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: 'never',
        // open: 'on-failure',
        // open: 'always',
      },
    ],
  ],
  use: {
    baseURL: 'https://f88.github.io/yonokomae/',
    navigationTimeout: 5_000,
    actionTimeout: 5_000,
    trace: process.env.CI ? 'off' : 'on',
    screenshot: process.env.CI ? 'off' : 'on',
    video: process.env.CI ? 'off' : 'on',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] }, },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    // { name: 'iPadGen7', use: { ...devices['iPad (gen 7)'] } },
    { name: 'Pixel 7', use: { ...devices['Pixel 7'] } },
    // { name: 'iPhoneSE', use: { ...devices['iPhone SE'] } },
    { name: 'iPhone13', use: { ...devices['iPhone 13'] } },
  ],
  // Note: No webServer configuration for production testing
  // The site should already be deployed to GitHub Pages
});
