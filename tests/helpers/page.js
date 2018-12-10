const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/session-factory');
const userFactory = require('../factories/user-factory');

// Proxies tryout
class Page {
  static async build() {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const customPage = new Page(page);

    return new Proxy(customPage, {
      get: (target, property) => {
        return customPage[property] || browser[property] || page[property];
      }
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const { session, sig } = sessionFactory(await userFactory());
    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    await this.page.goto('http://localhost:3000/blogs');
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(selector) {
    return await this.page.$eval(selector, el => el.innerHTML);
  }

  async get(path) {
    return this.page.evaluate((_path) => {
      return fetch(_path,{
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(data => data.json());
    }, path);
  }

  async post(path, body) {
    return this.page.evaluate((_path, _body) => {
      return fetch(_path,{
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(_body)
      }).then(data => data.json());
    }, path, body);
  }
}

module.exports = Page;