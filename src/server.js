const http = require('http');
const url = require('url');

const port = 8080;

const server = http.createServer(function(req, res) {
    const reqUrl = url.parse(req.url);
    const service = require('./services.js');

	// GET Endpoint
    if (req.method === 'GET') {
        console.log('Request Type:' + req.method + ' Endpoint: ' + reqUrl.pathname);

        if(reqUrl.pathname == '/getWindSpeed'){
	        writeReply(service.getWindSpeed(new Date()), res);
	    }

        if(reqUrl.pathname == '/getElectricityConsumption'){
	        writeReply(service.getElectricityConsumption(new Date()), res);
	    }

        if(reqUrl.pathname == '/getCurrentElectricityPrice'){
	        writeReply(
	        	service.getCurrentElectricityPrice(
		        	service.getWindSpeed(new Date()),
		        	service.getElectricityConsumption(new Date())
	        	), res);
	    }
    } 
});
server.listen(port);

function writeReply(response, res){
	res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
}