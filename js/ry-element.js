$(function(){ 
	// 初始化滚动条高度
	$("#side-scrollBar").height(setScrollHeight("#page-list-view"));
	// 复制代码功能
	new Clipboard(".copy-btn");
	$(".copy-btn").hover(function(){
		$(this).addClass("active").prev().fadeIn();  
	},function(){
		$(this).removeClass("active").prev().fadeOut(function(){
			$(this).text("Copy to clipboard");
		}); 
	},200)
	$(".copy-btn").click(function(){
		$(this).prev().text("copied!");
	})
	// 单选按钮的选中效果
	$(".ry-radio").click(function(){
		$(".ry-radio").each(function(index){
			var $radio_inner = $(this).find(".ry-radio_inner");
			if($radio_inner.hasClass("checked")){
				$radio_inner.removeClass("checked");
			}
		})
		$(this).find(".ry-radio_inner").addClass("checked");
	}) 
	// 鼠标移入代码区域的动画效果
	$(".demo-block").hover(function(){
		$(this).addClass("is-hover");  
	},function(){
		$(this).removeClass("is-hover");  
	})
	$(".demo-block-control").hover(function(){
		$(this).addClass("hoverColor"); 
	},function(){
		$(this).removeClass("hoverColor"); 
	})
	$(".demo-block-control").click(function(){
		$(this).removeClass("hoverColor");
		if($(this).hasClass("is-fixed")){ 
			$(this).removeClass("is-fixed").find("span").text("显示代码").end().prev(".meta").slideUp(100);
			$(this).find("p>i").removeClass("icon-less").addClass("icon-moreunfold");
			$(".demo-block").removeClass("is-hover"); 
		}else{ 
			$(this).addClass("is-fixed").find("span").text("隐藏代码").end().prev(".meta").slideDown(100);
			$(this).find("p>i").removeClass("icon-moreunfold").addClass("icon-less");
		}
	})
	// 浏览器窗口变化时计算滚动条的宽高
	$(window).resize(function(){
		$("#side-escrollBar").height(setScrollHeight("#page-list-view"));
	})
	// 返回顶部按钮效果
	$(window).scroll(function(){
		var $top = $(window).scrollTop(); 
		if ($top > 150) {
			$("#page-component-top").fadeIn(); 
		}else{
			$("#page-component-top").fadeOut();
		}
	})
	$("#page-component-top").on("click",function(){
		$('html,body').animate({scrollTop: 0},300);
	})
})