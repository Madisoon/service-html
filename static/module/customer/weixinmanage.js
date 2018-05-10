/**
 * Created by Msater Zg on 2017/2/7.
 */

define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    var api = require('../../common/api');
    require('../../../spm_modules/bootstrap-3.3.0-dist/dist/js/bootstrap.min.js');
    require('../../../spm_modules/bootstrap-table-master/dist/bootstrap-table.min.js');
    require('../../../spm_modules/bootstrap-table-master/dist/locale/bootstrap-table-zh-CN.min.js');
    var addwxDialog;
    var postType;
    var wxId;
    //初始化时间-中文
    //添加配置wx的点击事件
    $('#add-wx-btn').unbind('click').click(function () {
        formSet(null, false);
        postType = 1;
        addwxDialog = layer.open({
            title: ' 新增微信',
            type: 1,
            area: ['50%', '70%'], //宽高
            content: $('#wx-editor-dialog')
        });
    });


    $('#wx-cancel-btn').unbind('click').click(function () {
        layer.close(addwxDialog);
    });
    $('#delete-wx-btn').unbind('click').click(function () {
        var datawx = $('#wx-table').bootstrapTable('getSelections', null);
        var datawxLen = datawx.length;
        var data = [];
        if (datawxLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (var i = 0; i < datawxLen; i++) {
                data.push(datawx[i].id);
            }
            api.movement.configureManage.deleteWx(data.join(','), function (rep) {
                if (rep.result) {
                    wxTableStart();
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
            })

        }
    });
    $('#wx-post-btn').unbind('click').click(function () {
        layer.close(addwxDialog);
        var wxDate = {
            wx_number: $('#wx-number').val(),
            wx_name: $('#wx-name').val(),
            wx_remark: $('#wx-remark').val()
        };
        if (postType) {
            api.movement.configureManage.addWx(JSON.stringify(wxDate), function (rep) {
                if (rep.result) {
                    $('#wx-table').bootstrapTable('refresh', null);
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
            api.movement.configureManage.updateWx(JSON.stringify(wxDate), wxId, function (rep) {
                if (rep.result) {
                    $('#wx-table').bootstrapTable('refresh', null);
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

    });


    wxTableStart();
    function wxTableStart() {
        $('#wx-table').bootstrapTable('destroy');
        $('#wx-table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'wx_number',
                searchable: true,
                sortable: true,
                title: '微信账号'
            }, {
                field: 'wx_name',
                searchable: true,
                title: '微信昵称'
            }, {
                field: 'wx_remark',
                searchable: true,
                title: '微信备注'
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
            url: '' + api.baseUrl + '/getAllWx',
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right',
            onClickRow: function (row) {
                formSet(row, true);
                postType = 0;
                addwxDialog = layer.open({
                    title: '修改微信信息',
                    type: 1,
                    area: ['50%', '70%'], //宽高
                    content: $('#wx-editor-dialog')
                });
                wxId = row.id;
            },
            onLoadSuccess: function (data) {
            }
        });
    }

    function formSet(wxData, flag) {
        if (flag) {
            $('#wx-number').val(wxData.wx_number);
            $('#wx-name').val(wxData.wx_name);
            $('#wx-remark').val(wxData.wx_remark);
        } else {
            $('#wx-number').val("");
            $('#wx-name').val("");
            $('#wx-remark').val("");
        }
    }
});