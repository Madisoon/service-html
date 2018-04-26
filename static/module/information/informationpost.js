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
    // 排序类型，0不排序，1按接收账号排序
    var sortType = 0;
    $('#receive-user-sort').click(function () {
        sortType = sortType === 0 ? 1 : 0;
        if (sortType === 1) {
            $('#receive-user-sort').removeClass('span-gray');
            $('#receive-user-sort').addClass('span-blue');
        } else {
            $('#receive-user-sort').removeClass('span-blue');
            $('#receive-user-sort').addClass('span-gray');
        }
        getAllPostInfo();
    });
    getAllPostInfo();

    function getAllPostInfo() {
        api.information.infoManualShow.getInforPost("", sortType, function (rep) {
            if (rep.result === 0) {
                $('.info-show-context').empty();
            } else {
                var dataInforPost = rep.data;
                var dataInforPostLen = dataInforPost.length;
                var dom = [];
                for (var i = 0; i < dataInforPostLen; i++) {
                    var informationContent = [];
                    informationContent.push("标题：" + dataInforPost[i].infor_title);
                    if (dataInforPost[i].infor_context.length > 201) {
                        informationContent.push("内容：" + dataInforPost[i].infor_context.substring(0, 50));
                    } else {
                        informationContent.push("内容：" + dataInforPost[i].infor_context);
                    }
                    informationContent.push("链接：\n" + dataInforPost[i].infor_link);
                    informationContent.push("站点：" + dataInforPost[i].infor_site);
                    var copyContent = informationContent.join('\n');
                    dom.push('<div class="info-context-item">');
                    dom.push('<div class="info-title word">' + dataInforPost[i].infor_title + '</div>');
                    dom.push('<div class="info-context word">' + dataInforPost[i].infor_context + '</div>');
                    var numberType;
                    switch (dataInforPost[i].infor_post_type) {
                        case "qq":
                            numberType = "QQ";
                            break;
                        case "qqGroup":
                            numberType = "QQ群";
                            break;
                        case "weixin":
                            numberType = "微信";
                            break;
                        case "weixinGroup":
                            numberType = "微信群";
                            break;
                        default:
                            numberType = "错误反馈";
                            break;

                    }
                    dom.push('<div class="info-type word">' + numberType + '</div>');
                    dom.push('<div class="info-get word">' + dataInforPost[i].infor_get_people + '-' + dataInforPost[i].get_remark + '</div>');
                    dom.push('<div class="info-operate word">');
                    dom.push('<button type="button" data-clipboard-text="' + copyContent + '" class="btn btn-primary">复制</button>');
                    dom.push('<button type="button" class="btn btn-danger " inforId="' + dataInforPost[i].id + '">删除</button>');
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
});
