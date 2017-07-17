/**
 * Created by Master  Zg on 2016/12/1.
 */
/**
 * Created by Master  Zg on 2016/11/21.
 */
(function ($, window) {
    $.areaFieldShow = {
        init: function (config) {
            var config_ = {
                id: '',
                areaProvince: '',
                areaCity: '',
                areaCounty: '',
                fieldStyle: ''//判断水平方向的三级地区选择还是竖着方向的三级地区选择
            };
            config_ = $.extend({}, config_, config);
            this.writeAreaFieldDom = function () {
                getAreaField();
            };
            //获取一级菜单
            function getAreaField() {
                $.ajax({
                    url: 'http://118.178.237.219:8080/yuqingmanage/manage/getTypeArea',
                    /*url: 'http://127.0.0.1:8080/manage/getTypeArea',*/
                    type: 'post',
                    dataType: 'JSON',
                    data: {
                        areaId: ''
                    },
                    success: function (rep) {
                        //获取到的字段的名字
                        var firstField = rep.data;
                        var firstFieldLen = rep.data.length;
                        var dom = [];
                        if (rep.result == 1) {
                            if (config_.fieldStyle == 'horizontal') {
                                dom.push('<form class="form-inline" role="form">');
                                dom.push('<select class="form-control area choiceuser_province" id="first-area">');
                                dom.push('<option value="" selected="selected">请选择</option>');
                                for (var i = 0; i < firstFieldLen; i++) {
                                    dom.push('<option class="remove-option"  areaId="' + firstField[i].id + '"  value="' + firstField[i].area_name + '">' + firstField[i].area_name + '</option>');
                                }
                                dom.push('</select>');
                                dom.push('<select class="form-control area choiceuser_city" id="second-area">');
                                dom.push('<option value="" selected="selected">请选择</option>');
                                dom.push('</select>');
                                dom.push('<select class="form-control area choiceuser_country" id="third-area">');
                                dom.push('<option value="" selected="selected">请选择</option>');
                                dom.push('</select>');
                                dom.push(' </form>');
                                $('.' + config_.id + '').empty();
                                $('.' + config_.id + '').append(dom.join(''));
                                $('#first-area').change(function () {
                                    var areaId = $('#first-area>option:selected').attr('areaId');
                                    if ($('#first-area').val() != '') {
                                        getSecondArea(areaId, 'horizontal', '');
                                    } else {
                                        $('#third-area .remove-option').remove();
                                        $('#second-area .remove-option').remove();
                                    }
                                });
                            } else {
                                dom.push('<div class="form-group"><label class="col-sm-2 control-label">用户省:</label>');
                                dom.push('<div class="col-sm-10">');
                                dom.push('<select class="form-control user_province" id="first-area-update">');
                                dom.push('<option value=""  selected="selected">请选择</option>');
                                for (var i = 0; i < firstFieldLen; i++) {
                                    dom.push('<option class="remove-option"  areaId="' + firstField[i].id + '"  value="' + firstField[i].area_name + '">' + firstField[i].area_name + '</option>');
                                }
                                dom.push('</select>');
                                dom.push('</div>');
                                dom.push('</div>');
                                dom.push(' <div class="form-group"><label class="col-sm-2 control-label">用户市:</label>');
                                dom.push('<div class="col-sm-10">');
                                dom.push('<select class="form-control user_city" id="second-area-update">');
                                dom.push('<option value=""  selected="selected">请选择</option>');
                                dom.push('</select>');
                                dom.push('</div>');
                                dom.push('</div>');
                                dom.push('<div class="form-group"><label class="col-sm-2 control-label">用户区县:</label>');
                                dom.push('<div class="col-sm-10">');
                                dom.push('<select class="form-control user_country" id="third-area-update">');
                                dom.push('<option value=""  selected="selected">请选择</option>');
                                dom.push('</select>');
                                dom.push('</div>');
                                dom.push('</div>');
                                $('#' + config_.id + '').append(dom.join(''));
                                $('#first-area-update').change(function () {
                                    var areaId = $('#first-area-update>option:selected').attr('areaId');
                                    //先把之前的数据全部都清空
                                    $('#third-area-update .remove-option').remove();
                                    $('#second-area-update .remove-option').remove();
                                    if ($('#first-area-update').val() != '') {
                                        var data = {
                                            user_city: ''
                                        };
                                        getSecondArea(areaId, 'vertical', data);
                                    } else {
                                        $('#third-area-update .remove-option').remove();
                                        $('#second-area-update .remove-option').remove();
                                    }
                                });
                            }
                        } else {

                        }
                    },
                    error: function (rep) {
                        console.log(rep);
                        layer.msg(' 方 法 异 常 first！');
                    }
                });
            }

            function getSecondArea(areaId, type, areaValue) {
                $.ajax({
                    url: 'http://118.178.237.219:8080/yuqingmanage/manage/getTypeArea',
                    /*url: 'http://127.0.0.1:8080/manage/getTypeArea',*/
                    type: 'post',
                    dataType: 'json',
                    data: {
                        areaId: areaId
                    },
                    success: function (rep) {
                        console.log(rep);
                        if (rep.result == 1) {
                            var firstField = rep.data;
                            var firstFieldLen = rep.data.length;
                            var dom = [];
                            for (var i = 0; i < firstFieldLen; i++) {
                                dom.push('<option class="remove-option"  areaId="' + firstField[i].id + '"  value="' + firstField[i].area_name + '">' + firstField[i].area_name + '</option>');
                            }
                            if (type == 'horizontal') {
                                $('#second-area .remove-option').remove();
                                $('#second-area').append(dom.join(''));
                                $('#second-area').change(function () {
                                    var areaId = $('#second-area>option:selected').attr('areaId');
                                    if ($('#second-area').val() != '') {
                                        getThirdArea(areaId, 'horizontal', '');
                                    } else {
                                        $('#third-area .remove-option').empty();
                                    }

                                });
                            } else {
                                $('#second-area-update .remove-option').remove();
                                $('#second-area-update').append(dom.join(''));
                                $('#second-area-update').change(function () {
                                    var areaId = $('#second-area-update>option:selected').attr('areaId');
                                    if ($('#second-area-update').val() != '') {
                                        getThirdArea(areaId, 'vertical', '');
                                    } else {
                                        $('#third-area-update .remove-option').remove();
                                    }

                                });
                                if (areaValue.user_city != '') {
                                    $('#second-area-update').val(areaValue.user_city);
                                    var areaId = $('#second-area-update > option:selected').attr('areaId');
                                    getThirdArea(areaId, 'vertical', areaValue.user_country);
                                }
                            }
                        } else {
                            $('#third-area-update .remove-option').remove();
                            $('#second-area-update .remove-option').remove();
                            $('#third-area .remove-option').remove();
                            $('#second-area .remove-option').remove();
                        }
                    },
                    error: function (rep) {
                        layer.msg(' 方 法 异 常 second！');
                    }
                });
            }

            function getThirdArea(areaId, type, areaValue) {
                $.ajax({
                    url: 'http://118.178.237.219:8080/yuqingmanage/manage/getTypeArea',
                    /*url: 'http://127.0.0.1:8080/manage/getTypeArea',*/
                    type: 'post',
                    dataType: 'json',
                    data: {
                        areaId: areaId
                    },
                    success: function (rep) {
                        if (rep.result == 1) {
                            var firstField = rep.data;
                            var firstFieldLen = rep.data.length;
                            var dom = [];
                            for (var i = 0; i < firstFieldLen; i++) {
                                dom.push('<option class="remove-option"  areaId="' + firstField[i].id + '"  value="' + firstField[i].area_name + '">' + firstField[i].area_name + '</option>');
                            }
                            if (type == 'horizontal') {
                                $('#third-area .remove-option').remove();
                                $('#third-area').append(dom.join(''));
                            } else {
                                $('#third-area-update .remove-option').remove();
                                $('#third-area-update').append(dom.join(''));
                                if (areaValue != '') {
                                    $('#third-area-update').val(areaValue);
                                }
                            }

                        } else {
                            $('#third-area-update .remove-option').remove();
                            $('#third-area .remove-option').remove();
                        }
                    },
                    error: function (rep) {
                        layer.msg(' 方 法 异 常 third！');
                    }
                });
            }

            /**
             * 加地区的默认字段
             * @param userAreaData
             */
            this.assignmentSelect = function (userAreaData) {
                var userAreaData_ = {
                    user_province: '',
                    user_city: '',
                    user_country: ''
                };
                userAreaData_ = $.extend({}, userAreaData_, userAreaData);
                $('#first-area-update').val(userAreaData_.user_province);
                var areaId = $('#first-area-update > option:selected').attr('areaId');
                getSecondArea(areaId, 'vertical', userAreaData_);
            };

            //获取属性新建或者是修改的地区的值
            this.getAreaFieldValue = function () {
                var fieldValue = {
                    user_province: '',
                    user_city: '',
                    user_country: ''
                };
                fieldValue.user_province = $('#first-area-update').val();
                fieldValue.user_city = $('#second-area-update').val();
                fieldValue.user_country = $('#third-area-update').val();
                return fieldValue;
            }
        }

    };
})($, window);
