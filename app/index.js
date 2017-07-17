/**
 * Created by Msater Zg on 2017/1/6.
 */
define(function (require, exports, module) {

    // 通过 require 引入依赖
    /*    require('../spm_modules/jquery/jquery-3.1.1.min');*/
    //二级模块

    var sysInfo = JSON.parse(localStorage.getItem('sysInfo'));
    var sysUser = JSON.parse(localStorage.getItem('sysUser'));
    var api = require('../static/common/api');
    if (sysInfo === '' || sysInfo == null) {
        window.location.href = './login.html';
    }
    var PERSONINFO;
    //系统的全局变量
    SYSTEM = {
        user: sysInfo.user,
        model: sysInfo.module,
        functions: sysInfo.function
    };
    $('.form-control.user_loginname').val(SYSTEM['user']['user_loginname']);
    $('.form-control.user_name').val(SYSTEM['user']['user_name']);
    $('.form-control.user_phone').val(SYSTEM['user']['user_phone']);

    $('.button-cancel').unbind('click').click(function () {
        layer.close(PERSONINFO);
    });
    $('#adv-show').unbind('click').click(function () {
        layer.open({
            type: 1,
            title: false,
            closeBtn: false,
            area: '450px;',
            shade: 0.6,
            id: 'LAY_layuipro',
            resize: false,
            shadeClose: true,
            btnAlign: 'c',
            moveType: 1,
            content: $('#sys-adv'),
        });
    });
    $('.button-preserve').unbind('click').click(function () {
        var passwordFirst = $('.form-control.user_password').val();
        var passwordSure = $('.form-control.password-sure').val();
        if (passwordFirst == passwordSure) {
            changePersonInfo();
        } else {
            layer.msg('请保持密码一致！', {
                time: 1500,
                zIndex: layer.zIndex, //重点1
                success: function (layero) {
                    layer.setTop(layero); //重点2
                }
            });
        }
    });

    $('#personal-setting').unbind('click').click(function () {
        PERSONINFO = layer.open({
            title: ' 个 人 设 置 ',
            type: 1,
            area: ['40%', '60%'], //宽高
            shadeClose: false,
            content: $('#person-info'),
            zIndex: layer.zIndex, //重点1
            success: function (layero) {
                layer.setTop(layero); //重点2
            }
        });
    });

    writeFirstDom();
    $('.right .user span').text(SYSTEM.user.user_name);

    //二级模块
    $('.body-left-nav ul li a').click(function () {
        $('.body-left-nav ul li a').removeClass('active');
        $(this).addClass('active');
    });
    $('.body-left-nav ul a :first').trigger('click');

    $('#user-info').unbind('click').click(function () {
        $('.user-info-choice').fadeToggle();
    });

    /* $('section').unbind('click').click(function () {
     $('.user-info-choice').fadeOut();
     });*/


    function writeFirstDom() {
        var data = SYSTEM.model;
        var dataLen = SYSTEM.model.length;
        var dom = [];
        for (var i = 0; i < dataLen; i++) {
            dom.push('<a href="#"  menu_id = "' + data[i].menu_id + '">' + data[i].menu_name + '</a>');
        }
        $('.sys-menu .nav-menu').append(dom.join(''));
        //一级块点击事件
        $('.nav-menu a').unbind('click').click(function () {
            $('.nav-menu a').removeClass('active');
            $(this).addClass('active');
            var menu_id = $(this).attr("menu_id");
            writeDomSecond(menu_id);
        });
        $('.nav-menu a:first').trigger('click');
    }

    function writeDomSecond(menu_id) {
        var functionModule = SYSTEM.functions[menu_id];
        var functionModuleLen = SYSTEM.functions[menu_id].length;
        var dom = [];
        $('.body-left-nav ul').empty();
        for (var i = 0; i < functionModuleLen; i++) {
            dom.push('<li>');
            dom.push('<a class="active" href="../static/module' + functionModule[i].menu_content + '" target="contextIframe">');
            dom.push('<span class="' + functionModule[i].menu_attr + '"></span>&nbsp;&nbsp;&nbsp;&nbsp;' + functionModule[i].menu_name + '');
            dom.push('</a>');
            dom.push('</li>');
        }

        $('.body-left-nav ul').append(dom.join(''));
        $('.body-left-nav ul li a').click(function () {
            $('.body-left-nav ul li a').removeClass('active');
            $(this).addClass('active');
        });
        $('.body-left-nav ul a :first').trigger('click');
    }

    function getFormValue() {
        var userDatat = {
            user_loginname: $('.form-control.user_loginname').val(),
            user_name: $('.form-control.user_name').val(),
            user_phone: $('.form-control.user_phone').val(),
        };
        var userPassword = $('.form-control.user_password').val();
        if (userPassword != '') {
            userDatat.user_password = userPassword;
        }
        return userDatat
    }

    function changePersonInfo() {
        api.userManage.changePersonInfo(JSON.stringify(getFormValue()), function (rep) {
            if (rep.result == 1) {
                window.location.href = "./login.html";
            } else {
                layer.close(PERSONINFO);
                layer.msg(' 修 改 失 败', {
                    icon: 2,
                    time: 1200,
                });
            }

        });
    }
});
