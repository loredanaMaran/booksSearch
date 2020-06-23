const path = require("path");
const https = require('https');
const express = require('express');
const xml2js = require('xml2js');
const config = require('./config.js');

const hostname = '127.0.0.1';
const port = 8085;
const parser = new xml2js.Parser({explicitArray:false});
let app = express();

app.use(express.static(path.join(__dirname, 'dist/goodreadsFindUrl')));

app.listen(port,hostname, function() {
  console.log('Server listening at http://%s:%s', hostname, port);
});
const latestSearches = [];
function xmlRequestCallback (resp,response,beforeResp) {
  console.log('statusCode:', resp.statusCode);
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    parser.parseString(data, function (err, result) {
      if (err) {
        console.log("Error: " + err.message);
      } else {
        if(beforeResp){
          beforeResp(result);
        }
        response.status(200).send(result);
      }
    });
  });
}
app.get('/latestSearches',(request,response) => {
  if (response){
    response.status(200).send({
      searches:latestSearches
    });
  }
});

app.get('/book/isbn/:isbn', function (request, response) {
  const isbn = request.params.isbn;
  console.log(isbn);
  https.get('https://www.goodreads.com/book/isbn_to_id/' + isbn + '?key='+config.apikey,
    (resp) => {
      if (resp.statusCode !== 200){
        response.status(resp.statusCode).send(resp.statusMessage)
      }
      resp.on('data', (data) => {
        if (response){
          response.status(200).send(data);
        }
      });
      resp.on('error', (err) => {
        if (response){
        response.status(404).send(err);
        }
      })
    }).on("error", (err) => {
    if (response){
      response.status(500).send(err);
    }
  });
});

app.get('/book/search/:q', (request,response) => {
  const q = request.params.q;
  https.get('https://www.goodreads.com/search/index.xml?key='+config.apikey+'&q='+q,
    (resp) => {
      xmlRequestCallback(resp,response);
    }).on("error", (err) => {
    if (response){
      response.status(500).send(err);
    }
  })
});
function addToLastSearch (result){
    let book = result && result.GoodreadsResponse && result.GoodreadsResponse.book ? result.GoodreadsResponse.book : {};
    if (!latestSearches.find(b => b.id === book.id))
      latestSearches.push(book);

}
app.get('/book/:id', function (request, response) {
  const id = request.params.id;
  https.get('https://www.goodreads.com/book/show/'+id+'.xml?key='+config.apikey,
    (resp) => {
      xmlRequestCallback(resp,response,addToLastSearch);
    }).on("error", (err) => {
    if (response){
      response.status(500).send(err);
    }
  })
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/goodreadsFindUrl/index.html'));
});

