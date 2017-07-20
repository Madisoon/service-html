/**
 * Created by Msater Zg on 2017/7/13.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    var api = require('../../common/api');
    var sysTem = window.parent.SYSTEM;
    var addAppUserDialog = {};
    var addAppModuleDialog = {};
    var areaId = '';
    var areaIds = [];
    var areaIdModules = [];
    var $that = {};
    var userFlag = 1;

    $.datetimepicker.setLocale('zh');
    $('.app-user-expiration-time').datetimepicker({
        format: 'Y-m-d',
        timepicker: false
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


    var settingModule = {
        callback: {
            onClick: onClickCallBackModule
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
    var zNodesModule = null;
    api.system.areaManage.getAllArea(function (rep) {
        zNodesModule = rep.data;
        areaId = rep.data[0].id;
        $.fn.zTree.init($("#module-area-tree"), settingModule, zNodesModule);
        var zTree = $.fn.zTree.getZTreeObj("module-area-tree");//获取ztree对象
        var node = zTree.getNodeByParam('id', rep.data[0].id);//获取id为1的点
        zTree.selectNode(node);//选择点
        zTree.setting.callback.onClick(null, zTree.setting.treeId, node);//调用事件
    });

    function onClickCallBackModule(event, treeId, treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj("module-area-tree");
        var nodes = treeObj.transformToArray(treeNode);
        var nodesLen = nodes.length;
        var idS = [];
        for (var i = 0; i < nodesLen; i++) {
            idS.push(nodes[i].id);
        }
        areaIdModules = idS;
        getAppModuleByAreaId();
    };


    $('#add-app-user').click(function () {
        addAppUserDialog = layer.open({
            title: '焦点信息标签',
            type: 1,
            area: ['60%', '85%'], //宽高
            content: $('#add-app-user-dialog')
        });
    });

    $('.add-new-program').click(function () {
        var newProgram = [];
        newProgram.push('<div class="program-context-item">');
        newProgram.push('<div class="program-name">');
        newProgram.push('<input type="text" class="form-control" placeholder="频道">');
        newProgram.push('</div>');
        newProgram.push('<div class="program-module">');
        newProgram.push('</div>');
        newProgram.push('<div class="program-operation" style="text-align: center">');
        newProgram.push('<span class="glyphicon glyphicon-plus span-green span-icon-cursor add-app-module"></span> ');
        newProgram.push('<span class="glyphicon glyphicon-remove span-red span-icon-cursor module-remove"></span>');
        newProgram.push('</div>');
        newProgram.push('</div>');
        $('.program-context').append(newProgram.join(''));
    });

    $('.program-context').on('click', '.module-remove', function () {
        $(this).parent().parent().remove();
    });

    $('.program-context').on('click', '.add-app-module', function () {
        $that = this;
        addAppModuleDialog = layer.open({
            title: '选择模块',
            type: 1,
            area: ['60%', '85%'], //宽高
            content: $('#add-app-module-dialog')
        });
    });

    function getAppModuleByAreaId() {
        api.app.appModule.getAllAppModuleByAreaId(areaIdModules.join(','), function (rep) {
            $('.search-app-module-show').empty();
            if (rep === '') {
                $('.search-app-module-show').empty();
            } else {
                var moduleDom = [];
                for (var i = 0, repLen = rep.length; i < repLen; i++) {
                    if (rep[i].app_module_type === "0") {
                        moduleDom.push('<label class="checkbox-inline">');
                        moduleDom.push('<input class="module-checkbox" type="checkbox" value="' + rep[i].id + '" data-module-name="' + rep[i].app_module_name + '" >' + rep[i].app_module_name + '(<span class="span-red">普通数据</span>)');
                        moduleDom.push('</label>');
                    } else {
                        moduleDom.push('<label class="checkbox-inline">');
                        moduleDom.push('<input class="module-checkbox" type="checkbox" value="' + rep[i].id + '" data-module-name="' + rep[i].app_module_name + '" >' + rep[i].app_module_name + '(<span class="span-green">焦点数据</span>)');
                        moduleDom.push('</label>');
                    }
                }
                $('.search-app-module-show').append(moduleDom.join(''))
            }
        });
    }

    $('#add-app-module-btn').click(function () {
        var addModuleDom = [];
        $('.module-checkbox:checked').each(function () {
            var moduleName = $(this).attr('data-module-name');
            var moduleId = $(this).val();
            addModuleDom.push('<span class="label label-primary span-icon-cursor module-tag" module-tag-id="' + moduleId + '">');
            addModuleDom.push('' + moduleName + '&nbsp;&nbsp;');
            addModuleDom.push('<span class="glyphicon  glyphicon-remove"></span></span>');
        });
        layer.close(addAppModuleDialog);
        $($that).parent().parent().find('.program-module').empty();
        $($that).parent().parent().find('.program-module').append(addModuleDom.join(''));
    });

    function getFormValue() {
        var userInfo = {
            app_user_loginname: $('.form-control.app-user-name').val(),
            app_user_overdue_time: $('.form-control.app-user-expiration-time').val()
        };
        return userInfo
    }


    function getSetForm() {
        if (userFlag) {

        } else {

        }
    }

    $('#add-app-user-btn').click(function () {
        var userInfo = getFormValue();
        var app_user_pwd = $('.form-control.app-user-pwd').val();
        var app_user_pwd_sure = $('.form-control.app-user-pwd-sure').val();

        var userProgram = [];

        $('.program-context-item').each(function () {
            var userModule = {};
            var moduleTag = [];
            $(this).find('.program-module .module-tag').each(function () {
                moduleTag.push($(this).attr("module-tag-id"));
            });
            userModule.programName = $(this).find('.program-name .form-control').val();
            userModule.programModule = moduleTag;
            userProgram.push(userModule);
        });

        if (userInfo.app_user_loginname === '' || userInfo.app_user_overdue_time === '') {
            layer.msg('抱歉,数据没有填写完整！', {
                time: 1500,
                zIndex: layer.zIndex, //重点1
                success: function (layero) {
                    layer.setTop(layero); //重点2
                }
            });
        } else {
            // 判断是新增还是修改
            if (userFlag) {
                console.log("11111");
                // 新增也就说密码不能为空
                if (app_user_pwd === '' || app_user_pwd_sure === '') {
                    layer.msg('抱歉,数据没有填写完整！', {
                        time: 1500,
                        zIndex: layer.zIndex, //重点1
                        success: function (layero) {
                            layer.setTop(layero); //重点2
                        }
                    });
                } else {
                    if (app_user_pwd === app_user_pwd_sure) {
                        userInfo.app_user_pwd = app_user_pwd;
                        // 开始进行新增
                        alert(areaId);
                        api.app.appUser.insertAppUser(JSON.stringify(userInfo), JSON.stringify(userProgram), areaId, function (rep) {
                            if (rep.result === 1) {
                                layer.close(addAppUserDialog);
                                layer.msg(' 新 增 成 功 ', {
                                    icon: 1,
                                    time: 1200
                                });
                            } else {
                                layer.msg(' 新 增 失 败', {
                                    icon: 2,
                                    time: 1200,
                                });
                            }
                        });

                    } else {
                        layer.msg('抱歉,两次密码不一致！', {
                            time: 1500,
                            zIndex: layer.zIndex, //重点1
                            success: function (layero) {
                                layer.setTop(layero); //重点2
                            }
                        });
                    }
                }
            } else {
                if (app_user_pwd === '' && app_user_pwd_sure === '') {
                    // 密码只要有一个为空，就判定为不想修改密码.进行修改

                } else {
                    if (app_user_pwd === app_user_pwd_sure) {
                        // 需要修改密码
                        userInfo.app_user_pwd = app_user_pwd;
                    } else {
                        layer.msg('抱歉,两次密码不一致！', {
                            time: 1500,
                            zIndex: layer.zIndex, //重点1
                            success: function (layero) {
                                layer.setTop(layero); //重点2
                            }
                        });
                    }
                }
            }

        }
    });

    function tableStart() {
        $('#app-user-table').bootstrapTable('destroy');
        $('#app-user-table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'app_user_loginname',
                title: '用户名称'
            }, {
                field: 'app_user_overdue_time',
                title: '过期时间'
            }, {
                field: 'app_user_time',
                title: '创建时间'
            }],
            pageNumber: 1,
            pageSize: 20,
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            sidePagination: 'client',
            classes: 'table table-bordered table-hover',
            method: 'post',
            url: '' + api.baseUrl + '/getAllAppUserModule',
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
                // 获取到用户
                var rowUserLoginName = row.app_user_loginname;

            }
        });
    }


});