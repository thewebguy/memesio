var fs				= require('fs')
	, path			= require('path')
	, models		= require('../config/models')
	, data			= require('../config/data');



exports.displayMemeTemplatesJSON = function(req, res){
	return res.send(data.memeTemplates);
};

exports.displayMemeJSON = function(req, res){
	models.Meme.findById(req.params.memeId, function(err, meme){
		if (err) return res.send(err);
		return res.send(meme);
	});
};

exports.displayMemeImage = function(req, res){
	models.Meme.findById(req.params.memeId, function(err, meme){
		if (err) return res.send(err);
		return res.redirect('/' + path.join('images', 'memes', meme.memeTemplate, meme._id + '.png'));
	});
};

exports.submitMeme = function(req, res){
	var memeTemplate = req.params.memeTemplate;
	
	var meme = new models.Meme({
		memeTemplate: memeTemplate,
		top: req.body.top,
		bottom: req.body.bottom
	});
	
	meme.save(function(err, meme){
		if (err) return res.send(err);
		
		var memePath = path.join(__dirname, '..', 'public', 'images', 'memes', memeTemplate);
		var base64Data = req.body.imgdata.replace(/^data:image\/png;base64,/,"");
		
		
		if (!fs.existsSync(memePath)) fs.mkdirSync(memePath);
		fs.writeFile(path.join(memePath, meme._id + '.png'), base64Data, "base64", function(err){
			if (err) return res.send(err);
			
			meme.imageURL = 'http://' + req.headers.host + '/' + path.join('images', 'memes', memeTemplate, meme._id + '.png');
			meme.save(function(err, meme){
				return res.send(meme);
			});
		});
	});
};