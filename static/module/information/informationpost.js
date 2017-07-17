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
                    dom.push('<button type="button" class="btn btn-success" inforId="' + dataInforPost[i].id + '">完成</button>');
                    dom.push('</div></div>');
                }
                $('.info-show-context').empty();
                $('.info-show-context').append(dom.join(''));
                var clipboard = new Clipboard('.btn-primary');

                $('.btn-primary').click(function () {
                    $('.btn-primary').parent().parent().removeClass('active');
                    $(this).parent().parent().addClass('active');
                });
                $('.btn-success').on("click", function () {
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

});
