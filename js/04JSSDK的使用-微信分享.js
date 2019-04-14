$(function(){
    var appId, nonceStr, timestamp, signature;
    var _url = encodeURIComponent(location.href.split('#')[0]);

    $.ajax({
     url: 'http://api.kuailuapp.com/?s=app/Usersauth/jssdk&url=' +_url,  // 这里的url地址一般是后端提供的接口地址 
        dataType: 'json',
        type: 'GET',
        async: true,
        success: function (data) {
            if (datas.status == '1') {
                appId = datas.data.appId;
                nonceStr = datas.data.nonceStr;
                timestamp = datas.data.timestamp;
                signature = encodeURIComponent(datas.data.signature);
                wxShare();
            }
            
        },
        error: function () {}
    });
    function wxShare(){
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        wx.config({
            debug: false, // 开启调试模式为true后可以通过alert弹窗将公众号签名等结果反馈出来
            appId: appId, // 必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: signature,// 必填，签名，见附录1
            jsApiList: [
                "onMenuShareTimeline",
                "onMenuShareAppMessage",//分享给好友
                "onMenuShareQQ",
                "onMenuShareWeibo",
                "onMenuShareQZone"
            ]
        });
        wx.ready(function () {
            //分享好友
            var shareData = {
                title: '分享标题',
                desc: '分享描述',
                dataUrl: '',
                type: 'link',
                imgUrl: '缩略图线上地址',
                link: location.href.split("#")[0]
            };
            wx.onMenuShareTimeline(shareData);
            wx.onMenuShareAppMessage(shareData);
            wx.onMenuShareQQ(shareData);
            wx.onMenuShareWeibo(shareData);
            wx.onMenuShareQZone(shareData);
        });
    }
});