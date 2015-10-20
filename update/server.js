var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var kittySchema = require('./models/kitty');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	var Kitten = mongoose.model('Kitten', kittySchema);

	Kitten.findOne({name: "fluffy"}, function(err,result) {
		if (err) return console.error(err);
		console.log(result);	
		result.name = "lion";
		result.save(function(err) {
			if (err) throw err
			console.log("Name changed");
			db.close();
		});
	});
});
