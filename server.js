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

app.get('/book/isbn/:isbn', function (request, response) {
  const isbn = request.params.isbn;
  console.log(isbn);
  https.get('https://www.goodreads.com/book/isbn_to_id/' + isbn + '?key='+config.apikey,
    (resp) => {
      console.log('statusCode:', resp.statusCode);
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
app.get('/book/:id', function (request, response) {
  const id = request.params.id;
  https.get('https://www.goodreads.com/book/show/'+id+'.xml?key='+config.apikey,
    (resp) => {
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
          response.status(200).send(result)
        }
      });
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/goodreadsFindUrl/index.html'));
});

