/**
 * Created by Msater Zg on 2017/1/6.
 */
define(function (require, exports, module) {
    require('../spm_modules/jquery/jquery.cookie');
    var api = require('../static/common/api');
//常量用大写来表示
    $(window).resize(function () {
        var login_context_width = ($(window).width() - 400) / 2;
        $('.login_main_html .login_context').css('margin-left', login_context_width);
    });
    //执行调整大小的方法
    /*$(window).trigger('resize');*/
    $(document).keypress(function (e) {
        if (e.charCode == 13) {
            $("#login_button").trigger("click");
        }
    });
    canvasDom();
    $('#login_button').click(function () {
        var user_loginname = $('#user_loginname').val();
        var user_password = $('#user_password').val();
        if (user_loginname === '' || user_password === '') {
            layer.msg('账号或密码填写不完整!', {
                time: 1500
            });
        } else {
            judgeLogin(user_loginname, user_password);
        }
    });

    $('#remember_password').click(function () {
        rememberMe();
    });

    //验证用户账号密码是否正确的函数


    function judgeLogin(userLoginName, userPassWord) {
        api.userManage.judgeLogin(userLoginName, userPassWord, function (rep) {
            if (rep.result == 1) {
                $('.fakeLoader').show();
                localStorage.setItem('sysInfo', JSON.stringify(rep.data));
                localStorage.setItem('sysUser', JSON.stringify(rep.data.user));
                setTimeout(function () {
                    window.location.href = './index.html';
                }, 1000);
            } else {
                layer.msg('账号或密码错误!', {
                    time: 1500
                });
            }

        });
    }

    //记住密码的方法
    function rememberMe() {
        if ($("#remember_password").prop('checked')) {
            $.cookie('rememberme', true, {expires: 365});
            $.cookie("loginname", $("#user_loginname").val(), {expires: 365});
            $.cookie("loginpwd", $("#user_password").val(), {expires: 365});
        } else {
            $.cookie('rememberme', false, {expires: 365});
            $.cookie("loginname", "");
            $.cookie("loginpwd", "");
        }
    }

    //程序运行时，先找cookie
    getRemember();
    function getRemember() {
        var rememberme = $.cookie("rememberme");
        if (rememberme != null && rememberme == "true") {
            $("#remember_password").prop('checked', true);
            $("#user_loginname").val($.cookie("loginname"));
            $("#user_password").val($.cookie("loginpwd"));
        } else {
            $("#remember_password").prop('checked', false);
            $("#user_password").val("");
            $("#user_password").val("");
        }
    }

    function canvasDom() {
        //定义画布宽高和生成点的个数
        var WIDTH = window.innerWidth, HEIGHT = window.innerHeight, POINT = 35;

        var canvas = document.getElementById('space');
        canvas.width = WIDTH,
            canvas.height = HEIGHT;
        var context = canvas.getContext('2d');
        context.strokeStyle = 'rgba(0,0,0,0.02)',
            context.strokeWidth = 1,
            context.fillStyle = 'rgba(0,0,0,0.05)';
        var circleArr = [];

        //线条：开始xy坐标，结束xy坐标，线条透明度
        function Line(x, y, _x, _y, o) {
            this.beginX = x,
                this.beginY = y,
                this.closeX = _x,
                this.closeY = _y,
                this.o = o;
        }

        //点：圆心xy坐标，半径，每帧移动xy的距离
        function Circle(x, y, r, moveX, moveY) {
            this.x = x,
                this.y = y,
                this.r = r,
                this.moveX = moveX,
                this.moveY = moveY;
        }

        //生成max和min之间的随机数
        function num(max, _min) {
            var min = arguments[1] || 0;
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        // 绘制原点
        function drawCricle(cxt, x, y, r, moveX, moveY) {
            var circle = new Circle(x, y, r, moveX, moveY)
            cxt.beginPath()
            cxt.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI)
            cxt.closePath()
            cxt.fill();
            return circle;
        }

        //绘制线条
        function drawLine(cxt, x, y, _x, _y, o) {
            var line = new Line(x, y, _x, _y, o)
            cxt.beginPath()
            cxt.strokeStyle = 'rgba(0,0,0,' + o + ')'
            cxt.moveTo(line.beginX, line.beginY)
            cxt.lineTo(line.closeX, line.closeY)
            cxt.closePath()
            cxt.stroke();

        }

        //初始化生成原点
        function init() {
            circleArr = [];
            for (var i = 0; i < POINT; i++) {
                circleArr.push(drawCricle(context, num(WIDTH), num(HEIGHT), num(15, 2), num(10, -10) / 40, num(10, -10) / 40));
            }
            draw();
        }

        //每帧绘制
        function draw() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < POINT; i++) {
                drawCricle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r);
            }
            for (var i = 0; i < POINT; i++) {
                for (var j = 0; j < POINT; j++) {
                    if (i + j < POINT) {
                        var A = Math.abs(circleArr[i + j].x - circleArr[i].x),
                            B = Math.abs(circleArr[i + j].y - circleArr[i].y);
                        var lineLength = Math.sqrt(A * A + B * B);
                        var C = 1 / lineLength * 7 - 0.009;
                        var lineOpacity = C > 0.03 ? 0.03 : C;
                        if (lineOpacity > 0) {
                            drawLine(context, circleArr[i].x, circleArr[i].y, circleArr[i + j].x, circleArr[i + j].y, lineOpacity);
                        }
                    }
                }
            }
        }

        //调用执行
        window.onload = function () {
            init();
            setInterval(function () {
                for (var i = 0; i < POINT; i++) {
                    var cir = circleArr[i];
                    cir.x += cir.moveX;
                    cir.y += cir.moveY;
                    if (cir.x > WIDTH) cir.x = 0;
                    else if (cir.x < 0) cir.x = WIDTH;
                    if (cir.y > HEIGHT) cir.y = 0;
                    else if (cir.y < 0) cir.y = HEIGHT;

                }
                draw();
            }, 16);
        };
    }
});