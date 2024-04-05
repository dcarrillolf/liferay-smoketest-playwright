import { test, expect, Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.beforeEach(async ({ page }, testInfo) => {
  testInfo.setTimeout(30000);
});

// HELPER FUNCTIONS

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function goToControlPanel(page: Page, tab:String, option:String) {
  await page.getByLabel('Open Applications Menu').click();
  await page.getByText(tab).click();
  await page.getByRole('link', {name:option}).click();
  await delay(1000);
}

async function goToProductMenu(page: Page, tab:String, option:String) {
  const productMenuButton = page.getByLabel('Open Product Menu');
  if (await productMenuButton.isVisible()) {
    await productMenuButton.click();
  }
  await page.getByRole('menuitem', {name:tab}).click();
  await page.getByRole('menuitem', {name:option}).click();
}

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

async function createUser(page: Page) {
  await page.getByRole('link', { name: 'Add User' }).click();
  await page.getByLabel('Screen Name').fill("t"+Date.now());
  await page.getByLabel('Email Address').fill(Date.now()+"@liferay.com");
  await page.getByLabel('First Name').fill("First");
  await page.getByLabel('Last Name').fill("Last");
  await page.getByRole('button', {name:'Save'}).click();
}

async function createWebContent(page: Page) {
  await page.getByRole('button', { name: 'New' }).click();
  await page.getByRole('menuitem', { name: 'Basic Web Content'}).click();
  await delay(10000);
  await page.getByPlaceholder('Untitled Basic Web Content').fill("WC Example");
  await page.getByRole('button', {name:"Publish"}).click();
  await delay(5000);
}

async function createSite(page: Page) {
  await page.getByRole('link', { name: 'Add Site' }).click();
  await page.getByRole('button', { name: 'Select Template: Blank Site' }).click();
  //await page.getByLabel('Name').fill("Site Example");
  await page.frameLocator('iframe[title="Add Site"]').getByLabel('Name Required').fill("Site Example");  // 
  await page.frameLocator('iframe[title="Add Site"]').getByRole('button', { name: 'Add' }).click();
  await delay(10000);
}

// SMOKE TESTS
test.skip('isAbleToLoginLogout', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#main-content')).toContainText('Welcome to Liferay');
  await login(page)
  await expect(page.getByRole('heading', { name: 'Home' })).toContainText('Home');
  await logout(page)
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
});

test('createUser', async ({ page }) => {
  await page.goto('/');
  await login(page);
  await goToControlPanel(page, 'Control Panel', 'Users and Organizations');
  await expect(page.getByRole('heading', { name: 'Users and Organizations' })).toBeVisible();
  await createUser(page);
  await expect(page.getByText('First Last')).toBeVisible();
});

test('createWebContent', async ({ page }) => {
  await page.goto('/');
  await login(page);
  await goToProductMenu(page, 'Content & Data', 'Web Content');
  await expect(page.getByRole('heading', { name: 'Web Content' })).toBeVisible();
  await createWebContent(page);
  await expect(page.getByRole('link',{name:'WC Example'})).toBeVisible();
});

test('createSite', async ({ page }) => {
  await page.goto('/');
  await login(page);
  await goToControlPanel(page, 'Control Panel', 'Sites');
  await expect(page.getByRole('heading', { name: 'Sites' })).toBeVisible();
  await createSite(page);
  await expect(page.getByRole('heading', {name:'Site Settings'})).toBeVisible();
});



