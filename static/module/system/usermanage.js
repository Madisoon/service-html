/**
 * Created by Msater Zg on 2017/2/6.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    var api = require('../../common/api');
    var sysTem = window.parent.SYSTEM;
    var customDialog = "";
    var userOperstion;
    //初始化表格
    $('#user-table').bootstrapTable({
        columns: [{
            checkbox: true
        }, {
            field: 'user_loginname',
            searchable: true,
            sortable: true,
            title: '账号'
        }, {
            field: 'user_name',
            searchable: true,
            title: '姓名'
        }, {
            field: 'user_phone',
            searchable: true,
            title: '手机号'
        }, {
            field: 'user_createtime',
            title: '创建时间'
        }, {
            field: 'role_name',
            title: '角色'
        }, {
            field: 'dep_name',
            title: '部门'
        }],
        pageNumber: 1,
        pageSize: 12,
        search: true,
        dataField: 'data',//指定后台的数据的名称
        undefinedText: '--',
        showColumns: 'true',
        classes: 'table table-bordered table-hover',
        method: 'post',
        formatSearch: function () {
            return "任意搜索";
        },
        url: '' + api.baseUrl + '/getAllUser',
        queryParamsType: "undefined",
        pagination: true,
        paginationHAlign: 'left',
        paginationDetailHAlign: 'right',
        onClickRow: function (row) {
            userOperstion = false;
            getSingleInfo(row);
        },
        onLoadSuccess: function (data) {
        }
    });


    //保存点击事件
    $('#reserve-button').unbind('click').click(function () {
        /* insertSysUser();*/
        var userData = getFormValue();
        if (userData.user_loginname == "" ||
            userData.user_name == "" ||
            userData.user_phone == "" ||
            userData.user_dep == "" ||
            userData.user_role == "") {
            layer.msg('抱歉,数据没有填写完整！', {
                time: 1500,
                zIndex: layer.zIndex, //重点1
                success: function (layero) {
                    layer.setTop(layero); //重点2
                }
            });
        } else {
            //密码要想等
            if (userOperstion) {
                //插入密码不为空
                if ($('.form-control.user_password').val() == "" || $('.form-control.user_password_sure').val() == "") {
                    layer.msg('抱歉,数据没有填写完整！', {
                        time: 1500,
                        zIndex: layer.zIndex, //重点1
                        success: function (layero) {
                            layer.setTop(layero); //重点2
                        }
                    });
                } else {
                    if ($('.form-control.user_password').val() != $('.form-control.user_password_sure').val()) {
                        layer.msg('抱歉,两次密码不一致！', {
                            time: 1500,
                            zIndex: layer.zIndex, //重点1
                            success: function (layero) {
                                layer.setTop(layero); //重点2
                            }
                        });
                    } else {
                        userData.user_password = $('.form-control.user_password').val();
                        api.system.userManage.insertSysUser(JSON.stringify(userData), function (rep) {
                            if (rep.result == 1) {
                                layer.close(customDialog);
                                layer.msg(' 新 增 成 功 ', {
                                    icon: 1,
                                    time: 1200,
                                    success: function () {
                                        $('#user-table').bootstrapTable('refresh', null);
                                    }
                                });
                            } else {
                                layer.msg(' 新 增 失 败', {
                                    icon: 2,
                                    time: 1200,
                                });
                            }
                        });
                    }
                }
            } else {
                //修改密码可以为空
                if ($('.form-control.user_password').val() == "" && $('.form-control.user_password_sure').val() == "") {
                    api.system.userManage.updateUserInfo(JSON.stringify(userData), function (rep) {
                        if (rep.result == 1) {
                            layer.close(customDialog);
                            layer.msg(' 修 改 成 功 ', {
                                icon: 1,
                                time: 1200,
                                success: function () {
                                    $('#user-table').bootstrapTable('refresh', null);
                                }
                            });
                        } else {
                            layer.msg(' 修 改 失 败', {
                                icon: 2,
                                time: 1200,
                            });
                        }
                    });
                } else {
                    if ($('.form-control.user_password').val() != $('.form-control.user_password_sure').val()) {
                        layer.msg('抱歉,两次密码不一致！', {
                            time: 1500,
                            zIndex: layer.zIndex, //重点1
                            success: function (layero) {
                                layer.setTop(layero); //重点2
                            }
                        });
                    } else {
                        userData.user_password = $('.form-control.user_password').val();
                        api.system.userManage.updateUserInfo(JSON.stringify(userData), function (rep) {
                            if (rep.result == 1) {
                                layer.close(customDialog);
                                layer.msg(' 修 改 成 功 ', {
                                    icon: 1,
                                    time: 1200,
                                    success: function () {
                                        $('#user-table').bootstrapTable('refresh', null);
                                    }
                                });
                            } else {
                                layer.msg(' 修 改 失 败', {
                                    icon: 2,
                                    time: 1200,
                                });
                            }
                        });
                    }
                }
            }
        }
    });
    //取消点击事件
    $('#cancel-button').unbind('click').click(function () {
        layer.close(customDialog);
    });
    //新增点击事件
    $('#addUserData').unbind('click').click(function () {
        userOperstion = true;
        insertOrGetValue(false, '');
        customDialog = layer.open({
            title: ' 用户信息管理 ',
            type: 1,
            area: ['60%', '90%'], //宽高
            content: $('#userInfoDialog')
        });
    });
    $('#deleteUserData').unbind('click').click(function () {
        var dataUser = $('#user-table').bootstrapTable('getSelections', null);
        var dataUserLen = dataUser.length;
        var data = [];
        if (dataUserLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (var i = 0; i < dataUserLen; i++) {
                data.push(dataUser[i].id);
            }
            api.system.userManage.deleteUser(data.join('@'), function (rep) {
                if (rep.result) {
                    $('#user-table').bootstrapTable('refresh', null);
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

    /**
     *得到表单的值
     */
    function getFormValue() {
        var userDatat = {
            user_loginname: $('.form-control.user_loginname').val(),
            user_name: $('.form-control.user_name').val(),
            user_phone: $('.form-control.user_phone').val(),
            user_dep: $('.form-control.user_dep').val(),
            user_role: $('.form-control.user_role').val(),
        };
        return userDatat;
    }

    /**
     * 初始化表单的值
     * @param flag
     * @param row
     */
    function insertOrGetValue(flag, row) {
        if (flag) {
            $('.form-control.user_loginname').prop('disabled', true);
            $('.form-control.user_loginname').val(row.user_loginname);
            $('.form-control.user_name').val(row.user_name);
            $('.form-control.user_phone').val(row.user_phone);
            $('.form-control.user_dep').val(row.user_dep);
            $('.form-control.user_role').val(row.user_role);
            $('.form-control.user_role').val(row.user_role);
            $('.form-control.user_password').val("");
            $('.form-control.user_password_sure').val("");
        } else {
            $('.form-control.user_loginname').prop('disabled', false);
            $('.form-control.user_loginname').val("");
            $('.form-control.user_name').val("");
            $('.form-control.user_phone').val("");
            $('.form-control.user_password').val("");
            $('.form-control.user_password_sure').val("");
        }
    }

    /**
     * 得到用户的信息
     * @param row
     */
    function getSingleInfo(row) {
        insertOrGetValue(true, row);
        customDialog = layer.open({
            title: ' 用户信息管理 ',
            type: 1,
            area: ['60%', '90%'], //宽高
            content: $('#userInfoDialog')
        });
    }

    /**
     * 得到部门和角色信息
     */

    api.system.depManage.getAllDepRole(function (rep) {
        var data = rep.data;
        var roleData = rep.data.role;
        var roleDataLen = rep.data.role.length;
        var roleDom = [];
        var depDom = [];
        for (var i = 0; i < roleDataLen; i++) {
            roleDom.push('<option value="' + roleData[i].id + '">' + roleData[i].role_name + '</option>');
        }

        var depData = rep.data.dep;
        var depDataLen = rep.data.dep.length;
        for (var i = 0; i < depDataLen; i++) {
            depDom.push('<option value="' + depData[i].dep_no + '">' + depData[i].dep_name + '</option>');
        }

        $('.user_dep').append(depDom.join(''));
        $('.user_role').append(roleDom.join(''));
    });
});
