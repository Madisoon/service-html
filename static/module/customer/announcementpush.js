/**
 * Created by Msater Zg on 2017/2/6.
 */
/**
 * Created by Msater Zg on 2017/1/9.
 */
define(function (require, exports, module) {
    var api = require('../../common/api');
    require('../../../spm_modules/bootstrap-3.3.0-dist/dist/js/bootstrap.min.js');
    require('../../../spm_modules/bootstrap-table-master/dist/bootstrap-table.min.js');
    require('../../../spm_modules/bootstrap-table-master/dist/locale/bootstrap-table-zh-CN.min.js');
    var announcementDialog = {};
    var announcementTitle = '';
    var announcementContent = '';
    var announcementStartTime = '';
    var announcementEndTime = '';
    $('#post-announcement').click(function () {
        announcementDialog = layer.open({
            title: '标 签 选 择',
            type: 1,
            area: ['45%', '60%'], //宽高
            content: $('#post-announcement-dialog')
        });
    });

    $.datetimepicker.setLocale('zh');
    $('.announcement-start-time').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function (ct) {
            this.setOptions({
                maxDate: $('.announcement-end-time').val() ? $('.announcement-end-time').val() : false
            })
        }
        /*timepicker: false*/
    });
    $('.announcement-end-time').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function (ct) {
            this.setOptions({
                minDate: $('.announcement-start-time').val() ? $('.announcement-start-time').val() : false
            })
        }
        /*timepicker: false*/
    });


    $('#choose-scheme-sure').click(function () {
        announcementTitle = $('.form-control.announcement-title').val();
        announcementContent = $('.form-control.announcement-content').val();
        announcementStartTime = $('.form-control.announcement-start-time').val();
        announcementEndTime = $('.form-control.announcement-end-time').val();
        announcementTableStart();
    });

    $('#choose-scheme').unbind('click').click(function () {
        $('.scheme-choose-input').stop().slideToggle();
    });

    $('#post-announcement-btn').click(function () {
        var title = $('.form-control.title').val();
        var content = $('.form-control.content').val();
        // 发布新闻
        api.movement.announcementManage.postAnnouncement(title, content, function (rep) {
            if (rep.value) {
                layer.msg(' 发 布 成 功 ！', {
                    icon: 1,
                    time: 1200,
                });
                announcementTableStart();
                layer.close(announcementDialog);
                $('.form-control.title').val('');
                $('.form-control.content').val('');
            } else {
                layer.msg(' 发 布 失 败 ！', {
                    icon: 2,
                    time: 1200,
                });
            }
        });
    });

    $('#reset-announcement').click(function () {
        // 发布重置
        api.movement.announcementManage.resetAnnouncement(function (rep) {
            announcementTableStart();
        });
    });

    announcementTableStart();

    function announcementTableStart() {
        $('#announcement-table').bootstrapTable('destroy');
        $('#announcement-table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'title',
                searchable: true,
                sortable: true,
                title: '公告标题'
            }, {
                field: 'content',
                searchable: true,
                title: '公告内容'
            }, {
                field: 'status',
                searchable: true,
                title: '公告状态',
                formatter: function (value, row, index) {
                    if (value === "1") {
                        return "目前通知";
                    } else {
                        return "历史通知";
                    }

                }
            }, {
                field: 'add_time',
                searchable: true,
                title: '发布时间'
            }],
            pageNumber: 1,
            pageSize: 10,
            /*search: true,*/
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            sidePagination: 'client',
            /*showColumns: 'true',*/
            classes: 'table table-bordered table-hover',
            method: 'post',
            url: '' + api.baseUrl + '/getAnnouncement',
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right',
            queryParams: function (params) {
                var param = {
                    title: announcementTitle,
                    content: announcementContent,
                    startTime: announcementStartTime,
                    endTime: announcementEndTime
                };
                return param;
            },
            onClickRow: function (row) {

            },
            onLoadSuccess: function (data) {
            }
        });
    }
});