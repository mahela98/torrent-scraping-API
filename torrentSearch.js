const puppeteer = require('puppeteer');

const torrentSearch = async (searchQuery) => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto('https://google.com');
    await page.type('input[name="q"]', searchQuery);

    await page.screenshot({path: 'example.png'});

    await browser.close();
};

module.exports = torrentSearch;
torrentSearch('cats');