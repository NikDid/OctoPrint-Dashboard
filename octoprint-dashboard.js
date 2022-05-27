const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const fs = require('fs');

const app = express();

/************************************************************************************ 
/      Setup these items
/************************************************************************************/
const port = 3000;      //Webserver Port

let getheaders = {
    'X-Api-Key' : ''    //API key, needs to be generated in OctoPrint
};

let optionsGet = {
    host : '', //Octopi server IP -- Server hostname was soemtimes causing issues, IP always seemed to work.
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
    const ts = Date.now();
    res.send('<img id="webcam" src="/view?'+ts+'" />'); //style="width:640; height:480" 
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

app.get('/view', (req, res) => {
    //req.pipe(req.get('http://'+optionsGet.host+'/webcam/?action=snapshot')).pipe(res);
    const file = fs.createWriteStream('octopi.jpeg');
    const request = http.get('http://'+optionsGet.host+'/webcam/?action=snapshot', function(response) {
        response.pipe(file);

        // after download completed close filestream
        file.on("finish", () => {
            file.close();
            res.writeHead(200, { 'content-type': 'image/jpeg' });
            fs.createReadStream('octopi.jpeg').pipe(res);

        });
    });
});

app.listen(port, () => console.log(`Octoprint Dashboard listening on port ${port}!`));
