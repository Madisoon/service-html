/**
 * Created by Master  Zg on 2016/11/16.
 */
/**
 * 寄生组合继承(解决组合继承的两次调用的问题)
 */

// 封装object对象创建的过程
function object(o) {
    function F() {
    }

    F.prototype = o;
    return new F();
}

// 实现继承
function inheritPrototype(child, parent) {
    // f为临时的一个对象
    // parent:父类
    // child：子类
    var f = object(parent.prototype);
    f.constructor = child;
    child.prototype = f;
}

// 题目对象共有属性和方法（父类）
function allField(config_) {
    //字段公用的属性和方法
    this.config = {
        field_title: config_.field_title,
        field_type: config_.field_type,
        field_hint: config_.field_hint,
        field_must: config_.field_must,
        field_value: config_.field_value,
        field_name: config_.field_name,
        field_fix: config_.field_fix
    };
}
// 所有的题目类型发送数据的方法
allField.prototype = {
    postData: function (data, flag, getAllData, fieldId, callback) {
        var callBack;
        // 继承的json数据，最后发送的数据
        /*
         * config= { detail_content: '',//题干 detail_type: '',//题目类型
         * detail_items: '', detail_scroe: '',//得分 detail_level: '',//等级
         * detail_parent: '',//父级 detail_status: '',//状态 }
         */
        var config_ = this.config;
        //后一个参数为主
        var configData = {};

        if (config_.field_type == 'input' || config_.field_type == 'textarea' || config_.field_type == 'inputtime') {
            configData = $.extend({}, config_, inputFieldData());
        } else {
            configData = $.extend({}, config_, selectFieldData());
        }
        /*console.log(configData);*/
        if (configData.field_title == ''
            || configData.field_must == '') {
            layer.msg('请 先 填 写 完 整');
            callBack = 0;
        } else {
            callBack = 1;
            postFieldData(configData);
        }
        function postFieldData(configData) {
            $.ajax({
                /* url: "http://127.0.0.1:8080/manage/postFieldData",*/
                url: "http://118.178.237.219:8080/yuqingmanage/manage/postFieldData",
                type: 'POST',
                dataType: 'JSON',
                data: {
                    configData: JSON.stringify(configData),
                    id: fieldId
                },
                success: function (rep) {

                    if (rep.result == 1) {
                        getAllData();
                        if (fieldId === '') {
                            layer.msg(' 添 加 成 功', {
                                icon: 1,
                                time: 1200
                            });
                        } else {
                            layer.msg(' 修 改 成 功', {
                                icon: 1,
                                time: 1200
                            });
                        }
                    } else {
                        if (fieldId === '') {
                            layer.msg(' 添 加 失 败', {
                                icon: 2,
                                time: 1200
                            });
                        } else {
                            layer.msg(' 修 改 失 败', {
                                icon: 2,
                                time: 1200
                            });
                        }

                    }
                },
                error: function (rep) {
                    alert("方法异常");
                }
            });
        }

        // 发送选择题数据(完成数据抓取)
        function inputFieldData() {
            var data = {
                field_title: '',
                field_hint: '',
                field_must: ''
            }
            data.field_title = $('form .field-title').val();
            data.field_hint = $('form .field-hint').val();
            if ($('form .field-must').prop("checked")) {
                data.field_must = "1";
            } else {
                data.field_must = "0";
            }
            return data;
        }

        function selectFieldData() {
            var data = {
                field_title: '',
                field_must: '',
                field_value: ''
            }
            data.field_title = $('form .field-title').val();
            var dataValue = [];
            $('form .field-value .field-value-input').each(function () {
                dataValue.push($(this).val());
            });
            data.field_value = dataValue.join('@');
            if ($('form .field-must').prop("checked")) {
                data.field_must = "1";
            } else {
                data.field_must = "0";
            }
            return data;
        }

        // 函数回调
        if (callback != null) {
            callback(callBack);
        }
    },
}

function inputField(config) {
    allField.call(this, config);
    var this_ = this;
    // 将dom绘制到指定的id上
    this.writedom = function (id, data, dataflag) {
        // dataflag 判断是创建这种类型的题目还是展示这种类型的题目
        var dom = [];
        dom.push('<form role="form">');
        dom.push('<div class="form-group">');
        dom.push('<label>字段标题 :</label>');
        dom.push('<input type="text" class="form-control field-title"  placeholder="字段标题">');
        dom.push('</div>');
        dom.push('<div class="form-group">');
        dom.push('<label>提示文字 :</label>');
        dom.push('<input type="text" class="form-control field-hint" placeholder="提示文字">');
        dom.push('</div>');
        dom.push('<div class="checkbox">');
        dom.push(' <div class="label">是否必填</div>');
        dom.push('<label>');
        dom.push('<input type="checkbox" class=" field-must"> 是');
        dom.push('</label>');
        dom.push('</div>');
        dom.push('</form>');
        $('.' + id).append(dom.join(''));
        //如果有数据传过来就需要执行这个js
        if (dataflag) {
            chooseJs();
        }
        function chooseJs() {
            $('.form-control.field-title').val(data[0].field_title);
            $('.form-control.field-hint').val(data[0].field_hint);
            if (data[0].field_must == 1) {
                $('.checkbox .field-must').prop('checked', true);
            }
            if (data[0].field_fix == 1) {
                $('.form-control.field-title').prop('disabled', true);
                $('.form-control.field-hint').prop('disabled', true);
                $('.checkbox .field-must').prop('disabled', true);
            }
        }

    }
}

