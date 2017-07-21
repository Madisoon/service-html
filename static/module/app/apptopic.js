/**
 * Created by Msater Zg on 2017/7/13.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    var api = require('../../common/api');
    var sysTem = window.parent.SYSTEM;
    var topicId = '';
    var topicIdGroup = '';
    var flag = 1;
    var addReportDialog = {};
    var topicContextId = "";

    var ue = UE.getEditor('editor');

    function qqTableStart() {
        $('#topic-context-table').bootstrapTable('destroy');
        $('#topic-context-table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'topic_title',
                searchable: true,
                sortable: true,
                title: '标题',
                formatter: function (value, row, index) {
                    var valueReturn;
                    if (value.length > 10) {
                        valueReturn = value.substring(0, 10) + '......';
                    } else {
                        valueReturn = value;
                    }
                    return valueReturn;
                }
            }, {
                field: 'topic_abstract',
                searchable: true,
                title: '摘要',
                formatter: function (value, row, index) {
                    var valueReturn;
                    if (value.length > 35) {
                        valueReturn = value.substring(0, 35) + '......';
                    } else {
                        valueReturn = value;
                    }
                    return valueReturn;
                }
            }, {
                field: 'user_name',
                searchable: true,
                title: '创建者'
            }, {
                field: 'topic_time',
                searchable: true,
                title: '更新时间'
            }, {
                field: 'topic_status',
                searchable: true,
                title: '状态',
                formatter: function (value, row, index) {
                    if (value === '1') {
                        return "已发布";
                    } else {
                        return "<span style='color: red; font-weight: 600'>未发布</span>";
                    }
                }
            }],
            pageNumber: 1,
            pageSize: 10,
            /*search: true,*/
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            sidePagination: 'server',
            /*showColumns: 'true',*/
            classes: 'table table-bordered table-hover',
            method: 'post',
            url: '' + api.baseUrl + '/getTopicContextByTopicId',
            queryParamsType: "undefined",
            queryParams: function (params) {
                var param = {
                    pageNumber: params.pageNumber,
                    pageSize: params.pageSize,
                    topicId: topicIdGroup.join(','),
                };
                return param;
            },
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right',
            onDblClickRow: function (row) {
                flag = 0;
                $('.dialog-show').slideDown('fast');
                /*addReportDialog = layer.open({
                 title: '编辑报告',
                 type: 1,
                 area: ['96%', '90%'], //宽高
                 content: $('#topic-post-dialog')
                 });*/
                setGetFormValue(row);
            },
            onLoadSuccess: function (data) {
            }
        });
    }

    $('#add-topic-report').click(function () {
        flag = 1;
        setGetFormValue({});
        $('.dialog-show').slideDown('fast');
        /*addReportDialog = layer.open({
         title: '新增报告',
         type: 1,
         area: ['96%', '90%'], //宽高
         content: $('#topic-post-dialog')
         });*/
    });

    $('#post-topic-btn').click(function () {
        var topicTitle = $('.form-control.topic-title').val();
        var topicAbstract = $('.form-control.topic-abstract').val();
        var topicContext = ue.getContent();
        var topicInfo = {
            topic_title: topicTitle,
            topic_abstract: topicAbstract,
            topic_context: topicContext,
            topic_username: sysTem.user.user_loginname
        };

        if (flag) {
            api.movement.topicFocusManage.insertTopicContext(topicId, JSON.stringify(topicInfo), function (rep) {
                if (rep.result > 0) {
                    qqTableStart();
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
                $('.dialog-show').slideUp('fast');
            });
        } else {
            api.movement.topicFocusManage.updateTopicContext(topicContextId, JSON.stringify(topicInfo), function (rep) {
                if (rep.result > 0) {
                    qqTableStart();
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
                $('.dialog-show').slideUp('fast');
            });
        }
    });

    $('#topic-show-btn').click(function () {
        $('#topic-show-dialog').empty();
        $('#topic-show-dialog').append(ue.getContent());
        layer.open({
            title: '编辑报告',
            type: 1,
            area: ['96%', '90%'], //宽高
            content: $('#topic-show-dialog'),
            zIndex: layer.zIndex, //重点1
            success: function (layero) {
                layer.setTop(layero); //重点2
            }
        });
    });

    // 树的初始化设置
    var setting = {
        edit: {
            enable: true,
            showRemoveBtn: false,
            showRenameBtn: false
        },
        view: {
            dblClickExpand: false
        },
        check: {
            enable: true
        },
        callback: {
            onRightClick: OnRightClick,
            onClick: onClickCallBack,
            onRename: zTreeOnRename
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
    var zNodes = null;
    var zTree, rMenu;
    initializeTree();
    function initializeTree() {
        api.movement.topicFocusManage.getAllTopic(function (rep) {
            zNodes = rep;
            $.fn.zTree.init($("#topic-tree"), setting, zNodes);
            zTree = $.fn.zTree.getZTreeObj("topic-tree");
            var node = zTree.getNodeByParam('id', rep[0].id);//
            zTree.selectNode(node);//选择点
            zTree.setting.callback.onClick(null, zTree.setting.treeId, node);//调用事件
            rMenu = $("#rMenu");
        });
    }

    // 修改名称成功之后的回调
    function zTreeOnRename(event, treeId, treeNode, isCancel) {
        api.movement.topicFocusManage.updateTopic(treeNode.id, treeNode.topic_name, function (rep) {
        });
    }

    // 右键菜单点击
    function OnRightClick(event, treeId, treeNode) {
        if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
            zTree.cancelSelectedNode();
            showRMenu("root", event.clientX, event.clientY);
        } else if (treeNode && !treeNode.noR) {
            zTree.selectNode(treeNode);
            showRMenu("node", event.clientX, event.clientY);
        }
    }

    function showRMenu(type, x, y) {
        $("#rMenu ul").show();
        if (type == "root") {
            $('#update-name').hide();
            $('#delete-tag').hide();
        } else {
            $('#update-name').show();
            $('#delete-tag').show();
        }
        rMenu.css({"top": y + "px", "left": x + "px", "visibility": "visible"});
        $("body").bind("mousedown", onBodyMouseDown);
    }

    function hideRMenu() {
        if (rMenu) rMenu.css({"visibility": "hidden"});
        $("body").unbind("mousedown", onBodyMouseDown);
    }

    function onBodyMouseDown(event) {
        if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
            rMenu.css({"visibility": "hidden"});
        }
    }

    function addTreeNode() {
        hideRMenu();
        var allParent = [];
        var newNode = null;
        var sNodes = zTree.getSelectedNodes();
        if (sNodes.length > 0) {
            var node = sNodes[0].getPath();
            var nodeLen = node.length;
            for (var i = 0; i < nodeLen; i++) {
                allParent.push(node[i].id)
            }
            newNode = {topic_name: "新增标签", topic_pid: zTree.getSelectedNodes()[0].id};
        } else {
            newNode = {topic_name: "新增标签", topic_pid: 0};
        }
        api.movement.topicFocusManage.insertTopic(JSON.stringify(newNode), function (rep) {
            console.log(rep);
            if (rep.result > 0) {
                initializeTree();
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
    }

    function removeTreeNode() {
        hideRMenu();
        var treeObj = $.fn.zTree.getZTreeObj("topic-tree");
        var nodes = zTree.getSelectedNodes();
        var nodeId = treeObj.transformToArray(nodes[0]);
        if (nodes && nodes.length > 0) {
            if (nodes[0].children && nodes[0].children.length > 0) {
                zTree.removeNode(nodes[0]);
            } else {
                zTree.removeNode(nodes[0]);
            }
        }
        var nodeIdLen = nodeId.length;
        var idS = [];
        for (var i = 0; i < nodeIdLen; i++) {
            idS.push(nodeId[i].id);
        }
        api.movement.topicFocusManage.deleteTopic(idS.join(','), function (rep) {
            initializeTree();
        });

    }

    function changeName() {
        hideRMenu();
        var zTree = $.fn.zTree.getZTreeObj("topic-tree"),
            nodes = zTree.getSelectedNodes(),
            treeNode = nodes[0];
        if (nodes.length == 0) {
            alert("请先选择一个节点");
            return;
        }
        zTree.editName(treeNode);
    }

    function onClickCallBack(event, treeId, treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj('topic-tree');
        var nodes = treeObj.transformToArray(treeNode);
        topicId = treeNode.id;
        var nodesLen = nodes.length;
        var topicIds = [];
        for (var i = 0; i < nodesLen; i++) {
            topicIds.push(nodes[i].id)
        }
        topicIdGroup = topicIds;
        qqTableStart();
    }

    function setGetFormValue(row) {
        if (flag) {
            ue.ready(function () {//编辑器初始化完成再赋值
                ue.setContent('');
            });
            $('.form-control.topic-title').val("");
            $('.form-control.topic-abstract').val("");
        } else {
            topicContextId = row.id;
            $('.form-control.topic-title').val(row.topic_title);
            $('.form-control.topic-abstract').val(row.topic_abstract);
            ue.ready(function () {//编辑器初始化完成再赋值
                ue.setContent(row.topic_context);
            });
        }
    }

    $('#add-tag').unbind('click').click(function () {
        addTreeNode();
    });

    $('#update-name').unbind('click').click(function () {
        changeName();
    });

    $('#delete-tag').unbind('click').click(function () {
        removeTreeNode();
    });

    $('#delete-topic-report').unbind('click').click(function () {
        var dataReport = $('#topic-context-table').bootstrapTable('getSelections', null);
        var dataReportLen = dataReport.length;
        var dataId = [];
        if (dataReportLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (var i = 0; i < dataReportLen; i++) {
                dataId.push(dataReport[i].id);
            }
            api.movement.topicFocusManage.deleteTopicContext(dataId.join(','), function (rep) {
                if (rep.result) {
                    qqTableStart();
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
            });
        }
    });

    // 审核发布

    $('#check-topic-report').unbind('click').click(function () {
        var dataReport = $('#topic-context-table').bootstrapTable('getSelections', null);
        var dataReportLen = dataReport.length;
        var dataId = [];
        if (dataReportLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (var i = 0; i < dataReportLen; i++) {
                dataId.push(dataReport[i].id);
            }
            api.movement.topicFocusManage.checkTopicContext(dataId.join(','), function (rep) {
                if (rep.result) {
                    qqTableStart();
                    layer.msg(' 审 核 成 功 ！', {
                        icon: 1,
                        time: 1200,
                    });
                } else {
                    layer.msg(' 审 核 失 败 ！', {
                        icon: 2,
                        time: 1200,
                    });
                }
            });
        }
    });

    $('#close-add-topicContext').click(function () {
        $('.dialog-show').slideUp('fast');
    });

    $('#cancel-topic-btn').click(function () {
        $('.dialog-show').slideUp('fast');
    });

});
