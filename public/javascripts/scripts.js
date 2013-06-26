$(function(){
	var $memeTemplates	= $('.memeTemplates')
		, $memeBuilder		= $('.memeBuilder')
		, $memeDisplay		= $('.memeDisplay')
		, $memeImage			= $memeBuilder.find('.memeImage')
		, $memeTools			= $memeBuilder.find('.memeTools')
		, $memeTop				= $memeTools.find('.memeTop')
		, $memeBottom			= $memeTools.find('.memeBottom')
		, $memeSave				= $memeTools.find('.memeSave')
		, $memeCancel			= $memeTools.find('.memeCancel')
		, memeURL					= ''
		, memejs
		, History = window.History
	
		, init = function(){
			var path = window.location.pathname
				, parts = []
				, memeTemplate;
				
			if (path) path = path.replace('/index','').replace('/','');
			if (path.length) parts = path.split('/');
			
			console.log(path, parts);
			
			switch (parts.length) {
				case 0:
					return showTemplates();
					break;
					
				case 1:
					return showTemplate(parts[0]);
					break;
					
				case 2:
					return showMeme(parts[0], parts[1].replace('meme-',''));
					break;
			}
		}
		
		, showTemplates = function(){
			$memeBuilder.hide(0);
			$memeDisplay.hide(0);
			$memeTemplates.show(0);
		}
		
		, showTemplate = function(memeTemplate){
			$memeDisplay.hide(0);
			$memeTemplates.hide(0);
			$memeBuilder.show(0);

			memeURL = '/images/templates/' + memeTemplate + '.jpg';
			memejs = new Meme(memeURL, $memeImage, $memeTop.val().toUpperCase(), $memeBottom.val().toUpperCase());
			$memeTop.select();
		}
		
		, showMeme = function(memeTemplate, memeImage){
			$memeTemplates.hide(0);
			$memeBuilder.hide(0);
			$memeDisplay.show(0);
			
			$memeDisplay.html('<img src="/images/memes/' + memeTemplate + '/' + memeImage + '.png">');
		}
		
		, updateMeme = function(){
			memejs.updateCanvas($memeTop.val().toUpperCase(), $memeBottom.val().toUpperCase());
		}
	
		, clickHandler = function(e){
			e.preventDefault();
			History.pushState({}, 'memes.io', e.currentTarget.href.replace('#/',''));
		}
		
		, cancelMeme = function(e){
			e.preventDefault();
			History.pushState({}, 'memes.io', '/');
		}
		
		, saveMeme = function(e){
			e.preventDefault();
		
			var data = {
				imgdata:	memejs.getPNG(),
				top:			$memeTop.val(),
				bottom:		$memeBottom.val()
			};
		
			$.ajax({
				url: window.location.pathname,
				type: 'POST',
				data: data,
				dataType: 'json',
				complete: function(xhr, status) {
					if (status != 'success') {
						console.log(xhr);
						return;
					}
					var meme = xhr.responseJSON;
					History.pushState({}, 'memes.io', meme.memeTemplate + '/meme-' + meme._id);
				}
			});
		};
	
	
	History.Adapter.bind(window,'statechange',function(){
		init();
	});
		
	$memeTop		.on('keyup keydown', updateMeme);
	$memeBottom	.on('keyup keydown', updateMeme);
	
	$('header')		.on('click', 'a', clickHandler);
	$memeTemplates.on('click', 'a.memeTemplate', clickHandler);
	
	$memeSave		.on('click', saveMeme);
	$memeCancel	.on('click', cancelMeme);
	
	init();
});