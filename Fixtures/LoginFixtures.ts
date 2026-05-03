import {test as base, expect, Page} from '@playwright/test'
import LoginPage from '../pages/QABrains/Login'
import testData from '../testData/QABrains/TestData'

type LoginFixtures = {
    loggedInUser: Page
}

export const test = base.extend<LoginFixtures>({
    loggedInUser: async ({page}, use) => {
        const loginPage = new LoginPage(page)

        // Visit the login page
        await page.goto(`${testData.Endpoint}ecommerce/login`)

        // Fill in username and password, then submit
        await loginPage.fillEmail(testData.Users.OrderUser.Username)
        await loginPage.fillPassword(testData.Users.OrderUser.Password)
        await loginPage.pressLoginButton()

        await expect(page.locator('.user-name')).toHaveText(testData.Users.OrderUser.Username)

        await use(page)
    }
})