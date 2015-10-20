var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var publisherSchema = require('./models/publisher');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	var Publisher = mongoose.model('Publisher', publisherSchema);

	var p = new Publisher({name: 'ABC', address: '30 Good Shepherd Street'});
	p.books.push({isbn: '01234567890ABC',
	              title: 'Introduction to Node.JS',
	              author: 'John Smith',
	              price: 70.00,
	              stock: 0,
	              available: false});

	p.save(function(err) {
		if (err) throw err
		console.log('Publisher created!')
		db.close();
	});
});
