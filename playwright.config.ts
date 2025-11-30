import { defineConfig, devices } from "@playwright/test";
import path from "path";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */

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
