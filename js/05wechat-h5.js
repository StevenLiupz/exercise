(function(){
    var oContent = $('#content');
    var oFreeBtn = $('#free-btn');
    var oOrderContainer = $('#order-container');
    var oUsername = $('#username');
    var oTelphone = $('#telphone');
    var oLocation = $('#location');
    var oOrderOnline = $('#order-online');
    var freeHeight = parseInt(oFreeBtn.parent().innerHeight() || 64);
    var orderContainerHeight = freeHeight - parseInt(oOrderContainer.innerHeight() || 396);

    // 点击免费上门量体出现遮罩层
    oFreeBtn.on('click', function(){
        var _top = orderContainerHeight + 'px';
        oOrderContainer.animate({
            top: _top,
        }, 520)
    })

    // 表单输入判断
    oOrderOnline.on('click', function(e){
        e.preventDefault();
        e.stopPropagation();

        if(oUsername.val().trim() == '') {
            alert('请输入您的姓名！');
        }else if(oTelphone.val().trim() == '') {
            alert('请输入您的手机号！');
        }else if(oLocation.val().trim() == '') {
            alert('请输入您的地址！');
        }else{
            closeToast();
            // 这里发送ajax请求
        }
    })

    // 点击遮罩层外区域关闭遮罩层
    oContent.on('click', function(e) {
        e.stopPropagation(); // 阻止事件冒泡
        closeToast();
    })

    // 关闭遮罩层
    function closeToast() {
        var _top = freeHeight + 'px';
        oOrderContainer.animate({
            top: _top,
        }, 520)
    }
})();