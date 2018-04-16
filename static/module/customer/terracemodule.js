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
    console.log(sysTem);
    //这个标签用来归属这个方案归属于哪一个地区
    var areaId = '';
    var areaIds = [];
    var addTerraceDialog;
    var addTerraceTag;
    var chooseTagDialog;
    var terraceId = '';
    var terraceType;
    var chooseId = [];
    var chooseDataTable;
    var chooseTerraceDialog;
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

    $('#add-terrace').unbind('click').click(function () {
        $('#terrace-post-btn').prop('disabled', false);
        getSetForm("", true);
        terraceType = true;
        addTerraceDialog = layer.open({
            title: ' 新增模块 (创建者:' + sysTem.user.user_name + ')',
            type: 1,
            area: ['52%', '98%'], //宽高
            content: $('#terrace-add-dialog')
        });
    });
    $('#add-terrace-tag').unbind('click').click(function () {
        addTerraceTag = layer.open({
            title: '标 签 选 择',
            type: 1,
            area: ['32%', '98%'], //宽高
            content: $('#terrace-tag-dialog'),
            zIndex: layer.zIndex, //重点1
            success: function (layero) {
                layer.setTop(layero); //重点2
            }
        });
    });

    $('#choose-terrace').unbind('click').click(function () {
        $('.terrace-choose-input').stop().slideToggle();
    });

    api.movement.schemeManage.getTerraceCustomerTag(function (rep) {
        var tagData = rep.value;
        var tagDataLen = rep.value.length;
        var tagDom = [];
        for (var i = 0; i < tagDataLen; i++) {
            tagDom.push('<label class="checkbox-inline">  ' +
                '            <input type="checkbox" class="terrace-tag-id" data-name = "' + tagData[i].name + '" value="' + tagData[i].id + '"> ' + tagData[i].name + '' +
                '            </label>');
        }
        $('.sorting-tag-show').empty();
        $('.sorting-tag-show').append(tagDom.join(''));
    });

    $('#add-sorting-tag').click(function () {
        chooseTerraceDialog = layer.open({
            title: '选择平台标签',
            type: 1,
            area: ['52%', '80%'], //宽高
            content: $('#choose-sorting-tag-dialog')
        });
        $('.terrace-tag-id').prop('checked', false);
    });

    $('#terrace-tag-btn').click(function () {
        var domTag = [];
        $('.terrace-tag-id:checked').each(function () {
            domTag.push('<span class="label label-success span-icon-cursor sorting-tag" tag-name="' + $(this).attr('data-name') + '" tag-id="' + $(this).val() + '">' + $(this).attr('data-name') + '&nbsp;&nbsp;' +
                '<span class="glyphicon  glyphicon-remove"></span></span>');
        });
        $('#sorting-tag-show').empty();
        $('#sorting-tag-show').append(domTag.join(''));
        layer.close(chooseTerraceDialog);
    });

    $('.form-control.terrace-choose-tag').focus(function () {
        tagShowChoose.tagOperation.writeDomTag(true, 'choose-tag-tree');
        chooseTagDialog = layer.open({
            title: '标 签 选 择',
            type: 1,
            area: ['32%', '98%'], //宽高
            content: $('#choose-terrace-tag-dialog')
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
        $('.form-control.terrace-choose-tag').val(chooseTagName.join(','));
    });

    // 筛选
    $('#choose-terrace-sure').unbind('click').click(function () {
        var chooseData = {};
        var terraceName = $('.form-control.terrace-choose-name').val();
        var terraceImp = $('.form-control.terrace-choose-imp').val();
        var terraceNoImp = $('.form-control.terrace-choose-no-imp').val();
        var terraceGrade = $('#terrace-choose-grade').val();
        var terracePlanId = $('#terrace-choose-plan').val();
        var terraceCreater = $('.form-control.choose-creater').val();
        if (terraceName != '') {
            chooseData.terrace_module_name = terraceName;
        }
        if (terraceImp != '') {
            chooseData.terrace_module_imp = terraceImp;
        }
        if (terraceNoImp != '') {
            chooseData.terrace_module_no_imp = terraceNoImp;
        }
        if (terraceGrade != '') {
            chooseData.terrace_module_grade = terraceGrade;
        }
        if (terracePlanId != '') {
            chooseData.terrace_module_plan = terracePlanId;
        }
        if (terraceCreater != '') {
            chooseData.user_name = terraceCreater;
        }
        chooseDataTable = chooseData;
        console.log(chooseData);
        tableStart();
        chooseId = [];
    });


    $('#add-tag-btn').unbind('click').click(function () {
        layer.close(addTerraceTag);
        /*var treeObj = $.fn.zTree.getZTreeObj("tag-tree");
         // 获取到所有被点击的标签*/
        var nodes = tagShow.tagOperation.getTreeValue(true, 'tag-tree');
        var nodesLen = nodes.length;
        var dom = [];
        for (var i = 0; i < nodesLen; i++) {
            dom.push('<span class="label label-primary span-icon-cursor terrace-tag" tag-id="' + nodes[i].id + '">' + nodes[i].name + '&nbsp;&nbsp;' +
                '<span class="glyphicon  glyphicon-remove"></span></span>');
        }
        $('#terrace-tag-show').empty();
        $('#terrace-tag-show').append(dom.join(''));
        $('.terrace-tag').unbind('click').click(function () {
            $(this).addClass('animated zoomOut');
            tagShow.tagOperation.writeTagData(false, $(this).attr("tag-id"), 'tag-tree');
            var $this = this;
            setTimeout(function () {
                $($this).remove();
            }, 1000);
        });
    });

    $('#add-cancel-btn').unbind('click').click(function () {
        layer.close(addTerraceTag);
    });

    $('#delete-terrace').unbind('click').click(function () {
        var dataTerrace = $('#all-terrace-table').bootstrapTable('getSelections', null);
        var dataTerraceLen = dataTerrace.length;
        var dataId = [];
        if (dataTerraceLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (var i = 0; i < dataTerraceLen; i++) {
                dataId.push(dataTerrace[i].id);
            }
            api.movement.terraceManage.deleteTerraceId(dataId.join(','), function (rep) {
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
        $('#terrace-choose-plan').append(dom.join(''));
    });

    $('#terrace-post-btn').unbind('click').click(function () {
        var terraceData = getTerraceValue();
        var tagBase = tagShow.tagOperation.getTreeValue(false, 'tag-tree');

        if (terraceData.terraceTagId.length == 0 ||
            terraceData.terraceData.terrace_name == "" ||
            terraceData.terraceData.terrace_plan_id == "") {
            layer.msg('抱歉,数据没有填写完整！', {
                time: 1500,
                zIndex: layer.zIndex, //重点1
                success: function (layero) {
                    layer.setTop(layero); //重点2
                }
            });
        } else {
            layer.close(addTerraceDialog);
            if (terraceType) {
                api.movement.terraceManage.insertTerrace(JSON.stringify(terraceData.terraceData),
                    terraceData.terraceTagId.join(','),
                    terraceData.sortingTagId.join(','),
                    terraceData.terraceTagName.join(','),
                    areaId,
                    tagBase.join(','),
                    function (rep) {
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
                api.movement.terraceManage.updateTerrace(terraceId, terraceData.terraceTagId.join(','), JSON.stringify(terraceData.terraceData), tagBase.join(','), function (rep) {
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

    $('#terrace-cancel-btn').unbind('click').click(function () {
        layer.close(addTerraceDialog);
    });

    function getTerraceValue() {
        /**
         * 方案包含的字段：1，自己信息的字段。2，自己的标签信息。3，自己的地域信息
         */
        var allData = {
            terraceData: {},
            terraceTagId: [],
            sortingTagId: []
        };
        var terraceGrade = [];
        $('.terrace-grade:checked').each(function () {
            terraceGrade.push($(this).val());
        });
        allData.terraceData = {
            terrace_module_name: $('#terrace-name').val(),
            terrace_module_imp: $('#terrace-imp').val(),
            terrace_module_no_imp: $('#terrace-no-imp').val(),
            terrace_module_grade: terraceGrade.join(','),
            terrace_module_plan: $('#plan-select').val(),
            terrace_module_create: sysTem.user.user_loginname,
            terrace_module_status: $('.terrace-status:checked').val(),
            terrace_module_interval: $('#terrace-interval').val()
        };

        $('.label-success.sorting-tag').each(function () {
            allData.sortingTagId.push($(this).attr('tag-id'));
        });
        $('.label-success.sorting-tag').each(function () {
            allData.terraceTagName.push($(this).attr('tag-name'));
        });
        $('.label-primary.terrace-tag').each(function () {
            allData.terraceTagId.push($(this).attr('tag-id'));
        });
        return allData;
    }

    tableStart();

    function tableStart() {
        $('#all-terrace-table').bootstrapTable('destroy');
        $('#all-terrace-table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'terrace_module_name',
                searchable: true,
                sortable: true,
                title: '模块名称'
            }, {
                field: 'tag_names',
                searchable: true,
                title: '标签'
            }, {
                field: 'terrace_module_imp',
                searchable: true,
                title: '匹配关键词'
            }, {
                field: 'terrace_module_no_imp',
                title: '排除关键词'
            }, {
                field: 'terrace_module_grade',
                title: '信息级别'
            }, {
                field: 'plan_name',
                title: '计划任务名称'
            }, {
                field: 'terrace_module_time',
                searchable: true,
                title: '修改时间'
            }, {
                field: 'user_name',
                searchable: true,
                title: '创建人'
            }],
            pageNumber: 1,
            pageSize: 10,
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            sidePagination: 'server',
            showColumns: 'true',
            classes: 'table table-bordered table-hover',
            method: 'post',
            showExport: true,                     //是否显示导出
            exportDataType: "basic",
            url: '' + api.baseUrl + '/getAllTerraceModuleChoose',
            queryParamsType: "undefined",
            queryParams: function (params) {
                var param = {
                    areaId: areaIds.join(','),
                    chooseTerraceData: JSON.stringify(chooseDataTable),
                    tagId: chooseId.join(',')

                };
                return param;
            },
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right',
            onClickRow: function (row) {
                terraceId = row.id;
                terraceType = false;
                addTerraceDialog = layer.open({
                    title: '模块编辑',
                    type: 1,
                    area: ['52%', '98%'], //宽高
                    content: $('#terrace-add-dialog')
                });
                getSetForm(row, false);
                if (sysTem.user.role_name === '超级管理员') {
                    $('#terrace-post-btn').prop('disabled', false);
                } else {
                    if (sysTem.user.user_loginname === row.user_loginname) {
                        $('#terrace-post-btn').prop('disabled', false);
                    } else {
                        $('#terrace-post-btn').prop('disabled', true);
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
            $('#terrace-tag-show').empty();
            $('.terrace-grade').prop('checked', true);
            $('#terrace-name').val("");
            $('#terrace-imp').val("");
            $('#terrace-no-imp').val("");
            $('#plan-select').val("");
            $('#terrace-interval').val("5");
            $('.terrace-status[value=0]').prop('checked', true);
        } else {
            $('.terrace-grade').prop('checked', false);
            $('#terrace-name').val(row.terrace_module_name);
            $('#terrace-imp').val(row.terrace_module_imp);
            $('#terrace-no-imp').val(row.terrace_module_no_imp);
            $('#plan-select').val(row.terrace_module_plan);
            $('#terrace-interval').val(row.terrace_module_interval);
            var tagIds = row.tag_ids.split(',');
            var tagNames = row.tag_names.split(',');
            var tagIdsLen = tagIds.length;
            var dom = [];
            for (var i = 0; i < tagIdsLen; i++) {
                tagShow.tagOperation.writeTagData(true, tagIds[i], 'tag-tree');
                dom.push('<span class="label label-primary span-icon-cursor terrace-tag" tag-id="' + tagIds[i] + '">' + tagNames[i] + '&nbsp;&nbsp;' +
                    '<span class="glyphicon  glyphicon-remove"></span></span>');
            }
            $('#terrace-tag-show').empty();
            $('#terrace-tag-show').append(dom.join(''));
            $('.terrace-tag').unbind('click').click(function () {
                $(this).addClass('animated zoomOut');
                tagShow.tagOperation.writeTagData(false, $(this).attr("tag-id"), 'tag-tree');
                var $this = this;
                setTimeout(function () {
                    $($this).remove();
                }, 1000);
            });
            var terraceGrade = row.terrace_module_grade.split(',');
            var terraceGradeLen = terraceGrade.length;
            for (var i = 0; i < terraceGradeLen; i++) {
                $('.terrace-grade[value=' + terraceGrade[i] + ']').prop('checked', true);
            }

            $('.terrace-status[value=' + row.terrace_status + ']').prop('checked', true);
        }
    }

});