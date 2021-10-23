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
const movieDetails = []

websites.forEach(website => {
    axios.get(website.address)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html)
            $('.text--bold.palewhite.title', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                movies.push({
                    title,
                    address: website.base + url,
                    source: website.name
                })
            })
            getMovieDetails();
        })
        .catch(err => console.log(err))
});

async function getMovieDetails() {
    console.log('fun loaded');
    movies.forEach(async movieUrl => {
        await axios.get(movieUrl.address)
            .then(response => {
                const html = response.data;
                const $ = cheerio.load(html);
                var title;
                var releaseYear;
                var movieType;
                var imageUrl;
                var IMDBRate;
                var synopsis;
                var torrentUrls = [];

                title = $('div[class="visible-xs col-xs-20 movie-info text--white"]', html).find('h1').first().text();
                releaseYear = $('div[class="visible-xs col-xs-20 movie-info text--white"]', html).find('h2').first().text();
                movieType = $('div[class="visible-xs col-xs-20 movie-info text--white"]', html).find('h2').eq(1).text();
                IMDBRate = $('span[itemprop="ratingValue"]', html).text();
                synopsis = $('div[class="synopsis col-sm-10 col-md-13 col-lg-12"]', html).find('p').first().text();
                $('p[class="hidden-md hidden-lg torrent-qualities"]', html).find('a[class="download-torrent popup123"]')
                    .each(function () {
                        if ($(this).find('img').attr('alt') !== "magnet") {
                            const torrent = $(this).attr('title');
                            const url = $(this).attr('href');
                            const tag = $(this).text();
                            torrentUrls.push({
                                tag: tag,
                                torrent: torrent,
                                url: url
                            });
                        }
                    });
                movieDetails.push({
                    title: title,
                    release_year: releaseYear,
                    type: movieType,
                    IMDB: IMDBRate,
                    synopsis: synopsis,
                    torrents: torrentUrls
                });
                // console.log(movieDetails)
            }).catch(err => console.log("error"))
    })
}


app.get('/', (req, res) => {
    res.json('Welcome to my Climate Change News API')
})

app.get('/movies', (req, res) => {
    res.json(movies)
})
app.get('/moviedetails', (req, res) => {
    res.json(movieDetails)
})

//Catches requests made to localhost:3000/search
app.get('/search', (request, response) => {

    //Holds value of the query param 'searchquery'.
    const searchQuery = request.query.searchquery;

    //Do something when the searchQuery is not null.
    if (searchQuery != null) {

        searchGoogle(searchQuery)
            .then(results => {
                //Returns a 200 Status OK with Results JSON back to the client.
                response.status(200);
                response.json(results);
            });
    } else {
        response.end();
    }
});

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