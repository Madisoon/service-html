/**
 * Created by Msater Zg on 2017/2/9.
 */
//封装标签树
/**
 * Created by Msater Zg on 2017/1/6.
 */
define(function (require, exports, module) {

    // 通过 require 引入依赖
    /* require('http://localhost:63343/service-html/spm_modules/layer/layer.js');*/
    //地址，参数（为对象），方法请求成功
    var api = require('./api');
    var tagOperation = (function () {
        var htmlIdBase = '';
        return {
            writeDomTag: function (flag, htmlId) {
                // 树的初始化设置
                htmlIdBase = htmlId;
                var settingTag = {
                    check: {
                        enable: true
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
                settingTag.check.chkboxType = {"Y": "", "N": ""};
                var zNodesTag = null;
                //接口调用
                if (flag) {
                    api.tag.tagShow.getAllTag(function (rep) {
                        zNodesTag = rep.data;
                        $.fn.zTree.init($('#' + htmlId), settingTag, zNodesTag);
                    });
                } else {
                    api.tag.tagShow.getTypeTag(function (rep) {
                        zNodesTag = rep.data;
                        $.fn.zTree.init($("#" + htmlId), settingTag, zNodesTag);
                    });
                }
            },
            writeTagData: function (flag, id, htmlId) {
                var treeObj = $.fn.zTree.getZTreeObj('' + htmlId);
                if (flag) {
                    //根据id改变标签选中
                    var node = treeObj.getNodeByParam("id", id);
                    //设置选择状态
                    treeObj.selectNode(node);
                    //改变被选择的状态
                    treeObj.checkNode(node, true, true);
                    //更新状态
                    treeObj.updateNode(node);
                } else {
                    if (id == '') {
                        treeObj.checkAllNodes(false);
                    } else {
                        //根据id改变标签选中
                        var node = treeObj.getNodeByParam("id", id);
                        //设置选择状态
                        treeObj.selectNode(node);
                        //改变被选择的状态
                        treeObj.checkNode(node, false, false);
                        //更新状态
                        treeObj.updateNode(node);
                    }
                }
            },
            getTreeValue: function (flag, htmlId) {
                //得到选中的标签
                var treeObj = $.fn.zTree.getZTreeObj('' + htmlId);
                var tagBase = [];
                if (flag) {
                    var nodes = treeObj.getCheckedNodes(true);
                    var nodesLen = nodes.length;
                    for (var i = 0; i < nodesLen; i++) {
                        tagBase.push(nodes[i]);
                    }
                } else {
                    // 获取到所有被点击的标签
                    var nodes = treeObj.getCheckedNodes(true);
                    var tagArrayBase = treeObj.transformToArray(nodes);
                    var tagArrayBaseLen = tagArrayBase.length;
                    for (var j = 0; j < tagArrayBaseLen; j++) {
                        if (!tagArrayBase[j].children) {
                            tagBase.push(tagArrayBase[j].id);
                        }
                    }
                }
                return tagBase;
            }
        }
    }());
    return {
        tagOperation: tagOperation
    };
});