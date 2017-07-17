/**
 * Created by Master  Zg on 2016/11/21.
 */
(function ($, window) {
    $.fieldshow = {
        init: function (fixData, fixDataLen, customData) {
            var url = "";

            /**
             * 根据选择获取到多个变量的值（如checkBox,下拉多选）
             * @param classOrId
             * @returns {string}
             */
            function getCheckBox(classOrId) {
                var checkBoxValue = [];
                $(classOrId).each(function () {
                    checkBoxValue.push($(this).val());
                });
                return checkBoxValue.join(',');
            }

            this.writeDom = function () {

                var dom = [];
                for (var i = 0; i < fixDataLen; i++) {
                    var fixXqData = fixData[i];
                    var fixXqDataLen = fixData[i].length;
                    if (fixXqData[0].field_type == "input") {
                        //单文斌
                        console.log(fixXqData[0].field_type);
                        dom.push('<div class="form-group" field-content-dialog = "单行文本" field-id="' + fixXqData[0].id + '" field-type="' + fixXqData[0].field_type + '">');
                        dom.push('<span class="glyphicon glyphicon-remove span-white span-icon-cursor delete-field" style="display:none"></span>');
                        dom.push('<label class="col-sm-2 control-label">' + fixXqData[0].field_title + ':</label>');
                        dom.push('<div class="col-sm-10">');
                        dom.push('<input type="text" class="form-control ' + fixXqData[0].field_name + ' " placeholder="' + fixXqData[0].field_hint + '">');
                        dom.push('</div>');
                        dom.push('</div>');
                    } else if (fixXqData[0].field_type == "inputtime") {
                        dom.push('<div class="form-group" field-content-dialog = "时间控件" field-id="' + fixXqData[0].id + '" field-type="' + fixXqData[0].field_type + '">');
                        dom.push('<span class="glyphicon glyphicon-remove span-white span-icon-cursor delete-field" style="display:none"></span>');
                        dom.push('<label class="col-sm-2 control-label">' + fixXqData[0].field_title + ':</label>');
                        dom.push('<div class="col-sm-10">');
                        dom.push('<input type="text" class="form-control datepicker-controller ' + fixXqData[0].field_name + '" placeholder="' + fixXqData[0].field_hint + '">');
                        dom.push('</div>');
                        dom.push('</div>');
                        //时间输入框
                    } else if (fixXqData[0].field_type == "textarea") {
                        //多文本输入框
                        dom.push('<div class="form-group" field-content-dialog = "多行文本" field-id="' + fixXqData[0].id + '" field-type="' + fixXqData[0].field_type + '">');
                        dom.push('<span class="glyphicon glyphicon-remove span-white span-icon-cursor delete-field" style="display:none"></span>');
                        dom.push(' <label class="col-sm-2 control-label">' + fixXqData[0].field_title + ':</label>');
                        dom.push('<div class="col-sm-10">');
                        dom.push('<textarea class="form-control ' + fixXqData[0].field_name + '" rows="3" placeholder="' + fixXqData[0].field_hint + '"></textarea>');
                        dom.push('</div>');
                        dom.push('</div>');

                    } else if (fixXqData[0].field_type == "checkbox") {
                        dom.push(' <div class="form-group" field-content-dialog = "多选按钮" field-id="' + fixXqData[0].id + '" field-type="' + fixXqData[0].field_type + '">');
                        dom.push('<span class="glyphicon glyphicon-remove span-white span-icon-cursor delete-field" style="display:none"></span>');
                        dom.push('<label class="col-sm-2 control-label">' + fixXqData[0].field_title + ':</label>');
                        dom.push('<div class="col-sm-10">');
                        for (var j = 0; j < fixXqDataLen; j++) {
                            dom.push('<label class="checkbox-inline">');
                            dom.push(' <input type="checkbox" name="inlineRadioOptions" class="' + fixXqData[0].field_name + '" value="' + fixXqData[j].custom_value + '">' + fixXqData[j].custom_value + '');
                            dom.push('</label>');
                        }
                        dom.push('</div></div>');

                    } else if (fixXqData[0].field_type == "radiobox") {
                        dom.push(' <div class="form-group" field-content-dialog = "单选按钮" field-id="' + fixXqData[0].id + '" field-type="' + fixXqData[0].field_type + '">');
                        dom.push('<span class="glyphicon glyphicon-remove span-white span-icon-cursor delete-field" style="display:none"></span>');
                        dom.push('<label class="col-sm-2 control-label">' + fixXqData[0].field_title + ':</label>');
                        dom.push('<div class="col-sm-10">');
                        for (var j = 0; j < fixXqDataLen; j++) {
                            dom.push('<label class="radio-inline">');
                            dom.push(' <input type="radio" name="inlineRadioOptions" class="' + fixXqData[0].field_name + '" value="' + fixXqData[j].custom_value + '">' + fixXqData[j].custom_value + '');
                            dom.push('</label>');
                        }
                        dom.push('</div></div>');
                    } else if (fixXqData[0].field_type == "select") {
                        dom.push(' <div class="form-group" field-content-dialog = "下拉控件" field-id="' + fixXqData[0].id + '" field-type="' + fixXqData[0].field_type + '">');
                        dom.push('<span class="glyphicon glyphicon-remove span-white span-icon-cursor delete-field" style="display:none"></span>');
                        dom.push('<label class="col-sm-2 control-label">' + fixXqData[0].field_title + ':</label>');
                        dom.push('<div class="col-sm-10">');
                        dom.push('<select class="form-control  ' + fixXqData[0].field_name + '">');
                        for (var j = 0; j < fixXqDataLen; j++) {
                            dom.push('<option value="' + fixXqData[j].custom_value + '">' + fixXqData[j].custom_value + '</option>');

                        }
                        dom.push('</select>');
                        dom.push('</div></div>');
                    }
                }
                return dom.join('');
            };

            //画选择框函数
            this.writeChoiceDom = function () {

                var dom = [];
                for (var i = 0; i < fixDataLen; i++) {
                    var fixXqData = fixData[i];
                    var fixXqDataLen = fixData[i].length;
                    if (fixXqData[0].field_type == "input") {
                        //单文斌
                        dom.push('<div class="form-group">');
                        dom.push('<input type="text" class="form-control choice' + fixXqData[0].field_name + ' " placeholder="' + fixXqData[0].field_hint + '">');
                        dom.push('</div>');
                    } else if (fixXqData[0].field_type == "inputtime") {
                        dom.push('<div class="form-group">');
                        dom.push('<input type="text" class="form-control datepicker-controller choice' + fixXqData[0].field_name + '" placeholder="' + fixXqData[0].field_hint + '">');
                        dom.push('</div>');
                        //时间输入框
                    } else if (fixXqData[0].field_type == "textarea") {
                        //多文本输入框
                        dom.push('<div class="form-group">');
                        dom.push('<input type="text" class="form-control choice' + fixXqData[0].field_name + ' " placeholder="' + fixXqData[0].field_hint + '">');
                        dom.push('</div>');

                    } else {
                        dom.push(' <div class="form-group">');
                        dom.push('<select class="form-control  choice' + fixXqData[0].field_name + '">');
                        dom.push('<option value="">请选择</option>');
                        for (var j = 0; j < fixXqDataLen; j++) {
                            dom.push('<option value="' + fixXqData[j].custom_value + '">' + fixXqData[j].custom_value + '</option>');

                        }
                        dom.push('</select>');
                        dom.push('</div>');
                    }
                }
                return dom.join('');
            };

            this.postCustomData = function (customId, areaFieldShow, customPurview, customerInfo, callback) {
                var getFormValue = function () {
                    var formValue = {};
                    for (var i = 0; i < fixDataLen; i++) {
                        if (fixData[i][0].field_type == "checkbox") {
                            var classId = '.' + fixData[i][0].field_name + ':checked';
                            formValue[fixData[i][0].field_name] = getCheckBox(classId)
                        } else if (fixData[i][0].field_type == "radiobox") {
                            var classId = '.' + fixData[i][0].field_name + ':checked';
                            formValue[fixData[i][0].field_name] = $(classId).val();
                        } else {
                            formValue[fixData[i][0].field_name] = $('.' + fixData[i][0].field_name + '').val();
                        }
                    }
                    formValue = $.extend(true, formValue, areaFieldShow);
                    formValue = $.extend(true, formValue, customPurview);
                    return formValue;
                };
                $.ajax({
                    url: 'http://118.178.237.219:8080/yuqingmanage/manage/postCustomData',
                    /* url: 'http://127.0.0.1:8080/manage/postCustomData',*/
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        customData: JSON.stringify(getFormValue()),
                        customId: customId,
                        customInfo: customerInfo
                    },
                    success: function (rep) {
                        if (rep.result == 1) {
                            layer.msg(' 添 加 成 功', {
                                icon: 1,
                                time: 1200,
                            });
                        } else {
                            layer.msg(' 添 加 失 败', {
                                icon: 2,
                                time: 1200,
                            });
                        }
                    },
                    error: function (rep) {
                        alert("方法异常");
                    }
                });

                if (callback != null) {
                    callback(1);
                } else {
                    return;
                }
            }
        }

    };
})($, window);
