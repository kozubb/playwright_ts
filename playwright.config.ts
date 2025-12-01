import { defineConfig, devices } from "@playwright/test";
import path from "path";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 15 * 1000,
  expect: {
    timeout: 5000,
  },

  reporter: [
    ["line"],
    [
      "junit",
      { outputFile: path.join(process.cwd(), "playwright-report/results.xml") },
    ],
    [
      "html",
      {
        outputFolder: path.join(process.cwd(), "playwright-report/html"),
        open: "never",
      },
    ],
    ["@estruyf/github-actions-reporter", { useDetails: true }],
  ],
  use: {
    trace: "on-first-retry",
    headless: process.env.CI === "true", // headless if in CI environment
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        video: "off",
        screenshot: "only-on-failure",
        trace: "retain-on-failure",
      },
    },
  ],
});
