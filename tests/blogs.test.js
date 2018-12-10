const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

describe('When logged in', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a[href="/blogs/new"]');
  });

  test('We can see create-blog form', async () => {
    const formLabel = await page.getContentsOf('.title label');
    expect(formLabel).toEqual('Blog Title');
  });

  describe('When using valid inputs', () => {
    beforeEach(async () => {
      await page.type('.title input', 'My title');
      await page.type('.content input', 'My content');
      await page.click('button[type="submit"]');
    });

    test('Submitting takes user to review page', async () => {
      const text = await page.getContentsOf('form h5');
      expect(text).toEqual('Please confirm your entries');
    });

    test('Submitting takes user to index page', async () => {
      await page.click('button.green');
      await page.waitFor('.card');
      const title = await page.getContentsOf('.card .card-title');
      const content = await page.getContentsOf('.card p');

      expect(title).toEqual('My title');
      expect(content).toEqual('My content');
    });
  });

  describe('When using invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('button[type="submit"]');
    });

    test('form shows invalid inputs', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');

      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });
});

describe('When not logged in', async () => {
  test('User cannot create blog post', async () => {
    const result = await page.post('/api/blogs', { title: 'Not logged in', content: 'Haha you\'re not posted'});
    expect(result.error).toEqual('You must log in!');
  });

  test('User cannot fetch blog list', async () => {
    const result = await page.get('/api/blogs');
    expect(result.error).toEqual('You must log in!');
  });
});