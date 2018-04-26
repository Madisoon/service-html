/**
 * Created by Msater Zg on 2017/1/9.
 */
define(function (require, exports, module) {
    var api = require('../../common/api');
    var informationId;

    $('#post-btn').unbind('click').click(function () {
        var inforDataInfo = getFormValue();
        $('.form-control.infor-write').val("");
        if (inforDataInfo.infor_title == "" || inforDataInfo.infor_context == "" || inforDataInfo.infor_link == "") {
            layer.msg('抱歉,数据没有填写完整！', {
                time: 1500,
                zIndex: layer.zIndex, //重点1
                success: function (layero) {
                    layer.setTop(layero); //重点2
                }
            });
        } else {
            //发送数据的接口
            api.information.infoShow.infoSure(informationId, JSON.stringify(inforDataInfo), function (rep) {
                // 修改信息并发送
                layer.closeAll();
                tableStart();
            });
        }
    });


    /**
     * 获取筛选表单的值
     * @returns {{}}
     */
    function getFormValue() {
        var informationData = {};
        informationData.infor_title = $('.form-control.infor-title').val();
        informationData.infor_context = $('.form-control.infor-context').val().replace(/\'/g, '‘');
        informationData.infor_type = $('input[name=type-radio]:checked').val();
        informationData.infor_grade = $('input[name=grade-radio]:checked').val();
        informationData.infor_link = $('.form-control.infor-link').val();
        informationData.infor_site = $('.form-control.infor-site').val();
        informationData.is_status = 1; // 将信息的状态改成确认状态
        informationData.infor_source = $('input[name=info-resource]:checked').val();
        return informationData;
    }

    tableStart();

    /**
     * 表格初始化
     */
    function tableStart() {
        $('#all-infor').bootstrapTable('destroy');
        $('#all-infor').bootstrapTable({
            columns: [{
                field: 'infor_title',
                title: '信息标题',
                width: 200,
                formatter: function (value, row, index) {
                    if (value.length > 25) {
                        return value.substring(0, 25) + "...";
                    } else {
                        return value;
                    }
                }
            }, {
                field: 'infor_context',
                title: '信息内容',
                width: 500,
                formatter: function (value, row, index) {
                    if (value.length > 75) {
                        return value.substring(0, 75) + "...";
                    } else {
                        return value;
                    }
                }
            }, {
                field: 'tag_names',
                title: '信息标签',
                formatter: function (value, row, index) {
                    if (value.length <= 10) {
                        return value;
                    } else {
                        return value.substring(0, 6) + "......";
                    }

                }
            }, {
                field: 'infor_type',
                title: '信息类型',
                formatter: function (value, row, index) {
                    if (value == 1) {
                        return "正面";
                    } else {
                        return "负面";
                    }
                }
            }, {
                field: 'infor_grade',
                title: '信息等级'
            }, {
                field: 'infor_source',
                title: '信息来源'
            }, {
                field: 'id',
                searchable: true,
                title: '操作',
                width: 130,
                formatter: function (value, row, index) {
                    return '<button type="button" class="btn btn-primary information-sure" data-id="' + value + '">确认</button>' +
                        '<button type="button" class="btn btn-danger information-delete" data-id="' + value + '">删除</button>';
                }

            }],
            pageNumber: 1,
            pageSize: 12,
            dataField: 'data',//指定后台的数据的名称
            undefinedText: '--',
            sidePagination: 'server',
            classes: 'table table-bordered table-hover',
            method: 'post',
            url: '' + api.baseUrl + '/getAllInfor',
            queryParamsType: "undefined",
            queryParams: function (params) {
                var param = {
                    pageNumber: params.pageNumber,
                    pageSize: params.pageSize,
                    searchTagId: '',
                    searchInfoData: {},
                    customerName: '',
                    isStatus: '0'
                };
                return param;
            },
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right',
            onDblClickRow: function (row) {
                layer.open({
                    title: ' 编辑信息 ',
                    type: 1,
                    area: ['52%', '80%'], //宽高
                    content: $('#add-infor')
                });
                getSetFormValue(row, false);
            }
        });
    }

    function getSetFormValue(row, flag) {
        informationId = row.id;
        $('.form-control.infor-title').val(row.infor_title);
        $('.form-control.infor-context').val(row.infor_context);
        $('input[name=info-resource][value=' + row.infor_source + ']').prop('checked', true);
        $('input[name=type-radio][value = ' + row.infor_type + ']').prop('checked', true);
        $('input[name=grade-radio][value = ' + row.infor_grade + ']').prop('checked', true);
        $('.form-control.infor-link').val(row.infor_link);
        $('.form-control.infor-site').val(row.infor_site);
        var tagIds = row.tag_ids.split(',');
        var tagNames = row.tag_names.split(',');
        var tagIdsLen = tagIds.length;
        var dom = [];
        for (var i = 0; i < tagIdsLen; i++) {
            dom.push('<span class="label  label-warning span-icon-cursor" tag-id="' + tagIds[i] + '">' + tagNames[i] + '&nbsp;&nbsp;');
            dom.push('<span class="glyphicon glyphicon-remove"></span></span>');
        }
        $('.tag').empty();
        $('.tag').append(dom.join(''));
    }


    $('body').on('click', '.information-sure', function () {
        var id = $(this).attr('data-id');
        api.information.infoShow.infoSure(id, JSON.stringify({}), function (rep) {
            tableStart();
        });
    });
    $('body').on('click', '.information-delete', function () {
        var id = $(this).attr('data-id');
        api.information.infoShow.deleteInfoData(id, function (rep) {
            tableStart();
        });
    });
});