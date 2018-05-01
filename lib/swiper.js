$(function() {
    var $swiperList = $('#swiper-list'); // 大图的ul
    var $swiperNav = $('#swiper-nav'); // 小图的ul
    var $swiperToast = $('#swiper-toast'); // 遮罩层
    var $toastImg = $('#toast-img'); // 遮罩层下的img
    var $prev = $('#swiper-prev');
    var $next = $('#swiper-next');
    var $toastPrev = $('#swiper-toast-prev');
    var $toastNext = $('#swiper-toast-next');
    var $closeBtn = $('#swiper-btn-close');
    var $toastContent = $('#toast-content');
    var $listLi = $swiperList.find('li'); // 获取大图中li的集合
    var $navLi = $swiperNav.find('li'); // 获取预览图中li的集合
    var _liLength = $navLi.length; // 获取li的个数
    var _liWidth = $navLi.eq(0).outerWidth(); // 预览图一个li的宽度
    var _navParentWidth = $swiperNav.parent().width(); // 预览图ul的父盒子的宽度
    var _ulWidth = _liWidth * _liLength + (_liLength - 1) * 10; // ul的宽度
    var _moveWidth = _liWidth + 10; // 每次点击按钮ul移动的距离
    var _index = 0; //初始化当前选中的li
    var _moveNum = 1; // 记录ul移动的次数
    var _clientWidth = document.documentElement.clientWidth;
    var _clientHeight = document.documentElement.clientHeight; // 可视区域高度

    // 初始化ul的宽度
    $swiperNav.width(_ulWidth);
    // 初始化遮罩层图片宽度
    function setToastWidth() {
        if ((_clientWidth / _clientHeight).toFixed(2) > 1.5) {
            $toastContent.width(parseInt(_clientHeight * 1.25));
        } else {
            $toastContent.width(parseInt(_clientHeight));
        }
    }
    setToastWidth();
    // 遮罩层的响应式监听
    $(window).resize(function() {
        _clientWidth = document.documentElement.clientWidth;
        _clientHeight = document.documentElement.clientHeight;
        setToastWidth();
    })

    // 获取当前显示的li的下标
    function getIndex() {
        $navLi.each(function(i) {
            if ($(this).hasClass('active')) {
                return _index = i;
            }
        })
    }
    // 下一页
    $next.on('click', function() {
            getIndex(); // 获取当前显示的li的下标
            if (_index < (_liLength - 1)) {
                _index += 1;
                console.log(_index);
                $navLi.removeClass('active').eq(_index).addClass('active'); // 切换预览图
                $listLi.removeClass('active').eq(_index).addClass('active'); // 切换大图
                // 如果当前active的li的下两个li不超过li的长度则可以移动
                if ((_index <= (_liLength - 2))) {
                    var _nextLiPos = $navLi.eq(_index + 1).position().left - (_moveNum - 1) * _moveWidth; // 这里要减去已经移动过的left
                    // if ((_index == (_liLength - 2)) && ((_navParentWidth - _nextLiPos) < _liWidth)) {
                    //     _moveNum += 1;
                    //     $swiperNav.css({
                    //         left: -_moveWidth + 'px'
                    //     })
                    // }
                    // 如果当前移动后的li的下一个li超出父容器的宽度则向左移动ul
                    // if (_nextLiPos >= _navParentWidth) {
                    if ((_navParentWidth - _nextLiPos) < _liWidth) {
                        _moveNum += 1;
                        $swiperNav.css({
                            left: -(_moveNum * _moveWidth) + 'px'
                        })
                    }
                }
            }
        })
        // 上一页
    $prev.on('click', function() {
            getIndex(); // 获取当前显示的li的下标
            if (_index >= 1) {
                _index -= 1;
                $navLi.removeClass('active').eq(_index).addClass('active'); // 切换预览图
                $listLi.removeClass('active').eq(_index).addClass('active'); // 切换大图
                // 如果当前active的li的上一个li的left小于移动的距离
                console.log(_index, $navLi.eq(_index - 1).position().left, (_moveNum * _moveWidth));
                if (_index != 0 && ($navLi.eq(_index - 1).position().left - (_moveNum * _moveWidth)) < 0) {
                    _moveNum -= 1;
                    console.log(_moveNum);
                    $swiperNav.css({
                        left: -(_moveNum * _moveWidth) + 'px'
                    })
                }
            }
        })
        // 小图的li点击事件切换轮播图
    $swiperNav.on('click', 'li', function() {
            _index = $(this).index();
            $navLi.removeClass('active').eq(_index).addClass('active'); // 切换预览图
            $listLi.removeClass('active').eq(_index).addClass('active'); // 切换大图
        })
        // 大图的点击切换
    if (_clientWidth > 768) {
        $swiperList.on('click', 'li', function() {
            _index = $(this).index();
            var _src = $(this).attr('data-src');

            $swiperToast.show();
            $toastImg.attr('src', _src).css('opacity', 1);
        })
    }

    // 遮罩层的上一页
    $toastPrev.on('click', function() {
        _index -= 1;
        if (_index < 0) {
            _index = _liLength - 1;
        }
        $toastImg.css('opacity', 0).attr('src', $listLi.eq(_index).attr('data-src')).css('opacity', 1);
        $navLi.removeClass('active').eq(_index).addClass('active'); // 切换预览图
        $listLi.removeClass('active').eq(_index).addClass('active'); // 切换大图
    })

    // 遮罩层的下一页
    $toastNext.on('click', function() {
        _index += 1;
        if (_index >= _liLength) {
            _index = 0;
        }
        $toastImg.css('opacity', 0).attr('src', $listLi.eq(_index).attr('data-src')).css('opacity', 1);
        $navLi.removeClass('active').eq(_index).addClass('active'); // 切换预览图
        $listLi.removeClass('active').eq(_index).addClass('active'); // 切换大图
    })

    // 关闭遮罩层
    // $closeBtn.on('click', function() {
    //     $swiperToast.hide();
    // })
    $swiperToast.on('click', function(e) {
        var event = e || window.event;
        console.log(e.target.id);
        if (event.target.id == 'swiper-toast' || event.target.id == 'swiper-btn-close') {
            $swiperToast.hide();
        }
        return false;
    })
})