export default class Snow {
    constructor() {
        this.init();
    }
    init() {
        this.angle = Math.floor(Math.random() * 10) > 5 ? Math.floor(Math.random() * 20) + 70 : Math.floor(Math.random() * 20) + 90; //角度运动
        this.v = 2 + Math.random() * 7; //速度
        this.x = 1 + Math.random() * window.screen.width * 2; //x位置
        this.y = Math.floor(1 + Math.random() * 200) * -1; //y位置 在屏幕上面，离屏。
        this.radius = Math.floor(2 + Math.random() * 3); //雪花大小半径
        this.over = 1; //1自由落下 。2是落到树上 3是没有落到树上
    };
    //设置随意随机分散雪花
    reset() {
        var radians = this.angle * Math.PI / 180;
        this.x = this.x + Math.cos(radians) * (Math.random() * window.screen.width * 2);
        this.y = this.y + Math.sin(radians) * (Math.random() * window.screen.height * 2);
    }
    render(ctx, w, h) {
        ctx.save();
        // ctx.translate(translateX, translateY);
        ctx.beginPath()
        var radians = this.angle * Math.PI / 180;

        this.x = this.x + Math.cos(radians) * this.v;
        this.y = this.y + Math.sin(radians) * this.v;
        // 超出屏幕外
        if (this.y > h || this.x < 0 || this.x > w) {
            this.init();
        }
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        // ctx.shadowBlur = 10;
        // ctx.shadowColor = "#f30"
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();
        ctx.restore();

        ctx.save();
        ctx.beginPath()
        ctx.translate(w / 2, h - 570 + 80)
        ctx.moveTo(0, 0);
        ctx.lineTo(200, 400)
        ctx.lineTo(-200, 400)
        ctx.lineTo(0, 0);

        ctx.restore();
        ctx.closePath();
        if (ctx.isPointInPath(this.x, this.y) && this.over === 1) {
            var rom = Math.floor(Math.random() * 10)
            this.over = 2;
            if (rom > 3) {
                this.v = 0.5;
                this.rotate = 90;
            }
        } else if ((!ctx.isPointInPath(this.x, this.y)) && this.over === 2) {
            this.v = 2;
        };
    }

};