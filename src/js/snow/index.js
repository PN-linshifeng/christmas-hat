import SnowMain from "./snowMain";
var snowCanvas = document.getElementById("snow");
var snowCtx = snowCanvas.getContext("2d");
snowCanvas.width = window.screen.width * 2;
snowCanvas.height = window.screen.height * 2;

//加载下雪
var snowing = new SnowMain(snowCtx, snowCanvas.width, snowCanvas.height);
var closeSnow = document.getElementById("closeSnow");
closeSnow.addEventListener("click", function() {
	snowing.clearLoop();
	document.querySelector(".snow-box").style.display = "none";
	document.querySelector(".wechar-ani").classList.add('scaleDown')
}, false);