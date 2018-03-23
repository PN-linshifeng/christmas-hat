import Hat from "./hat";
import ImageLayer from "./imageLayer"

var hatBox = document.querySelector(".hat-box");
var createImg = document.getElementById("createImg");
var canvasImg = document.getElementById("canvasImg");
var imgFile = document.getElementById("imgFile");
var selectHead = document.getElementById("selectHead"); //选择头像按钮
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//默认图片
import defaultHatSrc from '../../images/99.png';
var defaultHat = new Image();
defaultHat.src = defaultHatSrc;

var hat = new Hat({
	canvas: canvas
});
hat.drawRect(ctx);


//选择加载图片
imgFile.addEventListener("change", function() {
	imgFile.style.display = "none";
	var src = getFileUrl(this);
	var headerImg = new Image();
	headerImg.src = src;
	headerImg.onload = function() {
		document.querySelector(".tip").style.display = "none";
		switch (hat.imageLayer.length) {
			case 0:
				hat.imageLayer.push(new ImageLayer({
					imgObj: headerImg,
					name: 'header'
				}));
				hat.imageLayer.push(new ImageLayer({
					name: 'hat',
					imgObj: defaultHat,
					full: false,
					translate: {
						x: 50,
						y: 50
					}
				}));
				break;
			case 1:
				hat.imageLayer.unshift(new ImageLayer({
					imgObj: headerImg,
					name: 'header'
				}));
				break;

			default:
				hat.imageLayer.shift();
				hat.imageLayer.unshift(new ImageLayer({
					imgObj: headerImg,
					name: 'header'
				}));
				break;
		}

		hat.renderLayer(ctx);
	}

}, false);

//点击生成图片
createImg.addEventListener("click", function() {
	hat.buildImg();
}, false);

//点击选择图片
selectHead.addEventListener("click", function(e) {
	var handleClick = document.createEvent("MouseEvents");
	handleClick.initEvent("click", true, true);
	imgFile.dispatchEvent(handleClick)
}, false);

//选择帽子
hatBox.addEventListener('click', function(e) {
	if (e.target.tagName === "IMG") {
		hat.imageLayer.pop();
		var img = new Image();
		img.onload = function() {
			hat.imageLayer.push(new ImageLayer({
				name: 'hat',
				translate: {
					x: 50,
					y: 50
				},
				imgObj: img,
				full: false,
			}));
			hat.renderLayer(ctx);
		}
		img.src = e.target.src;
	}
}, false);

//关闭生成图片弹窗
document.querySelector(".close").addEventListener("click", function() {
	document.querySelector("#createHeadImg").style.display = "none";
}, false);

//file 图片资源
function getFileUrl(imgObj) {
	var url;
	if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE 
		url = imgObj.value;
	} else if (navigator.userAgent.indexOf("Firefox") > 0) { // Firefox 
		url = window.URL.createObjectURL(imgObj.files.item(0));
	} else { // Chrome 
		url = window.URL.createObjectURL(imgObj.files.item(0));
	}
	return url;
}