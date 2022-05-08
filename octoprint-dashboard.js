const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http')
const fs = require('fs')

const app = express();

/************************************************************************************ 
/      Setup these items
/************************************************************************************/
const port = 3000;      //Webserver Port

let getheaders = {
    'X-Api-Key' : 'AA42780D5D1849D69371B0157E33CA86'    //API key, needs to be generated in OctoPrint
};

let optionsGet = {
    host : '192.168.0.106', //Octopi server IP -- Server hostname was soemtimes causing issues, IP always seemed to work.
    port : 80,              //Octopi server default is part 80
    path : '/api/server',   //default server api
    method : 'GET',         //we only make GET calls
    headers : getheaders
};

/************************************************************************************/

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Files
app.get('/', (req, res) => {    //main html page
    res.writeHead(200, { 'content-type': 'text/html' });
    fs.createReadStream('dashboard.html').pipe(res);
});

app.get('/dashboard.js', (req, res) => {    //javascript for calling API's and manipulating display
    res.writeHead(200, { 'content-type': 'text/html' });
    fs.createReadStream('dashboard.js').pipe(res);
});

app.get('/dashboard.css', (req, res) => {   //CSS for styling dashboard
    res.writeHead(200, { 'content-type': 'text/css' });
    fs.createReadStream('dashboard.css').pipe(res);
});

app.get('/webcam', (req, res) => {   //have to call webcam in iframe because of CORS
    res.send('<iframe id="webcam" style="width:640; height:480" src="http://'+optionsGet.host+'/webcam/?action=stream"></iframe>');
});

app.get('/webcamafter', (req, res) => {   //Can only use this fomr the computer that is hosting node because of CORS
    res.send('<img id="webcam" style="width:640; height:480" src="http://'+optionsGet.host+'/webcam/?action=stream" />');
});

//API pass through to prevent CORS rejection in browser
app.get('/version', (req, res) => {

    optionsGet.path = '/api/version';

    http.request(optionsGet, function(res1) {
        res1.setEncoding('utf8');
        res1.on('data', function (chunk) {
          res.send(chunk);
        });
    }).end();

});

app.get('/server', (req, res) => {

    optionsGet.path = '/api/server';

    http.request(optionsGet, function(res1) {
        res1.setEncoding('utf8');
        res1.on('data', function (chunk) {
          res.send(chunk);
        });
    }).end();

});

app.get('/printer', (req, res) => {

    optionsGet.path = '/api/printer';

    http.request(optionsGet, function(res1) {
        res1.setEncoding('utf8');
        res1.on('data', function (chunk) {
          res.send(chunk);
        });
    }).end();

});

app.get('/job', (req, res) => {

    optionsGet.path = '/api/job';

    http.request(optionsGet, function(res1) {
        res1.setEncoding('utf8');
        res1.on('data', function (chunk) {
          res.send(chunk);
        });
    }).end();

});


app.listen(port, () => console.log(`Octoprint Dashboard listening on port ${port}!`));
