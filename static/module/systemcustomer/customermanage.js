/**
 * Created by Msater Zg on 2017/3/15.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    //接口文件
    var api = require('../../common/api');
    var customDialog = "";
    var userOperstion;
    var customerId = '';
    $('#user-table').bootstrapTable({
        columns: [{
            checkbox: true
        }, {
            field: 'customer_name',
            searchable: true,
            sortable: true,
            title: '客户名称'
        }, {
            field: 'customer_status',
            searchable: true,
            title: '客户状态'
        }, {
            field: 'customer_time',
            title: '创建时间'
        }, {
            field: 'yuqinguser_number',
            title: '所有人数'
        }],
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
        url: '' + api.baseUrl + '/getAllCustomer',
        queryParamsType: "undefined",
        pagination: true,
        paginationHAlign: 'left',
        paginationDetailHAlign: 'right',
        onClickRow: function (row) {
            userOperstion = false;
            getSingleInfo(row);
        },
        onLoadSuccess: function (data) {
        }
    });


    //保存点击事件
    $('#reserve-button').unbind('click').click(function () {
        /* insertSysUser();*/
        if (userOperstion) {
            api.customManage.customerManage.insertCustomer(JSON.stringify(getFormValue()), function (rep) {
                if (rep.result == 1) {
                    layer.close(customDialog);
                    layer.msg(' 新 增 成 功 ', {
                        icon: 1,
                        time: 1200,
                        success: function () {
                            $('#user-table').bootstrapTable('refresh', null);
                        }
                    });
                } else {
                    layer.msg(' 新 增 失 败', {
                        icon: 2,
                        time: 1200,
                    });
                }
            });
        } else {
            api.customManage.customerManage.changeCustomer(JSON.stringify(getFormValue()), customerId, function (rep) {
                if (rep.result == 1) {
                    layer.close(customDialog);
                    layer.msg(' 修 改 成 功 ', {
                        icon: 1,
                        time: 1200,
                        success: function () {
                            $('#user-table').bootstrapTable('refresh', null);
                        }
                    });
                } else {
                    layer.msg(' 修 改 失 败', {
                        icon: 2,
                        time: 1200,
                    });
                }
            });
        }
    });
    //取消点击事件
    $('#cancel-button').unbind('click').click(function () {
        layer.close(customDialog);
    });
    //新增点击事件
    $('#addUserData').unbind('click').click(function () {
        insertOrGetValue(false, '');
        userOperstion = true;
        customDialog = layer.open({
            title: ' 用户信息管理 ',
            type: 1,
            area: ['50%', '40%'], //宽高
            shadeClose: true,
            content: $('#userInfoDialog')
        });
    });
    $('#deleteUserData').unbind('click').click(function () {
        var dataUser = $('#user-table').bootstrapTable('getSelections', null);
        var dataUserLen = dataUser.length;
        var data = [];
        if (dataUserLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (var i = 0; i < dataUserLen; i++) {
                data.push(dataUser[i].id);
            }
            console.log(data);
            api.customManage.customerManage.deleteCustomer(data.join('@'), function (rep) {
                if (rep.result == 1) {
                    $('#user-table').bootstrapTable('refresh', null);
                }
            });
        }
    });

    /**
     *得到表单的值
     */
    function getFormValue() {
        var customerDatat = {
            customer_name: $('.form-control.customer_name').val(),
            customer_status: $('.form-control.customer_status').val(),
        };
        return customerDatat;
    }

    /**
     * 初始化表单的值
     * @param flag
     * @param row
     */
    function insertOrGetValue(flag, row) {
        if (flag) {
            customerId = row.id;
            $('.form-control.customer_name').val(row.customer_name);
            $('.form-control.customer_status').val(row.customer_status);
        } else {
            $('.form-control.customer_name').val("");
        }
    }

    /**
     * 得到用户的信息
     * @param row
     */
    function getSingleInfo(row) {
        insertOrGetValue(true, row);
        customDialog = layer.open({
            title: ' 用户信息管理 ',
            type: 1,
            area: ['50%', '40%'], //宽高
            maxmin: true, //开启最大化最小化按钮
            shadeClose: true,
            content: $('#userInfoDialog')
        });
    }

    /**
     * 添加一个用户
     */

});