/**
 * Created by Msater Zg on 2017/7/13.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    var api = require('../../common/api');
    var tagShow = require('../../common/tagshow');
    var sysTem = window.parent.SYSTEM;
    //这个标签用来归属这个方案归属于哪一个地区
    var areaId = '';
    var appModuleId = '';
    var areaIds = [];
    var addAppModuleDialog = {};
    var addInfoTagDialog = {};
    var addTopicTagDialog = {};
    var moduleOperateType = 1; // 1是新建 0是修改
    var tagType = 0;
    tagShow.tagOperation.writeDomTag(true, 'info-tag-tree');
    var settingTopic = {
        check: {
            enable: true
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "topic_pid",
                rootPId: 0
            },
            key: {
                name: 'topic_name'
            }
        }
    };
    // 联动性参数设置
    settingTopic.check.chkboxType = {"Y": "", "N": ""};
    var zNodesTopic = null;
    api.movement.topicFocusManage.getAllTopic(function (rep) {
        zNodesTopic = rep;
        $.fn.zTree.init($("#topic-tag-tree"), settingTopic, zNodesTopic);
    });

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

    $('#add-topic').click(function () {
        /*topic-add-dialog*/
        moduleOperateType = 1;
        dialogFormValue({});
        /*addAppModuleDialog = layer.open({
         title: '添加报告',
         type: 1,
         area: ['60%', '85%'], //宽高
         content: $('#topic-add-dialog')
         });*/
    });

    $('#add-info-tag').click(function () {
        addInfoTagDialog = layer.open({
            title: '普通信息标签',
            type: 1,
            area: ['30%', '85%'], //宽高
            content: $('#info-tag-dialog'),
            zIndex: layer.zIndex, //重点1
            success: function (layero) {
                layer.setTop(layero); //重点2
            }
        });
    });

    $('#add-topic-tag').click(function () {
        addTopicTagDialog = layer.open({
            title: '焦点信息标签',
            type: 1,
            area: ['30%', '85%'], //宽高
            content: $('#topic-tag-dialog'),
            zIndex: layer.zIndex, //重点1
            success: function (layero) {
                layer.setTop(layero); //重点2
            }
        });
    });

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

    function tableStart() {
        $('#all-topic-table').bootstrapTable('destroy');
        $('#all-topic-table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'app_module_name',
                searchable: true,
                sortable: true,
                title: '模块名称'
            }, {
                field: 'tag_names',
                searchable: true,
                title: '标签'
            }, {
                field: 'app_module_type',
                searchable: true,
                title: '模块类型',
                formatter: function (value, row, index) {
                    if (value === '1') {
                        return "焦点数据";
                    } else {
                        return "普通数据";
                    }
                }
            }, {
                field: 'app_module_imp_word',
                searchable: true,
                title: '匹配关键词'
            }, {
                field: 'app_module_noimp_word',
                title: '排除关键词'
            }, {
                field: 'app_module_grade',
                title: '信息级别'
            }, {
                field: 'app_module_time',
                searchable: true,
                title: '修改时间'
            }, {
                field: 'user_name',
                searchable: true,
                title: '创建人'
            }],
            pageNumber: 1,
            pageSize: 20,
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            sidePagination: 'client',
            classes: 'table table-bordered table-hover',
            method: 'post',
            url: '' + api.baseUrl + '/getAllAppModule',
            queryParamsType: "undefined",
            queryParams: function (params) {
                var param = {
                    areaId: areaIds.join(','),
                };
                return param;
            },
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right',
            onClickRow: function (row) {
                moduleOperateType = 0;
                appModuleId = row.id;
                dialogFormValue(row);
            }
        });
    }

    function getFormValue() {
        var moduleGrade = [];
        $('.app-module-grade:checked').each(function () {
            moduleGrade.push($(this).val());
        });
        var appModuleInfo = {
            app_module_name: $('.form-control.app-module-name').val(),
            app_module_type: tagType,
            app_module_imp_word: $('.form-control.app-module-imp').val(),
            app_module_noimp_word: $('.form-control.app-module-noimp').val(),
            app_module_grade: moduleGrade.join(','),
            app_module_create: sysTem.user.user_loginname
        };
        return appModuleInfo;
    }

    $('#module-post-btn').click(function () {
        var appModuleInfo = getFormValue();
        var appTag = [];
        var appTagBase = [];
        // 获取到直接选择的标签，
        if (!tagType) {
            appTagBase = tagShow.tagOperation.getTreeValue(false, 'info-tag-tree');
            $('.info-tag').each(function () {
                appTag.push($(this).attr("info-tag-id"));
            });
        } else {
            var treeObj = $.fn.zTree.getZTreeObj('topic-tag-tree');
            // 获取到所有被点击的标签
            var nodes = treeObj.getCheckedNodes(true);
            var tagArrayBase = treeObj.transformToArray(nodes);
            var tagArrayBaseLen = tagArrayBase.length;
            for (var j = 0; j < tagArrayBaseLen; j++) {
                if (!tagArrayBase[j].children) {
                    appTagBase.push(tagArrayBase[j].id);
                }
            }
            $('.topic-tag').each(function () {
                appTag.push($(this).attr("topic-tag-id"));
            });
        }

        if (moduleOperateType) {
            api.app.appModule.insertAppModule(JSON.stringify(appModuleInfo), appTag.join(','), appTagBase.join(','), areaId, function (rep) {
                if (rep.result == 1) {
                    layer.close(addAppModuleDialog);
                    tableStart();
                    layer.msg(' 添加模块成功 ！', {
                        icon: 1,
                        time: 1200,
                    });
                } else {
                    layer.msg(' 添加模块失败 ！', {
                        icon: 2,
                        time: 1200,
                    });
                }
            });
        } else {
            api.app.appModule.updateAppModule(appModuleId, JSON.stringify(appModuleInfo), appTag.join(','), appTagBase.join(','), function (rep) {
                if (rep.result == 1) {
                    layer.close(addAppModuleDialog);
                    tableStart();
                    layer.msg(' 修改模块成功!', {
                        icon: 1,
                        time: 1200,
                    });
                } else {
                    layer.msg(' 修改模块失败!', {
                        icon: 2,
                        time: 1200,
                    });
                }
            });
        }
    });

    $('#add-info-tag-btn').click(function () {
        var tagBase = tagShow.tagOperation.getTreeValue(true, 'info-tag-tree');
        var tagBaseLen = tagBase.length;
        var infoTagDom = [];
        for (var i = 0; i < tagBaseLen; i++) {
            infoTagDom.push('<span class="label label-primary span-icon-cursor info-tag" info-tag-id="' + tagBase[i].id + '"> ');
            infoTagDom.push('' + tagBase[i].name + '&nbsp;&nbsp; ');
            infoTagDom.push('<span class="glyphicon  glyphicon-remove"></span></span>');
        }
        $('#tag-show').empty();
        $('#topic-tag-show').empty();
        $('#tag-show').append(infoTagDom.join(''));
        tagType = 0;
        layer.close(addInfoTagDialog);
    });

    $('#add-topic-tag-btn').click(function () {
        var treeObj = $.fn.zTree.getZTreeObj('topic-tag-tree');
        var nodes = treeObj.getCheckedNodes(true);
        var nodesLen = nodes.length;
        var topicDom = [];
        for (var i = 0; i < nodesLen; i++) {
            topicDom.push('<span class="label label-primary span-icon-cursor topic-tag" topic-tag-id="' + nodes[i].id + '"> ');
            topicDom.push('' + nodes[i].topic_name + '&nbsp;&nbsp;');
            topicDom.push('<span class="glyphicon  glyphicon-remove"></span></span>');
        }
        $('#tag-show').empty();
        $('#topic-tag-show').empty();
        $('#topic-tag-show').append(topicDom.join(''));
        tagType = 1;
        layer.close(addTopicTagDialog);
    });

    $('body').on('click', '.info-tag', function () {
        var infoId = $(this).attr("info-tag-id");
        var treeObj = $.fn.zTree.getZTreeObj('info-tag-tree');
        var node = treeObj.getNodeByParam("id", infoId);
        treeObj.selectNode(node);
        treeObj.checkNode(node, false, false);
        treeObj.updateNode(node);
        $(this).remove();
    });

    $('body').on('click', '.topic-tag', function () {
        var topicId = $(this).attr("topic-tag-id");
        var treeObj = $.fn.zTree.getZTreeObj('topic-tag-tree');
        var node = treeObj.getNodeByParam("id", topicId);
        treeObj.selectNode(node);
        treeObj.checkNode(node, false, false);
        treeObj.updateNode(node);
        $(this).remove();
    });

    $('#delete-topic').click(function () {
        var dataInfo = $('#all-topic-table').bootstrapTable('getSelections', null);
        var dataInfoLen = dataInfo.length;
        var data = [];
        if (dataInfoLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (var i = 0; i < dataInfoLen; i++) {
                data.push(dataInfo[i].id);
            }
            api.app.appModule.deleteAppModule(data.join(','), function (rep) {
                if (rep.result) {
                    tableStart();
                    layer.msg(' 删 除 成 功 ', {
                        icon: 1,
                        time: 1200,
                    });
                } else {
                    layer.msg(' 删 除 失 败 ', {
                        icon: 2,
                        time: 1200,
                    });
                }
            });
        }
    });

    function dialogFormValue(row) {
        var dialogTitle = '';
        if (moduleOperateType) {
            dialogTitle = '新建报告';
            $('.form-control.app-module-name').val("");
            $('.form-control.app-module-imp').val("");
            $('.form-control.app-module-noimp').val("");
            $('#tag-show').empty();
            $('#topic-tag-show').empty();
        } else {
            dialogTitle = '编辑报告';
            $('.form-control.app-module-name').val(row.app_module_name);
            $('.form-control.app-module-imp').val(row.app_module_imp_word);
            $('.form-control.app-module-noimp').val(row.app_module_noimp_word);
            var tagNames = row.tag_names.split(",");
            var tagNamesLen = tagNames.length;
            var tagIds = row.app_module_tag_ids.split(",");
            var tagDom = [];
            var treeObj = $.fn.zTree.getZTreeObj('info-tag-tree');
            var treeObjTopic = $.fn.zTree.getZTreeObj('topic-tag-tree');
            for (var i = 0; i < tagNamesLen; i++) {
                console.log(tagIds[i]);
                var node = {};
                if (row.app_module_type === '1') {
                    //根据id改变标签选中
                    node = treeObjTopic.getNodeByParam("id", tagIds[i]);
                    //设置选择状态
                    treeObjTopic.selectNode(node);
                    //改变被选择的状态
                    treeObjTopic.checkNode(node, true, true);
                    //更新状态
                    treeObjTopic.updateNode(node);
                    tagDom.push('<span class="label label-primary span-icon-cursor topic-tag" topic-tag-id="' + tagIds[i] + '">');
                    tagDom.push('' + tagNames[i] + '&nbsp;&nbsp;');
                    tagDom.push('<span class="glyphicon  glyphicon-remove"></span></span>');
                } else {
                    console.log("执行");
                    node = treeObj.getNodeByParam("id", tagIds[i]);
                    treeObj.selectNode(node);
                    treeObj.checkNode(node, true, true);
                    treeObj.updateNode(node);
                    tagDom.push('<span class="label label-primary span-icon-cursor info-tag" info-tag-id="' + tagIds[i] + '">');
                    tagDom.push('' + tagNames[i] + '&nbsp;&nbsp;');
                    tagDom.push('<span class="glyphicon  glyphicon-remove"></span></span>');
                }
            }
            if (row.app_module_type === '1') {
                $('#topic-tag-show').empty();
                $('#topic-tag-show').append(tagDom.join(''));
            } else {
                $('#tag-show').empty();
                $('#tag-show').append(tagDom.join(''));
            }
        }
        addAppModuleDialog = layer.open({
            title: dialogTitle,
            type: 1,
            area: ['60%', '85%'], //宽高
            content: $('#topic-add-dialog')
        });
    }
});