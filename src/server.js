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
    '/prosumerSignUp': (service,request) => {
        /** Récupération des paramètres **/
        service.insertProsumer(/*..*/);
    },
};

const server = http.createServer(function (req, res) {
    const reqUrl = url.parse(req.url);
    const service = require('./services.js');

    // GET Endpoint
    if (req.method === 'GET' || req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
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