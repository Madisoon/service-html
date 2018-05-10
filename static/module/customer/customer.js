/**
 * Created by Msater Zg on 2017/1/9.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    var api = require('../../common/api');
    var sysTem = window.parent.SYSTEM;
    var areaId = '';
    var areaIds = [];
    var addType = '';
    var operationType;
    var serveCustomerId;
    var addCustomerDialog;
    var addRemarkDialog;
    var addSchemeDialog;
    var serveCustomerSearch = {};
    $.datetimepicker.setLocale('zh');
    //时间组件的初始化
    $('.start-time').datetimepicker({
        format: 'Y-m-d',
        onShow: function (ct) {
            this.setOptions({
                maxDate: $('.end-time').val() ? $('.end-time').val() : false
            })
        },
        timepicker: false
    });
    $('.end-time').datetimepicker({
        format: 'Y-m-d',
        onShow: function (ct) {
            this.setOptions({
                minDate: $('.start-time').val() ? $('.start-time').val() : false
            })
        },
        timepicker: false
    });

    $('.customer-status input').unbind('click').click(function () {
        if ($('.customer-status input[name=customer-status]:checked').val() == '0') {
            $('.plan-time-interval').stop().fadeOut();
        } else {
            $('.plan-time-interval').stop().fadeIn();
        }
    });

    $('.span-icon-cursor.add').unbind('click').click(function () {
        addType = $(this).attr('addType');
        addRemarkDialog = layer.open({
            title: '添加发送信息',
            type: 1,
            area: ['33%', '45%'], //宽高
            content: $('#add-remark-info')
        });
    });

    $('#cancel-remark-btn').unbind('click').click(function () {
        layer.close(addRemarkDialog);
    });

    $('.glyphicon-remove.info').unbind('click').click(function () {
        $(this).parent().remove();
    });
    $('#export-data').unbind('click').click(function () {
        api.movement.severCustomer.exportCustomerData(areaIds.join(','), JSON.stringify(getSearchData()), $(this).attr("exportType"), function (rep) {
            console.log(rep);
            if (rep.result == 1) {
                window.open('http://118.178.237.219:8080/dummyPath/' + rep.url);
            }
            else {
                layer.msg('无可导出的数据!', {
                    time: 1500
                });
            }
        });
    });

    $('#post-remark-btn').unbind('click').click(function () {
        var dom = [];
        var numberInfo = $('.number-info').val();
        var remarkInfo = $('.remark-info').val();
        dom.push('<li class="list-group-item">');
        dom.push('<span class="word" word-number="' + numberInfo + '" word-remark="' + remarkInfo + '">' + numberInfo + '--' + remarkInfo + '</span>');
        dom.push('<span class="glyphicon glyphicon-remove span-icon-cursor info"></span>');
        dom.push('</li>');
        layer.close(addRemarkDialog);
        if (addType === 'qq') {
            $('.list-group.qq').append(dom.join(''));
        } else if (addType === 'qqGroup') {
            $('.list-group.qq-group').append(dom.join(''));
        } else if (addType === 'weixin') {
            $('.list-group.weixin').append(dom.join(''));
        } else if (addType === 'weixinGroup') {
            $('.list-group.weixin-group').append(dom.join(''));
        } else {
            $('.list-group.number').append(dom.join(''));
        }
        $('.number-info').val("");
        $('.remark-info').val("");
        $('.glyphicon-remove.info').unbind('click').click(function () {
            $(this).parent().remove();
        });
    });

    $('.add-scheme').unbind('click').click(function () {
        addSchemeDialog = layer.open({
            title: '添加发送信息',
            type: 1,
            area: ['52%', '95%'], //宽高
            content: $('#scheme-choose-dialog')
        });
    });

    $('#delete-customer-btn').unbind('click').click(function () {
        var dataServe = $('#customer-info').bootstrapTable('getSelections', null);
        var dataServeLen = dataServe.length;
        var dataId = [];
        if (dataServeLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (var i = 0; i < dataServeLen; i++) {
                dataId.push(dataServe[i].id);
            }
            api.movement.severCustomer.deleteServeCustomer(dataId.join(','), function (rep) {
                if (rep.result) {
                    tableStart();
                    layer.msg(' 删 除 成 功 ！', {
                        icon: 1,
                        time: 1200,
                    });
                } else {
                    layer.msg(' 删 除 失 败 ！', {
                        icon: 2,
                        time: 1200,
                    });
                }
            });
        }
    });

    $('#sure-choose-scheme').unbind('click').click(function () {

        serveCustomerSearch = getSearchData();
        tableStart();
    });

    function getSearchData() {
        var serveCustomer = {};
        var getNumber = $('.form-control.customer-get-number').val();
        var serveName = $('.form-control.customer-name').val();
        var serveStatus = $('#customer-status').val();
        var serveScheme = $('.form-control.customer-post-scheme').val();
        var serveCreate = $('.form-control.customer-create').val();
        if (getNumber !== "") {
            serveCustomer.get_number = getNumber;
        }

        if (serveName !== "") {
            serveCustomer.customer_name = serveName;
        }

        if (serveStatus !== "") {
            serveCustomer.customer_status = serveStatus;
        }

        if (serveScheme !== "") {
            serveCustomer.customer_scheme = serveScheme;
        }

        if (serveCreate !== "") {
            serveCustomer.customer_creater = serveCreate;
        }
        return serveCustomer;
    }

    api.movement.configureManage.getAllQq(function (rep) {
        var qqData = rep.data;
        var qqDataLen = rep.data.length;
        var dom = [];
        for (var i = 0; i < qqDataLen; i++) {
            dom.push('<option value="' + qqData[i].id + '">' + qqData[i].qq_number + '--' + qqData[i].qq_name + '</option>');
        }
        $('#choose-qq').append(dom.join(','));
    });


    // 树的初始化设置
    var setting = {
        callback: {
            onClick: onClickCallBack
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "area_parent",
                rootPId: 0
            }
        }
    };
    // 联动性参数设置
    var zNodes = null;
    api.system.areaManage.getAllArea(function (rep) {
        zNodes = rep.data;
        areaId = rep.data[0].id;
        $.fn.zTree.init($("#area-tree"), setting, zNodes);
        var zTree = $.fn.zTree.getZTreeObj("area-tree");//获取ztree对象
        var node = zTree.getNodeByParam('id', rep.data[0].id);//获取id为1的点
        zTree.selectNode(node);//选择点
        zTree.setting.callback.onClick(null, zTree.setting.treeId, node);//调用事件
    });

    function onClickCallBack(event, treeId, treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj("area-tree");
        var nodes = treeObj.transformToArray(treeNode);
        areaId = treeNode.id;
        var nodesLen = nodes.length;
        var idS = [];
        for (var i = 0; i < nodesLen; i++) {
            idS.push(nodes[i].id);
        }
        areaIds = idS;
        tableStart();
    };


    // 树的初始化设置
    var settingScheme = {
        callback: {
            onClick: onClickCallBackScheme
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "area_parent",
                rootPId: 0
            }
        }
    };
    // 联动性参数设置
    var zNodesScheme = null;
    api.system.areaManage.getAllArea(function (rep) {
        zNodesScheme = rep.data;
        $.fn.zTree.init($("#scheme-area-tree"), settingScheme, zNodesScheme);
    });

    function onClickCallBackScheme(event, treeId, treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj("area-tree");
        var nodes = treeObj.transformToArray(treeNode);
        var nodesLen = nodes.length;
        var idS = [];
        for (var i = 0; i < nodesLen; i++) {
            idS.push(nodes[i].id);
        }
        api.movement.schemeManage.getAllSchemeById(idS.join(','), function (rep) {
            var schemeAll = rep.data;
            var schemeAllLen = rep.total;
            var schemeDom = [];
            for (var i = 0; i < schemeAllLen; i++) {
                schemeDom.push('<label class="radio-inline">');
                schemeDom.push('<input type="radio" name="schemeOptions" schemeName="' + schemeAll[i].scheme_name + '"  value="' + schemeAll[i].id + '" checked>');
                schemeDom.push('' + schemeAll[i].scheme_name + '');
                schemeDom.push('</label>');
            }
            $('#search-scheme-name').val("");
            $('.scheme-info').empty();
            $('.scheme-info').append(schemeDom.join(''));
        });
    };


    $('#search-show-btn').unbind('click').click(function () {
        $('.customer-search').stop().slideToggle();
    });

    $('#add-customer-btn').unbind('click').click(function () {
        getSetFormValue(null, true);
        $('#post-customer-btn').prop('disabled', false);
        operationType = true;
        addCustomerDialog = layer.open({
            title: ' 新增客户(创建人：' + sysTem.user.user_name + ')',
            type: 1,
            area: ['52%', '95%'], //宽高
            content: $('#add-customer')
        });
    });

    $('#cancel-scheme-btn').unbind('click').click(function () {
        layer.close(addSchemeDialog);
    });

    $('#post-scheme-btn').unbind('click').click(function () {
        layer.close(addSchemeDialog);
        var schemeId = $('input[name=schemeOptions]:checked').val();
        var schemeName = $('input[name=schemeOptions]:checked').attr("schemeName");
        $('.panel-body.scheme-name').text(schemeName);
        $('.panel-body.scheme-name').attr('scheme-id', schemeId);
    });

    $('#cancel-customer-btn').unbind('click').click(function () {
        layer.close(addCustomerDialog);
    });

    $('.search-scheme').unbind('click').click(function () {
        var schemeName = $('#search-scheme-name').val();
        if (schemeName == '') {
            $('.radio-inline').show();
        } else {
            $('.radio-inline').hide();
            $('.radio-inline input[schemeName*=' + schemeName + ']').parent().show();
        }
    });

    $('#post-customer-btn').unbind('click').click(function () {
        var qqData = $('#choose-qq').val();
        var schemeCustomer = {
            customer_name: $('#customer-name').val(),
            customer_start_time: $('.form-control.start-time').val(),
            customer_end_time: $('.form-control.end-time').val(),
            customer_status: $('input[name=customer-status]:checked').val(),
            customer_priority: $('.customer-grade-value:checked').val(),
            email_status: $('.email-post-status:checked').val(),
            email_number: $('#email-number').val(),
            customer_scheme: $('.panel-body.scheme-name').attr("scheme-id"),
            customer_creater: sysTem.user.user_loginname,
            customer_post_qq: $('#choose-qq').val(),
            customer_post_weixin: $('#choose-weixin').val()
        };
        var getAllData = [];
        $('.list-group.qq .word').each(function () {
            var getData = {
                get_number: '',
                get_remark: '',
                get_type: 'qq'
            };
            getData.get_number = $(this).attr('word-number');
            getData.get_remark = $(this).attr('word-remark');
            getAllData.push(getData);
        });
        $('.list-group.qq-group .word').each(function () {
            var getData = {
                get_number: '',
                get_remark: '',
                get_type: 'qqGroup'
            };
            getData.get_number = $(this).attr('word-number');
            getData.get_remark = $(this).attr('word-remark');
            getAllData.push(getData);
        });
        $('.list-group.number .word').each(function () {
            var getData = {
                get_number: '',
                get_remark: '',
                get_type: 'number'
            };
            getData.get_number = $(this).attr('word-number');
            getData.get_remark = $(this).attr('word-remark');
            getAllData.push(getData);
        });

        $('.list-group.weixin .word').each(function () {
            var getData = {
                get_number: '',
                get_remark: '',
                get_type: 'weixin'
            };
            getData.get_number = $(this).attr('word-number');
            getData.get_remark = $(this).attr('word-remark');
            getAllData.push(getData);
        });

        $('.list-group.weixin-group .word').each(function () {
            var getData = {
                get_number: '',
                get_remark: '',
                get_type: 'weixinGroup'
            };
            getData.get_number = $(this).attr('word-number');
            getData.get_remark = $(this).attr('word-remark');
            getAllData.push(getData);
        });

        if (schemeCustomer.customer_name === "" ||
            schemeCustomer.customer_start_time === "" ||
            schemeCustomer.customer_end_time === "" ||
            schemeCustomer.customer_scheme === "" ||
            getAllData.length === 0
        ) {
            layer.msg('抱歉,数据没有填写完整！', {
                time: 1500,
                zIndex: layer.zIndex, //重点1
                success: function (layero) {
                    layer.setTop(layero); //重点2
                }
            });
        } else {
            layer.close(addCustomerDialog);
            if (operationType) {
                api.movement.severCustomer.insertServeCustomer(JSON.stringify(schemeCustomer), JSON.stringify(getAllData), areaId, function (rep) {
                    if (rep.result) {
                        tableStart();
                        layer.msg(' 添 加 成 功 ！', {
                            icon: 1,
                            time: 1200,
                        });
                    } else {
                        layer.msg(' 添 加 失 败 ！', {
                            icon: 2,
                            time: 1200,
                        });
                    }
                });
            } else {
                api.movement.severCustomer.updateServeCustomer(JSON.stringify(schemeCustomer), JSON.stringify(getAllData), serveCustomerId, function (rep) {
                    if (rep.result) {
                        tableStart();
                        layer.msg(' 修 改 成 功 ！', {
                            icon: 1,
                            time: 1200,
                        });
                    } else {
                        layer.msg(' 修 改 失 败 ！', {
                            icon: 2,
                            time: 1200,
                        });
                    }
                });
            }
        }
    });

    api.movement.configureManage.getAllWx(function (rep) {
        var wxData = rep.data;
        var wxLen = rep.total;
        var dom = [];
        for (var i = 0; i < wxLen; i++) {
            dom.push('<option value="' + wxData[i].wx_number + '">' + wxData[i].wx_number + '--' + wxData[i].wx_remark + '</option>');
        }
        $('#choose-weixin').append(dom.join(''));
    });

    tableStart();

    function tableStart() {
        $('#customer-info').bootstrapTable('destroy');
        $('#customer-info').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'customer_name',
                searchable: true,
                sortable: true,
                title: '客户名称'
            }, {
                field: 'scheme_name',
                searchable: true,
                title: '发送方案'
            }, {
                field: 'get_numbers',
                title: 'qq号/群号',
                formatter: function (value, row, index) {
                    var allValue = value.split(',');
                    var numberType = row.get_types.split(',');
                    var numberValue = [];
                    var numberTypeLen = numberType.length;
                    for (var i = 0; i < numberTypeLen; i++) {
                        if (numberType[i] == "qq" || numberType[i] == "qqGroup") {
                            numberValue.push(allValue[i]);
                        }
                    }
                    return numberValue.join('|');
                }
            }, {
                field: 'get_numbers',
                title: '手机号',
                formatter: function (value, row, index) {
                    var allValue = value.split(',');
                    var numberType = row.get_types.split(',');
                    var numberValue = [];
                    var numberTypeLen = numberType.length;
                    for (var i = 0; i < numberTypeLen; i++) {
                        if (numberType[i] == "number") {
                            numberValue.push(allValue[i]);
                        }
                    }
                    return numberValue.join('|');
                }
            }, {
                field: 'get_numbers',
                title: '微信号',
                formatter: function (value, row, index) {
                    var allValue = value.split(',');
                    var numberType = row.get_types.split(',');
                    var numberValue = [];
                    var numberTypeLen = numberType.length;
                    for (var i = 0; i < numberTypeLen; i++) {
                        if (numberType[i] == 'weixin' || numberType[i] == 'weixinGroup') {
                            numberValue.push(allValue[i]);
                        }
                    }
                    return numberValue.join('|');
                }
            }, {
                field: 'user_name',
                title: '创建人'
            }, {
                field: 'customer_end_time',
                searchable: true,
                title: '结束时间'
            }, {
                field: 'customer_status',
                searchable: true,
                title: '状态',
                formatter: function (value, row, index) {
                    if (value == 1) {
                        return "启用";
                    } else {
                        return "停用";
                    }
                }
            }],
            pageNumber: 1,
            pageSize: 25,
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            sidePagination: 'client',
            showColumns: 'true',
            classes: 'table table-bordered table-hover',
            method: 'post',
            url: '' + api.baseUrl + '/getAllServeCustomer',
            queryParamsType: "undefined",
            queryParams: function (params) {
                var param = {
                        pageNumber: params.pageNumber,
                        pageSize: params.pageSize,
                        areaId: areaIds.join(','),
                        serveCustomerSearch: JSON.stringify(serveCustomerSearch)
                    }
                ;
                console.log(param);
                return param;
            },
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right',
            onClickRow: function (row) {
                getSetFormValue(row, false);
                operationType = false;
                addCustomerDialog = layer.open({
                    title: ' 编辑客户(创建人：' + row.user_name + ')',
                    type: 1,
                    area: ['52%', '95%'], //宽高
                    content: $('#add-customer')
                });
                serveCustomerId = row.id;
                if (sysTem.user.role_name === '超级管理员') {
                    $('#post-customer-btn').prop('disabled', false);
                } else {
                    if (sysTem.user.user_loginname === row.user_loginname) {
                        $('#post-customer-btn').prop('disabled', false);
                    } else {
                        $('#post-customer-btn').prop('disabled', true);
                    }
                }
            }
        });
    }

    function getSetFormValue(row, flag) {
        if (flag) {
            //为新增，我需要删除表单中的所有的东西
            $('#customer-name').val('');
            $('.form-control.start-time').val('');
            $('.form-control.end-time').val('');
            $('.panel-body.scheme-name').attr('scheme-id', "");
            $('#choose-qq').val("0");
            $('#choose-weixin').val("0");
            $('.panel-body.scheme-name').text('请选择方案');
            $('.list-group.qq').empty();
            $('.list-group.qq-group').empty();
            $('.list-group.number').empty();
            $('.list-group.weixin').empty();
            $('.list-group.weixin-group').empty();
            $('.customer-status input[value=1]').prop("checked", true);
            $('.customer-grade-value[value=1]').prop("checked", true);
            $('.plan-time-interval').show();
        } else {
            $('input[name=customer-status][value=' + row.customer_status + ']').prop("checked", true);
            if (row.customer_status == 1) {
                $('.plan-time-interval').show();
            } else {
                $('.plan-time-interval').hide();
            }

            $('.customer-grade-value[value=' + row.customer_priority + ']').prop("checked", true);
            $('#customer-name').val(row.customer_name);
            $('.form-control.start-time').val(row.customer_start_time);
            $('.form-control.end-time').val(row.customer_end_time);
            $('.panel-body.scheme-name').attr('scheme-id', row.customer_scheme);
            $('#choose-qq').val(row.customer_post_qq);
            $('#choose-weixin').val(row.customer_post_weixin);
            $('.panel-body.scheme-name').text(row.scheme_name);

            var getNumbers = row.get_numbers.split(',');
            var getRemarks = row.get_remarks.split(',');
            var getTypes = row.get_types.split(',');
            var getNUmbersLen = getNumbers.length;
            var qqDom = [];
            var qqGroupDom = [];
            var numberDom = [];
            var weixinDom = [];
            var weixinGroupDom = [];
            for (var i = 0; i < getNUmbersLen; i++) {
                if (getTypes[i] === 'qq') {
                    qqDom.push('<li class="list-group-item">');
                    qqDom.push('<span class="word" word-number="' + getNumbers[i] + '" word-remark="' + getRemarks[i] + '">' + getNumbers[i] + '--' + getRemarks[i] + '</span>');
                    qqDom.push('<span class="glyphicon glyphicon-remove span-icon-cursor info"></span>');
                    qqDom.push('</li>');
                } else if (getTypes[i] === 'qqGroup') {
                    qqGroupDom.push('<li class="list-group-item">');
                    qqGroupDom.push('<span class="word" word-number="' + getNumbers[i] + '" word-remark="' + getRemarks[i] + '">' + getNumbers[i] + '--' + getRemarks[i] + '</span>');
                    qqGroupDom.push('<span class="glyphicon glyphicon-remove span-icon-cursor info"></span>');
                    qqGroupDom.push('</li>');
                } else if (getTypes[i] === 'weixin') {
                    weixinDom.push('<li class="list-group-item">');
                    weixinDom.push('<span class="word" word-number="' + getNumbers[i] + '" word-remark="' + getRemarks[i] + '">' + getNumbers[i] + '--' + getRemarks[i] + '</span>');
                    weixinDom.push('<span class="glyphicon glyphicon-remove span-icon-cursor info"></span>');
                    weixinDom.push('</li>');
                } else if (getTypes[i] === 'weixinGroup') {
                    weixinGroupDom.push('<li class="list-group-item">');
                    weixinGroupDom.push('<span class="word" word-number="' + getNumbers[i] + '" word-remark="' + getRemarks[i] + '">' + getNumbers[i] + '--' + getRemarks[i] + '</span>');
                    weixinGroupDom.push('<span class="glyphicon glyphicon-remove span-icon-cursor info"></span>');
                    weixinGroupDom.push('</li>');
                } else {
                    numberDom.push('<li class="list-group-item">');
                    numberDom.push('<span class="word" word-number="' + getNumbers[i] + '" word-remark="' + getRemarks[i] + '">' + getNumbers[i] + '--' + getRemarks[i] + '</span>');
                    numberDom.push('<span class="glyphicon glyphicon-remove span-icon-cursor info"></span>');
                    numberDom.push('</li>');
                }
            }
            $('.list-group.qq').empty();
            $('.list-group.qq-group').empty();
            $('.list-group.number').empty();
            $('.list-group.weixin').empty();
            $('.list-group.weixin-group').empty();
            $('.list-group.qq').append(qqDom.join(''));
            $('.list-group.qq-group').append(qqGroupDom.join(''));
            $('.list-group.number').append(numberDom.join(''));
            $('.list-group.weixin').append(weixinDom.join(''));
            $('.list-group.weixin-group').append(weixinGroupDom.join(''));
            $('.glyphicon-remove.info').unbind('click').click(function () {
                $(this).parent().remove();
            });


        }
    }


});