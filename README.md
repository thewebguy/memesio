# memes.io
## the simplest ass meme generator there is
This is a super simple way to launch a memes website. Overview of resourced used at http://memes.io/wtf

# Features
* Simple meme generation
* Client side image creation
* Free `.jpg` redirection to CDN image
* Free `.json` API for reading meme text (helpful for reddit bots)
* Mostly single page app

# You will need
1. nodejs
2. npm
3. mongodb

# Using this thing
1. `git clone https://github.com/thewebguy/memesio.git`
2. `cd memesio`
3. `npm install`
4. a) Add [AWS](http://www.amazonaws.com) keys to your `process.env` vars as `S3_KEY` & `S3_SECRET`
4. b) Or save a file to `./config/aws-secret.js` with the keys as exports:
		exports.S3_KEY		= '';
		exports.S3_SECRET	= '';
5. Change the CDN URL that I'm using, currently `img1.memes.io` in `./controllers/memes.js` & `./public/javascripts/scripts.js`
6. `node app`
7. Make it better and send a pull request

# License
MIT: http://thewebguy.mit-license.org