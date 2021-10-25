const express = require('express');
const getMovieDetails = require('./getMovieDetails');
const torrentSearch = require('./torrentSearch');
const app = express();
const port = 3000;

app.get('/',async (request, response) => {
    const searchQuery = request.query.search;
    if (searchQuery != null) {
    //    var results=await torrentSearch(searchQuery)
    //    console.log(results);
       
       torrentSearch(searchQuery)
            .then(results => {
                response.status(200);
                response.json(results);
            });
    } else {
        response.end();
    }
});

app.get('/movie',async (request, response) => {
    const url = request.query.url;
    console.log(url)
    if (url != null) {
        getMovieDetails(url)
            .then(results => {
                response.status(200);
                response.json(results);
            }).catch(err=> {
                console.log("error in geting data");
                response.status(404);
                response.json("enter a valid movie url");
            });
    } else {
        response.end(err=> console.log("error in geting data"));
    }
});


app.listen(port, () => console.log(`server is listening on port ${port}!`));
