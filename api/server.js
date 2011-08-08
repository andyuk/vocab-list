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



var bulkDocsRequest = function(keys, callback) {

	var options = {
								port: db_port,
								host: db_host,
								method: 'POST',
								path: '/' + db_name + '/_all_docs?include_docs=true',
								headers: {
										'Content-Type': 'application/json'	
									}
								};

	var data = '{"keys":' + JSON.stringify(keys) + '}';
	//console.log('Requesting new versions...');
	//console.log(data);

	var couch_request = http.request(options, function(response) {
		
		response.setEncoding('utf8');
		
		var buffer = '';
		
	  response.on('data', function (chunk) {
			buffer += (chunk || '');
	  });

		var onEnd = function() {
			
			var json = JSON.parse(buffer);
			
			callback(json.rows);
		};
		
	  response.on('close', onEnd);
		response.on('end', onEnd);
	});
	couch_request.write(data);
	couch_request.end();
	
};


app.post(api_url + 'sync', function(req, res, next){
	
	var data = req.body.data;
	//console.log(req.body.data);
	
	if (data === undefined) {
		
		res.send({ error: "Invalid request. No data supplied. Sorry!" }, 500);
		next();
		return;
	}
	
	var options = {
								port: db_port,
								host: db_host,
								method: 'POST',
								path: '/' + db_name + '/_bulk_docs',
								headers: {
										'Content-Type': 'application/json'	
									}
								};

	var couch_request = http.request(options, function(response) {
		
	  response.setEncoding('utf8');
		var buffer = '';
	
	  response.on('data', function (chunk) {
			buffer += (chunk || '');
	  });
	
		var onEnd = function() {
			
			// TODO: check if there are any conflicts, if so get the latest version
			
			var updates = JSON.parse(buffer);
			
			if (updates != null && updates.length > 0) {
			
				var updated_docs = [];

				for (var key in updates) {
					
					//console.log(updates[key]);
					//console.log(updates[key].id);
					updated_docs.push(updates[key].id);
				}
				
				bulkDocsRequest(updated_docs, function(latest_docs) {
					
					//console.log('got latest:');
					//console.log(latest_docs);
					for (var key in latest_docs) {
						
						for (var i in updates) {
							
							if (latest_docs[key].id === updates[i].id) {
								updates[i] = latest_docs[key].doc;
							}
						}
					}
					//console.log('now updated:');
					//console.log(updates);
					
					res.send(updates);
					
				});
			} else {
				
				res.send(updates);
			}
		}
	  response.on('close', onEnd);
		response.on('end', onEnd);

	});
	couch_request.write(data);
	couch_request.end();

});

app.listen(3000);