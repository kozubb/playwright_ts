# Playwright with TypeScript - E2E Testing

## Project Description

This project demonstrates an end-to-end (E2E) testing framework using **Playwright** with **TypeScript**. It includes automated tests for:

- **Frontend testing**: login, registration, and product purchase process.
- **API testing**: testing GET, POST, PUT, and DELETE requests.
- **Contract Testing with Zod**: testing GET requests using Zod library.
- **Accessibility (a11y) Audits**: tests are using `@axe-core/playwright` library to ensure **WCAG 2.1** compliance and generate reports
- **Cross-browser testing**: tests are run on **Chrome**.
- **CI/CD pipeline**: integrated fully with **GitHub Actions**, including test execution and reporting.

---

## Key Features

### Frontend Tests

1. **QA Brains (Current site under maintenance)**

   - Existing frontend tests for the QA Brains website.
   - Currently **skipped** due to site being in maintenance mode.
   - Includes login, registration, and product purchase flows.

2. **Sauce Demo**
   - Frontend tests for [Sauce Demo](https://www.saucedemo.com) website.
   - Covers:
     - User login
     - Adding products to the cart
     - Complete order placement process (checkout and confirmation)
   - Implemented using **Page Object Pattern** for maintainability and clarity.

### API Tests

- GET, POST, PUT, and DELETE requests

### Conract API Tests

- GET requests using Zod library

### Accessibility (a11y) Audits:

- Automated scans using `@axe-core/playwright` to ensure **WCAG 2.1** compliance.
- Custom logic to generate visual **HTML reports** whenever violations are detected.
- Navigation using keyboard keys

### Cross-Browser Testing

- Runs on **Chrome** browser

### CI/CD with GitHub Actions

- **Automated Workflow**: Full integration of Playwright tests triggered on every push and pull request.
- **Reporting & Observability**:
  - Automatic generation of **Playwright HTML Reports**.
  - **Artifact Management**: Reports in HTML and XML files are stored as GitHub Actions artifacts for easy debugging.
  - **Direct Summary**: Test results are visible directly in the GitHub Actions summary for quick feedback.

### Test Documentation

- Detailed comments in the test code for easy understanding of the test flow, especially for non-technical people.

---

## Test Strategy

The project follows a balanced testing pyramid approach.

### Frontend E2E Tests

- Focus only on business-critical user flows
- Validate real UI behavior from an end-user perspective
- Avoid over-testing UI details
- Written with stability and readability in mind

### API Tests

- Faster and more reliable than UI tests
- Used to validate backend logic independently
- Reduce the need for excessive E2E coverage

### API Contract Testing

- **Contract Testing with Zod**:

  - Implementation of **Schema Validation** to ensure API responses match expected structures.
  - Validating data types, mandatory fields, and nested objects (e.g., address and company details).

## ♿ Accessibility Testing (a11y)

This project integrates automated accessibility audits to ensure compliance with **WCAG 2.1** standards:

- **Engine:** `@axe-core/playwright`
- Validation of navigation using keyboard navigation to simulate user interactions in accordance with
  accessibility guidelines and allow moving through the application without a mouse.
- Build can be run manually in Github Actions
- **Reporting:** - If violations are found, a detailed **HTML Report** is generated.
  - Reports are saved as **GitHub Action Artifacts** for 14 days.
  - Custom console logging provides immediate feedback on the number of violations.

---

## Design Decisions

### Page Object Pattern

- Each page has its own class containing:
  - UI actions
  - Validations
- **Benefits:**
  - Tests remain clean and focused only on business flow
  - Easier maintenance when selectors or UI structure change

### Playwright with TypeScript

- TypeScript chosen because it offers:
  - Type safety for fewer runtime errors
  - Better IDE support and autocompletion
  - Native Playwright ecosystem support

### Chrome-only Execution

- Chrome is selected as the primary browser because:

  - It reflects the most common real-user environment
  - Reduces test flakiness
  - Simplifies CI configuration

  ### Contract Testing with Zod

- Instead of just checking status codes, the project uses **Zod** for schema validation.
- **Why Zod?**
  - **Type Safety**: Automatically infers TypeScript types from schemas.
  - **Resilience**: Tests fail immediately if the backend changes a field name or data type, even if the status code is still 200.
  - **Detailed Error Reporting**: Provides clear information on which exact field in a deeply nested JSON failed validation.

---

## Trade-offs and Limitations

### Playwright-related trade-offs

- Single-browser focus in CI pipelines
- Limited multi-tab workflow testing
- Some advanced cross-browser scenarios may require extra configuration

**These limitations are accepted because:**

- The tested applications do not require multi-tab workflows
- The goal is fast, stable feedback, not exhaustive browser coverage

---

## In progress

- Implement **accessibility (a11y) tests** to ensure compliance with accessibility standards WCAG - it will be done using axe library for playwright

---

## Future Goals

- Implement **visual regression tests** to detect UI changes automatically

---

## How to Run Tests

### Prerequisites

- Node.js (recommended LTS version)
- npm (comes with Node.js)

### Install Dependencies

npm install

Installs all required packages for running the Playwright tests.

### Run Playwright Tests

You can run tests either in interactive mode (headed) or in headless mode (for CI/CD).

**Open Playwright Test Runner (headed)**

npx playwright test --ui

- Opens the Playwright Test Runner UI
- Allows running tests interactively

**Run Playwright tests headlessly**

npx playwright test --grep-invert @a11y

- Runs all tests headlessly
- Recommended for CI/CD pipelines

### NPM Scripts

- `"pw:test:headed": "npx playwright test --ui"`
- `"pw:test:headless": "npx playwright test"`

### Check results visually

After running tests you can open html report using command:

npx playwright show-report playwright-report/html

### How to Run accessibility tests:

**Run only accessibility tests**

npx playwright test --grep @a11y

**View the results**

Open /axe-reports/accessibility-report.html in your browser

Open html report using command:
npx playwright show-report playwright-report/html
