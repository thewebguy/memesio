# memes.io
## the simplest ass meme generator there is
This is a super simple way to launch a memes website. Overview of resourced used at http://memes.io/wtf

# Features
* Simple meme generation
* Client side image creation
* Free `.jpg` redirection to CDN image
* Free `.json` API for reading meme text (helpful for reddit bots)
* Mostly single page app

# Using this thing
Grab the repo, cd into it and install the node_modules you'll need:
```    
git clone https://github.com/thewebguy/memesio.git
cd memesio
npm install
```
Add [AWS](http://www.amazonaws.com) keys to your `process.env` vars as `S3_KEY` & `S3_SECRET` **OR** save a file to `./config/aws-secret.js` with the keys as exports:
```
exports.S3_KEY		= '';
exports.S3_SECRET	= '';
```    
Change the CDN URL that I'm using, currently `img1.memes.io` in `./controllers/memes.js` & `./public/javascripts/scripts.js`
```
node app
```
Then make it better and send me a pull request :)

# License
MIT: http://thewebguy.mit-license.org