function selectField(config) {
    allField.call(this, config);
    // 将dom绘制到指定的id上
    this.writedom = function (id, data, dataflag) {
        // dataflag 判断是创建这种类型的题目还是展示这种类型的题目
        var dom = [];
        dom.push('<form role="form">');
        dom.push('<div class="form-group"><label>字段标题 :</label><input type="text" class="form-control field-title" placeholder="字段标题">');
        dom.push('</div>');
        dom.push('<div class="form-group fi">');
        dom.push('<label>选项设置 :</label>');
        dom.push('<div class="field-value">');
        dom.push('<input type="text" class="form-control field-value-input" placeholder="选项值" value="选项一">');
        dom.push('<span class="glyphicon glyphicon-plus bordered span-icon-cursor span-blue add"></span>');
        dom.push('</div>');
        dom.push('<div class="field-value">');
        dom.push('<input type="text" class="form-control field-value-input" placeholder="选项值" value="选项二">');
        dom.push('<span class="glyphicon glyphicon-minus bordered span-icon-cursor span-red remove"></span>');
        dom.push('</div>');
        dom.push('<div class="field-value">');
        dom.push('<input type="text" class="form-control field-value-input" placeholder="选项值" value="选项三">');
        dom.push('<span class="glyphicon glyphicon-minus bordered span-icon-cursor span-red remove"></span>');
        dom.push('</div>');
        dom.push('</div>');
        dom.push('<div style="clear: both"></div>');
        dom.push('<div class="checkbox">');
        dom.push('<div class="label">是否必填</div>');
        dom.push('<label><input type="checkbox" class="field-must"> 是</label></div>');
        dom.push('</form>');
        $('.' + id).append(dom.join(''));
        zxJs();
        function zxJs() {
            if (dataflag) {
                $('.form-group.fi').empty();
                $('.form-control.field-title').val(data[0].field_title);
                if (data[0].field_must == 1) {
                    $('.checkbox .field-must').prop('checked', true);
                }
                var updateDom = [];
                updateDom.push('<label>选项设置 :</label>');
                var dataLen = data.length;
                for (var i = 0; i < dataLen; i++) {
                    if (i == 0) {
                        updateDom.push('<div class="field-value">');
                        updateDom.push('<input type="text" class="form-control field-value-input" placeholder="选项值" value="' + data[i].custom_value + '">');
                        updateDom.push('<span class="glyphicon glyphicon-plus bordered span-icon-cursor span-blue add"></span>');
                        updateDom.push('</div>');
                    } else {
                        updateDom.push('<div class="field-value">');
                        updateDom.push('<input type="text" class="form-control field-value-input" placeholder="选项值" value="' + data[i].custom_value + '">');
                        updateDom.push('<span class="glyphicon glyphicon-minus bordered span-icon-cursor span-red remove"></span>');
                        updateDom.push('</div>');
                    }
                }
                $('.form-group.fi').append(updateDom.join(''));
                if (data[0].field_fix == 1) {
                    $('.form-control.field-title').prop('disabled', true);
                    $('.form-control.field-value-input').prop('disabled', true);
                    $('.checkbox .field-must').prop('disabled', true);
                } else {
                    $('form span.add').unbind('click').click(function () {
                        var addDom = [];
                        addDom.push('<div class="field-value">');
                        addDom.push('<input type="text" class="form-control field-value-input" placeholder="选项值" value="新增选项">');
                        addDom.push('<span class="glyphicon glyphicon-minus bordered span-icon-cursor span-red remove"></span>');
                        addDom.push('</div>');
                        $(this).parent().after(addDom.join(''));
                        $('form span.remove').unbind('click').click(function () {
                            $(this).parent().remove();
                        });
                    });
                }
            }

            $('form span.add').unbind('click').click(function () {
                var addDom = [];
                addDom.push('<div class="field-value">');
                addDom.push('<input type="text" class="form-control field-value-input" placeholder="选项值" value="新增选项">');
                addDom.push('<span class="glyphicon glyphicon-minus bordered span-icon-cursor span-red remove"></span>');
                addDom.push('</div>');
                $(this).parent().after(addDom.join(''));
                $('form span.remove').unbind('click').click(function () {
                    $(this).parent().remove();
                });
            });
        }

        $('form span.remove').unbind('click').click(function () {
            $(this).parent().remove();
        });
    }
}


inheritPrototype(selectField, allField); // 通过这里实现继承
inheritPrototype(inputField, allField); // 通过这里实现继承

