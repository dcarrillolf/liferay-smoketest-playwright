import { test, expect, Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.beforeEach(async ({ page }, testInfo) => {
  testInfo.setTimeout(120000);
});

// HELPER FUNCTIONS
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function goToControlPanel(page: Page, tab:string, option:string) {
  await page.getByLabel('Open Applications Menu').click();
  await page.getByRole('tab', { name: tab , exact: true }).click();
  await page.getByRole('menuitem', { name: option }).click();
}

async function goToProductMenu(page: Page, tab:string, option:string) {
  const openProductMenu = page.getByRole('tab', {name:'Open Product Menu'});
  await openProductMenu.waitFor({timeout: 5000}).then(() => {openProductMenu.click();}).catch(() => {});
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
  await page.getByRole('button', { name: 'New' }).first().click();
  await page.getByRole('menuitem', { name: 'Basic Web Content'}).click();
  const contentLocator = page.frameLocator('internal:role=application[name="Rich Text Editor, _com_liferay_journal_web_portlet_JournalPortlet_ddm$$content$"i] >> iframe').getByRole('textbox');
  await contentLocator.click();
  await contentLocator.type("Example Content"+Date.now());
  await page.getByPlaceholder('Untitled Basic Web Content').fill("Web Content "+Date.now());
  await page.getByRole('button', { name: 'Publish' }).click();
}

async function createBlogEntry(page: Page) {
  await page.getByRole('link', { name: 'Add Blog Entry' }).click();
  await page.getByPlaceholder('Title *').fill("Example Title"+Date.now());
  await page.getByPlaceholder('Subtitle').fill("Example Subtitle"+Date.now());
  const contentLocator = page.locator('[id="_com_liferay_blogs_web_portlet_BlogsAdminPortlet_contentEditor"]');
  await contentLocator.click();
  await contentLocator.type("Example Content"+Date.now());
  await page.getByRole('button', {name:"Publish"}).click();
}

async function createSite(page: Page) {
  await page.getByRole('link', { name: 'Add Site' }).click();
  await page.getByRole('button', { name: 'Select Template: Blank Site' }).click();
  await page.frameLocator('iframe[title="Add Site"]').getByLabel('Name Required').fill("Site"+Date.now());
  await page.frameLocator('iframe[title="Add Site"]').getByRole('button', { name: 'Add' }).click();  // Random error at this point the first time
  await delay(5000);
}

async function createLayoutWithBlogPortlet(page: Page) {
  await page.getByRole('button', { name: 'New' }).first().click();
  await page.getByRole('menuitem', { name: 'Page', exact: true }).click();
  await page.getByRole('button', { name: 'Blank' }).click();
  await page.frameLocator('iframe[title="Add Page"]').getByPlaceholder('Add Page Name').fill("CustomPage "+Date.now());
  await page.frameLocator('iframe[title="Add Page"]').getByRole('button', { name: 'Add' }).click();
  await delay(3000);
  await page.getByLabel('Search Fragments and Widgets').fill('blogs');
  await page.getByRole('menuitem', { name: 'Blogs Add Blogs' }).first().dragTo(page.getByText('Place fragments or widgets'));
  await delay(3000);
  await page.getByRole('button', {name:"Publish"}).click();
}

// TESTS
test('createWebContent', async ({ page }) => {
  await page.goto('/');
  await login(page);
  await goToProductMenu(page, 'Content & Data', 'Web Content');
  await expect(page.getByRole('heading', { name: 'Web Content' })).toBeVisible();
  await createWebContent(page);
  await expect(page.getByText('Success')).toBeVisible();
});

test('createLayoutWithBlogPortlet',  async ({ page }) => {
  await page.goto('/');
  await login(page);
  await goToProductMenu(page, 'Site Builder', 'Pages');
  await expect(page.getByRole('heading', { name: 'Pages', exact: true })).toBeVisible();
  await createLayoutWithBlogPortlet(page);
  await expect(page.getByText('Success')).toBeVisible();  
});

test('createBlogEntry', async ({ page }) => {
  await page.goto('/');
  await login(page);
  await goToProductMenu(page, 'Content & Data', 'Blogs');
  await expect(page.getByRole('heading', { name: 'Blogs' })).toBeVisible();
  await createBlogEntry(page);
  await expect(page.getByText('Success')).toBeVisible();
});

// Smoke Tests
test.only('isAbleToLoginLogout', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#main-content')).toContainText('Welcome to Liferay');
  await login(page)
  await expect(page.getByRole('heading', { name: 'Home' })).toContainText('Home');
  await logout(page)
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
});


test.only('createUser', async ({ page }) => {
  await page.goto('/');
  await login(page);
  await goToControlPanel(page, 'Control Panel', 'Users and Organizations');
  await expect(page).toHaveTitle(new RegExp('Users and Organizations'));
  await createUser(page);
  await expect(page.getByText('Success')).toBeVisible();
});

test.only('createSiteWithContent', async ({ page }) => {
  await page.goto('/');
  await login(page);
  
  // SITE
  await goToControlPanel(page, 'Control Panel', 'Sites');
  await expect(page.locator('h2.applications-menu-sites-label')).toBeVisible();
  await createSite(page);
  await expect(page.getByText('Success')).toBeVisible();
  
  // LAYOUT
  await goToProductMenu(page, 'Site Builder', 'Pages');
  await expect(page).toHaveTitle(new RegExp('Pages'));
  await createLayoutWithBlogPortlet(page);
  await expect(page.getByText('Success')).toBeVisible();
  
  // WEB CONTENT
  await goToProductMenu(page, 'Content & Data', 'Web Content');
  await expect(page).toHaveTitle(new RegExp('Web Content'));
  await createWebContent(page);
  await expect(page.getByText('Success')).toBeVisible();
  
  // BLOG ENTRY
  await goToProductMenu(page, 'Content & Data', 'Blogs');
  await expect(page).toHaveTitle(new RegExp('Blogs'));
  await createBlogEntry(page);
  await expect(page.getByText('Success')).toBeVisible();
});
