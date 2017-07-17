/**
 * Created by Msater Zg on 2017/3/15.
 */

define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    //接口文件
    var api = require('../../common/api');
    $('#trashuser-table').bootstrapTable({
        columns: [/*{
         checkbox: true
         },*/ {
            field: 'custom_name',
            searchable: true,
            sortable: true,
            title: '客户名'
        }, {
            field: 'user_name',
            searchable: true,
            title: '用户名'
        }, {
            field: 'start_time',
            searchable: true,
            title: '开始时间'
        }, {
            field: 'end_time',
            title: '结束时间'
        }, {
            field: 'custom_status',
            title: '状态'
        }, {
            field: 'delete_time',
            title: '删除时间'
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
        url: '' + api.baseUrl + '/getAllTrashUser',
        queryParamsType: "undefined",
        pagination: true,
        paginationHAlign: 'left',
        paginationDetailHAlign: 'right',
        onClickRow: function (row) {
            /* userOperstion = false;
             getSingleInfo(row);*/
        },
        onLoadSuccess: function (data) {
        }
    });
});