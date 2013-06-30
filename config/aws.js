if (process.env.S3_KEY) {
	exports.key			= process.env.S3_KEY;
	exports.secret	= process.env.S3_SECRET;
} else {
	var secret = require('./aws-secret.js');
	exports.key			= secret.S3_KEY;
	exports.secret	= secret.S3_SECRET;
}

exports.bucket	= "img.memes.io";
exports.region	= "";
exports.secure	= false;