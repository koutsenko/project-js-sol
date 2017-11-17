let puppeteer = require("puppeteer");

let page;
let browser;

// TODO Сгенерировать тесты для всех трех видов layout.

const width = 800;
const height = 600;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 80,
    args: [`--window-size=${width},${height}`]
  });
  page = await browser.newPage();
  await page.goto('http://localhost:9000');
  await page.setViewport({ width, height });
});
afterAll(() => {
  browser.close();
});

describe("test case 1", () => {
  test("just wait for <body> tag", async () => {
    await page.waitForSelector("body");
  });
});