$(function(){
	//--------------------------------------------------
	//	どのぐらいスクロールしたかを描画
	//--------------------------------------------------
	var y = $(window).scrollTop();
	$(window).scroll(function(){
		y = $(this).scrollTop();
		$(".scrolled em").text(y);
	});

	//--------------------------------------------------
	//	ナビゲーションの位置
	//--------------------------------------------------
	var $navContent = $('header,#first,#second');
	for(var i = 0;i < $navContent.length;i++) {
		$(window).parallax({
			parallax : $navContent.eq(i),
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
	}

	//--------------------------------------------------
	//	1つ目のコンテンツの動きの指定
	//--------------------------------------------------
	$('[class*=maru]').each(function(i){
		//スピードをランダムで指定
		//-2から2までの範囲のスピードを取得
		var randomSpeed = 1 + Math.random() * 2;
			randomSpeed = Math.floor(Math.random() * 2) === 0 ? -randomSpeed : randomSpeed;

		//プラグインを使った動きの設定
		$(window).parallax({
			parallax : $(this),
			type : 'type2',
			style : 'top',
			fixPosition : 0,
			speed : randomSpeed,
			adjustment : Number($(this).css('top').replace('px', '')),
			contentStartLinePercent: 50
		});
	});

	//--------------------------------------------------
	//	２つ目のコンテンツの動きの指定
	//--------------------------------------------------
	//背景のパララックス効果
	$(window).parallax({
		parallax : $('#first'),
		type : 'type2',
		style : 'background-positionTop',
		fixPosition : $('#first').offset().top,
		speed : -3,
		maxPosition : 0,
		adjustment : -200,
		contentStartLinePercent: 50
	});
	
	//テキストの位置を調整
	$('#first p').css({
		top: -100
	});
	
	//テキスト表示されるときの処理
	$(window).parallax({
		parallax : $('#first'),
		type : 'type3',
		fixPosition : $('#first').offset().top,
		startAnimation: function(e){showAnimate(e);},
		endAnimation: function(e){hideAnimate(e);},
		contentStartLinePercent: 30
	});
	
	//テキストの消えるときの処理
	$(window).parallax({
		parallax : $('#first'),
		type : 'type3',
		fixPosition : $('#first').offset().top + $('#first').height(),
		startAnimation: function(e){hide2Animate(e);},
		endAnimation: function(e){showAnimate(e);},
		contentStartLinePercent: 80
	});

	//テキストの表示される時のアニメーション
	function showAnimate(e) {
		var obj = e.target.find('p');
	
		obj.queue([]).stop();
		obj.animate({
			opacity: 1,
			top: 0
		},1000);
	};
	//テキストが上に向かって消える時のアニメーション
	function hideAnimate(e) {
		var obj = e.target.find('p');
	
		obj.queue([]).stop();
		obj.animate({
			opacity: 0,
			top: -50
		},1000);
	};
	//テキストが下に向かって消える時のアニメーション
	function hide2Animate(e) {
		var obj = e.target.find('p');
	
		obj.queue([]).stop();
		obj.animate({
			opacity: 0,
			top: 50
		},1000);
	};

	//--------------------------------------------------
	//	3つ目のコンテンツの動きの指定
	//--------------------------------------------------
	function contentSet() {
		var parallaxObj = {};
		parallaxObj['photo1'] = {};
		parallaxObj['photo1'].obj = $('.photo01 img');
		parallaxObj['photo2'] = {};
		parallaxObj['photo2'].obj = $('.photo02 img');
		parallaxObj['photo1'].tagMotions = {}
		parallaxObj['photo2'].tagMotions = {};
		
		parallaxObj['photo1'].tagMotions.motion1 = [{
			start : $('body').height() - $(window).height() - 300,
			end : $('body').height() - $(window).height(),
			fromStyle : {
				opacity : 0,
				top : -100
			},
			toStyle : {
				opacity : 1,
				top : 0
			},
			easing : 'easeOutBounce'
		}];
		parallaxObj['photo2'].tagMotions.motion1 = [{
			start : $('body').height() - $(window).height() - 300,
			end : $('body').height() - $(window).height(),
			fromStyle : {
				opacity : 0,
				top : 100
			},
			toStyle : {
				opacity : 1,
				top : 0
			},
			easing : 'easeOutBounce'
		}];
		
		$(window).parallax({
			parallax : parallaxObj
		});
	};
	
	contentSet();
	$(window).bind("resize",function(){
		contentSet();
	});
});