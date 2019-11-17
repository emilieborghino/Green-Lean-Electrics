const http = require('http');
const url = require('url');

const port = 8080;

const routes = {
    '/getWindSpeed': (service, request) => service.getWindSpeed(new Date()),
    '/getElectricityConsumption': (service, request) => service.getElectricityConsumption(new Date()),
    '/getCurrentElectricityPrice': (service, request) => service.getCurrentElectricityPrice(
        service.getWindSpeed(new Date()).windSpeed,
        service.getElectricityConsumption(new Date()).electricityConsumption
    ),
    '/prosumerSignUp': (service) => service.insertProsumer(/*..*/),
};

const server = http.createServer(function (req, res) {
    const reqUrl = url.parse(req.url);
    const service = require('./services.js');

    // GET Endpoint
    if (req.method === 'GET') {
        console.log('Request Type:' + req.method + ' Endpoint: ' + reqUrl.pathname);

        const route = routes[reqUrl.pathname];
        const reply = route(service, req);
        if (route) {
            writeReply(reply, res);
        } else {
            // TODO: add an error message
        }
    }
});

function writeReply(response, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
}

server.listen(port);

// Data Base

const mongo = require('mongodb');
const mongourl = "mongodb://localhost:27017";

mongo.connect(mongourl, {useNewUrlParser: true}, (err, db) => {
    if(err) {
       console.log(err);
       process.exit(0);
    }
    console.log('database connected!');
    var dbo = db.db('greenleanelectrics');
    dbo.createCollection('prosumers', (err, result) => {
        if(err) {
           console.log(err);
           process.exit(0);
        }
        console.log('collection created!');
        db.close();
    });
});