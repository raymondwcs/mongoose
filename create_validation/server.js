var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var kittySchema = require('./models/kitty');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	var Kitten = mongoose.model('Kitten', kittySchema);
	var fluffy = new Kitten({name: 'fluffy', age: 90});

	fluffy.validate(function (err) {
   		console.log(err);
	});

	fluffy.save(function(err) {
		if (err) throw err
		console.log('Kitten created!')
		db.close();
	});
});
