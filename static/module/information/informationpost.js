/**
 * Created by Msater Zg on 2017/4/20.
 */
/**
 * Created by Msater Zg on 2017/1/25.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    var api = require('../../common/api');
    var sysTem = window.parent.SYSTEM;
    var sortType = 0;
    $('#search-infor-data').click(function () {
        getAllPostInfo();
    });

    $('#post-user-sort').click(function () {
        sortType = 0;
        getAllPostInfo();
    });

    $('#receive-user-sort').click(function () {
        sortType = 1;
        getAllPostInfo();
    });

    api.system.userManage.getAllUser(function (rep) {
        var userData = rep.data;
        var dom = [];
        for (var i = 0; i < rep.total; i++) {
            dom.push('<option value="' + userData[i].user_loginname + '">' + userData[i].user_name + '</option>');
        }
        $('#user-loginname').append(dom.join(''));
    });


    getAllPostInfo();

    function getAllPostInfo() {
        var userLoginName = $('#user-loginname').val();
        api.information.infoManualShow.getInforPost(userLoginName, sortType, function (rep) {
            if (rep.result === 0) {
                $('.info-show-context').empty();
            } else {
                var dataInforPost = rep.data;
                var dataInforPostLen = dataInforPost.length;
                var dom = [];
                for (var i = 0; i < dataInforPostLen; i++) {
                    var postTypeName = '';
                    dom.push('<div class="info-context-item">');
                    dom.push('<div class="info-context word">' + dataInforPost[i].infor_context.substring(0, 20) + '</div>');
                    dom.push('<div class="info-time word">' + dataInforPost[i].infor_post_time.substring(0, 16) + '</div>');
                    switch (dataInforPost[i].infor_post_type) {
                        case "qq":
                            postTypeName = 'QQ';
                            break;
                        case "qqGroup":
                            postTypeName = 'QQ群';
                            break;
                        case "weixin":
                            postTypeName = '微信';
                            break;
                        case "weixinGroup":
                            postTypeName = '微信群';
                            break;
                    }
                    dom.push('<div class="info-type word">' + postTypeName + '</div>');
                    dom.push('<div class="info-post word">' + dataInforPost[i].infor_post_people + '--' + dataInforPost[i].number_name.substring(0, 5) + '</div>');
                    dom.push('<div class="info-get word">' + dataInforPost[i].infor_get_people + '--' + dataInforPost[i].get_remark + '</div>');
                    dom.push('<div class="info-operate word">');
                    var inforText = dataInforPost[i].infor_context.replace(/\"/g, '”');
                    dom.push('<button type="button" data-clipboard-text="' + inforText + '" class="btn btn-primary">复制</button>');
                    dom.push('<button type="button" class="btn btn-danger" inforId="' + dataInforPost[i].id + '">删除</button>');
                    dom.push('<button type="button" class="btn btn-success post" inforId="' + dataInforPost[i].id + '">完成</button>');
                    dom.push('</div></div>');
                }
                $('.info-show-context').empty();
                $('.info-show-context').append(dom.join(''));
                var clipboard = new Clipboard('.btn-primary');

                $('.btn-primary').click(function () {
                    $('.btn-primary').parent().parent().removeClass('active');
                    $(this).parent().parent().addClass('active');
                });
                $('.btn-success.post').on("click", function () {
                    //调用修改的方法
                    var inforId = $(this).attr("inforId");
                    $(this).parent().parent().remove();
                    api.information.infoManualShow.updateInforPost(inforId, sysTem.user.user_loginname, function (rep) {
                        var inforNumber = $('.info-context-item').length;
                        if (inforNumber < 20) {
                            getAllPostInfo();
                        }
                    });
                });
                $('.btn-danger').on("click", function () {
                    //调用修改的方法
                    var inforId = $(this).attr("inforId");
                    $(this).parent().parent().remove();
                    api.information.infoManualShow.deleteInforPost(inforId, function (rep) {
                    });
                });
            }
        });
    }


    var tagShow = require('../../common/tagshow');
    var sysTem = window.parent.SYSTEM;
    var ADDINFOR;
    var CHOOSETAG;


    tagShow.tagOperation.writeDomTag(false, 'tag-tree');
    //添加信息的标签
    $('#add-infor-btn').unbind('click').click(function () {
        getSetFormValue(null, true);
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


    //信息表的主要内容
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
            api.information.infoShow.postInforData(inforDataInfo, inforData.inforTag.join(','), function (rep) {
                layer.close(ADDINFOR);
                if (rep.result == 1) {
                    getAllPostInfo();
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
        }

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
        inforData.infor_status = '0';
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


    function getSetFormValue(row, flag) {
        tagShow.tagOperation.writeTagData(false, '', 'tag-tree');
        if (flag) {
            $('#id_select > option').attr('select', false);
            $('.dropdown-menu.inner.selectpicker li').removeClass('selected active');
            console.log('shengxiao');
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

    /*    api.tag.tagShow.getChildTag(function (rep) {
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
        });*/

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
