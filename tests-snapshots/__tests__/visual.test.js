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

  test('Single element snapshot', async () => {
    await page.goto('http://www.example.com')
    const h1 = await page.waitForSelector('h1')
    const image = await h1.screenshot()
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.01,
    })
  })

  test('Mobile snapshot', async () => {
    await page.goto('http://www.example.com')
    await page.waitForSelector('h1')
    await page.emulate(puppeteer.devices['iPhone X'])
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.01,
    })
  })

  test('Tablet snapshot', async () => {
    await page.goto('http://www.example.com')
    await page.waitForSelector('h1')
    await page.emulate(puppeteer.devices['iPad landscape'])
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.01,
    })
  })

  test('Remove element before snapshot', async () => {
    await page.goto('http://www.example.com')
    await page.evaluate(() => {
      (document.querySelectorAll('h1') || []).forEach((el) => el.remove())
    })

    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.01,
    })
  })
})
