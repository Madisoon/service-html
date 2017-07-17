/**
 * Created by Msater Zg on 2017/2/6.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    var api = require('../../common/api');
    var sysTem = window.parent.SYSTEM;
    var addModuleDialog;
    var addSecondModule;
    var updateFirstModule;
    var updateSecondModule;
    var moduleId;
    //一级模块的全局id
    var module_id;
    getAllModule();
    //添加一级模块的点击事件
    $('#add-first-module').unbind('click').click(function () {
        addModuleDialog = layer.open({
            title: '添 加 一 级 模 块',
            type: 1,
            area: ['30%', '60%'], //宽高
            content: $('#add-first-module-ialog')
        });
    });
    //添加二级模块点击
    $('#add-second-module').unbind('click').click(function () {
        addSecondModule = layer.open({
            title: '添 加 二 级 模 块',
            type: 1,
            area: ['60%', '60%'], //宽高
            content: $('#add-second-module-ialog')
        });
    });

    //删除点击事件
    $('.delete-module').click(function () {
        $(this).parent().parent().addClass('animated zoomOut');
        var this_ = this;
        setTimeout(function () {
            $(this_).parent().parent().remove();
        }, 500);
    });

    //多添加的点击事件
    $('.module-context .second-fix').unbind('click').click(function () {

        var dom = [];
        dom.push('<div class="module-context animated zoomIn">');
        dom.push('<input type="text" class="form-control second-module-name" placeholder="模块名称">');
        dom.push('<input type="text" class="form-control second-module-url second-input" placeholder="模块地址配置">');
        dom.push('<div class="operationicon">');
        dom.push('<span class="glyphicon glyphicon-trash span-icon span-icon-cursor delete-module span-red"></span>');
        dom.push('</div>');
        dom.push('<div style="clear: both"></div>');
        dom.push('</div>');
        $('#add-second-module-ialog .context').append(dom.join(''));


        $('.delete-module').click(function () {
            $(this).parent().parent().addClass('animated zoomOut');
            var this_ = this;
            setTimeout(function () {
                $(this_).parent().parent().remove();
            }, 500);
        });
    });

    //多添加的点击事件
    $('.module-context .fix').click(function () {
        var dom = [];
        dom.push('<div class="module-context animated zoomIn">');
        dom.push('<input type="text" class="form-control module-name" placeholder="模块名称">');
        dom.push('<div class="operationicon">');
        dom.push('<span class="glyphicon glyphicon-trash span-icon span-icon-cursor delete-module span-red"></span>');
        dom.push('</div>');
        dom.push('<div style="clear: both"></div>');
        dom.push('</div>');
        $('#add-first-module-ialog .context').append(dom.join(''));
        $('.delete-module').click(function () {
            $(this).parent().parent().addClass('animated zoomOut');
            var this_ = this;
            setTimeout(function () {
                $(this_).parent().parent().remove();
            }, 500);
        });
    });

    $('#post-module').click(function () {
        var input_value = [];
        $('.module-name').each(function () {
            input_value.push($(this).val());
        });
        layer.close(addModuleDialog);
        insertModule(JSON.stringify(input_value), "", "");
    });

    $('#post-second-module').unbind('click').click(function () {
        var input_value = [];
        var input_url = [];
        $('.second-module-name').each(function () {
            input_value.push($(this).val());
        });
        $('.second-module-url').each(function () {
            input_url.push($(this).val());
        });
        layer.close(addSecondModule);
        insertModule(JSON.stringify(input_value), JSON.stringify(input_url), module_id);
    });

    $('#update-first-module').unbind('click').click(function () {
        if ($('#update-first-name').val() === '') {
            layer.msg(' 值 不 可 为 空 ');
        } else {
            updateModuleInfo(moduleId, $('#update-first-name').val(), "");
        }
    });
    //改变二级菜单的值
    $('#update-second-module').unbind('click').click(function () {
        if ($('#update-second-name').val() === ''
            || $('#update-second-url').val() === '') {
            layer.msg(' 值 不 可 为 空 ');
        } else {
            updateModuleInfo(moduleId, $('#update-second-name').val(), $('#update-second-url').val());
        }
    });

    $('#cancel-module').click(function () {
        layer.close(addModuleDialog);
    });
    $('#cancel-second-module').click(function () {
        layer.close(updateSecondModule);
    });
    $('#cancel-first-module').click(function () {
        layer.close(updateFirstModule);
    });
    $('#cancel-second-btn').click(function () {
        layer.close(addSecondModule);
    });

    /**
     * 新增模块
     * @param module_value
     * @param module_url
     * @param module_id
     */
    function insertModule(module_value, module_url, module_id) {
        api.system.moduleManage.insertModule(module_value, module_url, module_id, function (rep) {
            if (rep.result === 0) {
                layer.msg(' 添 加 失 败', {
                    icon: 2,
                    time: 1200,
                });
            } else {
                layer.msg(' 添 加 成 功', {
                    icon: 1,
                    time: 1200,
                    success: function (layero, index) {
                        if (module_id === '') {
                            getAllModule();
                        } else {
                            getAllSecondModule(module_id)
                        }
                    }
                });
            }
        });
    }

    /**
     * 获得所有的一级模块
     */
    function getAllModule() {
        api.system.moduleManage.getAllModule(function (rep) {
            var module_data = rep.data;
            var module_data_length = rep.data.length;
            var dom = [];
            if (rep.result === 0) {
                $('.first-main-html .list-group').empty();
            } else {
                $('.first-main-html .list-group').empty();
                for (var i = 0; i < module_data_length; i++) {
                    dom.push('<li class="list-group-item li-module-info" module-id="' + module_data[i].menu_id + '">');
                    dom.push(' ' + module_data[i].menu_name + '');
                    dom.push('<span class="glyphicon glyphicon-trash span-icon-cursor span-red delete-module tooltip-show" data-toggle="tooltip" data-placement="left" title="删 除"  module-id="' + module_data[i].menu_id + '"></span>');
                    dom.push('<span class="glyphicon glyphicon-repeat span-blue span-icon-cursor update-module tooltip-show" data-toggle="tooltip" data-placement="top" title="修 改" module-name="' + module_data[i].menu_name + '"    module-id="' + module_data[i].menu_id + '"></span>');
                    dom.push('</li>');
                }
                $('.first-main-html .list-group').append(dom.join(''));
                $('.tooltip-show').tooltip();
                $('.li-module-info').click(function () {
                    $('.li-module-info').removeClass('activeli');
                    $(this).addClass('activeli');
                    module_id = $(this).attr('module-id');
                    getAllSecondModule(module_id);

                });
                $('.list-group .list-group-item:first').trigger('click');
                $('.delete-module').click(function () {
                    deleteModule($(this).attr('module-id'), 'first');
                    $(this).parent().remove();
                });

                $('.update-module').click(function () {
                    $('#update-first-name').val($(this).attr("module-name"));
                    moduleId = $(this).attr("module-id");
                    updateFirstModule = layer.open({
                        title: '修改一级模块',
                        type: 1,
                        area: ['30%', '33%'], //宽高
                        content: $('#update-first-module-dialog')
                    });
                });
            }
        });
    }

    /**
     * 根据一级id，获取二级的模块
     * @param module_id
     */
    function getAllSecondModule(module_id) {
        api.system.moduleManage.getAllSecondModule(module_id, function (rep) {
            if (rep.result === 0) {
                $('.module-info-show-table').empty();
            } else {
                var module_data = rep.data;
                var module_data_length = rep.data.length;
                var dom = [];
                $('.module-info-show-table').empty();
                for (var i = 0; i < module_data_length; i++) {
                    dom.push('<tr>');
                    dom.push('<td>' + module_data[i].menu_name + '</td>');
                    dom.push('<td>' + module_data[i].menu_content + '</td>');
                    dom.push('<td><span class="glyphicon glyphicon-trash span-icon-cursor second-module-delete tooltip-show span-red" data-toggle="tooltip" data-placement="top" title="删 除"  module-id="' + module_data[i].menu_id + '"></span></td>');
                    dom.push('<td><span class="glyphicon glyphicon-edit span-icon-cursor second-module-update tooltip-show span-blue"  data-toggle="tooltip" data-placement="top" title="修 改"  module-id="' + module_data[i].menu_id + '" module-name="' + module_data[i].menu_name + '" module-content="' + module_data[i].menu_content + '"  ></span></td>');
                    dom.push('</tr>');
                }
                $('.module-info-show-table').append(dom.join(''));
                $('.tooltip-show').tooltip();
                $('.second-module-delete').click(function () {
                    deleteModule($(this).attr('module-id'), 'second');
                    $(this).parent().parent().remove();
                });
                $('.second-module-update').unbind('click').click(function () {
                    $('#update-second-name').val($(this).attr('module-name'));
                    $('#update-second-url').val($(this).attr('module-content'));
                    moduleId = $(this).attr("module-id");
                    updateSecondModule = layer.open({
                        title: '修 改 二 级 模 块',
                        type: 1,
                        area: ['50%', '60%'], //宽高
                        content: $('#update-second-module-dialog')
                    });
                });
            }
        });
    }

    /**
     * 删除模块
     * @param module_id
     * @param operation_type
     */
    function deleteModule(module_id, operation_type) {
        api.system.moduleManage.deleteModule(module_id, function (rep) {
            if (rep.result === 0) {
                layer.msg(' 删 除 失 败 ', {
                    icon: 2,
                    time: 1200,
                });
            } else {
                layer.msg(' 删 除 成 功 ', {
                    icon: 1,
                    time: 1200,
                    success: function () {
                        if (operation_type == 'first') {
                            getAllModule();
                        }
                    }
                });
            }
        });
    }

    /**
     * 修改模块信息
     * @param module_id
     * @param module_name
     * @param module_content
     */
    function updateModuleInfo(module_id, module_name, module_content) {
        api.system.moduleManage.updateModuleInfo(module_id, module_name, module_content, function (rep) {
            layer.close(updateFirstModule);
            layer.close(updateSecondModule);
            if (rep.result === 0) {
                layer.msg(' 修 改 失 败 ', {
                    icon: 2,
                    time: 1200,
                });
            } else {
                layer.msg(' 修 改 成 功 ', {
                    icon: 1,
                    time: 1200,
                    success: function () {
                        getAllModule();
                    }
                });
            }
        });
    }
});
