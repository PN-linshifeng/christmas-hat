;
(function(win, doc) {
	/*
	 @method pageModai 模态窗口
	 *窗口class page-view
	 */
	function pageModai() {
		if (!document.addEventListener) {
			return undefined;
		}
		var handleClick = function(event) {
			var target = event.target;
			if (target.className.indexOf("page-view") >= 0) {
				history.back();
				return;
			}
			if (target.className.indexOf("close") >= 0 && target.parentNode.className.indexOf("page-view") >= 0) {
				history.back();
			}

		}
		var hashFun = function() {
			var pageView = document.querySelectorAll(".page-view");
			var hash = location.hash;
			if (hash.length && document.querySelector(hash)) {
				document.querySelector(hash).style.display = "block";
			} else {
				for (var i = 0; i < pageView.length; i++) {
					pageView[i].style.display = "none";
				}
			}
		}
		document.addEventListener("click", handleClick, false);
		return hashFun;
	}
	win.pageModai = pageModai;
})(window, document);
window.onhashchange = pageModai();