/**
 * Created by Msater Zg on 2017/1/25.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    var api = require('../../common/api');
    var sysTem = window.parent.SYSTEM;

    // 树的初始化设置
    var setting = {
        check: {
            enable: true
        },
        callback: {
            onCheck: onCheckCallBack
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
    // 联动性参数设置
    setting.check.chkboxType = {"Y": "", "N": ""};
    var zNodes = null;
    api.tag.tagShow.getTypeTag(function (rep) {
        zNodes = rep.data;
        $.fn.zTree.init($("#tag-tree"), setting, zNodes);
        api.tag.personTag.getMyTag(sysTem.user.user_loginname, function (rep) {
            var treeObj = $.fn.zTree.getZTreeObj("tag-tree");
            var myTag = rep.data;
            var myTagLen = rep.data.length;
            var myTagDom = [];
            for (var i = 0; i < myTagLen; i++) {
                myTagDom.push('<span class="label label-primary" tag-id="' + myTag[i].id + '">' + myTag[i].name + '</span>');
                var node = treeObj.getNodeByParam("id", myTag[i].id);
                //设置选择状态
                treeObj.selectNode(node);
                //改变被选择的状态
                treeObj.checkNode(node, true, true);
                //更新状态
                treeObj.updateNode(node);
            }
            $('.my-tag').empty();
            $('.my-tag').append(myTagDom.join(''));
        });
    });

    function onCheckCallBack(event, treeId, treeNode) {
        if (treeNode.checked) {
            api.tag.personTag.insertMyTag(sysTem.user.user_loginname, treeNode.id, function (rep) {
                $('.my-tag').append('<span class="label label-primary" tag-id="' + treeNode.id + '">' + treeNode.name + '</span>');
            });
        } else {
            api.tag.personTag.deleteMyTag(sysTem.user.user_loginname, treeNode.id, function (rep) {
                $('.my-tag .label[tag-id=' + treeNode.id + ']').remove();
            });
        }
    };
});
