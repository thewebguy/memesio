
/**
 * Module dependencies.
 */

var express		= require('express')
  , http			= require('http')
	, fs				= require('fs')
  , path			= require('path')
  , routes		= require('./config/routes.js')
	, data			= require('./config/data.js')
	, models		= require('./config/models');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
	app.locals(data);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/index.json', function(req, res){
	returnres.send(data.memeTemplates);
});
app.get('/:memeTemplate/meme-:memeId.json', function(req, res){
	models.Meme.findById(req.params.memeId, function(err, meme){
		if (err) return res.send(err);
		return res.send(meme);
	});
});
app.get('/:memeTemplate/meme-:memeId.png', function(req, res){
	models.Meme.findById(req.params.memeId, function(err, meme){
		if (err) return res.send(err);
		return res.redirect('/' + path.join('images', 'memes', meme.memeTemplate, meme._id + '.png'));
	});
});

app.get('/', routes.index);
app.get('/index', routes.index);
app.get('/:memeTemplate', routes.index);
app.get('/:memeTemplate/meme-:memeId', routes.index);

app.post('/:memeTemplate', function(req, res){
	var memeTemplate = req.params.memeTemplate;
	
	var meme = new models.Meme({
		memeTemplate: memeTemplate,
		top: req.body.top,
		bottom: req.body.bottom
	});
	
	meme.save(function(err, meme){
		if (err) return res.send(err);
		
		var memePath = path.join(__dirname, 'public', 'images', 'memes', memeTemplate);
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
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
