const puppeteer = require('puppeteer');

const torrentSearch = async (searchQuery) => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(`https://yts.rs/browse-movies/${searchQuery}/all/all/0/latest`);
    // await page.type('input[name="search"]', searchQuery);
    // await page.keyboard.press('Enter');

    await page.waitForSelector("div[class=__header]");
    await page.screenshot({ path: 'example.png' });
    // const parent = await page.$eval('div[class=card]', result => result);
    // const title = parent.querySelector('a[class=image-container-link popup123] ').href;
    const heading1 = await page.$eval("h2[class='text--green']", el => el.textContent);
    console.log(heading1);

    // await page.evaluate(() => {
    //     let results = [];
    //     let items = document.querySelectorAll('div[class=card]');
    //     items.forEach((item) => {
    //         console.log('asd')
    //     })

    // })

    const movieUrls = await page.evaluate(() => Array
        .from(document.querySelectorAll("div[class=card] > a[class='text--bold palewhite title']"), element => element.href));
    const movieName = await page.evaluate(() => Array
        .from(document.querySelectorAll("div[class=card] > a[class='text--bold palewhite title']"), element => element.innerText));
        const movieImage = await page.evaluate(() => Array
        .from(document.querySelectorAll("div[class=card] > a[class='image-container-link popup123'] > img[class='hero__card-img image']"), element => element.src));

    // text.forEach((x) => {
    //     console.log(x)
    // })
for (let index = 0; index < movieName.length; index++) {
   console.log(movieName[index])
   console.log(movieImage[index])
    
}



    await browser.close();
};

module.exports = torrentSearch;
torrentSearch('cats');