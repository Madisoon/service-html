/**
 * Created by Msater Zg on 2017/1/9.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    var api = require('../../common/api');
    var sysTem = window.parent.SYSTEM;
    var areaId = '';
    var areaIds = [];
    var operationType;
    var terraceCustomerId;
    var addTerraceDialog;
    var addModuleDialog;
    var serveTerraceSearch = {};

    // 树的初始化设置
    // 地区初始化
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

    // 选择平台模块里面的树
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
        $.fn.zTree.init($("#module-area-tree"), settingModule, zNodesModule);
    });

    //选择模块点击事件
    $('#add-module-dialog').unbind('click').click(function () {
        addModuleDialog = layer.open({
            title: '选 择 模 块',
            type: 1,
            area: ['52%', '95%'], //宽高
            content: $('#module-choose-dialog')
        });
    });

    //删除平台点击事件
    $('#delete-terrace-btn').unbind('click').click(function () {
        var dataServe = $('#terrace-info').bootstrapTable('getSelections', null);
        var dataServeLen = dataServe.length;
        var dataId = [];
        if (dataServeLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (var i = 0; i < dataServeLen; i++) {
                dataId.push(dataServe[i].id);
            }
            api.movement.terraceCustomer.deleteTerraceCustomerId(dataId.join(','), function (rep) {
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
            })
        }
    });

    // 搜索的点击事件
    $('#sure-choose-module').unbind('click').click(function () {
        var terraceName = $('.choose-terrace-name').val();
        var terraceLink = $('.choose-terrace-link').val();
        var userName = $('.choose-terrace-create').val();
        var terraceModuleName = $('.choose-terrace-module').val();
        var chooseData = {};
        if (terraceName != '') {
            chooseData.terrace_name = terraceName;
        }
        if (terraceLink != '') {
            chooseData.terrace_link = terraceLink;
        }
        if (userName != '') {
            chooseData.user_name = userName;
        }
        if (terraceModuleName != '') {
            chooseData.terrace_module_name = terraceModuleName;
        }
        serveTerraceSearch = chooseData;
        tableStart();
    });

    // 平台树点击回调
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

    // 模块树点击回调
    function onClickCallBackModule(event, treeId, treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj("area-tree");
        var nodes = treeObj.transformToArray(treeNode);
        var nodesLen = nodes.length;
        var idS = [];
        for (var i = 0; i < nodesLen; i++) {
            idS.push(nodes[i].id);
        }
        api.movement.terraceManage.getAllTerraceModule(idS.join(','), function (rep) {
            console.log(rep);
            var moduleAll = rep.data;
            var moduleAllLen = rep.total;
            var moduleDom = [];
            for (var i = 0; i < moduleAllLen; i++) {
                moduleDom.push('<label class="checkbox-inline">');
                moduleDom.push('<input type="checkbox" name="moduleOptions" moduleName="' + moduleAll[i].terrace_module_name + '"  value="' + moduleAll[i].id + '">');
                moduleDom.push('' + moduleAll[i].terrace_module_name + '');
                moduleDom.push('</label>');
            }
            $('#search-module-name').val("");
            $('.module-info').empty();
            $('.module-info').append(moduleDom.join(''));
        });
    };

    // 搜索框的隐藏和展现
    $('#search-show-btn').unbind('click').click(function () {
        $('.terrace-search').stop().slideToggle();
    });

    // 新建平台
    $('#add-terrace-btn').unbind('click').click(function () {
        getSetFormValue(null, true);
        $('#post-terrace-btn').prop('disabled', false);
        operationType = true;
        addTerraceDialog = layer.open({
            title: ' 新建平台客户(创建人：' + sysTem.user.user_name + ')',
            type: 1,
            area: ['52%', '55%'], //宽高
            content: $('#add-terrace')
        });
    });

    //弹窗口取消
    $('#cancel-module-btn').unbind('click').click(function () {
        layer.close(addModuleDialog);
    });

    // 选择模块后的确定事件
    $('#post-module-btn').unbind('click').click(function () {
        layer.close(addModuleDialog);
        var moduleId = $('input[name=moduleOptions]:checked').val();
        var moduleName = $('input[name=moduleOptions]:checked').attr("moduleName");
        var moduleDom = [];
        $('input[name=moduleOptions]:checked').each(function () {
            moduleDom.push(' <span class="label other-module label-primary span-icon-cursor" ');
            moduleDom.push(' module-id="' + $(this).val() + '">' + $(this).attr("moduleName") + '&nbsp;&nbsp;<span ');
            moduleDom.push(' class="glyphicon glyphicon-remove"></span></span> ');
        });
        /*$('#terrace-module').empty();*/
        $('#terrace-module').append(moduleDom.join(''));
        $('#terrace-module .other-module').unbind('click').click(function () {
            $(this).addClass(' animated zoomOut ');
            var $this = this;
            setTimeout(function () {
                $($this).remove();
            }, 1000);
        });

    });

    //取消模块事件
    $('#cancel-terrace-btn').unbind('click').click(function () {
        layer.close(addTerraceDialog);
    });

    $('.search-module').unbind('click').click(function () {

    });

    $('#post-terrace-btn').unbind('click').click(function () {
        var moduleTerrace = {
            terrace_name: $('.form-control.terrace-name').val(),
            terrace_link: $('.form-control.terrace-link').val(),
            terrace_create: sysTem.user.user_loginname
        };
        var allModule = [];
        $('#terrace-module .other-module').each(function () {
            allModule.push($(this).attr('module-id'));
        });
        if (moduleTerrace.terrace_name === "" ||
            moduleTerrace.terrace_link === "" ||
            moduleTerrace.terrace_create === "" ||
            allModule.length === 0
        ) {
            layer.msg('抱歉,数据没有填写完整！', {
                time: 1500,
                zIndex: layer.zIndex, //重点1
                success: function (layero) {
                    layer.setTop(layero); //重点2
                }
            });
        } else {
            layer.close(addTerraceDialog);
            if (operationType) {
                api.movement.terraceCustomer.insertTerraceCustomer(JSON.stringify(moduleTerrace), allModule.join(','), areaId, function (rep) {
                    if (rep.result) {
                        tableStart();
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
            } else {
                console.log(terraceCustomerId);
                api.movement.terraceCustomer.updateTerraceCustomer(JSON.stringify(moduleTerrace), allModule.join(','), terraceCustomerId, function (rep) {
                    if (rep.result) {
                        tableStart();
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
                });
            }
        }
    });

    tableStart();
    function tableStart() {
        $('#terrace-info').bootstrapTable('destroy');
        $('#terrace-info').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'terrace_name',
                searchable: true,
                sortable: true,
                title: '平台名称'
            }, {
                field: 'terrace_link',
                searchable: true,
                title: '平台链接'
            }, {
                field: 'terrace_module_names',
                title: '模块'
            }, {
                field: 'terrace_time',
                searchable: true,
                title: '创建时间'
            }, {
                field: 'user_name',
                searchable: true,
                title: '创建人'
            }],
            pageNumber: 1,
            pageSize: 10,
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            sidePagination: 'client',
            showColumns: 'true',
            classes: 'table table-bordered table-hover',
            method: 'post',
            url: '' + api.baseUrl + 'getAllTerraceCustomer',
            queryParamsType: "undefined",
            queryParams: function (params) {
                var param = {
                        pageNumber: params.pageNumber,
                        pageSize: params.pageSize,
                        serveTerraceSearch: serveTerraceSearch,
                        areaId: areaIds.join(',')
                    }
                    ;
                return param;
            },
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right',
            onClickRow: function (row) {
                console.log(row);
                getSetFormValue(row, false);
                operationType = false;
                addTerraceDialog = layer.open({
                    title: ' 编辑平台(创建人：' + row.user_name + ')',
                    type: 1,
                    area: ['52%', '55%'], //宽高
                    content: $('#add-terrace')
                });
                terraceCustomerId = row.id;
                if (sysTem.user.role_name === '超级管理员') {
                    $('#post-terrace-btn').prop('disabled', false);
                } else {
                    if (sysTem.user.user_loginname === row.user_loginname) {
                        $('#post-terrace-btn').prop('disabled', false);
                    } else {
                        $('#post-terrace-btn').prop('disabled', true);
                    }
                }
            }
        });
    }

    function getSetFormValue(row, flag) {
        if (flag) {
            //为新增，我需要删除表单中的所有的东西
            $('.form-control.terrace-name').val("");
            $('.form-control.terrace-link').val("");
            $('#terrace-module').empty();
        } else {
            $('.form-control.terrace-name').val(row.terrace_name);
            $('.form-control.terrace-link').val(row.terrace_link);
            var moduleNames = row.terrace_module_names.split(',');
            var moduleIds = row.module_ids.split(',');
            var moduleLen = moduleNames.length;
            var dom = [];
            for (var i = 0; i < moduleLen; i++) {
                dom.push(' <span class="label other-module label-primary span-icon-cursor" module-id="' + moduleIds[i] + '">' + moduleNames[i] + '<span ');
                dom.push(' class="glyphicon glyphicon-remove"></span></span> ');
            }
            $('#terrace-module').empty();
            $('#terrace-module').append(dom.join(''));
            $('#terrace-module .other-module').unbind('click').click(function () {
                $(this).addClass(' animated zoomOut ');
                var $this = this;
                setTimeout(function () {
                    $($this).remove();
                }, 1000);
            });

        }
    }


});