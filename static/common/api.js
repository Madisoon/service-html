/**
 * Created by Msater Zg on 2017/1/6.
 */
define(function (require, exports, module) {
    // 立即执行函数实现模块化
    // 通过 require 引入依赖
    /* require('http://localhost:63343/service-html/spm_modules/layer/layer.js');*/
    //地址，参数（为对象），方法请求成功
    var baseUrl = 'http://127.0.0.1:8080/manage/';
    /*var baseUrl = 'http://39.108.178.160:8080/yuqingmanage/manage/';*/
    /*var baseUrl = 'http://118.178.237.219:8080/yuqingmanage/manage/';*/
    var getDataWay = function (url, params, success) {
        //发送ajax请求
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'JSON',
            data: params,
            success: function (rep) {
                success(rep);
            },
            error: function () {
            },
        });
    };
    //客户相关的所有的接口
    // 自行执行函数
    var customManage = (function () {
        var url = baseUrl;
        return {
            customerManage: { //客户管理
                changeCustomer: function (customerInfo, customerId, success) {
                    getDataWay(url + "changeCustomer", {
                        "customerInfo": customerInfo,
                        "customerId": customerId
                    }, success);
                },
                insertCustomer: function (customerInfo, success) {
                    getDataWay(url + "insertCustomer", {'customerInfo': customerInfo}, success);
                },
                deleteCustomer: function (id, success) {
                    getDataWay(url + "deleteCustomer", {'id': id}, success);
                },
                getAllCustomer: function (success) {
                    getDataWay(url + "getAllCustomer", {}, success);
                }
            },
            userManage: {
                getDeparmentUser: function (success) {
                    getDataWay(url + "getDeparmentUser", {}, success);
                },
                getFieldName: function (success) {
                    getDataWay(url + "getFieldName", {}, success);
                },
                getAllCustomerById: function (customerId, success) {
                    getDataWay(url + "getAllCustomerById", {customerId: customerId}, success);
                }
            },
            trashUserManage: {
                insertSysUser: function (userAllData, success) {
                    getDataWay(url + "insertSysUser", {'userAllData': userAllData}, success);
                },
                updateUserInfo: function (userAllData, success) {
                    getDataWay(url + "updateUserInfo", {'userAllData': userAllData}, success);
                },
                deleteUser: function (id, success) {
                    getDataWay(url + "deleteUser", {'id': id}, success);
                }
            },
            fieldManage: {
                getSingleField: function (id, success) {
                    getDataWay(url + "getSingleField", {id: id}, success);
                },
                getAllField: function (dataType, success) {
                    getDataWay(url + "getAllField", {dataType: dataType}, success);
                },
                deleteField: function (id, success) {
                    getDataWay(url + "deleteField", {id: id}, success);
                }
            }
        }
    }());

    //系统管理的所有的接口
    var sysManage = (function () {
        var url = baseUrl + "information/";
        return {
            getModules: function (success) {
                getDataWay(url + "module", {}, success);
            }
        }
    }());

    //用户管理的接口
    var userManage = (function () {
        var url = baseUrl;
        return {
            judgeLogin: function (userName, userPassword, success) {
                getDataWay(url + "getUserAllInfo", {
                    'user_loginname': userName,
                    'user_password': userPassword
                }, success);
            },
            changePersonInfo: function (userAllData, success) {
                getDataWay(url + "updateUserInfo", {
                    'userAllData': userAllData
                }, success);
            }
        }
    }());


    //系统相关的所有的接口
    var system;
    //用户管理
    system = (function () {
        var url = baseUrl;
        return {
            userManage: {
                insertSysUser: function (userAllData, success) {
                    getDataWay(url + "insertSysUser", {'userAllData': userAllData}, success);
                },
                updateUserInfo: function (userAllData, success) {
                    getDataWay(url + "updateUserInfo", {'userAllData': userAllData}, success);
                },
                deleteUser: function (id, success) {
                    getDataWay(url + "deleteUser", {'id': id}, success);
                },
                getAllUser: function (success) {
                    getDataWay(url + "getAllUser", {}, success);
                }
            },
            roleManage: {
                getAllRole: function (success) {
                    getDataWay(url + "getAllRole", {}, success);
                },
                getSingleRole: function (role_id, success) {
                    getDataWay(url + "getSingleRole", {'role_id': role_id}, success);
                },
                changeRole: function (role_id, menu_id, menu_pid, menu_purview, success) {
                    getDataWay(url + "changeRole", {
                        'role_id': role_id,
                        'menu_id': menu_id,
                        'menu_pid': menu_pid,
                        'menu_purview': menu_purview
                    }, success);
                },
                insertRole: function (role_name, success) {
                    getDataWay(url + "insertRole", {'role_name': role_name}, success);
                },
                getUserRole: function (role_id, success) {
                    getDataWay(url + "getUserRole", {'role_id': role_id}, success);
                },
                updateRoleName: function (role_id, role_name, success) {
                    getDataWay(url + "updateRoleName", {
                        'role_id': role_id,
                        'role_name': role_name
                    }, success);
                },
                deleteRole: function (id, success) {
                    getDataWay(url + "deleteRole", {'id': id}, success);
                }
            },
            depManage: {
                getAllDep: function (success) {
                    getDataWay(url + 'getAllDep', {}, success);
                },
                postDepData: function (dep_name, dep_no, success) {
                    getDataWay(url + "postDepData", {
                        'dep_name': dep_name,
                        'dep_no': dep_no
                    }, success);
                },
                updateDep: function (dep_name, dep_no, depId, success) {
                    getDataWay(url + "updateDep", {
                        'dep_name': dep_name,
                        'dep_no': dep_no,
                        'id': depId
                    }, success);
                },
                getUserByDepNo: function (dep_no, success) {
                    getDataWay(url + 'getUserByDepNo', {'dep_no': dep_no}, success);
                },
                getAllDepRole: function (success) {
                    getDataWay(url + 'getAllDepRole', {}, success);
                },
                deleteDep: function (id, success) {
                    getDataWay(url + "deleteById", {id: id}, success);
                }
            },
            moduleManage: {
                insertModule: function (module_value, module_url, module_id, success) {
                    getDataWay(url + "insertModule", {
                        'module_value': module_value,
                        'module_url': module_url,
                        'module_id': module_id
                    }, success);
                },
                getAllModule: function (success) {
                    getDataWay(url + 'getAllModule', {}, success);
                },
                getAllSecondModule: function (module_id, success) {
                    getDataWay(url + 'getAllSecondModule', {'module_id': module_id}, success);
                },
                deleteModule: function (module_id, success) {
                    getDataWay(url + 'deleteModule', {'module_id': module_id}, success);
                },
                updateModuleInfo: function (module_id, module_name, module_content, success) {
                    getDataWay(url + 'updateModuleInfo', {
                        'module_id': module_id,
                        'module_name': module_name,
                        'module_content': module_content
                    }, success);
                }
            },
            areaManage: {
                getFirstArea: function (success) {
                    getDataWay(url + "getFirstArea", {}, success);
                },
                getAllArea: function (success) {
                    getDataWay(url + "getAllArea", {}, success);
                },
                getTypeArea: function (areaId, success) {
                    getDataWay(url + "getTypeArea", {areaId: areaId}, success);
                },
                postAreaData: function (areaId, areaValue, areaGrade, success) {
                    getDataWay(url + "postAreaData", {
                        areaId: areaId,
                        areaValue: areaValue,
                        areaGrade: areaGrade
                    }, success);
                },
                deleteArea: function (areaId, success) {
                    getDataWay(url + "deleteArea", {
                        areaId: areaId
                    }, success);
                },
                updateArea: function (areaId, areaName, success) {
                    getDataWay(url + "updateArea", {
                        areaId: areaId,
                        areaName: areaName
                    }, success);
                },
                getAreaMaxId: function (success) {
                    getDataWay(url + "getAreaMaxId", {}, success);
                },
                insertArea: function (areaData, success) {
                    getDataWay(url + "insertArea", {areaData: areaData}, success);
                }
            }
        }
    }());

    //推送功能的接口
    var movement;
    //管理配置
    movement = (function () {
        var url = baseUrl;
        return {
            configureManage: {
                addQq: function (qqDate, success) {
                    getDataWay(url + "addQq", {qqDate: qqDate}, success);
                },
                deleteQq: function (idData, success) {
                    getDataWay(url + "deleteQq", {idData: idData}, success);
                },
                updateQq: function (qqData, id, success) {
                    getDataWay(url + "updateQq", {
                        qqData: qqData,
                        id: id
                    }, success);
                },
                getAllQq: function (success) {
                    getDataWay(url + "getAllQq", {}, success);
                },
                addWx: function (wxDate, success) {
                    getDataWay(url + "addWx", {wxDate: wxDate}, success);
                },
                deleteWx: function (idData, success) {
                    getDataWay(url + "deleteWx", {idData: idData}, success);
                },
                updateWx: function (wxData, id, success) {
                    getDataWay(url + "updateWx", {
                        wxData: wxData,
                        id: id
                    }, success);
                },
                getAllWx: function (success) {
                    getDataWay(url + "getAllWx", {}, success);
                },
                addPlan: function (planData, success) {
                    getDataWay(url + "addPlan", {planData: planData}, success);
                },
                deletePlan: function (idData, success) {
                    getDataWay(url + "deletePlan", {idData: idData}, success);
                },
                updatePlan: function (planData, id, success) {
                    getDataWay(url + "updatePlan", {
                        planData: planData,
                        id: id
                    }, success);
                },
                getAllPlan: function (success) {
                    getDataWay(url + "getAllPlan", {}, success);
                }
            },
            schemeManage: {
                insertScheme: function (schemeData, tagIds, areaId, baseTag, success) {
                    getDataWay(url + "insertScheme", {
                        schemeData: schemeData,
                        tagIds: tagIds,
                        areaId: areaId,
                        baseTag: baseTag
                    }, success);
                },
                deleteSchemeId: function (schemeId, success) {
                    getDataWay(url + "deleteSchemeId", {schemeId: schemeId}, success);
                },
                updateScheme: function (schemeId, tagIds, schemeData, baseTag, success) {
                    getDataWay(url + "updateScheme", {
                        schemeId: schemeId,
                        tagIds: tagIds,
                        schemeData: schemeData,
                        baseTag: baseTag
                    }, success);
                },
                getAllSchemeById: function (schemeId, success) {
                    getDataWay(url + "getAllSchemeById", {schemeId: schemeId}, success);
                }
            },
            severCustomer: {
                insertServeCustomer: function (customerData, getData, areaId, success) {
                    getDataWay(url + "insertServeCustomer", {
                        customerData: customerData,
                        getData: getData,
                        areaId: areaId
                    }, success);
                },
                updateServeCustomer: function (customerData, getData, serveCustomerId, success) {
                    getDataWay(url + "updateServeCustomer", {
                        customerData: customerData,
                        getData: getData,
                        serveCustomerId: serveCustomerId
                    }, success);
                },
                deleteServeCustomer: function (serveCustomerId, success) {
                    getDataWay(url + "deleteServeCustomer", {serveCustomerId: serveCustomerId}, success);
                },
                getAllServeCustomers: function (areaId, success) {
                    getDataWay(url + "getAllServeCustomers", {areaId: areaId}, success);
                },
                exportCustomerData: function (areaId, searchData, exportType, success) {
                    getDataWay(url + "exportCustomerData", {
                        areaId: areaId,
                        searchData: searchData,
                        exportType: exportType
                    }, success);
                }
            },
            terraceManage: {
                insertTerrace: function (terraceData, tagIds, areaId, baseTag, success) {
                    getDataWay(url + "insertTerraceModule", {
                        terraceData: terraceData,
                        tagIds: tagIds,
                        areaId: areaId,
                        baseTag: baseTag
                    }, success);
                },
                deleteTerraceId: function (terraceId, success) {
                    getDataWay(url + "deleteTerraceModuleId", {terraceId: terraceId}, success);
                },
                updateTerrace: function (terraceId, tagIds, terraceData, baseTag, success) {
                    getDataWay(url + "updateTerraceModule", {
                        terraceId: terraceId,
                        tagIds: tagIds,
                        terraceData: terraceData,
                        baseTag: baseTag
                    }, success);
                },
                getAllTerraceModule: function (areaId, success) {
                    getDataWay(url + "getAllTerraceModule", {areaId: areaId}, success);
                },
            },
            terraceCustomer: {
                insertTerraceCustomer: function (terraceCustomerData, moduleId, areaId, success) {
                    getDataWay(url + "insertTerraceCustomer", {
                        terraceCustomerData: terraceCustomerData,
                        moduleId: moduleId,
                        areaId: areaId
                    }, success);
                },
                deleteTerraceCustomerId: function (terraceId, success) {
                    getDataWay(url + "deleteTerraceCustomerId", {terraceId: terraceId}, success);
                },
                updateTerraceCustomer: function (terraceCustomerData, moduleId, terraceId, success) {
                    getDataWay(url + "updateTerraceCustomer", {
                        terraceCustomerData: terraceCustomerData,
                        moduleId: moduleId,
                        terraceId: terraceId
                    }, success);
                },
                getAllTerraceCustomer: function (areaId, success) {
                    getDataWay(url + "getAllTerraceCustomer", {areaId: areaId}, success);
                },
            },
            topicFocusManage: {
                insertTopicContext: function (topicId, topicInfo, success) {
                    getDataWay(url + "insertTopicContext", {
                        topicId: topicId,
                        topicInfo: topicInfo,
                    }, success);
                },
                deleteTopicContext: function (topicId, success) {
                    getDataWay(url + "deleteTopicContext", {
                        topicId: topicId
                    }, success);
                },
                checkTopicContext: function (topicId, success) {
                    getDataWay(url + "checkTopicContext", {
                        topicId: topicId
                    }, success);
                },
                updateTopicContext: function (topicId, topicInfo, success) {
                    getDataWay(url + "updateTopicContext", {
                        topicId: topicId,
                        topicInfo: topicInfo,
                    }, success);
                },
                insertTopic: function (topicId, topicInfo, success) {
                    getDataWay(url + "insertTopic", {
                        topicInfo: topicInfo
                    }, success);
                },
                updateTopic: function (topicId, topicName, success) {
                    getDataWay(url + "updateTopic", {
                        topicId: topicId,
                        topicName: topicName
                    }, success);
                },
                deleteTopic: function (topicId, success) {
                    getDataWay(url + "deleteTopic", {
                        topicId: topicId,
                    }, success);
                },
                getAllTopic: function (success) {
                    getDataWay(url + "getAllTopic", {}, success);
                },
            }

        }
    }());


    //所有信息接口
    var information;
    //信息展示
    information = (function () {
        var url = baseUrl;
        return {
            infoShow: {
                postInforData: function (infoData, infoTag, success) {
                    getDataWay(url + "insertInFor", {
                        infoData: JSON.stringify(infoData),
                        infoTag: infoTag
                    }, success);
                },
                updateInfoData: function (infoData, infoTagId, infoId, success) {
                    getDataWay(url + "updateInfoData", {
                        infoData: infoData,
                        infoTagId: infoTagId,
                        infoId: infoId
                    }, success);
                },
                deleteInfoData: function (infoId, success) {
                    getDataWay(url + 'deleteInfoData', {infoId: infoId}, success);
                },
                manualPost: function (infoId, customerId, success) {
                    getDataWay(url + 'manualPost', {
                        infoId: infoId,
                        customerId: customerId
                    }, success);
                },
                exportData: function (searchTagId, searchInfoData, customerName, exportType, success) {
                    getDataWay(url + 'exportData', {
                        searchTagId: searchTagId,
                        searchInfoData: searchInfoData,
                        customerName: customerName,
                        exportType: exportType
                    }, success);
                }
            },
            infoManualShow: {
                getInforPost: function (userLoginName, sortType, success) {
                    getDataWay(url + "getInforPost", {
                        userLoginName: userLoginName,
                        sortType: sortType
                    }, success);
                },
                updateInforPost: function (inforId, userLoginName, success) {
                    getDataWay(url + "updateInforPost", {
                        inforId: inforId,
                        userLoginName: userLoginName
                    }, success);
                },
                deleteInforPost: function (inforId, success) {
                    getDataWay(url + "deleteInforPost", {inforId: inforId}, success);
                }
            },
            infoHistory: {
                getInforPost: function (success) {
                    getDataWay(url + "getInforPost", {}, success);
                },
                exportHistoryInfor: function (searchData, success) {
                    getDataWay(url + "exportHistoryInfor", {searchData: searchData}, success);
                }
            }
        }
    }());

    var tag;
    tag = (function () {
        var url = baseUrl;
        return {
            tagShow: {
                insertTag: function (tagData, allParent, success) {
                    getDataWay(url + "insertTag", {
                        tagData: tagData,
                        allParent: allParent
                    }, success);
                },
                getIdMax: function (success) {
                    getDataWay(url + "getIdMax", {}, success);
                },
                getAllTag: function (success) {
                    getDataWay(url + "getAllTag", {}, success);
                },
                updateTag: function (id, tagName, success) {
                    getDataWay(url + "updateTag", {'id': id, 'tagName': tagName}, success);
                },
                deleteTag: function (id, success) {
                    getDataWay(url + "deleteTag", {'id': id}, success);
                },
                getTypeTag: function (success) {
                    getDataWay(url + "getTypeTag", {}, success);
                }
            },
            personTag: {
                getMyTag: function (userLoginName, success) {
                    getDataWay(url + "getMyTag", {'userLoginName': userLoginName}, success);
                },
                insertMyTag: function (userLoginName, id, success) {
                    getDataWay(url + "insertMyTag", {'userLoginName': userLoginName, 'id': id}, success);
                },
                deleteMyTag: function (userLoginName, id, success) {
                    getDataWay(url + "deleteMyTag", {'userLoginName': userLoginName, 'id': id}, success);
                }
            }

        }
    }());

    var app = (function () {
        return {
            appModule: {
                insertAppModule: function (appModuleInfo, appModuleInfoTag, appArea, success) {
                    getDataWay(url + "insertTag", {
                        appModuleInfo: appModuleInfo,
                        appModuleInfoTag: appModuleInfoTag,
                        appArea: appArea,
                    }, success);
                },
                deleteAppModule: function (appModuleId, success) {
                    getDataWay(url + "deleteAppModule", {
                        appModuleId: appModuleId
                    }, success);
                }
            },
        }
    }());
    return {
        baseUrl: baseUrl,
        customManage: customManage,
        sysManage: sysManage,
        userManage: userManage,
        system: system,
        movement: movement,
        information: information,
        tag: tag,
        app: app
    };
});