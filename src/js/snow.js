var Snow = function() {
    this.init();
    // console.log(this.angle)
}
Snow.prototype.reset = function() {
    var radians = this.angle * Math.PI / 180;
    this.x = this.x + Math.cos(radians) * (Math.random() * document.body.clientWidth * 2);
    this.y = this.y + Math.sin(radians) * (Math.random() * document.body.clientHeight * 2);
}
Snow.prototype.init = function() {
    this.angle = Math.floor(Math.random() * 10) > 5 ? Math.floor(Math.random() * 20) + 70 : Math.floor(Math.random() * 20) + 90;
    this.v = 2 + Math.random() * 7;
    this.x = 1 + Math.random() * window.screen.width * 2;
    this.y = Math.floor(1 + Math.random() * 200) * -1;
    this.radius = Math.floor(2 + Math.random() * 3);
    this.over = 1; //1自由落下 。2是落到树上 3是没有落到树上
}
Snow.prototype.draw = function(gct, w, h, translateX, translateY) {
    // console.log(translateX, translateY)

    gct.save();
    // gct.translate(translateX, translateY);
    gct.beginPath()
    var radians = this.angle * Math.PI / 180;

    this.x = this.x + Math.cos(radians) * this.v;
    this.y = this.y + Math.sin(radians) * this.v;

    if (this.y > h || this.x < -w || this.x > w) {
        this.init();
    }
    gct.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    // gct.shadowBlur = 10;
    // gct.shadowColor = "#f30"
    gct.fillStyle = "#fff";
    gct.fill();
    gct.closePath();
    gct.restore();
    // if (this.over === 1) {
    gct.save();
    gct.beginPath()
    gct.translate(w / 2, h - 570 + 80)
    gct.moveTo(0, 0);
    gct.lineTo(200, 400)
    gct.lineTo(-200, 400)
    gct.lineTo(0, 0);
    // gct.stroke()
    gct.restore();
    gct.closePath();
    if (gct.isPointInPath(this.x, this.y) && this.over === 1) {
        var rom = Math.floor(Math.random() * 10)
        this.over = 2;
        if (rom > 3) {
            this.v = 0.5;
            this.rotate = 90;
        }
    } else if ((!gct.isPointInPath(this.x, this.y)) && this.over === 2) {
        this.v = 2;
    }
}

export default Snow;