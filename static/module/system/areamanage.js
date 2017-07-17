/**
 * Created by Msater Zg on 2017/2/6.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    var api = require('../../common/api');
    var sysTem = window.parent.SYSTEM;
    var addAreaDialog;
    //用来判断添加哪一级地区
    var areaGradeFlag;
    var firstId;
    var secondId;
    getFirstArea();
    $('#add-first-button').unbind('click').click(function () {
        areaGradeFlag = 'first';
        domDrawDialog();
    });

    $('#add-second-button').unbind('click').click(function () {
        areaGradeFlag = 'second';
        domDrawDialog();
    });

    $('#add-third-button').unbind('click').click(function () {
        areaGradeFlag = 'third';
        domDrawDialog();
    });

    $('#cancel-area').unbind('click').click(function () {
        layer.close(addAreaDialog);
    });

    $('.module-context .fix').click(function () {
        var dom = [];
        dom.push('<div class="module-context add animated zoomIn">');
        dom.push('<input type="text" class="form-control area-name" placeholder="地区称">');
        dom.push('<div class="operationicon">');
        dom.push('<span class="glyphicon glyphicon-trash span-icon span-icon-cursor delete-module span-red"></span>');
        dom.push('</div>');
        dom.push('<div style="clear: both"></div>');
        dom.push('</div>');
        $('#area-add-dialog .context').append(dom.join(''));
        $('.delete-module').click(function () {
            $(this).parent().parent().addClass('animated zoomOut');
            var this_ = this;
            setTimeout(function () {
                $(this_).parent().parent().remove();
            }, 500);
        });
    });

    //提交的点击事件
    $('#add-area').unbind('click').click(function () {
        var areaValue = [];
        $('.form-control.area-name').each(function () {
            areaValue.push($(this).val());
        });
        postAreaData(areaValue.join('@'))
    });
    /**
     *控制弹出框
     * */
    function domDrawDialog() {
        $('.form-control.area-name').val('');
        $('.module-context.add').remove();
        addAreaDialog = layer.open({
            title: ' 添 加 地 区',
            type: 1,
            area: ['35%', '50%'],
            content: $('#area-add-dialog'),
        });
    }

    /**
     * 获取所有的一级地区
     * @param areaId
     */
    function getFirstArea() {
        api.system.areaManage.getTypeArea('', function (rep) {
            console.log(rep);
            if (rep.result == 1) {
                var areaData = rep.data;
                var areaDataLen = rep.data.length;
                var dom = [];
                for (var i = 0; i < areaDataLen; i++) {
                    dom.push(' <li class="area-li" areaId = "' + areaData[i].id + '">' + areaData[i].area_name + '</li>');
                }
                $('.left-html ul').empty();
                $('.left-html ul').append(dom.join(''));
                $('.left-html ul .area-li').unbind('click').click(function () {
                    $('.left-html ul .area-li').removeClass('li-active');
                    $(this).addClass('li-active');
                    var areaId = $(this).attr('areaId');
                    firstId = $(this).attr('areaId');
                    getSecondArea(areaId);
                });
                $('.left-html ul .area-li:first').trigger('click');
            } else {
                $('.left-html ul').empty();
                /*layer.msg('数据为空', {
                 time: 1500,
                 });*/
            }
        });
    }


    /**
     * 根据id获取到二级地区
     */
    function getSecondArea(areaId) {
        api.system.areaManage.getTypeArea(areaId, function (rep) {
            console.log(rep);
            if (rep.result == 1) {
                var areaData = rep.data;
                var areaDataLen = rep.data.length;
                var dom = [];
                for (var i = 0; i < areaDataLen; i++) {
                    dom.push(' <li class="area-li" areaId = "' + areaData[i].id + '">' + areaData[i].area_name + '</li>');
                }
                $('.center-html ul').empty();
                $('.center-html ul').append(dom.join(''));
                $('.center-html ul .area-li').unbind('click').click(function () {
                    $('.center-html ul .area-li').removeClass('li-active');
                    $(this).addClass('li-active');
                    var areaId = $(this).attr('areaId');
                    secondId = $(this).attr('areaId');
                    getThirdArea(areaId);
                });
                $('.center-html ul .area-li:first').trigger('click');
            } else {
                $('.center-html ul').empty();
                $('.right-html ul').empty();
                $('.center-html ul').append('<li class="area-li no-data"> 数 据 为 空 ！</li>');
                $('.right-html ul').append('<li class="area-li no-data"> 数 据 为 空 ！</li>');
            }
        });
    }

    /**
     * 根据id获取三级地区
     * @param areaId
     */
    function getThirdArea(areaId) {
        api.system.areaManage.getTypeArea(areaId, function (rep) {
            if (rep.result == 1) {
                var areaData = rep.data;
                var areaDataLen = rep.data.length;
                var dom = [];
                for (var i = 0; i < areaDataLen; i++) {
                    dom.push(' <li class="area-li" areaId = "' + areaData[i].id + '">' + areaData[i].area_name + '</li>');
                }
                $('.right-html ul').empty();
                $('.right-html ul').append(dom.join(''));
            } else {
                $('.right-html ul').empty();
                $('.right-html ul').append('<li class="area-li no-data"> 数 据 为 空 ！</li>');
            }
        });
    }

    /**
     * 新增地区（1,2,3级一起添加）
     * @param areaValue
     */
    function postAreaData(areaValue) {
        var areaId = '';
        var areaGrade = '';
        if (areaGradeFlag == 'first') {
            areaId = 0;
            areaGrade = 1;
        } else if (areaGradeFlag == 'second') {
            areaId = firstId;
            areaGrade = 2;
        } else if (areaGradeFlag == 'third') {
            areaId = secondId;
            areaGrade = 3;
        }

        api.system.areaManage.postAreaData(areaId, areaValue, areaGrade, function (rep) {
            if (rep.result == 1) {
                layer.close(addAreaDialog);
                if (areaGradeFlag == 'first') {
                    getFirstArea();
                } else if (areaGradeFlag == 'second') {
                    getSecondArea(firstId);
                } else if (areaGradeFlag == 'third') {
                    getThirdArea(secondId);
                }
            }
        });
    }
});

