/*
Meme.js
=======

Use one function to generate a meme.

You can call it all with strings:

     Meme('dog.jpg', 'canvasID', 'Buy pizza, 'Pay in snakes');

Or with a selected canvas element:

     var canvas = document.getElementById('canvasID');
     Meme('wolf.jpg', canvas, 'The time is now', 'to take what\'s yours');

Or with a jQuery/Zepto selection:

     Meme('spidey.jpg', $('#canvasID'), 'Did someone say', 'Spiderman JS?');

You can also pass in an image:

     var img = new Image();
     img.src = 'insanity.jpg';
     var can = document.getElementById('canvasID');
     Meme(img, can, 'you ignore my calls', 'I ignore your screams of mercy');

********************************************************************************

Copyright (c) 2012 BuddyMeme

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

// updated by kevin khandjian

window.Meme = function(image, canvas, top, bottom) {
	
	this.getPNG = function(){
		return this.canvas.toDataURL();
	}

	/*
	Do everything else after image loads
	*/

	this.updateCanvas = function(top, bottom) {
		// Set dimensions
		this.setCanvasDimensions(this.image.width, this.image.height);
		this.context.drawImage(this.image, 0, 0);
		
		if (!top.toUpperCase) return false;

		// Set up text variables
		this.context.fillStyle = 'white';
		this.context.strokeStyle = 'black';
		this.context.lineWidth = 2;
		var fontSize = (this.canvas.height / 8);
		this.context.font = fontSize + 'px Impact';
		this.context.textAlign = 'center';

		// Draw them!
		this.drawText(top, 'top');
		this.drawText(bottom, 'bottom');

	};

	this.setCanvasDimensions = function(w, h) {
		this.canvas.width = w;
		this.canvas.height = h;
	};
	
	

	this.init = function(image, canvas, top, bottom) {
		/*
		Default top and bottom
		*/

		this.top = top || '';
		this.bottom = bottom || '';

		/*
		Deal with the canvas
		*/

		// If it's nothing, set it to a dummy value to trigger error
		if (!canvas)
			this.canvas = 0;
		else
			this.canvas = canvas;

		// If it's a string, conver it
		if (this.canvas.toUpperCase)
			this.canvas = document.getElementById(this.canvas);

		// If it's jQuery or Zepto, convert it
		if (($) && (this.canvas instanceof $))
			this.canvas = this.canvas[0];

		// Throw error
		if (!(this.canvas instanceof HTMLCanvasElement))
			throw new Error('No canvas selected');

		// Get context
		this.context = this.canvas.getContext('2d');

		/*
		Deal with the image
		*/

		// If there's no image, set it to a dummy value to trigger an error
		// Convert it from a string
		if (image && image.toUpperCase) {
			var src = image;
			this.image = new Image();
			this.image.src = src;
		}

		this.image.onload = this.updateCanvas.bind(this, this.top, this.bottom);

		// Set the proper width and height of the canvas
		this.setCanvasDimensions(this.image.width, this.image.height);
	}


	/*
	Draw a centered meme string
	*/

	this.drawText = function(text, topOrBottom, y) {

		// Variable setup
		topOrBottom = topOrBottom || 'top';
		var fontSize = (this.canvas.height / 8);
		var x = this.canvas.width / 2;
		if (typeof y === 'undefined') {
			y = fontSize;
			if (topOrBottom === 'bottom')
				y = this.canvas.height - 10;
		}

		// Should we split it into multiple lines?
		if (this.context.measureText(text).width > (this.canvas.width * 1.1)) {

			// Split word by word
			var words = text.split(' ');
			var wordsLength = words.length;

			// Start with the entire string, removing one word at a time. If
			// that removal lets us make a line, place the line and recurse with
			// the rest. Removes words from the back if placing at the top;
			// removes words at the front if placing at the bottom.
			if (topOrBottom === 'top') {
				var i = wordsLength;
				while (i --) {
					var justThis = words.slice(0, i).join(' ');
					if (this.context.measureText(justThis).width < (this.canvas.width * 1.0)) {
						this.drawText(justThis, topOrBottom, y);
						this.drawText(words.slice(i, wordsLength).join(' '), topOrBottom, y + fontSize);
						return;
					}
				}
			}
			else if (topOrBottom === 'bottom') {
				for (var i = 0; i < wordsLength; i ++) {
					var justThis = words.slice(i, wordsLength).join(' ');
					if (this.context.measureText(justThis).width < (this.canvas.width * 1.0)) {
						this.drawText(justThis, topOrBottom, y);
						this.drawText(words.slice(0, i).join(' '), topOrBottom, y - fontSize);
						return;
					}
				}
			}

		}

		// Draw!
		this.context.fillText(text, x, y, this.canvas.width * .9);
		this.context.strokeText(text, x, y, this.canvas.width * .9);

	};
	
		
	this.init(image, canvas, top, bottom);
};
