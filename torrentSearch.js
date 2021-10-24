const puppeteer = require('puppeteer');

const torrentSearch = async (searchQuery) => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(`https://yts.rs/browse-movies/${searchQuery}/all/all/0/latest`);
    // await page.type('input[name="search"]', searchQuery);
    // await page.keyboard.press('Enter');

    await page.waitForSelector("div[class=__header]");
    await page.screenshot({ path: 'example.png' });

    await browser.close();
};

module.exports = torrentSearch;
torrentSearch('cats');