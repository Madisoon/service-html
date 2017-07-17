/**
 * Created by Msater Zg on 2017/3/15.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    //接口文件
    var api = require('../../common/api');
//函数的所有的方法
    var ALLFUNCTION = {};
    //字段变量
    var fieldTypeFunction = {};
    var fieldUpdateId = '';
    var fieldData = {
        field_title: '',
        field_type: '',
        field_hint: '',
        field_must: '',
        field_value: '',
        field_name: '',
        field_fix: '0',
    };
    $('.field-setting').hide();
    $('.field-setting .title span').unbind('click').click(function () {
        $('.field-setting').stop().slideUp();
    });
    $('.field-setting .action .cancel').unbind('click').click(function () {
        $('.field-setting').stop().slideUp();
    });

    $('.field-setting .action .post').unbind('click').click(function () {
        fieldTypeFunction.postData("", false, ALLFUNCTION.getAllField, fieldUpdateId, function (rep) {
            if (rep == 1) {
                $('.field-setting').stop().slideUp();
            }
        });
    });

    //设置为中文
    $.datetimepicker.setLocale('zh');
    ALLFUNCTION.getSingleField = function (id, fieldType) {
        api.customManage.fieldManage.getSingleField(id, function (rep) {
            if (rep.result == 0) {
                layer.msg(' 数 据 为 空', {
                    icon: 2,
                    time: 1200,
                });
            } else {
                //开始画有数据的字段控制
                if (fieldType == 'input'
                    || fieldType == 'textarea'
                    || fieldType == 'inputtime') {
                    //单值填空的表单
                    fieldData.field_type = fieldType;
                    fieldTypeFunction = new inputField(fieldData);
                } else {
                    //有值的表单
                    fieldData.field_type = fieldType;
                    fieldTypeFunction = new selectField(fieldData);
                }
                //先清空div
                $('.field-setting-context').empty();
                //绘画有值的字段添加的dom
                fieldTypeFunction.writedom("field-setting-context", rep.data, true);
            }
        });
    };


    ALLFUNCTION.getAllField = function () {
        api.customManage.fieldManage.getAllField('kind', function (rep) {
            if (rep.result == 0) {
                layer.msg(' 数 据 为 空', {
                    icon: 2,
                    time: 1200,
                });
            } else {
                var fixData = rep.data['fix'];
                var fixDataLen = rep.data['fix'].length;
                $('.pretermit-field form').empty();
                var fieldShow = new $.fieldshow.init(fixData, fixDataLen, "");
                $('.pretermit-field form').append(fieldShow.writeDom());
                var NofixData = rep.data['noFix'];
                var NofixDataLen = rep.data['noFix'].length;
                $('.extra-field form').empty();
                fieldShow = new $.fieldshow.init(NofixData, NofixDataLen, "");
                $('.extra-field form').append(fieldShow.writeDom());
                $('.datepicker-controller').datetimepicker({
                    format: 'Y-m-d',
                    timepicker: false,
                });
                $('#defined-field-html .form-horizontal .form-group').unbind('click').click(function () {
                    //画dom
                    fieldUpdateId = $(this).attr('field-id');
                    $('#defined-field-html .form-horizontal .form-group').removeClass('form-active');
                    $(this).addClass('form-active');
                    var fieldType = $(this).attr('field-type');
                    ALLFUNCTION.getSingleField($(this).attr('field-id'), fieldType);
                    $('.field-setting .title small').text($(this).attr('field-content-dialog'));
                    $('.field-setting').stop().slideDown();

                });

                $('#defined-field-html .form-horizontal .form-group .delete-field').unbind('click').click(function () {
                    var fieldId = $(this).parent().attr('field-id');
                    var this_ = this;
                    api.customManage.fieldManage.deleteField(fieldId, function (rep) {
                        $('.field-setting').stop().slideUp();
                        $(this_).parent().remove();
                    });
                });
            }
        });
    };
    ALLFUNCTION.getAllField();
    /*        fieldType.postData('input', function () {

     });*/
    $('.assembly-group button').unbind('click').click(function () {
        //去掉所有的被选中
        $('#defined-field-html .form-horizontal .form-group').removeClass('form-active');
        fieldUpdateId = '';
        var field_type = $(this).attr('field-type');
        fieldData.field_type = field_type;
        if (field_type == 'input'
            || field_type == 'inputtime'
            || field_type == 'textarea') {
            fieldTypeFunction = new inputField(fieldData);
        } else {
            fieldTypeFunction = new selectField(fieldData);
        }
        $('.field-setting-context').empty();
        /*添加数据的dom操作->false*/
        fieldTypeFunction.writedom("field-setting-context", "", false);
        $('.field-setting .title small').text($(this).attr('field-context'));
        $('.field-setting').stop().slideDown();
    });
});