/**
 * Created by Msater Zg on 2017/2/6.
 */
/**
 * Created by Msater Zg on 2017/1/9.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    var api = require('../../common/api');
    var tagShow = require('../../common/tagshow');
    var tagShowChoose = require('../../common/tagshow');
    var sysTem = window.parent.SYSTEM;
    //这个标签用来归属这个方案归属于哪一个地区
    var areaId = '';
    var areaIds = [];
    var addSchemeDialog;
    var addSchemeTag;
    var chooseTagDialog;
    var schemeId = '';
    var schemeType;
    var chooseId = [];
    var chooseDataTable;
    // 树的初始化设置
    var setting = {
        callback: {
            onClick: onClickCallBack
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "area_parent",
                rootPId: 0
            }
        }
    };
    // 联动性参数设置
    var zNodes = null;
    api.system.areaManage.getAllArea(function (rep) {
        zNodes = rep.data;
        areaId = rep.data[0].id;
        $.fn.zTree.init($("#area-tree"), setting, zNodes);
        var zTree = $.fn.zTree.getZTreeObj("area-tree");//获取ztree对象
        var node = zTree.getNodeByParam('id', rep.data[0].id);//获取id为1的点
        zTree.selectNode(node);//选择点
        zTree.setting.callback.onClick(null, zTree.setting.treeId, node);//调用事件
    });

    function onClickCallBack(event, treeId, treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj("area-tree");
        var nodes = treeObj.transformToArray(treeNode);
        areaId = treeNode.id;
        var nodesLen = nodes.length;
        var idS = [];
        for (var i = 0; i < nodesLen; i++) {
            idS.push(nodes[i].id);
        }
        areaIds = idS;
        tableStart();
    };

    $('#add-scheme').unbind('click').click(function () {
        $('#scheme-post-btn').prop('disabled', false);
        getSetForm("", true);
        schemeType = true;
        addSchemeDialog = layer.open({
            title: ' 新增方案 (创建者:' + sysTem.user.user_name + ')',
            type: 1,
            area: ['52%', '98%'], //宽高
            content: $('#scheme-add-dialog')
        });
    });

    $('#add-scheme-tag').unbind('click').click(function () {
        addSchemeTag = layer.open({
            title: '标 签 选 择',
            type: 1,
            area: ['32%', '98%'], //宽高
            content: $('#scheme-tag-dialog'),
            zIndex: layer.zIndex, //重点1
            success: function (layero) {
                layer.setTop(layero); //重点2
            }
        });
    });

    $('#choose-scheme').unbind('click').click(function () {
        $('.scheme-choose-input').stop().slideToggle();
    });

    $('.form-control.scheme-choose-tag').focus(function () {
        tagShowChoose.tagOperation.writeDomTag(true, 'choose-tag-tree');
        chooseTagDialog = layer.open({
            title: '标 签 选 择',
            type: 1,
            area: ['32%', '98%'], //宽高
            content: $('#choose-scheme-tag-dialog')
        });
    });
    $('#choose-cancel-btn').unbind('click').click(function () {
        layer.close(chooseTagDialog);
    });

    $('#choose-tag-btn').unbind('click').click(function () {
        layer.close(chooseTagDialog);
        var chooseData = tagShowChoose.tagOperation.getTreeValue(true, 'choose-tag-tree');
        var chooseDataLen = chooseData.length;
        var chooseTagId = [];
        var chooseTagName = [];
        for (var i = 0; i < chooseDataLen; i++) {
            chooseTagId.push(chooseData[i].id);
            chooseTagName.push(chooseData[i].name);
        }
        chooseId = chooseTagId;
        $('.form-control.scheme-choose-tag').val(chooseTagName.join(','));
    });

    $('#choose-scheme-sure').unbind('click').click(function () {
        var chooseData = {};
        var schemeName = $('.form-control.scheme-choose-name').val();
        var schemeImp = $('.form-control.scheme-choose-imp').val();
        var schemeNoImp = $('.form-control.scheme-choose-no-imp').val();
        var schemeGrade = $('#scheme-choose-grade').val();
        var schemePlanId = $('#scheme-choose-plan').val();
        var schemeCreater = $('.form-control.choose-creater').val();
        if (schemeName != '') {
            chooseData.scheme_name = schemeName;
        }
        if (schemeImp != '') {
            chooseData.scheme_imp = schemeImp;
        }
        if (schemeNoImp != '') {
            chooseData.scheme_no_imp = schemeNoImp;
        }
        if (schemeGrade != '') {
            chooseData.scheme_grade = schemeGrade;
        }
        if (schemePlanId != '') {
            chooseData.scheme_plan_id = schemePlanId;
        }
        if (schemeCreater != '') {
            chooseData.user_name = schemeCreater;
        }
        chooseDataTable = chooseData;
        tableStart();
    });


    $('#add-tag-btn').unbind('click').click(function () {
        layer.close(addSchemeTag);
        /*var treeObj = $.fn.zTree.getZTreeObj("tag-tree");
         // 获取到所有被点击的标签*/
        var nodes = tagShow.tagOperation.getTreeValue(true, 'tag-tree');
        var nodesLen = nodes.length;
        var dom = [];
        for (var i = 0; i < nodesLen; i++) {
            dom.push('<span class="label label-primary span-icon-cursor scheme-tag" tag-id="' + nodes[i].id + '">' + nodes[i].name + '&nbsp;&nbsp;' +
                '<span class="glyphicon  glyphicon-remove"></span></span>');
        }
        $('#scheme-tag-show').empty();
        $('#scheme-tag-show').append(dom.join(''));
        $('.scheme-tag').unbind('click').click(function () {
            $(this).addClass('animated zoomOut');
            tagShow.tagOperation.writeTagData(false, $(this).attr("tag-id"), 'tag-tree');
            var $this = this;
            setTimeout(function () {
                $($this).remove();
            }, 1000);
        });
    });

    $('#add-cancel-btn').unbind('click').click(function () {
        layer.close(addSchemeTag);
    });

    $('#delete-scheme').unbind('click').click(function () {
        var dataScheme = $('#all-scheme-table').bootstrapTable('getSelections', null);
        var dataSchemeLen = dataScheme.length;
        var dataId = [];
        if (dataSchemeLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (var i = 0; i < dataSchemeLen; i++) {
                dataId.push(dataScheme[i].id);
            }
            api.movement.schemeManage.deleteSchemeId(dataId.join(','), function (rep) {
                if (rep.result) {
                    tableStart();
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
    tagShow.tagOperation.writeDomTag(true, 'tag-tree');
    api.movement.configureManage.getAllPlan(function (rep) {
        var planData = rep.data;
        var planDataLen = planData.length;
        var dom = [];
        for (var i = 0; i < planDataLen; i++) {
            dom.push('<option class="plan-option" value="' + planData[i].id + '">' + planData[i].plan_name + '</option>');
        }
        $('#plan-select .plan-option').remove();
        $('#plan-select').append(dom.join(''));
        $('#scheme-choose-plan').append(dom.join(''));
    });

    $('#scheme-post-btn').unbind('click').click(function () {
        var schemeData = getSchemeValue();
        var tagBase = tagShow.tagOperation.getTreeValue(false, 'tag-tree');
        if (schemeData.schemeTagId.length == 0 ||
            schemeData.schemeData.scheme_name == "" ||
            schemeData.schemeData.scheme_plan_id == "") {
            layer.msg('抱歉,数据没有填写完整！', {
                time: 1500,
                zIndex: layer.zIndex, //重点1
                success: function (layero) {
                    layer.setTop(layero); //重点2
                }
            });
        } else {
            layer.close(addSchemeDialog);
            if (schemeType) {
                api.movement.schemeManage.insertScheme(JSON.stringify(schemeData.schemeData), schemeData.terraceTagId.join(','), schemeData.terraceTagName.join(','), schemeData.schemeTagId.join(','), areaId, tagBase.join(','), function (rep) {
                    if (rep.result) {
                        tableStart();
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
                api.movement.schemeManage.updateScheme(schemeId, schemeData.schemeTagId.join(','), schemeData.terraceTagId.join(','), schemeData.terraceTagName.join(','), JSON.stringify(schemeData.schemeData), tagBase.join(','), function (rep) {
                    if (rep.result) {
                        tableStart();
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
        }
    });

    $('#scheme-cancel-btn').unbind('click').click(function () {
        layer.close(addSchemeDialog);
    });

    function getSchemeValue() {
        /**
         * 方案包含的字段：1，自己信息的字段。2，自己的标签信息。3，自己的地域信息
         */
        var allData = {
            schemeData: {},
            schemeTagId: []
        };
        var schemeGrade = [];
        $('.scheme-grade:checked').each(function () {
            schemeGrade.push($(this).val());
        });
        allData.schemeData = {
            scheme_name: $('#scheme-name').val(),
            scheme_imp: $('#scheme-imp').val(),
            scheme_no_imp: $('#scheme-no-imp').val(),
            scheme_link: $('#scheme-link').val(),
            scheme_no_link: $('#scheme-no-link').val(),
            scheme_grade: schemeGrade.join(','),
            scheme_plan_id: $('#plan-select').val(),
            scheme_creater: sysTem.user.user_loginname,
            scheme_status: $('.scheme-status:checked').val(),
            scheme_interval: $('#scheme-interval').val()
        };
        $('.label-primary.scheme-tag').each(function () {
            allData.schemeTagId.push($(this).attr('tag-id'));
        });
        return allData;
    }

    tableStart();

    function tableStart() {
        $('#all-scheme-table').bootstrapTable('destroy');
        $('#all-scheme-table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'scheme_name',
                searchable: true,
                sortable: true,
                title: '方案名称'
            }, {
                field: 'tag_names',
                searchable: true,
                title: '标签'
            }, {
                field: 'scheme_imp',
                searchable: true,
                title: '匹配关键词'
            }, {
                field: 'scheme_no_imp',
                title: '排除关键词'
            },{
                field: 'scheme_grade',
                title: '信息级别'
            }, {
                field: 'plan_name',
                title: '计划任务名称'
            }, {
                field: 'scheme_time',
                searchable: true,
                title: '修改时间',
                formatter: function (value, row, index) {
                    return value.substring(0, 10);
                }
            }, {
                field: 'user_name',
                searchable: true,
                title: '创建人'
            }],
            pageNumber: 1,
            pageSize: 25,
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            sidePagination: 'client',
            classes: 'table table-bordered table-hover',
            method: 'post',
            url: '' + api.baseUrl + '/getAllSchemeChoose',
            queryParamsType: "undefined",
            queryParams: function (params) {
                var param = {
                    areaId: areaIds.join(','),
                    chooseSchemeData: JSON.stringify(chooseDataTable),
                    tagId: chooseId.join(',')

                };
                return param;
            },
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right',
            onClickRow: function (row) {
                schemeId = row.id;
                schemeType = false;
                addSchemeDialog = layer.open({
                    title: '方案编辑',
                    type: 1,
                    area: ['52%', '98%'], //宽高
                    content: $('#scheme-add-dialog')
                });
                getSetForm(row, false);
                if (sysTem.user.role_name === '超级管理员') {
                    $('#scheme-post-btn').prop('disabled', false);
                } else {
                    if (sysTem.user.user_loginname === row.user_loginname) {
                        $('#scheme-post-btn').prop('disabled', false);
                    } else {
                        $('#scheme-post-btn').prop('disabled', true);
                    }
                }
            },
            onLoadSuccess: function (data) {
            }
        });
    }


    //表单赋值或者清空
    function getSetForm(row, flag) {
        console.log(row);
        //表单清空
        var treeObj = $.fn.zTree.getZTreeObj("tag-tree");
        tagShow.tagOperation.writeTagData(false, '', 'tag-tree');
        if (flag) {
            $('#scheme-tag-show').empty();
            $('.scheme-grade').prop('checked', true);
            $('#scheme-name').val("");
            $('#scheme-imp').val("");
            $('#scheme-no-imp').val("");
            $('#scheme-link').val("");
            $('#scheme-no-link').val("");
            $('#plan-select').val("");
            $('#scheme-interval').val("5");
            $('.scheme-status[value=0]').prop('checked', true);
            $('#terrace-tag-show').empty();
        } else {
            $('#terrace-tag-show').empty();
            $('.scheme-grade').prop('checked', false);
            $('#scheme-name').val(row.scheme_name);
            $('#scheme-imp').val(row.scheme_imp);
            $('#scheme-no-imp').val(row.scheme_no_imp);
            $('#scheme-link').val(row.scheme_link);
            $('#scheme-no-link').val(row.scheme_no_link);
            $('#plan-select').val(row.scheme_plan_id);
            $('#scheme-interval').val(row.scheme_interval);
            var tagIds = row.tag_ids.split(',');
            var tagNames = row.tag_names.split(',');
            var tagIdsLen = tagIds.length;
            var dom = [];
            for (var i = 0; i < tagIdsLen; i++) {
                tagShow.tagOperation.writeTagData(true, tagIds[i], 'tag-tree');
                dom.push('<span class="label label-primary span-icon-cursor scheme-tag" tag-id="' + tagIds[i] + '">' + tagNames[i] + '&nbsp;&nbsp;' +
                    '<span class="glyphicon  glyphicon-remove"></span></span>');
            }
            $('#scheme-tag-show').empty();
            $('#scheme-tag-show').append(dom.join(''));
            $('.scheme-tag').unbind('click').click(function () {
                $(this).addClass('animated zoomOut');
                tagShow.tagOperation.writeTagData(false, $(this).attr("tag-id"), 'tag-tree');
                var $this = this;
                setTimeout(function () {
                    $($this).remove();
                }, 1000);
            });
            var schemeGrade = row.scheme_grade.split(',');
            var schemeGradeLen = schemeGrade.length;
            for (var i = 0; i < schemeGradeLen; i++) {
                $('.scheme-grade[value=' + schemeGrade[i] + ']').prop('checked', true);
            }

            $('.scheme-status[value=' + row.scheme_status + ']').prop('checked', true);
        }
    }
});