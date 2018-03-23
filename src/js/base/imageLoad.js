/**
 * 图片加载器
 * @param  {[type]} arr [传入图片url集合]
 * @return {[type]}     [返回promise对象]
 */
var imagesLoad = (arr) => {
	var imagesArr = [];
	arr.forEach(function(item) {
		var promise = new Promise(function(resolve, reject) {
			var img = new Image();
			img.src = item;
			img.onload = function() {
				resolve(img)
			}
			img.onerror = function() {
				reject('图片加载失败:' + item)
			}
		})
		imagesArr.push(promise)
	})
	return imagesArr;
}

export default imagesLoad;