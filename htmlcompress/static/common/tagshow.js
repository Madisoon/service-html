define(function(require,exports,module){var e=require("./api");return{tagOperation:function(){var a="";return{writeDomTag:function(t,r){a=r;var n={check:{enable:!0},data:{simpleData:{enable:!0,idKey:"id",pIdKey:"tag_parent",rootPId:0}}};n.check.chkboxType={Y:"",N:""};var o=null;t?e.tag.tagShow.getAllTag(function(e){o=e.data,$.fn.zTree.init($("#"+r),n,o)}):e.tag.tagShow.getTypeTag(function(e){o=e.data,$.fn.zTree.init($("#"+r),n,o)})},writeTagData:function(e,a,t){var r=$.fn.zTree.getZTreeObj(""+t);if(e){var n=r.getNodeByParam("id",a);r.selectNode(n),r.checkNode(n,!0,!0),r.updateNode(n)}else if(""===a)console.log(r),r.checkAllNodes(!1);else{var n=r.getNodeByParam("id",a);r.selectNode(n),r.checkNode(n,!1,!1),r.updateNode(n)}},getTreeValue:function(e,a){var t=$.fn.zTree.getZTreeObj(""+a),r=[];if(e)for(var n=t.getCheckedNodes(!0),o=n.length,d=0;d<o;d++)r.push(n[d]);else for(var n=t.getCheckedNodes(!0),i=t.transformToArray(n),c=i.length,g=0;g<c;g++)i[g].children||r.push(i[g].id);return r}}}()}});