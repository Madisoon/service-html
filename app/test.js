/**
 * Created by Msater Zg on 2017/6/12.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    const api = require('../../common/js/api');
    const guidanceTypeSpm = require('../../common/js/guidanceType');
    const userLoginName = window.parent.SYSTEM.user.user_loginname;
    const userType = window.parent.SYSTEM.userType;
    // 用户角色，1是超级管理员 ，2不是超级管理员
    // 1是系统账号 0为私人账号，此功能只用于超级管理员
    let [addNumberDialog, config_id, menuType, numberUpdateId, flag] = [{}, '', '1', '', 1];
    if (userType === 1) {
        $('.top-nav').slideDown();
    }
    guidanceTypeSpm.guidanceType.writeDom(userLoginName, userType, '#guidance-type-show', (rep) => {
        config_id = rep;
        if (menuType === '1') {
            initializeTable();
        } else {
            initializeTablePublic();
        }
    });

    $('#add-sys-number').on('click', () => {
        flag = 1;
        getSetFormValue();
    });
    let getSetFormValue = (row = {}, flag = 1) => {
        // flag 1代表 新增   flag 0代表修改
        addNumberDialog = layer.open({
            title: '新增账号',
            type: 1,
            area: ['40%', '50%'], //宽高
            content: $('#add-number-dialog')
        });
        if (flag) {
            $('.form-control.number-name').val("");
            $('.form-control.number-password').val("");
            $('.form-control.number-nick-name').val("");
        } else {
            $('.form-control.number-name').val(row.number_name);
            $('.form-control.number-password').val(row.number_password);
            $('.form-control.number-nick-name').val(row.number_nickname);
            numberUpdateId = row.id;
        }
    };
    $('#reserve-button').click(function () {
        layer.close(addNumberDialog);
        let numberName = $('.form-control.number-name').val();
        let numberPd = $('.form-control.number-password').val();
        let numberNickName = $('.form-control.number-nick-name').val();
        let numberInfo = {};
        if (flag) {
            numberInfo = {
                config_id: config_id,
                number_name: numberName,
                number_password: numberPd,
                number_nickname: numberNickName,
                number_sys_status: userType,
                number_create: userLoginName
            };
            api.system.numberManage.insertNumber(JSON.stringify(numberInfo), (rep) => {
                if (rep.result === 1) {
                    initializeTable();
                    layer.msg(' 新 增 成 功 ！', {
                        icon: 1,
                        time: 1200,
                    });
                } else {
                    layer.msg(' 新 增 失 败 ！', {
                        icon: 2,
                        time: 1200,
                    });
                }
            });
        } else {
            numberInfo = {
                number_name: numberName,
                number_password: numberPd,
                number_nickname: numberNickName,
            };
            api.system.numberManage.updateNumber(JSON.stringify(numberInfo), numberUpdateId, (rep) => {
                if (rep.result === 1) {
                    initializeTable();
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

    $('#cancel-button').on('click', () => {
        layer.close(addNumberDialog);
    });

    let initializeTable = () => {
        $('#number-table').bootstrapTable('destroy');
        $('#number-table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'number_name',
                searchable: true,
                title: '账号名称'
            }, {
                field: 'number_nickname',
                searchable: true,
                title: '昵称'
            }, {
                field: 'number_time',
                title: '账号状态',
                formatter: (value, row, index) => {
                    return '可用';
                }
            }, {
                field: 'user_name',
                title: '创建者'
            }, {
                field: 'number_time',
                title: '创建时间'
            }],
            pageNumber: 1,
            pageSize: 20,
            sidePagination: 'server',
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            classes: 'table table-bordered table-hover',
            method: 'POST',
            url: '' + api.baseUrl + 'system/getAllNumber',
            queryParamsType: "json",
            queryParams: function (params) {
                var param = {
                    pageNumber: params.pageNumber,
                    pageSize: params.pageSize,
                    configId: config_id,
                    numberType: userType,
                    numberCreate: userLoginName
                };
                return JSON.stringify(param);
            },
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right',
            onClickRow: (row) => {
                flag = 0;
                getSetFormValue(row, flag);
            }
        });
    };
    initializeTable();

    let initializeTablePublic = () => {
        $('#number-table').bootstrapTable('destroy');
        $('#number-table').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'number_name',
                searchable: true,
                title: '账号名称'
            }, {
                field: 'number_nickname',
                searchable: true,
                title: '昵称'
            }, {
                field: 'number_time',
                title: '账号状态',
                formatter: (value, row, index) => {
                    return '可用';
                }
            }, {
                field: 'user_name',
                title: '创建者'
            }, {
                field: 'number_time',
                title: '创建时间'
            }, {
                field: 'number_open',
                title: '是否属于系统',
                formatter: (value, row, index) => {
                    if (value === '1') {
                        return '已加入系统';
                    } else {
                        return `<svg number-id = ${row.id} class="icon table-icon icon-cursor" aria-hidden="true">
							<use class="icon-x" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-add1"></use>
							</svg>`;
                    }
                }
            }],
            pageNumber: 1,
            pageSize: 20,
            sidePagination: 'server',
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            classes: 'table table-bordered table-hover',
            method: 'POST',
            url: '' + api.baseUrl + 'system/getAllNumber',
            queryParamsType: "json",
            queryParams: function (params) {
                var param = {
                    pageNumber: params.pageNumber,
                    pageSize: params.pageSize,
                    configId: config_id,
                    numberType: '0',
                    numberCreate: ''
                };
                return JSON.stringify(param);
            },
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right',
            onClickRow: (row) => {
            }
        });
    };
    $('body').on('click', '.table-icon', function () {
        let numberId = $(this).attr("number-id");
        api.system.numberManage.updateNumberOpen(numberId, (rep) => {
            if (rep.result) {
                initializeTablePublic();
                layer.msg(' 加 入 成 功 ！', {
                    icon: 1,
                    time: 1200,
                });
            } else {
                layer.msg(' 加 入 失 败 ！', {
                    icon: 2,
                    time: 1200,
                });
            }
        });
    });
    $('.tabs .tab a').click(function () {
        $('.tabs .tab a').removeClass('active');
        $(this).addClass('active');
        menuType = $(this).attr("guidance-way");
        if (menuType === '1') {
            $('.bottom-context button').prop('disabled', false);
            initializeTable();
        } else {
            $('.bottom-context button').prop('disabled', true);
            initializeTablePublic();
        }
    });

    $('.guidance-type-item .context').unbind('click').click(function () {
        $('.guidance-type-item .context').removeClass('active');
        $(this).addClass('active');
        config_id = $(this).attr('guidance-id');
        if (menuType === '1') {
            initializeTable();
        } else {
            initializeTablePublic();
        }
    });
    $('#delete-sys-number').on('click', () => {
        var dataNumber = $('#number-table').bootstrapTable('getSelections', null);
        var dataCorpusLen = dataNumber.length;
        var dataId = [];
        if (dataCorpusLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (let dataSingle of dataNumber) {
                dataId.push(dataSingle.id);
            }
            api.system.numberManage.deleteNumber(dataId.join(','), (rep) => {
                if (rep.result === 1) {
                    initializeTable();
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
});
