/**
 * Created by Msater Zg on 2017/1/6.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    var api = require('../../common/api');
    var maxId = 0;
    getMaxId();
    function getMaxId() {
        api.tag.tagShow.getIdMax(function (rep) {
            if (rep.result > 0) {
                maxId = (parseInt(rep.data[0].id, 10) + 1);
            } else {
                maxId = 1;
            }

        });
    }

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
            onRename: zTreeOnRename
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "tag_parent",
                rootPId: 0
            }
        }

    };
    var zNodes = null;
    var zTree, rMenu;
    api.tag.tagShow.getAllTag(function (rep) {
        zNodes = rep.data;
        $.fn.zTree.init($("#treeDemo"), setting, zNodes);
        zTree = $.fn.zTree.getZTreeObj("treeDemo");
        rMenu = $("#rMenu");
    });
    // 修改名称成功之后的回调
    function zTreeOnRename(event, treeId, treeNode, isCancel) {
        api.tag.tagShow.updateTag(treeNode.id, treeNode.name, function (rep) {
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
            console.log(node);
            var nodeLen = node.length;
            for (var i = 0; i < nodeLen; i++) {
                allParent.push(node[i].id)
            }
            newNode = {name: "新增标签", tag_parent: zTree.getSelectedNodes()[0].id, id: maxId};

            zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
        } else {
            newNode = {name: "新增标签", tag_parent: 0, id: maxId};
            zTree.addNodes(null, newNode);
        }
        api.tag.tagShow.insertTag(JSON.stringify(newNode), JSON.stringify(allParent), function (rep) {
            if (rep.result > 0) {
                getMaxId();
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
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
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
        api.tag.tagShow.deleteTag(idS.join(','), function (rep) {

        });

    }

    function changeName() {
        hideRMenu();
        var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
            nodes = zTree.getSelectedNodes(),
            treeNode = nodes[0];
        if (nodes.length == 0) {
            alert("请先选择一个节点");
            return;
        }
        zTree.editName(treeNode);
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
});
