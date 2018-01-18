/**
 * Created by Msater Zg on 2017/2/6.
 */
/**
 * Created by Msater Zg on 2017/1/9.
 */
define(function (require, exports, module) {
    var api = require('../../common/api');
    tableStart();

    function tableStart() {
        $('#all-terrace-table').bootstrapTable('destroy');
        $('#all-terrace-table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'scheme_name',
                searchable: true,
                sortable: true,
                title: '方案名称'
            }, {
                field: 'tag_name',
                searchable: true,
                title: '标签'
            }, {
                field: 'scheme_imp',
                searchable: true,
                title: '匹配关键词'
            }, {
                field: 'scheme_no_imp',
                title: '排除关键词'
            }, {
                field: 'scheme_grade',
                title: '信息级别'
            }, {
                field: 'scheme_time',
                searchable: true,
                title: '修改时间',
                formatter: function (value, row, index) {
                    return value.substring(0, 10);
                }
            }],
            pageNumber: 1,
            pageSize: 12,
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            sidePagination: 'client',
            showColumns: 'true',
            classes: 'table table-bordered table-hover',
            method: 'post',
            url: '' + api.baseUrl + '/getTerraceScheme',
            queryParamsType: "undefined",
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right',
            onLoadSuccess: function (data) {
            }
        });
    }
});