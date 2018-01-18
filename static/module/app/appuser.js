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
    var rowUserLoginName = '';

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

    $('#delete-app-user').unbind('click').click(function () {
        var dataAppUser = $('#app-user-table').bootstrapTable('getSelections', null);
        var dataAppUserLen = dataAppUser.length;
        var dataId = [];
        if (dataAppUserLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (var i = 0; i < dataAppUserLen; i++) {
                dataId.push(dataAppUser[i].app_user_loginname);
            }
            api.app.appUser.deleteAppUser(dataId.join(','), function (rep) {
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
            });
        }
    });

    $('#add-app-user').click(function () {
        userFlag = 1;
        getSetFormValue({}, {});
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
                        moduleDom.push('<input class="module-checkbox" type="checkbox"  data-module-type = "' + rep[i].app_module_type + '"  value="' + rep[i].id + '" data-module-name="' + rep[i].app_module_name + '" >' + rep[i].app_module_name + '(<span class="span-red">普通数据</span>)');
                        moduleDom.push('</label>');
                    } else {
                        moduleDom.push('<label class="checkbox-inline">');
                        moduleDom.push('<input class="module-checkbox" type="checkbox"  data-module-type = "' + rep[i].app_module_type + '"    value="' + rep[i].id + '" data-module-name="' + rep[i].app_module_name + '" >' + rep[i].app_module_name + '(<span class="span-green">焦点数据</span>)');
                        moduleDom.push('</label>');
                    }
                }
                $('.search-app-module-show').append(moduleDom.join(''))
            }
        });
    }

    $('#add-app-module-btn').click(function () {
        var addModuleDom = [];
        var moduleType = [];
        $('.module-checkbox:checked').each(function () {
            var moduleName = $(this).attr('data-module-name');
            moduleType.push($(this).attr('data-module-type'));
            var moduleId = $(this).val();
            addModuleDom.push('<span class="label label-primary span-icon-cursor module-tag" module-tag-id="' + moduleId + '">');
            addModuleDom.push('' + moduleName + '&nbsp;&nbsp;');
            addModuleDom.push('<span class="glyphicon  glyphicon-remove"></span></span>');
        });
        layer.close(addAppModuleDialog);
        var flag = true;
        for (var i = 0, moduleTypeLen = moduleType.length; i < moduleTypeLen; i++) {
            if (moduleType[i] !== moduleType[0]) {
                flag = false;
            }
        }
        if (flag) {
            $($that).parent().parent().find('.program-module').empty();
            $($that).parent().parent().find('.program-module').append(addModuleDom.join(''));
        } else {
            layer.msg('抱歉，模块类型不同，不可提交！', {
                time: 1800
            });
        }
    });

    function getFormValue() {
        var userInfo = {
            app_user_loginname: $('.form-control.app-user-name').val(),
            app_user_overdue_time: $('.form-control.app-user-expiration-time').val()
        };
        return userInfo
    }

    $('#add-app-user-btn').click(function () {
        var userInfo = getFormValue();
        var app_user_pwd = $('.form-control.app-user-pwd').val();
        var app_user_pwd_sure = $('.form-control.app-user-pwd-sure').val();

        var userProgram = [];

        $('.program-context-item').each(function () {
            var userModule = {};
            var moduleTag = [];
            var programType = '';
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
                        api.app.appUser.insertAppUser(JSON.stringify(userInfo), JSON.stringify(userProgram), areaId, function (rep) {
                            if (rep.result === 1) {
                                tableStart();
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
                    delete userInfo.app_user_loginname;
                    api.app.appUser.updateAppUser(rowUserLoginName, JSON.stringify(userInfo), JSON.stringify(userProgram), function (rep) {
                        if (rep.result === 1) {
                            tableStart();
                            layer.close(addAppUserDialog);
                            layer.msg(' 修 改 成 功 ', {
                                icon: 1,
                                time: 1200
                            });
                        } else {
                            layer.msg(' 修 改 失 败', {
                                icon: 2,
                                time: 1200,
                            });
                        }
                    });
                } else {
                    if (app_user_pwd === app_user_pwd_sure) {
                        // 需要修改密码
                        userInfo.app_user_pwd = app_user_pwd;
                        delete userInfo.app_user_loginname;
                        api.app.appUser.updateAppUser(rowUserLoginName, JSON.stringify(userInfo), JSON.stringify(userProgram), function (rep) {
                            if (rep.result === 1) {
                                tableStart();
                                layer.close(addAppUserDialog);
                                layer.msg(' 修 改 成 功 ', {
                                    icon: 1,
                                    time: 1200
                                });
                            } else {
                                layer.msg(' 修 改 失 败', {
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
            pageSize: 12,
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
                userFlag = 0;
                rowUserLoginName = row.app_user_loginname;
                api.app.appUser.getSingleAppUser(row.app_user_loginname, function (rep) {
                    getSetFormValue(row, rep.data);
                });
            }
        });
    }

    function getSetFormValue(rowUser, userProgram) {
        var dialogTitle = '';
        if (userFlag) {
            // 新增
            dialogTitle = '新增app用户';
            $('.form-control.app-user-pwd').val('');
            $('.form-control.app-user-pwd-sure').val('');
            $('.form-control.app-user-name').val('');
            $('.form-control.app-user-expiration-time').val('');
            $('.form-control.app-user-name').prop('disabled', false);

            var domValue = [];
            domValue.push('<div class="program-context-item">');
            domValue.push('<div class="program-name">');
            domValue.push('<input type="text" class="form-control" placeholder="频道" value="推荐">');
            domValue.push('</div>');
            domValue.push('<div class="program-module">');
            domValue.push('</div>');
            domValue.push('<div class="program-operation" style="text-align: center">');
            domValue.push('<span class="glyphicon glyphicon-plus span-green span-icon-cursor add-app-module"></span>');
            domValue.push('<span class="glyphicon glyphicon-remove span-red span-icon-cursor module-remove"></span>');
            domValue.push('</div>');
            domValue.push('</div>');
            domValue.push('<div class="program-context-item">');
            domValue.push('<div class="program-name">');
            domValue.push('<input type="text" class="form-control" placeholder="频道" value="预警">');
            domValue.push('</div>');
            domValue.push('<div class="program-module">');
            domValue.push('</div>');
            domValue.push('<div class="program-operation" style="text-align: center">');
            domValue.push('<span class="glyphicon glyphicon-plus span-green span-icon-cursor add-app-module"></span>');
            domValue.push('<span class="glyphicon glyphicon-remove span-red span-icon-cursor module-remove"></span>');
            domValue.push('</div>');
            domValue.push('</div>');
            domValue.push('<div class="program-context-item">');
            domValue.push('<div class="program-name">');
            domValue.push('<input type="text" class="form-control" placeholder="频道" value="聚焦">');
            domValue.push('</div>');
            domValue.push('<div class="program-module">');
            domValue.push('</div>');
            domValue.push('<div class="program-operation" style="text-align: center">');
            domValue.push('<span class="glyphicon glyphicon-plus span-green span-icon-cursor add-app-module"></span>');
            domValue.push('<span class="glyphicon glyphicon-remove span-red span-icon-cursor module-remove"></span>');
            domValue.push('</div>');
            domValue.push('</div>');
            $('.program-context').empty();
            $('.program-context').append(domValue.join(''));
        } else {
            // 修改
            var newProgram = [];
            dialogTitle = '修改app用户';
            $('.form-control.app-user-name').prop('disabled', true);
            $('.form-control.app-user-name').val(rowUser.app_user_loginname);
            $('.form-control.app-user-expiration-time').val(rowUser.app_user_overdue_time);
            for (var i = 0, userProgramLen = userProgram.length; i < userProgramLen; i++) {
                var programName = userProgram[i].app_program_name;
                var appModuleNames = userProgram[i].app_module_names.split(",");
                var appModuleIds = userProgram[i].app_module_ids.split(",");
                newProgram.push('<div class="program-context-item">');
                newProgram.push('<div class="program-name">');
                newProgram.push('<input type="text" class="form-control" placeholder="频道" value="' + programName + '">');
                newProgram.push('</div>');
                newProgram.push('<div class="program-module">');
                for (var j = 0, appModuleIdsLen = appModuleIds.length; j < appModuleIdsLen; j++) {
                    newProgram.push('<span class="label label-primary span-icon-cursor module-tag" module-tag-id="' + appModuleIds[j] + '">');
                    newProgram.push('' + appModuleNames[j] + '&nbsp;&nbsp;');
                    newProgram.push('<span class="glyphicon  glyphicon-remove"></span></span>');
                }
                newProgram.push('</div>');
                newProgram.push('<div class="program-operation" style="text-align: center">');
                newProgram.push('<span class="glyphicon glyphicon-plus span-green span-icon-cursor add-app-module"></span>');
                newProgram.push('<span class="glyphicon glyphicon-remove span-red span-icon-cursor module-remove"></span>');
                newProgram.push('</div>');
                newProgram.push('</div>');
            }
            $('.program-context').empty();
            $('.program-context').append(newProgram.join(''));
        }
        addAppUserDialog = layer.open({
            title: dialogTitle,
            type: 1,
            area: ['60%', '85%'], //宽高
            content: $('#add-app-user-dialog')
        });
    }

    $('body').on('click', '.module-tag', function () {
        $(this).remove();
    });
});