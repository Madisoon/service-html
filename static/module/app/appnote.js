/**
 * Created by Msater Zg on 2017/7/13.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    var api = require('../../common/api');
    var sysTem = window.parent.SYSTEM;
    var chooseData = {};
    tableStart();

    $.datetimepicker.setLocale('zh');
    $('.note-start-time').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function (ct) {
            this.setOptions({
                maxDate: $('.note-end-time').val() ? $('.note-end-time').val() : false
            })
        }
        /*timepicker: false*/
    });
    $('.note-end-time').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function (ct) {
            this.setOptions({
                minDate: $('.note-start-time').val() ? $('.note-start-time').val() : false
            })
        }
        /*timepicker: false*/
    });

    function tableStart() {
        $('#all-note-table').bootstrapTable('destroy');
        $('#all-note-table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'note_create',
                title: '账号'
            }, {
                field: 'note_type',
                title: '操作类型',
                formatter: function (value, row, index) {
                    if (value === '1') {
                        return "登陆";
                    } else if (value === '2') {
                        return "查询";
                    } else {
                        return "详情";
                    }
                }
            }, {
                field: 'note_title',
                title: '标题'
            }, {
                field: 'note_date',
                title: '日期'
            }],
            pageNumber: 1,
            pageSize: 12,
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            sidePagination: 'server',
            classes: 'table table-bordered table-hover',
            method: 'post',
            url: '' + api.baseUrl + '/getAllAppNote',
            queryParamsType: "undefined",
            queryParams: function (params) {
                var param = {
                    pageNumber: params.pageNumber,
                    pageSize: params.pageSize,
                    chooseData: JSON.stringify(chooseData)
                };
                return param;
            },
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right',
            onClickRow: function (row) {
            }
        });
    }

    $('#senior-search').click(function () {
        var noteCreate = $('.form-control.note-create').val();
        var noteStartTime = $('.form-control.note-start-time').val();
        var noteEndTime = $('.form-control.note-end-time').val();
        var noteTitle = $('.form-control.note-title').val();
        var noteType = $('.form-control.note-type').val();
        var formData = {};
        if (noteCreate !== '') {
            formData.note_create = noteCreate;
        }
        if (noteTitle !== '') {
            formData.note_title = noteTitle;
        }
        if (noteType !== 'all') {
            formData.note_type = noteType;
        }
        if (noteStartTime !== '') {
            formData.note_date = noteStartTime;
        }
        if (noteEndTime !== '') {
            formData.note_date += "," + noteEndTime;
        }
        chooseData = formData;
        tableStart();
    });

    $('#excel-export').click(function () {
        var noteCreate = $('.form-control.note-create').val();
        var noteStartTime = $('.form-control.note-start-time').val();
        var noteEndTime = $('.form-control.note-end-time').val();
        var noteTitle = $('.form-control.note-title').val();
        var noteType = $('.form-control.note-type').val();
        var formData = {};
        if (noteCreate !== '') {
            formData.note_create = noteCreate;
        }
        if (noteTitle !== '') {
            formData.note_title = noteTitle;
        }
        if (noteType !== 'all') {
            formData.note_type = noteType;
        }
        if (noteStartTime !== '') {
            formData.note_date = noteStartTime;
        }
        if (noteEndTime !== '') {
            formData.note_date += "," + noteEndTime;
        }
        chooseData = formData;
        api.app.appUser.exportAppNoteExcel(JSON.stringify(chooseData), function (rep) {
            var filePath = rep.result;
            if (filePath === '') {
                layer.msg('抱歉!没有可导出的数据', {
                    time: 1500
                });
            } else {
                window.open('http://118.178.237.219:8080/dummyPath/' + filePath);
            }
        });
    });
});
