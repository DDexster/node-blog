const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

test('Header has the correct text', async () => {
  const text = await page.getContentsOf('a.brand-logo');
  expect(text).toEqual('Blogster')
});

test('Click login starts OAuth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in there is a logout button', async () => {
  await page.login();
  const logoutText = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  expect(logoutText).toEqual('Logout');
});
