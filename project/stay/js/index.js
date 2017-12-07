/**
 * Created by Steven on 2017/4/30.
 */
$(function () {
    /*轮播图部分*/
    $.each($("#main-banner>ul>li"), function (i) {
        // 遍历li，为每个li添加背景图片并动态设置li的宽度
        $(this).css({"background":"url('./images/banner"+(i+1)+".jpg') 50% 0% no-repeat", "width": $("#main-banner>ul").width()/($("#main-banner>ul>li").length+1)});
    });

    // 将第一张图片动态克隆到ul的尾部
    var $firstLi = $("#main-banner>ul>li").eq(0).clone(true);
    $("#main-banner>ul").append($firstLi);

    var timer = null;
    var index = 0; // 用于记录轮播的单位长度
    var liLength = $("#main-banner>ul>li").length; // li的个数
    var flag = true; // 定义一个变量用于记录当前动画是否执行完成

    autoplay();

    // 鼠标移入移出时图片的轮播切换 & 上下页按钮的显示与隐藏
    $("#main-banner").mouseover(function () {
        clearInterval(timer);
        $("#main-banner .btn-arrow").show();
    }).mouseout(function () {
        autoplay();
        $("#main-banner .btn-arrow").hide();
    });

    // 上下页的点击功能实现
    $("#main-banner .next").click(function () {
        move();
    })
    $("#main-banner .prev").click(function () {
        move(false);
    })

    // 封装的一个自动播放的函数
    function autoplay() { // bool控制向左还是向右滑动
        clearInterval(timer); // 要用定时器先清定时器
        timer = setInterval(function () {
            move();
        },3000);
    }

    // 封装的一个点击翻页按钮切换图片的函数
    function move(bool) {
        if(flag){
            flag = false; // 每次执行动画时，都将flag关闭，变为false，只有动画执行完成后才变为true

            if(typeof bool != "undefined" && bool == false){
                index--;
            }else if (typeof bool == "undefined" || bool == true){
                index++;
            }

            // 控制left的范围
            if(index >= liLength){
                $("#main-banner>ul").css("left",0);
                index = 1;
            }
            if(index < 0){
                $("#main-banner>ul").css("left", -(liLength - 1)*$("#main-banner").width());
                index = liLength - 2;
            }

            $("#main-banner>ul").stop().animate({
                left: -index * $("#main-banner").width()
            },600,function () {
                $("#main-banner>ul>li>.content>a").removeClass("run");
                $("#main-banner>ul>li").eq(index).find("a").addClass("run");
                flag = true; // 利用开闭原则，只有在当前动画执行完成后才能进行下一动画（当前flag打开，变为true）
            });
        }
    }
})
