var mongoose = require('mongoose')
	, ShortId = require('shortid')
	, db;

mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/memesio');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	var memeSchema = mongoose.Schema({
		_id: { type: String, default: ShortId.generate },
		top: String,
		bottom: String,
		memeTemplate: String,
		imageURL: String,
		url: String
	});
	
	exports.Meme = mongoose.model('Meme', memeSchema);
});

