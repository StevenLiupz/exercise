$(function(){
	var $swiperList = $('#swiper-list');
	var $swiperNav = $('#swiper-nav');
	var $prev = $('#swiper-prev');
	var $next = $('#swiper-next');
	var $listLi = $swiperList.find('li'); // 获取大图中li的集合
	var $navLi = $swiperNav.find('li'); // 获取预览图中li的集合
	var _liLength = $navLi.length; // 获取li的个数
	var _liWidth = $navLi.eq(0).outerWidth(); // 预览图一个li的宽度
	var _navParentWidth = $swiperNav.parent().width(); // 预览图ul的父盒子的宽度
	var _ulWidth = _liWidth * _liLength + (_liLength-1)*10; // ul的宽度
	var _moveWidth = _liWidth + 10; // 每次点击按钮ul移动的距离
	var _index = 0; //初始化当前选中的li
	var _moveNum = 1; // 记录ul移动的次数

	// 初始化ul的宽度
	$swiperNav.width();

	// 获取当前显示的li的下标
	function getIndex(){
		$navLi.each(function(i){
			if($(this).hasClass('active')){
				return _index = i;
			}
		})
	}
	// 下一页
	$next.on('click',function(){
		getIndex(); // 获取当前显示的li的下标
		if(_index < (_liLength-1)){
			_index+=1;
			$navLi.removeClass('active').eq(_index).addClass('active');  // 切换预览图
			$listLi.removeClass('active').eq(_index).addClass('active'); // 切换大图
			// 如果当前active的li的下两个li不超过li的长度则可以移动
			if((_index <= (_liLength-2))){
				var _nextLiPos = $navLi.eq(_index+1).position().left - (_moveNum - 1)*_moveWidth; // 这里要减去已经移动过的left
				// 如果当前移动后的li的下一个li超出父容器的宽度则向左移动ul
				if(_nextLiPos >= _navParentWidth){
					_moveNum+=1;
					$swiperNav.css({
						left: -(_moveNum * _moveWidth) + 'px'
					})
				}
			}
		}
	})
	// 上一页
	$prev.on('click',function(){
		getIndex(); // 获取当前显示的li的下标
		if(_index >= 1){
			_index-=1;
			$navLi.removeClass('active').eq(_index).addClass('active');  // 切换预览图
			$listLi.removeClass('active').eq(_index).addClass('active'); // 切换大图
			// 如果当前active的li的上一个li的left小于移动的距离
			console.log(_index,$navLi.eq(_index-1).position().left,(_moveNum * _moveWidth));
			if(_index != 0 && ($navLi.eq(_index-1).position().left - (_moveNum * _moveWidth)) < 0){
				_moveNum-=1;
				console.log(_moveNum);
				$swiperNav.css({
					left: -(_moveNum * _moveWidth) + 'px'
				})
			}
		}
	})
})