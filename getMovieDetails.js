const puppeteer = require('puppeteer');

const getMovieDetails = async (url) => {
    const torrents = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector("h1[itemprop=name]");
    await page.screenshot({ path: 'example2.png' });

    const title = await page.$eval("div[class='hidden-xs'] > h1", element => element.textContent);
    const YearAndType = await page.evaluate(() => Array
        .from(document.querySelectorAll("div[class='hidden-xs'] h2"), element => element.innerText));
    const synopsis = await page.$eval("div[class='synopsis col-sm-10 col-md-13 col-lg-12'] > p", element => element.textContent);
    const rate = await page.$eval("span[itemprop='ratingValue']", element => element.textContent);
    const torrentlinks = await page.evaluate(() => Array
        .from(document.querySelectorAll("p[class='hidden-md hidden-lg torrent-qualities'] > a > span[class='text--green glyphicon glyphicon-download-alt'] "),
            element => element.parentNode.href));
    const torrentNames = await page.evaluate(() => Array
        .from(document.querySelectorAll("p[class='hidden-md hidden-lg torrent-qualities'] > a > span[class='text--green glyphicon glyphicon-download-alt'] "),
            element => element.parentNode.innerText));
    const image_url = await page.$eval("img[class='hero__card-img image']", element => element.src);
    const year = YearAndType[0];
    const type = YearAndType[1];
    const types = type.split("/");
    for (let index = 0; index < torrentlinks.length; index++) {
        torrents.push({
            quality: torrentNames[index],
            link: torrentlinks[index]
        })

    }
    await browser.close();

    const movie = {
        title: title,
        release_year: year,
        genre: types,
        synopsis: synopsis,
        IMDB_rate: rate,
        torrent_links: torrents,
        image_url: image_url
    }
    // console.log(movie)
    return movie;
};

module.exports = getMovieDetails;

// getMovieDetails('https://yts.rs/movie/venom-2018');