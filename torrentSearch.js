const puppeteer = require('puppeteer');

const torrentSearch = async (searchQuery) => {
    const movies = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://yts.rs/browse-movies/${searchQuery}/all/all/0/year`);
    await page.waitForSelector("div[class=__header]");
    await page.screenshot({ path: 'example.png' });

    const heading1 = await page.$eval("h2[class='text--green']", el => el.textContent);
    console.log(heading1);

    const movieUrls = await page.evaluate(() => Array
        .from(document.querySelectorAll("div[class=card] > a[class='text--bold palewhite title']"), element => element.href));
    const movieName = await page.evaluate(() => Array
        .from(document.querySelectorAll("div[class=card] > a[class='text--bold palewhite title']"), element => element.innerText));
    const movieReleaseYear = await page.evaluate(() => Array
        .from(document.querySelectorAll("div[class=card] > span[class='text--gray year']"), element => element.innerText));
    const movieImage = await page.evaluate(() => Array
        .from(document.querySelectorAll("div[class=card] > a[class='image-container-link popup123'] > img[class='hero__card-img image']"), element => element.src));

    for (let index = 0; index < movieName.length; index++) {
        movies.push({
            title: movieName[index],
            release_year: movieReleaseYear[index],
            image_url: movieImage[index],
            movie_url: movieUrls[index]
        });
    }
    await browser.close();
    return movies;
};

module.exports = torrentSearch;
