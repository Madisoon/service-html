/**
 * Created by Msater Zg on 2017/4/20.
 */
define(function (require, exports, module) {
    var API = require('../../common/api');
    var tagShow = require('../../common/tagshow');
    var taskFileUrl = "";
    var addTagDialog;
    tagShow.tagOperation.writeDomTag(false, 'tag-tree');
    emailTableStart();

    function emailTableStart() {
        $('#all-email').bootstrapTable('destroy');
        $('#all-email').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'template_name',
                searchable: true,
                sortable: true,
                title: '模版名称'
            }, {
                field: 'tag_name',
                searchable: true,
                title: '标签'
            }, {
                field: 'email_file_url',
                searchable: true,
                title: '文件',
                formatter: function (value, row, index) {
                    return '<a href="http://118.178.237.219:8080/dummyPath/' + value + '">' +
                        '<span class="glyphicon glyphicon-download-alt"></span></a>'
                }

            }, {
                field: 'gmt_create',
                searchable: true,
                title: '发送时间'
            }],
            pageNumber: 1,
            pageSize: 10,
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            sidePagination: 'server',
            classes: 'table table-bordered table-hover',
            method: 'post',
            url: API.baseUrl + '/getAllPostEmail',
            queryParamsType: "undefined",
            queryParams: function (params) {
                var param = {
                    pageNumber: params.pageNumber,
                    pageSize: params.pageSize,
                };
                return param;
            },
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right'
        });
    }

    $('.report-delete').click(function () {
        var data = $('#all-email').bootstrapTable('getSelections', null);
        var dataLen = data.length;
        var id = [];
        if (dataLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (var i = 0; i < dataLen; i++) {
                id.push(data[i].id);
            }
            API.movement.emailManage.deleteEmailData(id.join(','), function (rep) {
                if (rep.result) {
                    emailTableStart();
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

    $('#tag-post-btn').unbind('click').click(function () {
        var tagData = tagShow.tagOperation.getTreeValue(true, 'tag-tree');
        var nodesLen = tagData.length;
        var dom = [];
        $('.tag .other-tag').remove();
        for (var i = 0; i < nodesLen; i++) {
            dom.push('<span class="label other-tag label-warning span-icon-cursor" tag-id="' + tagData[i].id + '">' + tagData[i].name + '</span>');
        }
        $('.tag').append(dom.join(''));
        layer.close(addTagDialog);
    });

    $('.report-post').click(function () {
        var id = $('.email-template').val();
        var tagIds = [];
        $('.other-tag').each(function () {
            tagIds.push($(this).attr("tag-id"));
        });
        API.movement.emailManage.insertEmailData(id, taskFileUrl, tagIds.join(','), function (rep) {
            emailTableStart();
        });
        layer.closeAll();
    });

    $('.form-control.taskFileUrl').change(function () {
        $('#taskFileUrl').ajaxSubmit({
            success: function (data) {
                taskFileUrl = data;
                $('#task-file-url').prop('href', API.fileAddressUrl + taskFileUrl);
                layer.msg('上传成功!', {icon: 1, time: 1000})
            }, error: function (e) {
                layer.msg('上传失败!', {icon: 5, time: 1000})
            }
        });
    });

    $('#add-other-tag').unbind('click').click(function () {
        addTagDialog = layer.open({
            title: '标 签 选 择（额 外 标 签）',
            type: 1,
            area: ['32%', '98%'], //宽高
            content: $('#tag-choose-dialog'),
            zIndex: layer.zIndex, //重点1
            success: function (layero) {
                layer.setTop(layero); //重点2
            }
        });
    });
    // 新建: 需要标签，模板，文件地址
    $('.report-add').click(function () {
        layer.open({
            title: '邮件发送',
            type: 1,
            area: ['56%', '52%'], //宽高
            content: $('#report-add-dialog')
        });
    });

    API.movement.emailManage.getAllTemplate(function (rep) {
        var dom = [];
        var repLen = rep.length;
        for (var i = 0; i < repLen; i++) {
            dom.push('<option value="' + rep[i].id + '">' + rep[i].template_name + '</option> ');
        }
        $('.email-template').append(dom.join(''));
    });
});
