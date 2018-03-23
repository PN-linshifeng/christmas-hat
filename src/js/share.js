//微信分享
import 'whatwg-fetch';
var abc = encodeURIComponent(window.location.href)
fetch('http://www.viphk.xin/ajax/weixin.ashx?url=' + abc, {
	method: "GET"
}).then((response) => {
	return response.json();
}).then((json) => {
	console.log(json)
	wxInfo(json)
})

function wxInfo(json) {
	//配置微信
	wx.config({
		debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: 'wx3dcb634a12345331', // 必填，公众号的唯一标识
		timestamp: json.timestamp, // 必填，生成签名的时间戳
		nonceStr: json.noncestr, // 必填，生成签名的随机串
		signature: json.signature, // 必填，签名，见附录1
		jsApiList: [
			'checkJsApi',
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'onMenuShareQQ',
			'onMenuShareWeibo'
		]
	});

	//分享信息   
	wx.ready(function() {
		var sdata = {
			title: "让微信头像带上圣诞帽子",
			desc: "只要15秒, 在线给微信头像制作圣诞老人帽子",
			link: window.location.href,
			imgUrl: "http://www.viphk.xin/static/html/hat/images/head.jpg"
		};
		wx.onMenuShareTimeline(sdata);
		wx.onMenuShareAppMessage(sdata);
		wx.onMenuShareQQ(sdata);
		wx.onMenuShareWeibo(sdata);
	});

};
var au = document.getElementById("bgm");
document.addEventListener("WeixinJSBridgeReady", function() {
	au.play();
}, false);