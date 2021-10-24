const express = require('express');
const app = express();
const port = 3000;


app.get('/search', (request, response) => {
    const searchQuery = request.query.searchquery;
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

//Catches requests made to localhost:3000/
app.get('/', (req, res) => res.send('Hello World!'));


//Initialises the express server on the port 30000
app.listen(port, () => console.log(`server is listening on port ${port}!`));
