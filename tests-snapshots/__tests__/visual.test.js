const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot')

expect.extend({ toMatchImageSnapshot })

describe('Visual regression testing', () => {
  let browser
  let page

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false })
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
  })

  test('Full page snapshot', async () => {
    await page.goto('http://www.example.com')
    await page.waitForSelector('h1')
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'pixel',
      failureThreshold: 500,
    })
  })
})