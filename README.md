# Playwright with TypeScript - E2E Testing

## Project Description

This project demonstrates an end-to-end (E2E) testing framework using **Playwright** with **TypeScript**. It includes automated tests for:

- **Frontend testing**: login, registration, and product purchase process.
- **API testing**: testing GET, POST, PUT, and DELETE requests.
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

### Cross-Browser Testing

- Runs on **Chrome** browser

### CI/CD with GitHub Actions

- Full integration of Playwright tests within GitHub Actions
- Test reports available in **HTML** and **JUnit** formats
- Results displayed in **GitHub Actions summary** and as **artifacts** (HTML and XML)

### Test Documentation

- Detailed comments in the test code for easy understanding of the test flow, especially for non-technical people.

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

npx playwright test

- Runs all tests headlessly
- Recommended for CI/CD pipelines

### NPM Scripts

- `"pw:test:headed": "npx playwright test --ui"`
- `"pw:test:headless": "npx playwright test"`

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

## Future Goals

- Implement **visual regression tests** to detect UI changes automatically
- Implement **accessibility (a11y) tests** to ensure compliance with accessibility standards
