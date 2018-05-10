/**
 * Created by Msater Zg on 2017/1/9.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    //接口文件
    var api = require('../../common/api');
    require('../../../spm_modules/datepicker/jquery.datetimepicker.full.min');
    var tagShow = require('../../common/tagshow');
    var tagChooseShow = require('../../common/tagshow');
    var sysTem = window.parent.SYSTEM;
    var infoId;
    var infoType;
    var searchDatas = '';
    var ADDINFOR;
    var CHOOSETAG;
    var HANDMOVEMENT;
    var searchTagDialog;
    var searchTagId = [];
    var searchInfoData = {};
    var customerName = '';
    var customerChooseType = '';
    $.datetimepicker.setLocale('zh');
    $('#choose-start-time').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function (ct) {
            this.setOptions({
                maxDate: $('#choose-end-time').val() ? $('#choose-end-time').val() : false
            })
        }
    });
    $('#choose-end-time').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function (ct) {
            this.setOptions({
                minDate: $('#choose-start-time').val() ? $('#choose-start-time').val() : false
            })
        }
    });

    $('#contact-info-time').focus(function () {
        $('#choose-time-section').stop().slideDown();
    });

    $('#remove-choose-time').unbind('click').click(function () {
        $('#choose-time-section').stop().slideUp();
    });

    $('#sure-choose-time').unbind('click').click(function () {
        var startTime = $('#choose-start-time').val();
        var endTime = $('#choose-end-time').val();
        if (startTime == "") {
            $('#contact-info-time').val("");
        } else {
            var timeSection = startTime + '&' + endTime;
            $('#contact-info-time').val(timeSection);
            $('#choose-start-time').val("");
            $('#choose-end-time').val("");
        }
        $('#choose-time-section').stop().slideUp();
    });
    tagShow.tagOperation.writeDomTag(false, 'tag-tree');
    tagChooseShow.tagOperation.writeDomTag(true, 'choose-tag-tree');
    //添加信息的标签
    $('#add-infor-btn').unbind('click').click(function () {
        getSetFormValue(null, true);
        infoType = true;
        ADDINFOR = layer.open({
            title: ' 新增信息 (监测信息员:' + sysTem.user.user_name + ')',
            type: 1,
            area: ['52%', '98%'], //宽高
            content: $('#add-infor')
        });
    });


    //选择额外的标签
    $('#add-other-tag').unbind('click').click(function () {
        CHOOSETAG = layer.open({
            title: '标 签 选 择（额 外 标 签）',
            type: 1,
            area: ['32%', '98%'], //宽高
            content: $('#other-tag-choose'),
            zIndex: layer.zIndex, //重点1
            success: function (layero) {
                layer.setTop(layero); //重点2
            }
        });
    });

    //弹出框取消
    $('#cancel-btn').unbind('click').click(function () {
        $('.form-control.infor-write').val("");
        layer.close(ADDINFOR);
    });


    $('#contact-info-tag').focus(function () {
        searchTagDialog = layer.open({
            title: '标 签 选 择（额 外 标 签）',
            type: 1,
            area: ['32%', '98%'], //宽高
            content: $('#search-tag-choose'),
            zIndex: layer.zIndex, //重点1
            success: function (layero) {
                layer.setTop(layero); //重点2
            }
        });
    });

    $('#delete-infor-btn').unbind('click').click(function () {
        var dataInfo = $('#all-infor').bootstrapTable('getSelections', null);
        var dataInfoLen = dataInfo.length;
        var data = [];
        if (dataInfoLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (var i = 0; i < dataInfoLen; i++) {
                data.push(dataInfo[i].id);
            }
            api.information.infoShow.deleteInfoData(data.join(','), function (rep) {
                if (rep.result) {
                    tableStart();
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

    //信息表的主要内容

    $('#choose-tag-post-btn').unbind('click').click(function () {
        layer.close(searchTagDialog);
        var searchTagIdTemporary = [];
        var tagData = tagChooseShow.tagOperation.getTreeValue(true, 'choose-tag-tree');
        var tagDataId = tagChooseShow.tagOperation.getTreeValue(false, 'choose-tag-tree');
        var tagDataIdLen = tagDataId.length;
        var dom = [];
        for (var i = 0; i < tagDataIdLen; i++) {
            searchTagIdTemporary.push(tagDataId[i]);
        }

        var tagDataLen = tagData.length;
        for (var i = 0; i < tagDataLen; i++) {
            dom.push(tagData[i].name);
        }
        $('#contact-info-tag').val(dom.join('|'));
        searchTagId = searchTagIdTemporary;
    });


    api.tag.personTag.getMyTag(sysTem.user.user_loginname, function (rep) {
        var myTag = rep.data;
        var myTagLen = rep.data.length;
        var myTagDom = [];
        for (var i = 0; i < myTagLen; i++) {
            myTagDom.push('<span class="label label-danger span-icon-cursor add" tag-id="' + myTag[i].id + '">' + myTag[i].name + '&nbsp;&nbsp;<span  class="glyphicon glyphicon-arrow-up "></span></span>');
        }
        $('.my-tag-show').empty();
        $('.my-tag-show').append(myTagDom.join(''));
        $('.my-tag-show .label').unbind('click').click(function () {
            var tagId = $(this).attr("tag-id");
            var dom = '<span class="label animated zoomIn label-warning span-icon-cursor" tag-id="' + tagId + '">' + $(this).text() + '&nbsp;&nbsp;<span ' +
                'class="glyphicon glyphicon-remove"></span></span>';
            if ($('.tag .label[tag-id = ' + tagId + ']').length == 0) {
                $('.tag').append(dom);
                setTimeout(function () {
                    $('.tag .label').removeClass('animated zoomIn');
                }, 500);
                $('.tag .label').unbind('click').click(function () {
                    $(this).addClass('animated zoomOut');
                    var tagIdTop = $(this).attr("tag-id");
                    tagShow.tagOperation.writeTagData(false, tagIdTop, 'tag-tree');
                    $('.my-tag-show .label[tag-id = ' + tagIdTop + ']').removeClass('label-primary');
                    $('.my-tag-show .label[tag-id = ' + tagIdTop + ']').addClass('label-danger');
                    $('.my-tag-show .label[tag-id = ' + tagIdTop + ']').children().removeClass('glyphicon-ok');
                    $('.my-tag-show .label[tag-id = ' + tagIdTop + ']').children().addClass('glyphicon-arrow-up');
                    var $this = this;
                    setTimeout(function () {
                        $($this).remove();
                    }, 500);
                });
                $(this).removeClass('label-danger');
                $(this).addClass('label-primary');
                $(this).children('span').removeClass('glyphicon-arrow-up');
                $(this).children('span').addClass('glyphicon-ok');
            }
        });
    });


    //弹出框提交事件
    $('#post-btn').unbind('click').click(function () {
        var inforData = getFormValue();
        $('.form-control.infor-write').val("");
        var inforDataInfo = inforData.infor;
        if (inforDataInfo.infor_title == "" || inforDataInfo.infor_context == "" || inforDataInfo.infor_link == "" || inforData.inforTag.length == 0) {
            layer.msg('抱歉,数据没有填写完整！', {
                time: 1500,
                zIndex: layer.zIndex, //重点1
                success: function (layero) {
                    layer.setTop(layero); //重点2
                }
            });
        } else {
            //发送数据的接口
            if (infoType) {
                api.information.infoShow.postInforData(inforDataInfo, inforData.inforTag.join(','), function (rep) {
                    layer.close(ADDINFOR);
                    if (rep.result == 1) {
                        $('#all-infor').bootstrapTable('refresh', null);
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
                api.information.infoShow.updateInfoData(JSON.stringify(inforData.infor), inforData.inforTag.join(','), infoId, function (rep) {
                    layer.close(ADDINFOR);
                    if (rep.result == 1) {
                        $('#all-infor').bootstrapTable('refresh', null);
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

    //筛选框点击事件
    $('#choose-infor-btn').unbind('click').click(function () {
        $('.infor-search').stop().slideToggle();
    });
    //手工发送按钮
    $('#post-infor-btn').unbind('click').click(function () {
        customerChooseType = 1;
        var dataInfo = $('#all-infor').bootstrapTable('getSelections', null);
        var dataInfoLen = dataInfo.length;
        var data = [];
        if (dataInfoLen === 0) {
            layer.msg(' 没 有 选 中 任 何 数 据 ');
        } else {
            for (var i = 0; i < dataInfoLen; i++) {
                data.push(dataInfo[i].id);
            }
            HANDMOVEMENT = layer.open({
                title: '手 动 发 送',
                type: 1,
                area: ['50%', '96%'], //宽高
                content: $('#scheme-choose-dialog')
            });
        }
    });

    $('#choose-contact-customer-btn').unbind('click').click(function () {
        customerChooseType = 0;
        HANDMOVEMENT = layer.open({
            title: '筛 选 客 户',
            type: 1,
            area: ['50%', '96%'], //宽高
            content: $('#scheme-choose-dialog')
        });
    });

    $('.export-infor-btn').click(function () {
        var infoChooseData = {};
        customerName = $('#contact-info-customer').val();
        var infoContext = $('#contact-info-context').val();
        var infoCreater = $('#contact-info-user').val();
        var infoCreateTime = $('#contact-info-time').val();
        if (infoContext !== '') {
            infoChooseData.infor_context = infoContext;
        }
        if (infoType !== '') {
            infoChooseData.infor_type = infoType;
        }
        if (infoCreater !== '') {
            infoChooseData.user_name = infoCreater;
        }
        if (infoCreateTime !== '') {
            infoChooseData.infor_createtime = infoCreateTime;
        }
        if ($('#contact-info-tag').val() == "") {
            searchTagId = [];
        }
        searchInfoData = infoChooseData;
        api.information.infoShow.exportData(searchTagId.join(','), JSON.stringify(searchInfoData), customerName, $(this).attr("exportType"), function (rep) {
            var filePath = rep.result;
            if (filePath === '') {
                layer.msg('抱歉!没有可导出的数据', {
                    time: 1500
                });
            } else {
                window.open('http://118.178.237.219:8080/dummyPath/' + filePath);
            }

        });
    });

    $('#post-scheme-btn').unbind('click').click(function () {
        if (customerChooseType == 0) {
            layer.close(HANDMOVEMENT);
            var customerArray = [];
            $('input[name = schemeOptions]:checked').each(function () {
                customerArray.push($(this).attr('schemeName'));
            });
            $('#contact-info-customer').val(customerArray.join('|'));
        } else {
            var customerId;
            $('input[name = schemeOptions]:checked').each(function () {
                customerId = $(this).val();
            });
            var dataInfo = $('#all-infor').bootstrapTable('getSelections', null);
            var dataInfoLen = dataInfo.length;
            var data = [];
            for (var i = 0; i < dataInfoLen; i++) {
                data.push(dataInfo[i].id);
            }
            layer.close(HANDMOVEMENT);
            api.information.infoShow.manualPost(data.join(','), customerId, function (rep) {
            });
        }
    });
    $('#cancel-scheme-btn').unbind('click').click(function () {
        layer.close(HANDMOVEMENT);
    });

    //确定筛选
    $('#choose-infor').unbind('click').click(function () {
        var infoChooseData = {};
        customerName = $('#contact-info-customer').val();
        var infoTitle = $('#contact-info-title').val();
        var infoContext = $('#contact-info-context').val();
        var infoType = $('#contact-info-type').val();
        var infoGrade = $('#contact-info-grade').val();
        var infoCreater = $('#contact-info-user').val();
        var infoStatus = $('#contact-info-status').val();
        var infoCreateTime = $('#contact-info-time').val();
        if (infoTitle !== '') {
            infoChooseData.infor_title = infoTitle;
        }
        if (infoContext !== '') {
            infoChooseData.infor_context = infoContext;
        }
        if (infoType !== '') {
            infoChooseData.infor_type = infoType;
        }
        if (infoGrade !== '') {
            infoChooseData.infor_grade = infoGrade;
        }
        if (infoCreater !== '') {
            infoChooseData.user_name = infoCreater;
        }
        if (infoStatus !== '') {
            infoChooseData.infor_status = infoStatus;
        }
        if (infoCreateTime !== '') {
            infoChooseData.infor_createtime = infoCreateTime;
        }
        if ($('#contact-info-tag').val() == "") {
            searchTagId = [];
        }
        searchInfoData = infoChooseData;
        tableStart();
        //信息所属于的标签
        /*
         $('#all-infor').bootstrapTable('destroy');
         ;*/

    });

    $('.infor-write').change(function () {
        var contactValue = $('.form-control.infor-write').val();
        //标题
        $('.form-control.infor-title').val(contactValue.substring(contactValue.indexOf('标题:') + 3, contactValue.indexOf('内容:')));
        //内容
        $('.form-control.infor-context').val(contactValue.substring(contactValue.indexOf('内容:') + 3, contactValue.indexOf('链接:')).trim());
        //链接
        $('.form-control.infor-link').val(contactValue.substring(contactValue.indexOf('链接:') + 3, contactValue.indexOf('来源:')));
        //站点
        $('.form-control.infor-site').val(contactValue.substring(contactValue.indexOf('站点:') + 3));
        $('input[name=info-resource][value=' + contactValue.substring(contactValue.indexOf('来源:') + 3, contactValue.indexOf('属性:')).trim() + ']').prop('checked', true);
    });

    /**
     * 获取筛选表单的值
     * @returns {{}}
     */
    function getFormValue() {
        var allData = {};
        var inforData = {};
        inforData.infor_title = $('.form-control.infor-title').val();
        inforData.infor_context = $('.form-control.infor-context').val().replace(/\'/g, '‘');
        inforData.infor_type = $('input[name=type-radio]:checked').val();
        inforData.infor_grade = $('input[name=grade-radio]:checked').val();
        inforData.infor_link = $('.form-control.infor-link').val();
        inforData.infor_site = $('.form-control.infor-site').val();
        inforData.infor_source = $('input[name=info-resource]:checked').val();
        inforData.infor_creater = sysTem.user.user_loginname;
        var tagIds = [];
        $('.tag .label').each(function () {
            tagIds.push($(this).attr('tag-id'));
        });
        allData.infor = inforData;
        allData.inforTag = tagIds;
        return allData;
    }

    tableStart();

    /**
     * 表格初始化
     */
    function tableStart() {
        $('#all-infor').bootstrapTable('destroy');
        $('#all-infor').bootstrapTable({
            columns: [{
                checkbox: true
            }, {
                field: 'infor_title',
                title: '信息标题',
                width: 200,
                formatter: function (value, row, index) {
                    if (value.length > 25) {
                        return value.substring(0, 25)+"...";
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
                        return value.substring(0, 75)+"...";
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
                field: 'infor_createtime',
                searchable: true,
                title: '提交时间'
            }, {
                field: 'user_name',
                searchable: true,
                title: '创建者'
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
                    searchTagId: searchTagId.join(','),
                    searchInfoData: JSON.stringify(searchInfoData),
                    customerName: customerName,
                    isStatus: '1'
                };
                return param;
            },
            pagination: true,
            paginationHAlign: 'left',
            paginationDetailHAlign: 'right',
            onDblClickRow: function (row) {
                infoId = row.id;
                infoType = false;
                ADDINFOR = layer.open({
                    title: ' 编辑信息 (创建者:' + row.user_name + ')',
                    type: 1,
                    area: ['52%', '98%'], //宽高
                    content: $('#add-infor')
                });
                getSetFormValue(row, false);
            },
            onLoadSuccess: function (data) {
            }
        });
    }

    $('#tag-cancel-btn').unbind('click').click(function () {
        layer.close(CHOOSETAG);
    });

    $('#tag-post-btn').unbind('click').click(function () {
        layer.close(CHOOSETAG);
        var tagData = tagShow.tagOperation.getTreeValue(true, 'tag-tree');
        var nodesLen = tagData.length;
        var dom = [];
        $('.tag .other-tag').remove();
        for (var i = 0; i < nodesLen; i++) {
            if ($('.tag .label[tag-id = ' + tagData[i].id + ']').length == 0) {
                dom.push('<span class="label other-tag label-warning span-icon-cursor" tag-id="' + tagData[i].id + '">' + tagData[i].name + '&nbsp;&nbsp;&nbsp;&nbsp;<span class="glyphicon glyphicon-remove"></span></span>');
            }
        }
        $('.tag').append(dom.join(''));
        $('.tag .label').unbind('click').click(function () {
            $(this).addClass('animated zoomOut');
            var tagIdTop = $(this).attr("tag-id");
            tagShow.tagOperation.writeTagData(false, tagIdTop, 'tag-tree');
            $('.my-tag-show .label[tag-id = ' + tagIdTop + ']').removeClass('label-primary');
            $('.my-tag-show .label[tag-id = ' + tagIdTop + ']').addClass('label-danger');
            $('.my-tag-show .label[tag-id = ' + tagIdTop + ']').children().removeClass('glyphicon-ok');
            $('.my-tag-show .label[tag-id = ' + tagIdTop + ']').children().addClass('glyphicon-arrow-up');
            var $this = this;
            setTimeout(function () {
                $($this).remove();
            }, 500);
        });
    });
    /**
     * 树点击后的回调方法
     * @param event
     * @param treeId
     * @param treeNode
     */
    var settingScheme = {
        callback: {
            onClick: onClickCallBackScheme
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
    var zNodesScheme = null;
    api.system.areaManage.getAllArea(function (rep) {
        zNodesScheme = rep.data;
        $.fn.zTree.init($("#scheme-area-tree"), settingScheme, zNodesScheme);
    });

    function onClickCallBackScheme(event, treeId, treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj("scheme-area-tree");
        var nodes = treeObj.transformToArray(treeNode);
        var nodesLen = nodes.length;
        var idS = [];
        for (var i = 0; i < nodesLen; i++) {
            idS.push(nodes[i].id);
        }
        api.movement.severCustomer.getAllServeCustomers(idS.join(','), function (rep) {
            console.log(rep);
            var schemeAll = rep.data;
            var schemeAllLen = rep.total;
            var schemeDom = [];
            for (var i = 0; i < schemeAllLen; i++) {
                schemeDom.push('<label class="radio-inline">');
                schemeDom.push('<input type="radio" name="schemeOptions" schemeName="' + schemeAll[i].customer_name + '"  value="' + schemeAll[i].id + '" checked>');
                schemeDom.push('' + schemeAll[i].customer_name + '');
                schemeDom.push('</label>');
            }
            $('#search-scheme-name').val("");
            $('.scheme-info').empty();
            $('.scheme-info').append(schemeDom.join(''));
        });
    };

    function getSetFormValue(row, flag) {
        tagShow.tagOperation.writeTagData(false, '', 'tag-tree');
        if (flag) {
            $('#id_select > option').attr('select', false);
            $('.dropdown-menu.inner.selectpicker li').removeClass('selected active');
            $('.filter-option.pull-left').text('');
            $('.form-control.infor-title').val("");
            $('.form-control.infor-context').val("");
            $('input[name=type-radio][value = ' + 0 + ']').prop('checked', true);
            $('input[name=grade-radio][value = ' + 3 + ']').prop('checked', true);
            $('.form-control.infor-link').val("");
            $('.form-control.infor-site').val("");
            $('.tag').empty();
            $('.my-tag-show .label').removeClass('label-primary');
            $('.my-tag-show .label').addClass('label-danger');
            $('.my-tag-show .label').children('span').removeClass('glyphicon-ok');
            $('.my-tag-show .label').children('span').addClass('glyphicon-arrow-up');
        } else {
            $('.my-tag-show .label').removeClass('label-primary');
            $('.my-tag-show .label').addClass('label-danger');
            $('.my-tag-show .label').children('span').removeClass('glyphicon-ok');
            $('.my-tag-show .label').children('span').addClass('glyphicon-arrow-up');
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
                $('.my-tag-show .label[tag-id = ' + tagIds[i] + ']').removeClass('label-danger');
                $('.my-tag-show .label[tag-id = ' + tagIds[i] + ']').addClass('label-primary');
                $('.my-tag-show .label[tag-id = ' + tagIds[i] + ']').children('span').removeClass('glyphicon-arrow-up');
                $('.my-tag-show .label[tag-id = ' + tagIds[i] + ']').children('span').addClass('glyphicon-ok');
                tagShow.tagOperation.writeTagData(true, tagIds[i], 'tag-tree');
            }
            $('.tag').empty();
            $('.tag').append(dom.join(''));
        }
    }

    api.tag.tagShow.getChildTag(function (rep) {
        var tagData = rep.data;
        var tagLen = tagData.length;
        var dom = [];
        for (var i = 0; i < tagLen; i++) {
            dom.push('<option value="' + tagData[i].id + '">' + tagData[i].name + '</option>');
        }
        dom.push('</optgroup>');
        $('#id_select').append(dom.join(''));
        $('.selectpicker').selectpicker({
            'selectedText': 'cat'
        });
    });
    $('#id_select').change(function () {
        $('.tag').empty();
        $('#id_select > option:selected').each(function () {
            $('.tag').append('<span class="label other-tag label-warning span-icon-cursor" tag-id="' + $(this).val() + '">' + $(this).text() + '&nbsp;&nbsp;&nbsp;&nbsp;<span class="glyphicon glyphicon-remove"></span></span>');
        })
    });

    $('.tag', 'click', '.label', function () {
        $(this).addClass('animated zoomOut');
        var tagIdTop = $(this).attr("tag-id");
        tagShow.tagOperation.writeTagData(false, tagIdTop, 'tag-tree');
        $('.my-tag-show .label[tag-id = ' + tagIdTop + ']').removeClass('label-primary');
        $('.my-tag-show .label[tag-id = ' + tagIdTop + ']').addClass('label-danger');
        $('.my-tag-show .label[tag-id = ' + tagIdTop + ']').children().removeClass('glyphicon-ok');
        $('.my-tag-show .label[tag-id = ' + tagIdTop + ']').children().addClass('glyphicon-arrow-up');
        var $this = this;
        setTimeout(function () {
            $($this).remove();
        }, 500);
    });
});