var fs						= require('fs')
	, path					= require('path')
	, models				= require('../config/models')
	, data					= require('../config/data')
	, knox					= require('knox')
	, aws						= require('../config/aws.js')
	, s3						= knox.createClient(aws)
	, imagemagick		= require('imagemagick');

exports.displayMemeTemplatesJSON = function(req, res){
	return res.send(data.memeTemplates);
};

exports.redirectMeme = function(req, res){
	models.Meme.findById(req.params.memeId, function(err, meme){
		if (err) return res.send(err);
		return res.redirect(meme.url);
	});
}

exports.redirectMemeJSON = function(req, res){
	models.Meme.findById(req.params.memeId, function(err, meme){
		if (err) return res.send(err);
		return res.redirect(meme.url + '.json');
	});
}

exports.redirectMemeImage = function(req, res){
	models.Meme.findById(req.params.memeId, function(err, meme){
		if (err) return res.send(err);
		return res.redirect(meme.imageURL);
	});
};

exports.redirectMemeTemplateAbout = function(req, res){
	var memeTemplate = req.params.memeTemplate;
	
	for (var i in data.memeTemplates) {
		if (data.memeTemplates[i].template == memeTemplate) {
			return res.redirect(data.memeTemplates[i].desc);
		}
	}
	
	return res.redirect('/' + memeTemplate);
}

exports.displayMemeJSON = function(req, res){
	models.Meme.findById(req.params.memeId, function(err, meme){
		if (err) return res.send(err);
		return res.send(meme);
	});
};

exports.submitMeme = function(req, res){
	var memeTemplate = req.params.memeTemplate;
	
	var meme = new models.Meme({
		memeTemplate: memeTemplate,
		top: req.body.top.toUpperCase(),
		bottom: req.body.bottom.toUpperCase()
	});
	
	meme.save(function(err, meme){
		if (err) return res.send(err);
		
		var memeBasePath			= path.join('memes', memeTemplate)
			, memeFolderPath		= path.join(__dirname, '..', 'public', 'images', memeBasePath)
			, base64Data				= req.body.imgdata.replace(/^data:image\/png;base64,/,"")
			, memeFileName			= meme._id + '.png'
			, memeFileNameJPG		= meme._id + '.jpg'
			, memeLocalPath			= path.join(memeFolderPath, memeFileName)
			, memeLocalPathJPG	= path.join(memeFolderPath, memeFileNameJPG);
		
		
		if (!fs.existsSync(memeFolderPath)) fs.mkdirSync(memeFolderPath);
		fs.writeFile(memeLocalPath, base64Data, "base64", function(err){
			if (err) return res.send(err);
			
			imagemagick.convert(['-strip', '-interlace', 'Plane', '-quality', '85%', memeLocalPath, memeLocalPathJPG], function(err, result){
				function cleanUpText(str) {
					return str.toLowerCase().replace(/\s+/gi, '-').replace(/[^\w\d\-]/gi,'').replace(/(?:(?:^|\-)\-+|\-+(?:$|\-))/g,'');
				}

				meme.imageURL	= 'http://' + req.headers.host + '/' + path.join('images', 'memes', memeTemplate, memeFileNameJPG);
				meme.url			= 'http://' + req.headers.host + '/' + path.join(meme.memeTemplate, 'meme-' + meme._id, cleanUpText(req.body.top), cleanUpText(req.body.bottom));
				
				meme.save(function(err, meme){
				  var knoxUpload = s3.putFile(memeLocalPathJPG, path.join(memeBasePath, memeFileNameJPG), { 'x-amz-acl': 'public-read' }, function (err, resp) {
						if (err) return send("400");
						
				    if (resp.statusCode === 200) {
							meme.imageURL = 'http://img1.memes.io/' + path.join(memeBasePath, memeFileNameJPG);
						
							meme.save(function(err, meme){
								fs.unlink(memeLocalPath, function(err){
									if (err) console.log('unlink memeLocalPath', err);
									
									fs.unlink(memeLocalPathJPG, function(err){
										if (err) console.log('unlink memeLocalPathJPG', err);
								
										return res.send(meme);
									});
								});
							});
				    }
				  });
				});
			});
		});
	});
};