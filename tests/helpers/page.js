const puppeteer = require('puppeteer');
//Factories
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');


class CustomPage{
    static async build(){
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
        const customPage = new CustomPage(page);
        
        return new Proxy(customPage,{
            get: function(target, property){
                return customPage[property] || browser[property] || page[property] 
            }
        })
    }
    constructor(page){
        this.page = page;
    }

    async login(){
        const user = await userFactory();
        const {session , sig} = sessionFactory(user);
        //creating cookie
        //Session
        await this.page.setCookie({
            name: 'session', 
            value: session
        })
        //Session Signature
        await this.page.setCookie({
            name:'session.sig',
            value: sig
        })
        //redirect to myblogs page
        await this.page.goto('http://localhost:3000/blogs');
        //wait until [logout] appears on the screen
        await this.page.waitFor('a[href="/auth/logout"]');
    }

    //function that gets the innerHTML of a specific element by obly passing down the selector
    async getContentsOf(selector){
        return this.page.$eval(selector, el=> el.innerHTML);
    }

    requestMaker(url, method, data=''){

        return this.page.evaluate( (path, method, data) =>{

            return fetch(path ,{
                method: method,
                credentials:'same-origin',
                headers:{
                    'Content-Type':'application/json'
                },
                body : data ? JSON.stringify(data) : null
            })
            .then(res=> res.json());

        }, url, method, data)

    }

    execRequests(actions){
        //returns a single promise
        return Promise.all(
            actions.map(({path, method, data})=>{
                return this.requestMaker(path, method, data)
            })
        )
    }
}

module.exports = CustomPage;
