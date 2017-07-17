/**
 * Created by Msater Zg on 2017/2/6.
 */
/**
 * Created by Msater Zg on 2017/2/6.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    var api = require('../../common/api');
    var sysTem = window.parent.SYSTEM;

    //判断是否为删除操作
    var operationFlag;
    var depId = '';
    var layClose;
    getAllDep();
    //添加按钮的点击事件
    $('#add-dep').click(function () {
        operationFlag = true;
        insertFormValue(false, "", "");
        layClose = layer.open({
            title: ' 添 加 部 门',
            type: 1,
            area: ['45%', '60%'],
            maxmin: true, //开启最大化最小化按钮
            content: $('.add-dep-form'),
        });
    });
    //提交按钮的点击事件
    $('#post-dep').click(function () {
        if ($('#dep-name').val() === '' || $('#dep-no').val() === '') {
            layer.msg(" 值 不 可 为 空 ");
        } else {
            if (operationFlag) {
                postDepData($('#dep-name').val(), $('#dep-no').val());
            } else {
                updateDep($('#dep-name').val(), $('#dep-no').val(), depId);
            }
            layer.close(layClose);
        }
    });

    $('#cancel-dep').click(function () {
        layer.close(layClose);
    });

    //键盘控制提交
    $(document).keypress(function (e) {
        if (e.charCode == 13) {
            $("#post-dep").trigger("click");
        }
    });

    /**
     * 弹出框的控制
     * */
    function insertFormValue(flag, dep_no, dep_name) {
        if (flag) {
            $('#dep-no').val(dep_no);
            $('#dep-name').val(dep_name);
        } else {
            $('#dep-no').val("");
            $('#dep-name').val("");
        }
    }

    /**
     *
     *获取所有的部门
     * @return <Boolean> 无
     */
    function getAllDep() {
        api.system.depManage.getAllDep(function (rep) {
            $('.main-context').empty();
            var dep_data = rep.data;
            var dep_data_length = rep.data.length;
            var dom_arry = [];
            for (var i = 0; i < dep_data_length; i++) {
                dom_arry.push('<div class="single-member-card dep-card">');
                dom_arry.push('<div class="card-info">');
                dom_arry.push('<h4>' + dep_data[i].dep_name + '</h4>');
                dom_arry.push('<h5>编号:' + dep_data[i].dep_no + '</h5>');
                dom_arry.push('<h5>时间:' + dep_data[i].dep_createtime.substring(0, 10) + '</h5>');
                dom_arry.push('</div>');
                dom_arry.push('<div class="card-touch">');
                dom_arry.push('<span  class="glyphicon glyphicon-repeat span-blue span-icon update-span" data-toggle="tooltip" data-placement="top" title="修 改" dep-no = "' + dep_data[i].dep_no + '"  dep-id = "' + dep_data[i].id + '"  dep-name = "' + dep_data[i].dep_name + '"></span>');
                dom_arry.push('<span class="glyphicon glyphicon-user span-yellow span-icon look-span" data-toggle="tooltip" data-placement="top" title="查 看" dep-no = "' + dep_data[i].dep_no + '"  dep-id = "' + dep_data[i].id + '"  dep-name = "' + dep_data[i].dep_name + '"></span>');
                dom_arry.push('<span class="glyphicon glyphicon-trash span-red span-icon delete-span" data-toggle="tooltip" data-placement="top" title="删 除" dep-no = "' + dep_data[i].dep_no + '"  dep-id = "' + dep_data[i].id + '"  dep-name = "' + dep_data[i].dep_name + '"></span>');
                dom_arry.push('</div>');
                dom_arry.push('</div>');
            }
            $('.main-context').append(dom_arry.join(''));
            $('.card-touch span').tooltip();
            //删除的点击
            $('.delete-span').click(function () {
                /* deleteById($(this).attr('dep-id'));*/
                var dep_id = $(this).attr('dep-id');
                api.system.depManage.deleteDep(dep_id, function (rep) {
                    if (rep.result) {
                        getAllDep();
                        layer.msg(' 删 除 成 功', {
                            icon: 1,
                            time: 1200,
                        });
                    } else {
                        layer.msg(' 删 除 失 败', {
                            icon: 2,
                            time: 1200,
                        });
                    }
                });
                /* $.deleteData({
                 id: dep_id,
                 url: '../deleteById',
                 deleteCallBack: function () {
                 }

                 });*/
            });
            //查看的点击事件
            $('.look-span').click(function () {
                //根据id获取部门
                getUserByDepNo($(this).attr('dep-no'));
                layClose = layer.open({
                    title: '' + $(this).attr('dep-name') + ' 人员管理',
                    type: 1,
                    area: ['60%', '60%'],
                    maxmin: true, //开启最大化最小化按钮
                    content: $('.look-dep-user'),
                });
            });
            //修改点击事件
            $('.update-span').click(function () {
                depId = $(this).attr('dep-id');
                operationFlag = false;
                insertFormValue(true, $(this).attr('dep-no'), $(this).attr('dep-name'));
                layClose = layer.open({
                    title: ' 添 加 部 门',
                    type: 1,
                    area: ['45%', '60%'],
                    content: $('.add-dep-form'),
                });
            });
        });
    }

    /**
     *
     *添加部门
     *
     * @param <String> arg1 参数1
     * @param <String> arg2 参数2
     * @return <Boolean> 无
     */
    function postDepData(dep_name, dep_no) {
        api.system.depManage.postDepData(dep_name, dep_no, function (rep) {
            if (rep.result == 1) {
                getAllDep();
                layer.msg(' 添 加 成 功', {
                    icon: 1,
                    time: 1200,
                });
            } else {
                layer.msg(' 添 加 失 败', {
                    icon: 2,
                    time: 1200,
                });
            }
        });
    }

    /**
     *修改部门信息
     */
    function updateDep(dep_name, dep_no, depId) {
        api.system.depManage.updateDep(dep_name, dep_no, depId, function (rep) {
            if (rep.result == 1) {
                getAllDep();
                layer.msg(' 修 改 成 功', {
                    icon: 1,
                    time: 1200,
                });
            } else {
                layer.msg(' 修 改 失 败', {
                    icon: 2,
                    time: 1200,
                });
            }
        });
    }

    /**
     *
     *根据部门的dep_no,获取本部门的所有的人
     *
     * @param <String> arg2 参数2
     * @return <Boolean> 无
     */
    function getUserByDepNo(dep_no) {
        api.system.depManage.getUserByDepNo(dep_no, function (rep) {
            if (rep.result == 0) {
                $('.look-dep-user .people_number label').text('0');
                $('.look-dep-user span').remove();
            } else {
                var user_data = rep.data;
                var user_data_length = rep.data.length;
                $('.look-dep-user .people_number label').text(user_data_length);
                var userDataArry = [];
                $('.look-dep-user span').remove();
                for (var i = 0; i < user_data_length; i++) {
                    userDataArry.push('<span class="label dep-user-show span-label label-primary">');
                    userDataArry.push('' + user_data[i].user_name + '&nbsp;&nbsp;&nbsp;&nbsp;<span class="glyphicon glyphicon-remove span-icon-cursor user_delete" user-loginname="' + user_data[i].user_loginname + '"></span>');
                    userDataArry.push('</span>');
                }
                $('.look-dep-user').append(userDataArry.join(''));
                $('.user_delete').click(function () {
                    var user = {
                        user_loginname: $(this).attr("user-loginname"),
                        user_dep: "",
                    };
                    api.system.userManage.updateUserInfo(JSON.stringify(user), function (rep) {
                        if (rep.result == 1) {
                            layer.msg(' 修 改 成 功 ', {
                                icon: 1,
                                time: 1200,
                                success: function () {
                                    /* $('#user-table').bootstrapTable('refresh', null);*/
                                }
                            });
                        } else {
                            layer.msg(' 修 改 失 败', {
                                icon: 2,
                                time: 1200,
                            });
                        }
                    });
                    $(this).parent().addClass('animated zoomOutDown');
                    var user_number = (parseInt($('.look-dep-user .people_number label').text(), 10)) - 1;
                    $('.look-dep-user .people_number label').text(user_number);
                    var this_ = this;
                    setTimeout(function () {
                        $(this_).parent().remove();
                    }, 700);
                });

            }
        });
    }

});
