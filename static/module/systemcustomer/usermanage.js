/**
 * Created by Msater Zg on 2017/3/15.
 */
/**
 * Created by Msater Zg on 2017/1/9.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    //接口文件
    var api = require('../../common/api');
    var fieldShow = {};
    var customDialog;
    var customPurview;
    var customShowDialog;


    var dom = [];
    var customId = '0';
    var choiceDataS = '';
    var flagTable = false;
    $.datetimepicker.setLocale('zh');
    $('.field-choice').hide();
    $('.field-choice-area').hide();

    var config_ = {
        id: 'area-field-show',
        areaProvince: '',
        areaCity: '',
        areaCounty: '',
        fieldStyle: '',
    };

    var config = {
        id: 'field-choice-area',
        areaProvince: '',
        areaCity: '',
        areaCounty: '',
        fieldStyle: 'horizontal',
    };

    var areaFieldShow = new $.areaFieldShow.init(config_);
    areaFieldShow.writeAreaFieldDom();

    var areaFieldShowHorizontal = new $.areaFieldShow.init(config);
    areaFieldShowHorizontal.writeAreaFieldDom();

    getDeparmentUser();

    getFieldName('table');

    getAllChoiceField();


    //ztree插件的基础设置
    var setting = {
        check: {
            enable: true
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onCheck: onCheck
        }
    };
    setting.check.chkboxType = {"Y": "ps", "N": "ps"};
    //每一个点击的事件的回调函数
    function onCheck(e, treeId, treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var nodes = treeObj.getCheckedNodes(true);
        var nodesLen = nodes.length;
        var dom = [];
        for (var i = 0; i < nodesLen; i++) {

            if ('valname' in nodes[i]) {
                dom.push(' <li><span class="glyphicon glyphicon-user"></span>&nbsp;&nbsp;' + nodes[i].valname + '</li>');
            }
        }
        $('.purview-user').empty();
        $('.purview-user').append(dom.join(''));
    }

    //
    $('#showAllCustomer').click(function () {
        $('#user-table').bootstrapTable('destroy');
        flagTable = !flagTable;
        if (flagTable) {
            $('.field-choice').fadeOut();
            $('.field-choice-area').fadeOut();
            $('#showChoice').prop('disabled', true);
            $('#deleteData').prop('disabled', true);
            $('#selectData').prop('disabled', true);
            $('#user-table').bootstrapTable({
                columns: dom,
                /*  striped: true,//变色效果的设置*/
                pageNumber: 1,
                pageSize: 12,
                dataField: 'data',//指定后台的数据的名称
                undefinedText: '--',
                showColumns: 'true',
                sidePagination: 'server',
                classes: 'table table-bordered table-hover',
                method: 'post',
                formatSearch: function () {
                    return "任意搜索";
                },
                url: '' + api.baseUrl + '/getAllCustomGroup',
                queryParamsType: "undefined",
                queryParams: function (params) {
                    var param = {
                        pageNumber: params.pageNumber,
                        pageSize: params.pageSize
                    };
                    return param;
                },
                pagination: true,
                paginationHAlign: 'left',
                paginationDetailHAlign: 'right',
                onClickRow: function (row) {
                    startCustomerShow(row.custom_name_id);
                    customShowDialog = layer.open({
                        title: ' 客 户 所 有 者 管 理 ',
                        type: 1,
                        area: ['80%', '90%'], //宽高
                        shadeClose: true,
                        content: $('#allCustomerShow')
                    });
                },
                onLoadSuccess: function (data) {
                }
            });
        } else {
            $('#showChoice').prop('disabled', false);
            $('#deleteData').prop('disabled', false);
            $('#selectData').prop('disabled', false);
            $('#user-table').bootstrapTable({
                columns: dom,
                /*  striped: true,//变色效果的设置*/
                pageNumber: 1,
                pageSize: 12,
                dataField: 'data',//指定后台的数据的名称
                undefinedText: '--',
                showColumns: 'true',
                sidePagination: 'server',
                classes: 'table table-bordered table-hover',
                method: 'post',
                formatSearch: function () {
                    return "任意搜索";
                },
                url: '' + api.baseUrl + '/getAllCustom',
                queryParamsType: "undefined",
                queryParams: function (params) {
                    var param = {
                        pageNumber: params.pageNumber,
                        pageSize: params.pageSize,
                        choiceSelect: choiceDataS,
                    };
                    return param;
                },
                pagination: true,
                paginationHAlign: 'left',
                paginationDetailHAlign: 'right',
                onClickRow: function (row) {
                    getAllField(row);
                },
                onLoadSuccess: function (data) {
                }
            });
        }
    });

    //客户所有者取消点击事件
    $('#custom-purview-cancel').click(function () {
        layer.close(customPurview);
    });
    //事件所有者的保存点击事件
    $('#custom-purview-post').click(function () {
        //取到所有的值
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var nodes = treeObj.getCheckedNodes(true);
        var nodesLen = nodes.length;
        var dom = [];
        for (var i = 0; i < nodesLen; i++) {

            if ('valname' in nodes[i]) {
                dom.push('' + nodes[i].valname + '');
            }
        }
        //将值放入到文档中
        $('.user-purview').val(dom.join(','));
        layer.close(customPurview);
    });

    //客户所有者的聚焦事件
    $('.form-control.user-purview').focus(function () {
        customPurview = layer.open({
            title: ' 客 户 所 有 者 管 理 ',
            type: 1,
            area: ['35%', '100%'], //宽高
            shadeClose: true,
            content: $('#custom-purview'),
            zIndex: layer.zIndex, //重点1
            success: function (layero) {
                layer.setTop(layero); //重点2
            }
        });
    });

    $('#reserve-button').unbind('click').click(function () {
        /*customId 0/1  0代表新增，其它代表修改*/
        var customPurview = {
            user_purview: $('.form-control.user-purview').val()
        };
        var customerInfo = $('#customer-id').val();
        areaFieldShow.getAreaFieldValue();
        fieldShow.postCustomData(customId, areaFieldShow.getAreaFieldValue(), customPurview, customerInfo, function (rep) {
            layer.close(customDialog);
        });
        $('#user-table').bootstrapTable('refresh', null);
    });
    $('#cancel-button').unbind('click').click(function () {
        layer.close(customDialog);
    });

    $('#showChoice').unbind('click').click(function () {
        $('.field-choice').fadeToggle();
        $('.field-choice-area').fadeToggle();
    });

    $('#selectData').unbind('click').click(function () {
        getFieldName('choice', '');
    });

    $('#addData').unbind('click').click(function () {
        getAllField('');
    });

    api.customManage.customerManage.getAllCustomer(function (rep) {
        var customerData = rep.data;
        var customerDataLen = customerData.length;
        var domArray = [];
        domArray.push('<option value="">请选择客户</option>');
        for (var i = 0; i < customerDataLen; i++) {
            domArray.push('<option value="' + customerData[i].id + '">' + customerData[i].customer_name + '</option>');
        }
        $('#customer-id').empty();
        $('#customer-id').append(domArray.join(''));
    });


    //删除用户
    $('#deleteData').unbind('click').click(function () {
        var dataCustom = $('#user-table').bootstrapTable('getSelections', null);
        var dataCustomLen = dataCustom.length;
        var data = [];
        if (dataCustomLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (var i = 0; i < dataCustomLen; i++) {
                data.push(dataCustom[i].id);
            }
            $.deleteData({
                id: data.join('@'),
                url: '../deleteCustom',
                deleteCallBack: function () {
                    $('#user-table').bootstrapTable('refresh', null);
                }

            });
        }
    });

    /**
     * 分类获得，不同里面不同的人，用来设置数据权限
     */
    function getDeparmentUser() {
        api.customManage.userManage.getDeparmentUser(function (rep) {
            var zNodes = rep.data;
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
        });
    }

    /**
     * 获取到数据表的字段，初始化表格
     * @param rep
     */
    function getMediumData(rep) {
        dom = [];
        dom.push({
            checkbox: true
        });
        dom.push({
            field: 'customer_name',
            title: '客户名称',
            sortable: true,
        });
        dom.push({
            field: 'base_user_name',
            title: '用户名称',
            sortable: true,
        });
        dom.push({
            field: 'base_start_time',
            title: '开始时间',
            sortable: true,
            formatter: function (value, row, index) {
                return value.substring(0, 10);
            }
        });
        dom.push({
            field: 'base_end_time',
            title: '结束时间',
            sortable: true,
            formatter: function (value, row, index) {
                return value.substring(0, 10);
            }
        });
        if (rep.result == 1) {
            var fieldData = rep.data;
            var fieldDataLen = rep.data.length;
            for (var i = 0; i < fieldDataLen; i++) {
                var data = {
                    field: '',
                    title: '',
                    sortable: true,
                };
                data.field = fieldData[i].field_name;
                data.title = fieldData[i].field_title;
                dom.push(data);
            }
            dom.push({
                field: 'customer_status',
                title: '客户状态',
                sortable: true,
            });
            $('thead').remove();
            //后台分页
            $('#user-table').bootstrapTable({
                columns: dom,
                /*  striped: true,//变色效果的设置*/
                pageNumber: 1,
                pageSize: 12,
                dataField: 'data',//指定后台的数据的名称
                undefinedText: '--',
                showColumns: 'true',
                sidePagination: 'server',
                classes: 'table table-bordered table-hover',
                method: 'post',
                formatSearch: function () {
                    return "任意搜索";
                },
                url: '' + api.baseUrl + '/getAllCustom',
                queryParamsType: "undefined",
                queryParams: function (params) {
                    var param = {
                        pageNumber: params.pageNumber,
                        pageSize: params.pageSize,
                        choiceSelect: choiceDataS,
                    };
                    return param;
                },
                pagination: true,
                paginationHAlign: 'left',
                paginationDetailHAlign: 'right',
                onClickRow: function (row) {
                    getAllField(row);
                },
                onLoadSuccess: function (data) {
                }
            });
        }
    }

    /**
     * 获取到搜索里面的所有的值，用来实现搜索功能
     * @param rep
     */
    function getChoiceValue(rep) {
        var choiceField = rep.data;
        var choiceFieldLen = choiceField.length;
        var choiceData = {};
        var judge = 0;
        for (var i = 0; i < choiceFieldLen; i++) {
            if (choiceField[i].field_name != 'user_purview') {
                if ($('.choice' + choiceField[i].field_name + '').val() === '') {
                    continue;
                } else {
                    judge = 1;
                    choiceData[choiceField[i].field_name] = $('.choice' + choiceField[i].field_name + '').val();
                }
            }
        }
        if (judge == 1) {
            choiceDataS = choiceData;
        } else {
            choiceDataS = '';
        }
        $('#user-table').bootstrapTable('destroy');
        getFieldName('table');
    }

    /**
     * 获取到用户所有的字段的名字
     * @param row
     */
    function getFieldName(row) {
        api.customManage.userManage.getFieldName(function (rep) {
            if (row == 'table') {
                getMediumData(rep);
            } else {
                getChoiceValue(rep);
            }
        });
    }

    /**
     * 获取所有的选择的字段
     */
    function getAllChoiceField() {

        api.customManage.fieldManage.getAllField('nokind', function (rep) {
            var data = rep.data;
            var dataLen = rep.data.length;
            var fieldChoiceShow = new $.fieldshow.init(data, dataLen, "");
            var dom = fieldChoiceShow.writeChoiceDom();
            $('.field-choice form').append(dom);
        });
    }


    function getAllField(rowField) {
        api.customManage.fieldManage.getAllField('nokind', function (rep) {
            var data = rep.data;
            var dataLen = rep.data.length;
            fieldShow = new $.fieldshow.init(data, dataLen, rowField);
            var dom = fieldShow.writeDom();
            $('.custom-detail-form .otherField').empty();
            $('.custom-detail-form .otherField').append(dom);
            $('.datepicker-controller').datetimepicker({
                format: 'Y-m-d',
                timepicker: false,
            });

            if (rowField === '') {
                customId = '0';
            } else {
                customId = rowField.id;
                for (var protype_name in rowField) {
                    //给字段赋值
                    if (protype_name != 'user_province' && protype_name != 'user_city' && protype_name != 'user_country') {
                        if ($('.form-group .' + protype_name + ' ').parent().hasClass('radio-inline')) {
                            $('.form-group .' + protype_name + ' [value = "' + rowField[protype_name] + '"]').prop("checked", true);
                        } else if ($('.form-group .' + protype_name + ' ').parent().hasClass('checkbox-inline')) {
                            var checkBoxValue = rowField[protype_name].split(',');
                            var checkBoxValueLen = checkBoxValue.length;
                            for (var i = 0; i < checkBoxValueLen; i++) {
                                $('.form-group .' + protype_name + ' [value = "' + checkBoxValue[i] + '"]').prop("checked", true);
                            }
                        } else {
                            $('.form-group .' + protype_name + ' ').val(rowField[protype_name]);
                        }
                    }
                }
                $('.form-control.base-user-name').val(rowField['base_user_name']);
                $('.form-control.base-start-time').val(rowField['base_start_time']);
                $('.form-control.base-end-time').val(rowField['base_end_time']);
                $('#customer-id').val(rowField['custom_name_id']);
                $('.purview-user').empty();
                $('.form-control.user-purview').val(rowField['user_purview']);
                var areaData = {
                    user_province: rowField['user_province'],
                    user_city: rowField['user_city'],
                    user_country: rowField['user_country']
                };
                if (areaData.user_province != '' && areaData.user_city != '') {
                    areaFieldShow.assignmentSelect(areaData);
                } else {
                    $('#first-area-update').val('');
                    $('#second-area-update').val('');
                    $('#third-area-update').val('');
                }

                var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                treeObj.checkAllNodes(false);
                if (rowField['user_purview'] != '') {
                    var customPurviewData = rowField['user_purview'].split(',');
                    var customPurviewDataLen = customPurviewData.length;
                    var domPurview = [];
                    for (var i = 0; i < customPurviewDataLen; i++) {
                        var node = treeObj.getNodeByParam("valname", customPurviewData[i]);
                        //设置选择状态
                        treeObj.selectNode(node);
                        //改变被选择的状态
                        treeObj.checkNode(node, true, true);
                        //更新状态
                        treeObj.updateNode(node);
                        domPurview.push(' <li><span class="glyphicon glyphicon-user"></span>&nbsp;&nbsp;' + customPurviewData[i] + '</li>');
                    }

                    $('.purview-user').append(domPurview.join(''));

                }
            }
            customDialog = layer.open({
                title: ' 客 户 信 息 管 理 ',
                type: 1,
                area: ['60%', '90%'], //宽高
                shadeClose: true,
                zIndex: 99,
                content: $('#custom-detail')
            });

            if (rep.result == 0) {
                layer.msg(' 数 据 为 空', {
                    icon: 2,
                    time: 1200,
                });
            } else {

            }
        });
    }

    function startCustomerShow(customerId) {
        $('#all-customer').bootstrapTable('destroy');
        $('#all-customer').bootstrapTable({
            columns: dom,
            /*  striped: true,//变色效果的设置*/
            pageNumber: 1,
            pageSize: 12,
            search: true,
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            showColumns: 'true',
            classes: 'table table-bordered table-hover',
            method: 'post',
            formatSearch: function () {
                return "任意搜索";
            },
            url: '' + api.baseUrl + '/getAllCustomerById',
            queryParamsType: "undefined",
            queryParams: function (params) {
                var param = {
                    pageNumber: params.pageNumber,
                    pageSize: params.pageSize,
                    customerId: customerId
                };
                return param;
            },
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right'
        });
    }

});