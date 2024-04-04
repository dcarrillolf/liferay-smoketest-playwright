import { test, expect, Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.beforeEach(async ({ page }, testInfo) => {
  testInfo.setTimeout(10000);
});

// HELPER FUNCTIONS

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function goToControlPanel(page: Page, tab:String, option:String) {
  await page.getByLabel('Open Applications Menu').click();
  await page.getByText(tab).click();
  await page.getByText(option).click();
}

// LOGIN / LOGOUT
async function login(page: Page) {
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByLabel('Email Address').fill('test@liferay.com');
  await page.getByLabel('Password').fill('test');
  await page.getByLabel('Sign In- Loading').getByRole('button', { name: 'Sign In' }).press('Enter');
}

async function logout(page: Page) {
  await page.getByTitle('User Profile Menu').click();
  await page.getByText("Sign Out").click();
}

// USER CREATION
async function createUser(page: Page) {
  await page.getByRole('link', { name: 'Add User' }).click();
  await page.getByLabel('Screen Name').fill("t"+Date.now());
  await page.getByLabel('Email Address').fill(Date.now()+"@liferay.com");
  await page.getByLabel('First Name').fill("First");
  await page.getByLabel('Last Name').fill("Last");
  await page.getByRole('button', {name:'Save'}).click();
}

// Create a new site
// Create a few pages on the new site
// Add a blogs widget to the page
// Add another widget to the page

// SMOKE TESTS
test('1_isAbleToLoginLogout', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#main-content')).toContainText('Welcome to Liferay');
  await login(page)
  await expect(page.getByRole('heading', { name: 'Home' })).toContainText('Home');
  await logout(page)
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  await page.goto('/');
  await logout(page)
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
});

test('2_createUser', async ({ page }) => {
  test.setTimeout(10000);
  await page.goto('/');
  await login(page);
  await goToControlPanel(page, 'Control Panel', 'Users and Organizations');
  await expect(page.getByRole('heading', { name: 'Users and Organizations' })).toBeVisible();
  await createUser(page);
  await expect(page.getByText('First Last')).toBeVisible();
});




