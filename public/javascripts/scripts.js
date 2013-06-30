$(function(){
	var $memeTemplates	= $('.memeTemplates')

		, $wtf						= $('.wtf')
		
		, $memeDisplay		= $('.memeDisplay')
		, $memeImage			= $memeDisplay.find('.memeImage')

		, $memeBuilder		= $('.memeBuilder')
		, $memeCanvas			= $memeBuilder.find('.memeCanvas')
		, $memeTools			= $memeBuilder.find('.memeTools')
		, $memeTop				= $memeTools.find('.memeTop')
		, $memeBottom			= $memeTools.find('.memeBottom')
		, $memeSave				= $memeTools.find('.memeSave')
		, $memeCancel			= $memeTools.find('.memeCancel')

		, $memeNavigate		= $('.memeNavigate')
		, $memeName				= $memeNavigate.find('.memeName')
		, $memeContent		= $memeNavigate.find('.memeContent')
		
		, content					= [$memeTemplates, $wtf, $memeDisplay, $memeBuilder]

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
					if (parts[0] == 'wtf') return showWTF();
					return showTemplate(parts[0]);
					break;
					
				case 2:
				case 3:
				case 4:
					return showMeme(parts[0], parts[1].replace('meme-',''));
					break;
			}
		}
		
		, parseUrl = function(url){
			var a = document.createElement('a');
			a.href = url;
			return a;
		}
		
		, selectInputContents = function(e){
			e.preventDefault();
			var $target = $(e.target);
			window.setTimeout(function(){ $target.select(); }, 5);
		}
		
		, showContent = function($show){
			for (var i in content) {
				if (content[i] == $show) {
					console.log('yes');
					$show.show(0);
				} else {
					console.log('no', content[i], $show);
					content[i].hide(0);
				}
			}
		}
		
		, showWTF = function(){
			showContent($wtf);
		}
		
		, showTemplates = function(){
			showContent($memeTemplates);
		}
		
		, showTemplate = function(memeTemplate){
			showContent($memeBuilder);

			memeURL = '/images/templates/' + memeTemplate + '.jpg';
			memejs = new Meme(memeURL, $memeCanvas, $memeTop.val().toUpperCase(), $memeBottom.val().toUpperCase());
			$memeTop.select();
		}
		
		, showMeme = function(memeTemplate, memeImage){
			showContent($memeDisplay);
			
			var memeName = memeTemplate.replace(/\-/g,' ').toLowerCase().replace(/(?:(^.{1})|\ [a-z]{1})/g, function(a){return a.toUpperCase();});
			
			$memeName.html(
				memeName + 
				' <a href="/about/' + memeTemplate + '"><i class="icon icon-question-sign"></i></a>'
			);
			$memeImage.html('<img src="//img1.memes.io/memes/' + memeTemplate + '/' + memeImage + '.jpg">');
			$memeContent.html(
				'<a href="/' + memeTemplate + '" class="makeYourOwn pure-button pure-button-primary">Make your own ' + memeName + ' meme</a><br><br>' +
				'<a href="/" class="makeYourOwn pure-button">Make another meme</a> '
			);
			
			$.getJSON(window.location.pathname + '.json', function(meme, status){
				if (status == 'success') {
					$memeContent.html(
						meme.top + '<br>' +
						meme.bottom + '<br><br>' +
						
						'Share: <input class="memeShareURL" type="text" value="' + meme.url + '" readonly="readonly"><br><br>' +
						$memeContent.html()
					);
				}
			});
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
					var meme = xhr.responseJSON
						, url = parseUrl(meme.url).pathname;
					
					History.pushState({}, 'memes.io', url);
				}
			});
		};
	
	
	History.Adapter.bind(window,'statechange',function(){
		init();
	});
		
	$memeTop			.on('keyup keydown', updateMeme);
	$memeBottom		.on('keyup keydown', updateMeme);
	
	$('header')		.on('click', 'a', clickHandler);
	$memeTemplates.on('click', 'a.memeTemplate', clickHandler);
	$memeContent	.on('click', 'a.makeYourOwn', clickHandler);
	
	$memeSave			.on('click', saveMeme);
	$memeCancel		.on('click', cancelMeme);
	
	$memeNavigate	.on('click focus', '.memeShareURL', selectInputContents);
	
	init();
});