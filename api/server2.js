var http = require('http');
var net = require('net');

var version = "0.1.1";
var host = "127.0.0.1";
var port = 1337;

http.createServer(function (req, res) {

	switch(req.url) {
		case "/":
			res.writeHead(200, {'Content-Type': 'application/json'});
	  	res.end('{"version": "' + version + '"}');		
			break;
		case "/sync":
				res.writeHead(200, {'Content-Type': 'application/json'});
				
				var options = {
											port: 5984,
											host: '127.0.0.1',
											method: 'GET',
											path: '/'
											};

				var api_response = "";

				var couch_request = http.request(options, function(response) {
					
				  console.log('STATUS: ' + response.statusCode);
				  console.log('HEADERS: ' + JSON.stringify(response.headers));
				  response.setEncoding('utf8');
				  response.on('data', function (chunk) {
					
						api_response = api_response + chunk;
				    console.log('BODY: ' + chunk);
				  });
				
					var onEnd = function() {
						res.end(api_response);
					}
				  response.on('close', onEnd);
					response.on('end', onEnd);

				});
				couch_request.end();
				
				//res.end('{"still processing": true}');
				
				break;
		default:
			res.writeHead(400, {'Content-Type': 'application/json'});
			res.end('{"error": "Invalid request"}');		
			break;
	}

}).listen(port, host);

console.log('Server running at http://' + host + ':' + port + '/');

// GET /
// return {"api": "0.1.1"}

// POST /sync



