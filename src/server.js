const http = require('http');
const url = require('url');

const port = 8080;

const server = http.createServer(function(req, res) {
    const page = url.parse(req.url).path;
    res.writeHead(200);
    res.end(`You're now connected to '${page}'`);
});
server.listen(port);