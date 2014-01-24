$(function(){
	//--------------------------------------------------
	//	どのぐらいスクロールしたかを描画
	//--------------------------------------------------
	var x = $(window).scrollLeft();
	$(window).scroll(function(){
		x= $(this).scrollLeft();
		$(".scrolled em").text(x);
	});
	
	//--------------------------------------------------
	//	星の配置と動き
	//--------------------------------------------------
	var starNum = 30;

	for(var i = 0;i < starNum; i++) {
		var img = ((i % 4 + 1) < 10) ? "0" + (i % 4 + 1): i % 4 + 1;
		var opacityNum = Math.random() * 1 + 0.3;
		var randomSpeed = Math.random() * 5;
		
		$('section#first').append('<p class="star' +(i+1) +'"><img src="images/star' + img +'.png" alt=""></p>');
		
		$('.star' + (i+1)).css({
			top : Math.floor( Math.random() * 300 ),
			left : Math.floor( Math.random() * 2000 ) + 200,
			opacity : opacityNum
		});
		
		//プラグインを使った動きの設定
		//leftの動き
		$(window).parallax({
			parallax : $('.star' + (i+1)),
			direction : 'x',
			type : 'type2',
			style : 'left',
			fixPosition : $('#first').offset().left,
			speed : -randomSpeed,
			adjustment : Number($('.star' + (i+1)).css('left').replace('px', '')),
			contentStartLinePercent: 20
		});
		
		//topの動き
		$(window).parallax({
			parallax : $('.star' + (i+1)),
			direction : 'x',
			type : 'type2',
			style : 'top',
			fixPosition : $('#first').offset().left,
			speed : randomSpeed,
			adjustment : Number($('.star' + (i+1)).css('top').replace('px', '')),
			contentStartLinePercent: 20
		});
		
		//星が徐々に消えていく処理
		var parallaxObj = {};
		parallaxObj['.star' + (i+1)] = {};
		parallaxObj['.star' + (i+1)].obj = $('.star' + (i+1));
		parallaxObj['.star' + (i+1)].tagMotions = {};
		
		parallaxObj['.star' + (i+1)].tagMotions.motion1 = [{
			start : $('#first').offset().left + Math.random() * 100,
			end : $('#first').offset().left + +Math.random() * 1000,
			fromStyle : {
				opacity : 1
			},
			toStyle : {
				opacity : 0
			},
			easing : 'liner'
		}];
		
		$(window).parallax({
			direction : 'x',
			parallax : parallaxObj
		});
	}


	//--------------------------------------------------
	//	ナビゲーションの位置
	//--------------------------------------------------
	var $navContent = $('header,#first,#second');
	for(var i = 0;i < $navContent.length;i++) {
		$(window).parallax({
			parallax : $navContent.eq(i),
			direction : 'x',
			type : 'type3',
			startAnimation: function(e){nav(e);},
			endAnimation: function(e){nav(e);},
			contentStartLinePercent: 50
		});
	};
	
	function nav(e) {
		var obj = e.target;
			flg = e.isLine;
		$('#nav li').removeClass('on');
		
		contentNum = flg ? $navContent.index(obj) : $navContent.index(obj) - 1;
		$('#nav li').eq(contentNum).addClass('on');
	};
});