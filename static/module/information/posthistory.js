/**
 * Created by Msater Zg on 2017/4/20.
 */
/**
 * Created by Msater Zg on 2017/4/20.
 */
/**
 * Created by Msater Zg on 2017/1/25.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    var api = require('../../common/api');
    var sysTem = window.parent.SYSTEM;
    var tableChoiceData = {};
    $.datetimepicker.setLocale('zh');
    $('#choose-start-time').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function (ct) {
            this.setOptions({
                maxDate: $('#choose-end-time').val() ? $('#choose-end-time').val() : false
            })
        }
        /*timepicker: false*/
    });
    $('#choose-end-time').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function (ct) {
            this.setOptions({
                minDate: $('#choose-start-time').val() ? $('#choose-start-time').val() : false
            })
        }
        /*timepicker: false*/
    });

    $('#finish-time').focus(function () {
        $('#choose-time-section').stop().slideDown();
    });

    $('#remove-choose-time').unbind('click').click(function () {
        $('#choose-time-section').stop().slideUp();
    });

    $('#sure-choose-time').unbind('click').click(function () {
        var startTime = $('#choose-start-time').val();
        var endTime = $('#choose-end-time').val();
        if (startTime == "") {
            $('#finish-time').val("");
        } else {
            var timeSection = startTime + '&' + endTime;
            $('#finish-time').val(timeSection);
            $('#choose-start-time').val("");
            $('#choose-end-time').val("");
        }
        $('#choose-time-section').stop().slideUp();
    });

    $('#search-history-data').unbind('click').click(function () {
        var searchData = {};
        var postNumber = $('#post-number').val();
        var getNumber = $('#get-number').val();
        var finishTime = $('#finish-time').val();
        var finishPeople = $('#finish-people').val();
        var inforContent = $('#infor-content').val();
        var customerName = $('#customer-name').val();
        if (postNumber !== "") {
            searchData.infor_post_people = postNumber;
        }
        if (getNumber !== "") {
            searchData.infor_get_people = getNumber;
        }
        if (finishTime !== "") {
            searchData.infor_finish_time = finishTime;
        }
        if (finishPeople !== "") {
            searchData.user_name = finishPeople;
        }
        if (inforContent !== "") {
            searchData.infor_context = inforContent;
        }
        if (customerName !== "") {
            searchData.customer_name = customerName;
        }
        tableChoiceData = searchData;
        console.log(tableChoiceData);
        tableStart();
    });

    function getTime(startTime, endTime) {
        var startTime = new Date(startTime);
        var endTime = new Date(endTime);
        var timeDisparity = endTime.getTime() - startTime.getTime();
        var days = Math.floor(timeDisparity / (24 * 3600 * 1000));

//计算出小时数
        var leave1 = timeDisparity % (24 * 3600 * 1000);   //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));
//计算相差分钟数
        var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000));
        var timeData = hours + "时 " + minutes + "分";
        return timeData;
    }

    tableStart();


    /**
     * 表格初始化
     */
    function tableStart() {
        $('#all-infor-history').bootstrapTable('destroy');
        $('#all-infor-history').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'infor_context',
                searchable: true,
                sortable: true,
                title: '信息内容',
                formatter: function (value, row, index) {
                    if (value.length <= 50) {
                        return value;
                    } else {
                        return value.substring(0, 44) + "......";
                    }

                }
            }, {
                field: 'infor_post_type',
                searchable: true,
                sortable: true,
                title: '信息类型',
                formatter: function (value, row, index) {
                    var inforTypeName = "";
                    switch (value) {
                        case "qq":
                            inforTypeName = "QQ";
                            break;
                        case "qqGroup":
                            inforTypeName = "QQ群";
                            break;
                        case "weixin":
                            inforTypeName = "微信";
                            break;
                        case "weixinGroup":
                            inforTypeName = "微信群";
                            break;
                        default:
                            break;
                    }
                    return inforTypeName;

                }
            }, {
                field: 'infor_post_people',
                title: '发送方',
                formatter: function (value, row, index) {
                    return value + '--' + row.number_name;
                }
            }, {
                field: 'infor_get_people',
                title: '接收方',
                formatter: function (value, row, index) {
                    return value + '--' + row.get_remark;
                }
            }, {
                field: 'infor_post_time',
                title: '推送时间',
                formatter: function (value, row, index) {
                    return value.substring(0, 16);
                }
            }, {
                field: 'infor_finish_time',
                title: '完成时间',
                formatter: function (value, row, index) {
                    return value.substring(0, 16);
                }
            }, {
                field: 'infor_finish_time',
                title: '时间差',
                formatter: function (value, row, index) {
                    var startTime = row.infor_post_time.substring(0, 16).replace(/-/g, "/");
                    var endTime = row.infor_finish_time.substring(0, 16).replace(/-/g, "/");
                    return getTime(startTime, endTime);
                }
            }, {
                field: 'user_name',
                searchable: true,
                title: '完成者'
            }],
            pageNumber: 1,
            pageSize: 25,
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            sidePagination: 'server',
            classes: 'table table-bordered table-hover',
            method: 'post',
            url: '' + api.baseUrl + '/getAllHistory',
            queryParamsType: "undefined",
            queryParams: function (params) {
                var param = {
                    pageNumber: params.pageNumber,
                    pageSize: params.pageSize,
                    tableChoiceData: JSON.stringify(tableChoiceData)
                };
                return param;
            },
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right',
            onDblClickRow: function (row) {
                console.log(row);
            },
            onLoadSuccess: function (data) {
            }
        });
    }
});
