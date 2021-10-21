const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
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

websites.forEach(website => {
    axios.get(website.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            // console.log(html)
            $('.text--bold.palewhite.title', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                movies.push({
                    title,
                    url: website.base + url,
                    source: website.name
                })
                console.log(title);
            })

        }).catch(err => console.log(err))
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