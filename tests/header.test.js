//Helpers
const Page = require('./helpers/page');
let page;


beforeEach(async()=>{
    //page is our proxy
    page = await Page.build();
    //navigate to the app
    await page.goto('http://localhost:3000');
})

afterEach(async()=>{
    await page.close();
})


test('we can launch a browser', async()=>{

    //get a content of the logo brand
    const headerText = await page.getContentsOf('a.brand-logo');

    expect(headerText).toEqual('The Blog');

})

test('clicking login starts oauthflow', async()=>{
    await page.click('.right a');
    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);
})

test('when signed in, show logout button', async()=>{
    await page.login();
    
    const logoutText = await page.getContentsOf('a[href="/auth/logout"]');
    expect(logoutText).toEqual('Logout');
})

