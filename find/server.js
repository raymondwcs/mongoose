var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var kittySchema = require('./models/kitty.js');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	var Kitten = mongoose.model('Kitten', kittySchema);

	Kitten.find({name: /^flu/}, function(err,results) {
		if (err) return console.error(err);
		console.log(results);
		db.close();
	});
});
