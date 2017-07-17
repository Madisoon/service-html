/**
 * Created by Msater Zg on 2017/2/7.
 */
/**
 * Created by Msater Zg on 2017/1/9.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    var api = require('../../common/api');
    require('../../../spm_modules/datepicker/jquery.datetimepicker.full.min');
    require('../../../spm_modules/bootstrap-3.3.0-dist/dist/js/bootstrap.min.js');
    require('../../../spm_modules/bootstrap-table-master/dist/bootstrap-table.min.js');
    require('../../../spm_modules/bootstrap-table-master/dist/locale/bootstrap-table-zh-CN.min.js');
    /*    require('../../../spm_modules/layer/layer.js');
     require('../../../spm_modules/datepicker/jquery.datetimepicker.full.min');
     require('../../../spm_modules/bootstrap-3.3.0-dist/dist/js/bootstrap.min.js');
     require('../../../spm_modules/bootstrap-table-master/dist/bootstrap-table.min.js');
     require('../../../spm_modules/bootstrap-table-master/dist/locale/bootstrap-table-zh-CN.min.js');*/
    var addQqDialog;
    var addPlanDialog;
    var postType;
    var qqId;
    var planId;
    var postTypePlan;
    //初始化时间-中文
    $.datetimepicker.setLocale('zh');
    //时间初始化
    $('.time-start').datetimepicker({
        format: 'H:i',
        datepicker: false
    });
    $('.time-end').datetimepicker({
        format: 'H:i',
        datepicker: false
    });
    //添加配置qq的点击事件
    $('#add-qq-btn').unbind('click').click(function () {
        formSet(null, false);
        postType = 1;
        addQqDialog = layer.open({
            title: ' 新增配置QQ',
            type: 1,
            area: ['50%', '70%'], //宽高
            content: $('#qq-editor-dialog')
        });
    });

    $('#first-time-start').change(function () {
        $('.form-control.time-start').val($('#first-time-start').val());
    });

    $('#plan-cancel-btn').unbind('click').click(function () {
        layer.close(addPlanDialog);
    });

    $('#first-time-last').change(function () {
        $('.form-control.time-end').val($('#first-time-last').val());
    });


    $('#add-plan-btn').unbind('click').click(function () {
        postTypePlan = 1;
        planFormSet(null, false);
        addPlanDialog = layer.open({
            title: ' 新增计划任务',
            type: 1,
            area: ['60%', '80%'], //宽高
            content: $('#plan-editor-dialog')
        });
    });

    $('#plan-post-btn').unbind('click').click(function () {
        layer.close(addPlanDialog);
        var planData = {
            plan_name: $('#plan-name').val(),
            plan_remark: $('#plan-remark').val(),
            day_one: $('.day-one-start').val() + '-' + $('.day-one-end').val(),
            day_two: $('.day-two-start').val() + '-' + $('.day-two-end').val(),
            day_three: $('.day-three-start').val() + '-' + $('.day-three-end').val(),
            day_four: $('.day-four-start').val() + '-' + $('.day-four-end').val(),
            day_five: $('.day-five-start').val() + '-' + $('.day-five-end').val(),
            day_six: $('.day-six-start').val() + '-' + $('.day-six-end').val(),
            day_seven: $('.day-seven-start').val() + '-' + $('.day-seven-end').val(),
        };
        if (postTypePlan) {
            api.movement.configureManage.addPlan(JSON.stringify(planData), function (rep) {
                if (rep.result) {
                    $('#plan-table').bootstrapTable('refresh', null);
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
            api.movement.configureManage.updatePlan(JSON.stringify(planData), planId, function (rep) {
                if (rep.result) {
                    $('#plan-table').bootstrapTable('refresh', null);
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
    });

    $('#delete-plan-btn').unbind('click').click(function () {
        var dataQq = $('#plan-table').bootstrapTable('getSelections', null);
        var dataQqLen = dataQq.length;
        var data = [];
        if (dataQqLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (var i = 0; i < dataQqLen; i++) {
                data.push(dataQq[i].id);
            }
            api.movement.configureManage.deletePlan(data.join(','), function (rep) {
                if (rep.result) {
                    planTableStart();
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

    $('#qq-cancel-btn').unbind('click').click(function () {
        layer.close(addQqDialog);
    });
    $('#delete-qq-btn').unbind('click').click(function () {
        var dataQq = $('#qq-table').bootstrapTable('getSelections', null);
        var dataQqLen = dataQq.length;
        var data = [];
        if (dataQqLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (var i = 0; i < dataQqLen; i++) {
                data.push(dataQq[i].id);
            }
            api.movement.configureManage.deleteQq(data.join(','), function (rep) {
                if (rep.result) {
                    qqTableStart();
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
    $('#qq-post-btn').unbind('click').click(function () {
        layer.close(addQqDialog);
        var qqDate = {
            qq_number: $('#qq-number').val(),
            qq_name: $('#qq-name').val(),
            qq_password: $('#qq-password').val(),
            qq_remark: $('#qq-remark').val()
        };
        if (postType) {
            api.movement.configureManage.addQq(JSON.stringify(qqDate), function (rep) {
                if (rep.result) {
                    $('#qq-table').bootstrapTable('refresh', null);
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
            api.movement.configureManage.updateQq(JSON.stringify(qqDate), qqId, function (rep) {
                if (rep.result) {
                    $('#qq-table').bootstrapTable('refresh', null);
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
            })
        }

    });


    qqTableStart();
    function qqTableStart() {
        $('#qq-table').bootstrapTable('destroy');
        $('#qq-table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'qq_number',
                searchable: true,
                sortable: true,
                title: 'QQ号'
            }, {
                field: 'qq_name',
                searchable: true,
                title: '昵称'
            }, {
                field: 'qq_remark',
                searchable: true,
                title: '备注'
            }],
            pageNumber: 1,
            pageSize: 10,
            /*search: true,*/
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            sidePagination: 'client',
            /*showColumns: 'true',*/
            classes: 'table table-bordered table-hover',
            method: 'post',
            url: '' + api.baseUrl + '/getAllQq',
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right',
            onClickRow: function (row) {
                formSet(row, true);
                postType = 0;
                addQqDialog = layer.open({
                    title: ' 新增配置QQ',
                    type: 1,
                    area: ['50%', '70%'], //宽高
                    content: $('#qq-editor-dialog')
                });
                qqId = row.id;
            },
            onLoadSuccess: function (data) {
            }
        });
    }

    planTableStart();
    function planTableStart() {
        $('#plan-table').bootstrapTable('destroy');
        $('#plan-table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'plan_name',
                searchable: true,
                sortable: true,
                title: '计划任务名称'
            }, {
                field: 'plan_remark',
                searchable: true,
                title: '备注'
            }],
            pageNumber: 1,
            pageSize: 10,
            /*search: true,*/
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            sidePagination: 'client',
            /*showColumns: 'true',*/
            classes: 'table table-bordered table-hover',
            method: 'post',
            url: '' + api.baseUrl + '/getAllPlan',
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right',
            onClickRow: function (row) {
                postTypePlan = 0;
                planFormSet(row, true);
                addPlanDialog = layer.open({
                    title: ' 新增计划任务',
                    type: 1,
                    area: ['60%', '80%'], //宽高
                    content: $('#plan-editor-dialog')
                });
                planId = row.id;
            },
            onLoadSuccess: function (data) {
            }
        });
    }

    function formSet(qqData, flag) {
        if (flag) {
            $('#qq-number').val(qqData.qq_number);
            $('#qq-name').val(qqData.qq_name);
            $('#qq-password').val(qqData.qq_password);
            $('#qq-remark').val(qqData.qq_remark);
        } else {
            $('#qq-number').val("");
            $('#qq-name').val("");
            $('#qq-password').val("");
            $('#qq-remark').val("");
        }
    }

    function planFormSet(planData, flag) {
        if (flag) {
            var dayOne = planData.day_one.split('-');
            var dayTwo = planData.day_two.split('-');
            var dayThree = planData.day_three.split('-');
            var dayFour = planData.day_four.split('-');
            var dayFive = planData.day_five.split('-');
            var daySix = planData.day_six.split('-');
            var daySeven = planData.day_seven.split('-');
            $('.day-one-start').val(dayOne[0]);
            $('.day-one-end').val(dayOne[1]);
            $('.day-two-start').val(dayTwo[0]);
            $('.day-two-end').val(dayTwo[1]);
            $('.day-three-start').val(dayThree[0]);
            $('.day-three-end').val(dayThree[1]);
            $('.day-four-start').val(dayFour[0]);
            $('.day-four-end').val(dayFour[1]);
            $('.day-five-start').val(dayFive[0]);
            $('.day-five-end').val(dayFive[1]);
            $('.day-six-start').val(daySix[0]);
            $('.day-six-end').val(daySix[1]);
            $('.day-seven-start').val(daySeven[0]);
            $('.day-seven-end').val(daySeven[1]);
            $('#plan-name').val(planData.plan_name);
            $('#plan-remark').val(planData.plan_remark);
        } else {
            $('.form-control.time-start').val("");
            $('.form-control.time-end').val("");
            $('#plan-name').val("");
            $('#plan-remark').val("");
        }
    }


});