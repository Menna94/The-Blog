const puppeteer = require('puppeteer');
let browser, page;

beforeEach(async()=>{
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    //navigate to the app
    await page.goto('localhost:3000');
})

afterEach(async()=>{
    await browser.close();
})


test('we can launch a browser', async()=>{

    //get a content of the logo brand
    const headerText = await page.$eval('a.brand-logo', el=> el.innerHTML);

    expect(headerText).toEqual('The Blog');

})

test('clicking login starts oauthflow', async()=>{
    await page.click('.right a');
    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);
})