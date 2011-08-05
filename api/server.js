var express = require('./node_modules/express');
var http = require('http');
var sys = require('sys');

var api_version = '0.1';
var api_url = '/api/' + api_version + '/';

var db_host = '127.0.0.1',
		db_port = 5984,
		db_name = 'vocab-list';

var app = express.createServer(
    express.favicon()
  , express.logger()
  , express.static(__dirname + './../webroot/')
	, express.bodyParser()
);

// position our routes above the error handling middleware,
// and below our API middleware, since we want the API validation
// to take place BEFORE our routes
app.use(app.router);

// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use(function(err, req, res, next){
  // whatever you want here, feel free to populate
  // properties on `err` to treat it differently in here,
  // or when you next(err) set res.statusCode= etc.
  res.send({ error: err.message }, 500);
});

// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use(function(req, res){
  res.send({ error: "Invalid request. Sorry!" }, 404);
});

app.get(api_url, function(req, res, next){

	res.send({"version": api_version});
});

app.post(api_url + 'sync', function(req, res, next){
	
	var data = req.body.data;
	console.log(req.body.data);
	
	if (data === undefined) {
		
		res.send({ error: "Invalid request. No data supplied. Sorry!" }, 500);
		next();
		return;
	}
	
	//data = JSON.parse(data);
	
	var options = {
								port: db_port,
								host: db_host,
								method: 'POST',
								path: '/' + db_name + '/_bulk_docs',
								headers: {
										'Content-Type': 'application/json'	
									}
								};

	var api_response = "";

	var couch_request = http.request(options, function(response) {
		
	  //console.log('STATUS: ' + response.statusCode);
	  //console.log('HEADERS: ' + JSON.stringify(response.headers));
	  response.setEncoding('utf8');
	
	  response.on('data', function (chunk) {
		
			api_response = api_response + chunk;
	    //console.log('BODY: ' + chunk);
	  });
	
		var onEnd = function() {
			res.send(api_response);
		}
	  response.on('close', onEnd);
		response.on('end', onEnd);

	});
	couch_request.write(data);
	couch_request.end();

});

app.listen(3000);