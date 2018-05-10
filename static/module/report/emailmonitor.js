/**
 * Created by Msater Zg on 2017/4/20.
 */
define(function (require, exports, module) {
    var API = require('../../common/api');
    var isStatus = '0';

    $('.monitor-btn').click(function () {

        $('.monitor-btn').removeClass('btn-primary');
        $(this).addClass('btn-primary');
        isStatus = $(this).attr('data-status');
        emailTableStart();
    });

    emailTableStart();

    function emailTableStart() {
        var column = {};
        if (isStatus === '1') {
            column = {
                field: 'gmt_create',
                searchable: true,
                title: '时间'
            };
        } else {
            column = {
                field: 'id',
                title: '操作',
                formatter: function (value, row, index) {
                    return '<button type="button" class="btn btn-primary monitor-operation" data-type="1" data-id="' + value + '">完成</button> ' +
                        '<button type="button" class="btn btn-success monitor-operation" data-type="0" data-id="' + value + '">删除</button> '
                }
            };
        }
        $('#email-monitor').bootstrapTable('destroy');
        $('#email-monitor').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'customer_name',
                searchable: true,
                sortable: true,
                title: '客户'
            }, {
                field: 'customer_number',
                searchable: true,
                title: '账号'
            }, {
                field: 'email_url',
                searchable: true,
                title: '文件',
                formatter: function (value, row, index) {
                    return '<a href="http://118.178.237.219:8080/dummyPath/' + value + '">' +
                        '<span class="glyphicon glyphicon-download-alt"></span></a>'
                }

            }, column],
            pageNumber: 1,
            pageSize: 10,
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            sidePagination: 'server',
            classes: 'table table-bordered table-hover',
            method: 'post',
            url: API.baseUrl + '/getAllPostEmailMonitor',
            queryParamsType: "undefined",
            queryParams: function (params) {
                var param = {
                    pageNumber: params.pageNumber,
                    pageSize: params.pageSize,
                    isStatus: isStatus
                };
                return param;
            },
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right'
        });
    }

    $('.table').on('click', '.monitor-operation', function () {
        var dateType = $(this).attr("data-type");
        var dateId = $(this).attr("data-id");
        if (dateType === '1') {
            API.movement.emailManage.updateEmailMonitor(dateId, function (rep) {
                emailTableStart();
            });
        } else {
            API.movement.emailManage.deleteEmailMonitor(dateId, function (rep) {
                emailTableStart();
            });
        }
    });
});
