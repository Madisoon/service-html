/**
 * Created by Msater Zg on 2017/4/20.
 */
define(function (require, exports, module) {
    var API = require('../../common/api');
    var templateDialog;
    var templateId;
    var flag;

    $('.template-add').click(function () {
        flag = false;
        formSet('');
        templateDialog = layer.open({
            title: '新建模版',
            type: 1,
            area: ['56%', '52%'], //宽高
            content: $('#template-add-dialog')
        });
    });

    $('.template-post').click(function () {
        var templateData = {
            template_name: $('.template-name').val(),
            template_title: $('.email-title').val(),
            template_content: $('.email-content').val()
        };
        if (!flag) {
            API.movement.emailManage.insertTemplateData(JSON.stringify(templateData), function (rep) {
                layer.close(templateDialog);
                templateTableStart();
                if (rep.result) {
                    layer.msg(' 添加成功 ！', {
                        icon: 1,
                        time: 1200,
                    });
                } else {
                    layer.msg(' 添加失败 ！', {
                        icon: 2,
                        time: 1200,
                    });
                }
            });
        } else {
            API.movement.emailManage.updateTemplateData(JSON.stringify(templateData), templateId, function (rep) {
                layer.close(templateDialog);
                templateTableStart();
                if (rep.result) {
                    layer.msg(' 修改成功 ！', {
                        icon: 1,
                        time: 1200,
                    });
                } else {
                    layer.msg(' 修改失败 ！', {
                        icon: 2,
                        time: 1200,
                    });
                }
            });
        }
    });

    templateTableStart();

    function templateTableStart() {
        $('#all-template').bootstrapTable('destroy');
        $('#all-template').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'template_name',
                searchable: true,
                sortable: true,
                title: '模版名称'
            }, {
                field: 'template_title',
                searchable: true,
                title: '邮件主题'
            }, {
                field: 'template_content',
                searchable: true,
                title: '邮件内容'
            }],
            pageNumber: 1,
            pageSize: 10,
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            sidePagination: 'client',
            classes: 'table table-bordered table-hover',
            method: 'post',
            url: '' + API.baseUrl + '/getAllTemplate',
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right',
            onClickRow: function (row) {
                templateId = row.id;
                flag = true;
                formSet(row);
                templateDialog = layer.open({
                    title: '新建模版',
                    type: 1,
                    area: ['56%', '52%'], //宽高
                    content: $('#template-add-dialog')
                });
            },
            onLoadSuccess: function (data) {
            }
        });
    }

    $('.template-delete').unbind('click').click(function () {
        var data = $('#all-template').bootstrapTable('getSelections', null);
        var dataLen = data.length;
        var id = [];
        if (dataLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (var i = 0; i < dataLen; i++) {
                id.push(data[i].id);
            }
            API.movement.emailManage.deleteTemplateData(id.join(','), function (rep) {
                if (rep.result) {
                    templateTableStart();
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

    function formSet(row) {
        if (flag) {
            $('.template-name').val(row.template_name);
            $('.email-title').val(row.template_title);
            $('.email-content').val(row.template_content);
        } else {
            $('.template-name').val('');
            $('.email-title').val('');
            $('.email-content').val('');
        }
    }
});
