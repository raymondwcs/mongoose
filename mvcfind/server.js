var http = require('http');
var url = require('url');
var mongoose = require('mongoose');
var assert = require('assert');
var MONGODBURL = 'mongodb://localhost/test';

var kittySchema = require('./models/kitty');
var db = mongoose.connection;

// View
function renderResult(res,kitties) {
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write('<body>');
	res.write('<H2>Details of all Kitties:</H2>');
	res.write('<ol>');
	for (var i = 0; i < kitties.length; i++) {
		res.write('<li>' + JSON.stringify(kitties[i]) + '</li>')
	}
	res.write('</ol>');
	res.write('</H2>');
	res.write('</body></html>');
}

// Controller
function filterResult(id) {
	fields = (id == "admin") ? "name age -_id" : "name -_id";
	return(fields);
}

var server = http.createServer(function (req,res) {
	response = res;
	var today = new Date();

	console.log(today.toTimeString() + " " +
	            "INCOMING REQUEST: " + req.connection.remoteAddress + " " +
	            req.method + " " + req.url);

	var parsedURL = url.parse(req.url,true);  //true to get query as object
	var queryAsObject = parsedURL.query;

	if (parsedURL.pathname == '/show') {
		var fields = filterResult(queryAsObject.id);
		mongoose.connect(MONGODBURL, function(err) {
			assert.equal(err,null);
			var Kitten = mongoose.model('Kitten', kittySchema);
			Kitten.find({},fields,function(err,results) {
				assert.equal(err,null);
				var kitties = [];
				for(var i = 0; i < results.length; i++) {
						kitties.push(results[i]);
				}
				db.close();
				renderResult(res,kitties);
				res.end();
			})
		});
	}
	else {
		res.writeHead(404, {"Content-Type": "text/plain"});
		res.write("404 Not Found\n");
		res.end();
	}
});

server.listen(process.env.PORT || 8099);
