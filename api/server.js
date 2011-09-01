var express = require('./node_modules/express');
var http = require('http');
var sys = require('sys');
var $_ = require('./node_modules/underscore-min');

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

app.get(api_url + '_changes', function(req, res, next){

	var since = req.query.since || '';

	var options = {
								method: 'GET',
								path: '/' + db_name + '/_changes?include_docs=true'
								};

	if (since.length > 0) {
		options.path += '&since=' + since;
	}
	
	couchRequest(options, null, function(json) {
		
		res.send(json);
	});
});

app.post(api_url + '_bulk_docs', function(req, res, next){
	
	console.log('_bulk_docs request');
	
	var data = req.body.data;
	
	if (data === undefined) {
		
		res.send({ error: "Invalid request. No data supplied. Sorry!" }, 500);
		next();
		return;
	}
	
	var options = {
								method: 'POST',
								path: '/' + db_name + '/_bulk_docs'
								};

	console.log(data);

	couchRequest(options, data, function(json) {
		res.send(json);
	});				
});


var couchRequest = function(options, data, callback) {

	var request_options = {
								method: 'POST',
								path: '???',
								port: db_port,
								host: db_host,
								headers: {
										'Content-Type': 'application/json'	
									}
								};

	request_options = $_.extend(request_options, options);
	
	console.log('path: ' + request_options.path);
	
	var couch_request = http.request(request_options, function(response) {
		
		response.setEncoding('utf8');
		
		var buffer = '';
	  response.on('data', function (chunk) {
			buffer += (chunk || '');
	  });

		var onEnd = function() {
			
			var json = JSON.parse(buffer);
			
			callback(json);
		};
		
	  response.on('close', onEnd);
		response.on('end', onEnd);
	});
	
	if (data != undefined) {
		couch_request.write(data);
	}
	couch_request.end();
}

/*
var bulkDocsRequest = function(keys, callback) {

	var options = {
								path: '/' + db_name + '/_all_docs?include_docs=true'
								};

	var data = '{"keys":' + JSON.stringify(keys) + '}';
	
	//console.log('Requesting new versions...');
	//console.log(data);
	
	couchRequest(options, null, function(json) {

		callback(json);
	});	
};*/

app.listen(3000);