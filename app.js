
/**
 * Module dependencies.
 */

var express		= require('express')
  , http			= require('http')
  , path			= require('path')
  , static		= require('./controllers/static')
  , memes			= require('./controllers/memes');

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
	app.locals(require('./config/data'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/index.json', memes.displayMemeTemplatesJSON);
app.get('/:memeTemplate/meme-:memeId.json', memes.redirectMemeJSON);
app.get('/:memeTemplate/meme-:memeId/:top.json', memes.redirectMemeJSON);
app.get('/:memeTemplate/meme-:memeId/:top/:bottom.json', memes.displayMemeJSON);

app.get('/:memeTemplate/meme-:memeId.png', memes.redirectMemeImage);
app.get('/:memeTemplate/meme-:memeId/:top.png', memes.redirectMemeImage);
app.get('/:memeTemplate/meme-:memeId/:top/:bottom.png', memes.redirectMemeImage);

app.get('/', static.index);
app.get('/index', static.index);
app.get('/about/:memeTemplate', memes.redirectMemeTemplateAbout);
app.get('/:memeTemplate', static.index);

app.get('/go/:memeId', memes.redirectMeme);
app.get('/:memeTemplate/meme-:memeId', memes.redirectMeme);
app.get('/:memeTemplate/meme-:memeId/:top', memes.redirectMeme);
app.get('/:memeTemplate/meme-:memeId/:top/:bottom', static.index);

app.post('/:memeTemplate', memes.submitMeme);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
