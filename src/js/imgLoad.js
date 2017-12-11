var ImgLoading = function(imgArr, ceche) {
    var success = false;
    var num = 0;
    var ceche = ceche == undefined ? false : ceche;
    var errorFun = true;
    var imgArrObj = [];
    var errorTimes = 0;
    var storageImg = window.localStorage;

    function loadImg() {
        var clearCeche = location.href;
        for (var i = 0; i < imgArr.length; i++) {
            imgArrObj[i] = new Image();
            imgArrObj[i].src = imgArr[i];

        }
    }
    loadImg();
    return {
        load: function(callbackSuccess, callbackError) {
            for (var i = 0; i < imgArrObj.length; i++) {
                (function(i, callbackSuccess) {
                    imgArrObj[i].onload = function() {

                        num += 1;
                        if (num >= imgArrObj.length) {
                            success = true;
                            if (typeof callbackSuccess === 'function') {
                                callbackSuccess.apply(null, arguments);
                            }
                        }
                    }
                    imgArrObj[i].onerror = function() {
                        if (typeof callbackError === 'function' && errorFun) {
                            errorFun = false;
                            callbackError.apply(null, arguments);
                        }
                        errorTimes++;
                        return false;
                        if (errorTimes <= 5) {
                            var src = imgArrObj[i].src;
                            if (src.indexOf("?") < 0) {
                                imgArrObj[i].src = src + "?" + Date.now();
                            } else {
                                imgArrObj[i].src = src.replace(/\?.+?$/g, "?" + Date.now());
                            }
                        } else {
                            var load = window.confirm("图片加载失败,【确定】继续等待，【取消】重新加载");
                            if (load) {
                                window.location.reload();
                            } else {
                                errorTimes = 0;
                                var src = imgArrObj[i].src;
                                if (src.indexOf("?") < 0) {
                                    imgArrObj[i].src = src + "?" + Date.now();
                                } else {
                                    imgArrObj[i].src = src.replace(/\?.+?$/g, "?" + Date.now());
                                }
                            }

                        }
                    }
                })(i, callbackSuccess, callbackError);
            }
        },
        getState: function() {
            return success;
        },
        reload: function(callbackSuccess, callbackError) {
            this.init();
            for (var i = 0; i < imgArrObj.length; i++) {
                var s = imgArrObj[i].src.toString().split('?')[0]
                var src = s + "?" + new Date().getTime();
                imgArrObj[i].src = src;
            }
            this.load(callbackSuccess, callbackError);
        },
        getImgObg: imgArrObj,
        init: function() {
            success = false;
            num = 0;
            errorFun = true;
        }
    }
}
export default ImgLoading;