const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { find } = require('domutils');
// const { response } = require('express');
const app = express();

const PORT = process.env.PORT || 4000;
const websites = [
    {
        name: 'yts',
        address: 'https://yts.rs/browse-movies/0/2160p/all/0/latest',
        base: 'https://yts.rs'
    },
]
const movies = []
const movieUrls = [
    {
        name: 'yts',
        address: 'https://yts.rs/movie/the-velvet-underground-2021',
        base: 'https://yts.rs',
    }
]
const movieDetails = []

// websites.forEach(website => {
//     axios.get(website.address)
//         .then(response => {
//             const html = response.data;
//             const $ = cheerio.load(html)
//             $('.text--bold.palewhite.title', html).each(function () {
//                 const title = $(this).text()
//                 const url = $(this).attr('href')
//                 movies.push({
//                     title,
//                     url: website.base + url,
//                     source: website.name
//                 })
//                 // console.log(title);
//             })
//         }).catch(err => console.log(err))
// });

movieUrls.forEach(async movieUrl => {
    await axios.get(movieUrl.address)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            var title;
            var rYear;
            var movieType;
            var imageUrl;
            var IMDBRate;
            var torrentUrls = [];

            title = $('div[class="visible-xs col-xs-20 movie-info text--white"]', html).find('h1').first().text();
            rYear = $('div[class="visible-xs col-xs-20 movie-info text--white"]', html).find('h2').first().text();
            movieType = $('div[class="visible-xs col-xs-20 movie-info text--white"]', html).find('h2').eq(1).text();
            IMDBRate = $('span[itemprop="ratingValue"]', html).text();
            // var imageAttr= $('img[class="hero__card-img image"]', html).attr();
            // imageUrl= (imageAttr === undefined) ? null : imageAttr.src;
            // imageUrl= $('div[class="image-container"]', html).find('img').attr('alt');


            $('p[class="hidden-md hidden-lg torrent-qualities"]', html).find('a[class="download-torrent popup123"]')
            .each(function () {
                if ($(this).find('img').attr('alt')!=="magnet") {
                   const torrent = $(this).attr('title');
                   const url = $(this).attr('href');
                   const tag = $(this).text();
                //    console.log(torrent);
                //    console.log(url);
                //    console.log(tag);

                   torrentUrls.push({
                       tag:tag,
                       torrent:torrent,
                       url:url
                   });
                }
              
            });

            console.log(rYear);
            console.log(title);
            console.log(movieType);
            console.log(IMDBRate);
            console.log(imageUrl);
            torrentUrls.forEach(torrentUrl => {
                console.log(torrentUrl)
            });


        }).catch(err => console.log("error"))
})









app.get('/', (req, res) => {

    res.json('Welcome to my Climate Change News API')
})

app.get('/movies', (req, res) => {
    res.json(movies)
})

// app.get('/news/:websiteId', (req, res) => {
//     const websiteId = req.params.websiteId

//     const websiteAddress = websites.filter(website => website.name == websiteId)[0].address
//     const websiteBase = websites.filter(website => website.name == websiteId)[0].base


//     axios.get(websiteAddress)
//         .then(response => {
//             const html = response.data
//             const $ = cheerio.load(html)
//             const specificmovies = []

//             $('a:contains("climate")', html).each(function () {
//                 const title = $(this).text()
//                 const url = $(this).attr('href')
//                 specificmovies.push({
//                     title,
//                     url: websiteBase + url,
//                     source: websiteId
//                 })
//             })
//             res.json(specificmovies)
//         }).catch(err => console.log(err))
// })

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));