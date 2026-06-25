// 获取包含协议的主机地址
var fullHostAddress = window.location.origin;
var hosts=window.location.host;
var ServerIP = fullHostAddress + "/swzz/";
var FWIP = "";
var ClientIP = fullHostAddress+"/";
var TranslateIP = fullHostAddress+"/";
var HttpUrl = fullHostAddress+"//ModeUploadDoc/";
var QXIP = ServerIP;  
var PicUrl = fullHostAddress+"/ModeUploadDoc/";
var PicUrlNT = fullHostAddress+"/ModeUploadDoc/";//临时用的雷达图
var GCUrl = "";
var LoginName = "管理员";
var SYSTITLE = "上海水文总站";
var myLogin = {};
var systematicName = "上海市水情预报调度一体化平台（一期）";
SetCookie('miniuiMode', 'medium', 30);
SetCookie('miniuiSkin', 'bootstrap', 30);
var shswzzGroupAllIDS = "2017110700001,2022041810191130136,2022083017282433628";

var HuishuiApiUrl = window.location.pathname.indexOf('swzzWeb')>-1?fullHostAddress+"/modelproyx/HuishuiApi/":"/HuishuiApi";//nginx新版模型接口地址
var HuishuiServerUrl= window.location.pathname.indexOf('swzzWeb')>-1?fullHostAddress+"/modelproyx/serviceInfo/server/":"/HuishuiServer/";//nginx新版模型接口地址

//风暴潮模型接口
var StormSurgeForecastUrl=window.location.pathname.indexOf('swzzWeb')>-1?fullHostAddress+"/dev-api/StormSurgeForecast/":"/StormSurgeForecast";

var encryToken = false;
var JSMyPATH = _CreateJSPath("JSMy.js");
document.write('<script type="text/javascript" src="' + JSMyPATH + 'Scripts/cryptoJS/rollups/tripledes.js" charset="UTF-8"></script>');
document.write('<script type="text/javascript" src="' + JSMyPATH + 'Scripts/cryptoJS/components/mode-ecb.js" charset="UTF-8"></script>');
function _CreateJSPath(js) {
    var scripts = document.getElementsByTagName("script");
    var path = "";
    for (var i = 0, l = scripts.length; i < l; i++) {
        var src = scripts[i].src;
        if (src.indexOf(js) != -1) {
            var ss = src.split(js);
            path = ss[0];
            break;
        }
    }
    var href = location.href;
    href = href.split("#")[0];
    href = href.split("?")[0];
    var ss = href.split("/");
    ss.length = ss.length - 1;
    href = ss.join("/");
    if (path.indexOf("https:") == -1 && path.indexOf("http:") == -1 && path.indexOf("file:") == -1 && path.indexOf("\/") != 0) {
        path = href + "/" + path;
    }
    return path;
}

//}
function GetObj(objName) { //获得HTML中组件对象
    if (document.getElementById) {
        return eval('document.getElementById("' + objName + '")');
    } else {
        return eval('document.all.' + objName);
    }
}
function SetObj(objName) {
    if (objName == undefined) {
        objName = "";
    }
    return objName;
}
//设置cookie
function SetCookie(name, value, Days) {
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
function GetCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) {
        return unescape(arr[2]);
    } else {
        return "";
    }
}
//删除cookie
function DelCookie(name) {
    SetCookie(name, null, -1);
}
function openwindowBK(url, name, strWidth, strHeight) {  
    var iWidth = (window.screen.availWidth) * strWidth;                          //弹出窗口的宽度;
    var iHeight = (window.screen.availHeight) * strHeight;                        //弹出窗口的高度;
    var iTop = 0; //(window.screen.availHeight - 30 - iHeight) / 2;       //获得窗口的垂直位置;
    var iLeft = 0;// (window.screen.availWidth - 10 - iWidth) / 2;           //获得窗口的水平位置;
    window.open(url, name, 'height=' + iHeight + ',,innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',alwaysRaised=yes,menubar=no,toolbar=no,location=yes,status=yes,resizable=yes,,scrollbars=yes');
}
function getRect(elements) {
    var rect = elements.getBoundingClientRect();
    var clientTop = document.documentElement.clientTop;
    var clientLeft = document.documentElement.clientLeft;
    return { // 兼容ie多出的两个px 
        top: rect.top - clientTop, // 距离顶部的位置 
        bottom: rect.bottom - clientTop, // 距离顶部加上元素本身的高度就等于bottom的位置 
        left: rect.left - clientLeft, // 距离左边的位置 
        right: rect.right - clientLeft // 距离右边的位置就是 距离左边的位置加上元素本身的宽度 
    };
};
function openwindow(url, name) { 
    var iWidth = (window.screen.availWidth) * 0.7;                          //弹出窗口的宽度;
    var iHeight = (window.screen.availHeight) * 0.7;                        //弹出窗口的高度;
    var iTop = (window.screen.availHeight - 30 - iHeight) / 2;       //获得窗口的垂直位置;
    var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;           //获得窗口的水平位置;
    window.open(url, name, 'height=' + iHeight + ',,innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',alwaysRaised=yes,menubar=no,toolbar=no,location=yes,status=yes,resizable=yes,,scrollbars=yes');
}

function WindowsOpen(url, title, stcd) {
    var _width = 970, _height = 550;
    if (stcd.lastIndexOf('@') > -1) {
        var aggstcd = stcd.split('@');
        if (aggstcd.length > 0) {
            _width = aggstcd[0];
            _height = aggstcd[1];
        }
    }
    mini.open({
        url: url,
        title: title,
        width: _width,
        height: _height,
        showMaxButton: true,     //显示最大化按钮
        showCloseButton: true,   //显示关闭按钮
        onload: function () {
        },
        ondestroy: function (action) {
            //grid.reload();
        }
    });
}

function SetWinHeight(obj) { //动态设置Iframe的大小
    try {
        var OkIframe = obj;
        if (document.getElementById) {
            if (OkIframe && !window.opera) {
                if (OkIframe.contentDocument && OkIframe.contentDocument.body.offsetHeight) {
                    if (OkIframe.contentDocument.body.offsetHeight < 600) {
                        OkIframe.height = 600;
                    } else {
                        OkIframe.height = OkIframe.contentDocument.body.offsetHeight;
                    }
                }
                else if (OkIframe.Document && OkIframe.Document.body.scrollHeight) {
                    if (OkIframe.Document.body.scrollHeight < 600) {
                        OkIframe.height = 600;
                    } else {
                        OkIframe.height = OkIframe.Document.body.scrollHeight;
                    }
                }
                else {
                    var mainHeight = document.getElementById(OkIframe.id).contentWindow.document.body.scrollHeight;
                    OkIframe.height = mainHeight;
                }
            }
        }
    }
    catch (err) {
        OkIframe.height = "600";
    }
}


function iFrameHeight(ObjID) {
    var ifm = document.getElementById(ObjID);
    var subWeb = document.frames ? document.frames[ObjID].document : ifm.contentDocument;
    if (ifm != null && subWeb != null) {
        ifm.height = subWeb.body.scrollHeight;
    }
}

//验证文本框输入是否为数字
function JHshIsNumber(txtName, sLabel) {
    var strTemp = "";
    if (GetObj(txtName).value != "-") {
        if (isNaN(GetObj(txtName).value)) {
            strTemp = "“" + sLabel + "”必须是数值型数据。";
            window.alert(strTemp);
            GetObj(txtName).value = "";
            GetObj(txtName).focus();
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}

function GetAjaxHtml(ObjUrl, ObjId) {
    $.ajax({
        //提交数据的类型 POST GET
        type: "POST",
        //提交的网址
        url: ObjUrl + "&Time=" + Math.random(),
        //提交的数据 
        //返回数据的格式
        datatype: "jsonp", //"xml", "html", "script", "json", "jsonp", "text".
        //在请求之前调用的函数
        //beforeSend:function(){alert("在请求之前调用的函数");},
        //成功返回之后调用的函数             
        success: function (data) {
            alert(data);
            if (data == "发送成功") {
                sel();
            }
        },
        //调用执行后调用的函数
        //            complete: function(XMLHttpRequest, textStatus){
        //               alert(XMLHttpRequest.responseText);
        //               alert(textStatus);
        //                //HideLoading();
        //            },
        //调用出错执行的函数
        error: function () {
            //请求出错处理
            return "发送失败";
        }
    });
}

tablePage = function (http_url, divID) {
    //show();
    var mathRound = Math.random();
    if (http_url.lastIndexOf("?") < 0) {
        http_url = http_url + "?1=1";
    }
    var iDisplayLength = 20;
    $.get(http_url + "&mathRound=" + mathRound, function (data) {
        $("#" + divID).html(data);
        //ClearShow();
        $('.datatable').dataTable({
            "bDestroy": false,
            "bFilter": false,    //过滤功能
            "sSearch": "关键字:",
            "bAutoWidth": false,
            "bSort": false,     //排序功能 
            "bStateSave": false, //开关，是否打开客户端状态记录功能。这个数据是记录在cookies中的，打开了这个记录后，即使刷新一次页面，或重新打开浏览器，之前的状态都是保存下来的
            "bProcessing": false,
            "bLengthChange": false,
            "iDisplayLength": iDisplayLength, //每页显示10条数据
            //"sAjaxSource": "/rule/list", //ajax请求地址
            //"aLengthMenu": [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "所有"]], 
            "oLanguage": {
                "sUrl": "/Common/Script/zh_CN.json"
            }

        });
    });
}
tablePageNew = function (http_url, divID) {
    //show();
    var mathRound = Math.random();
    if (http_url.lastIndexOf("?") < 0) {
        http_url = http_url + "?1=1";
    }
    var iDisplayLength = 20;
    $.get(http_url + "&mathRound=" + mathRound, function (data) {
        $("#" + divID).html(data);
        GetFloat();
        ////ClearShow();
        //$('.datatable').dataTable({
        //    "bDestroy": false,
        //    "bFilter": false,    //过滤功能
        //    "sSearch": "关键字:",
        //    "bAutoWidth": false,
        //    "bSort": false,     //排序功能 
        //    "bStateSave": false, //开关，是否打开客户端状态记录功能。这个数据是记录在cookies中的，打开了这个记录后，即使刷新一次页面，或重新打开浏览器，之前的状态都是保存下来的
        //    "bProcessing": false,
        //    "bLengthChange": false,
        //    "iDisplayLength": iDisplayLength, //每页显示10条数据
        //    //"sAjaxSource": "/rule/list", //ajax请求地址
        //    //"aLengthMenu": [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "所有"]], 
        //    "oLanguage": {
        //        "sUrl": "/Common/Script/zh_CN.json"
        //    }

        //});
    });
}
PageTable = function () {
    var iDisplayLength = 20;
    $('.datatable').dataTable({
        "bDestroy": false,
        "bFilter": false,    //过滤功能
        "sSearch": "关键字:",
        "bAutoWidth": false,
        "bSort": false,     //排序功能 
        "bStateSave": false, //开关，是否打开客户端状态记录功能。这个数据是记录在cookies中的，打开了这个记录后，即使刷新一次页面，或重新打开浏览器，之前的状态都是保存下来的
        "bProcessing": false,
        "bLengthChange": false,
        "iDisplayLength": iDisplayLength, //每页显示10条数据
        //"sAjaxSource": "/rule/list", //ajax请求地址
        //"aLengthMenu": [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "所有"]], 
        "oLanguage": {
            "sUrl": "/Common/Script/zh_CN.json"
        }

    });
    setBomHeight();
}
//移除指定的值
Array.prototype.removeValue = function (val) {
    var index = this.indexOf(val);
    while (index > -1) {
        this.splice(index, 1);
        index = this.indexOf(val);
    }
};
function setBomHeight() {
    var ev = document.documentElement || document.body;
    var body_top = $("#form1").height();
    var win_top = document.documentElement.clientHeight || document.body.clientHeight;
    //var win_top = window.innerHeight
    //alert(body_top + "--" + win_top)
    if (win_top - 60 > body_top) {
        $("#mas_bottom").css("position", "absolute");
        $("#mas_bottom").css("top", win_top - 60 + "px");
    }
    else {
        $("#mas_bottom").css("position", "");
    }
}

FanHui = function (objUrl) {
    //history.back();
    window.location.href = objUrl;
}

function show() {
    //window.parent.document.getElementById("feedbox").style.display = "block";
    //window.parent.document.getElementById("boxmain").style.display = "block";
}
function ClearShow() {
    //window.parent.document.getElementById("boxmain").style.display = "none";
    //window.parent.document.getElementById("feedbox").style.display = "none";
}
function cncover(obj) {//显示
    GetObj(obj).style.visibility = "visible";
}

function cncout(obj) {//隐藏
    GetObj(obj).style.visibility = "hidden";
}

//文件下载
function Recorder_Down(strNAME, strType, strFILE) {//查询
    //1、名称2、类型、3文件
    var Rands = getRandom(0, 100);
    window.open("/Down_FBB_File_Set.aspx?NewName=" + escape(strNAME) + "&TYPES=" + escape(strType) + "&strFILE=" + escape(strFILE) + "&Rands=" + Rands, 'filedown', 'width=0,height=0,scrollbars=no,resizable=no');
}
function getRandom(min, max) {
    var r = Math.random() * (max - min);
    var re = Math.round(r + min);
    re = Math.max(Math.min(re, max), min);
    return re;
}


function CheckRequired(objClss) {
    var required = $("." + objClss);
    var strMsg = "";
    if (required.length > 0) {
        for (num = 0; num < required.length; num++) {
            try {
                $("#span" + required[num].id).remove();
            }
            catch (e) { }
            if (required[num].value != "") {
                if (GetObj(required[num].id).title != "") {
                    Checkonblur(required[num].id);
                    strMsg = "";
                }

            }
            else {
                GetObj(required[num].id).style.color = "#b94a48";
                GetObj(required[num].id).style.backgroundColor = " #f2dede";
                GetObj(required[num].id).style.borderColor = " #b94a48";
                GetObj(required[num].id).style.float = " left";
                GetObj(required[num].id).title = "1";
                $("#" + required[num].id).innerHTML = "";
                $("#" + required[num].id).after("<span id='span" + required[num].id + "' style='color:#b94a48; float:left;'><img src='/Common/images/error.gif'/>&nbsp;</span>");//" + $("#" + required[num].id).attr("emptytext") + "
                var tempid = required[num].id;
                Bindblur(required[num].id);
                strMsg = "1";
            }
        }
    }
    if (strMsg != "") {
        return false;
    }
    else {
        return true;
    }
}

function Checkonblur(objID) {
    if (GetObj(objID).value != "") {
        GetObj(objID).style.color = "";
        GetObj(objID).style.backgroundColor = "";
        GetObj(objID).style.borderColor = "";
        GetObj(objID).title = "";
        $("#span" + objID).remove();
    }
}
function Bindblur(objID) {
    $('#' + objID).blur(function () {
        Checkonblur(objID);
    });
}

function jsSelectItemByValue(objID, objItemText) {
    var objSelect = document.getElementById(objID);
    for (var i = 0; i < objSelect.options.length; i++) {
        if (objSelect.options[i].value == objItemText) {
            objSelect.options[i].selected = true;
            $('[data-form=select2]').select2();
            break;
        }
    }
}


function obj2str(o) {
    var r = [];
    if (typeof o == "string" || o == null) {
        return o;
    }
    if (typeof o == "object") {
        if (!o.sort) {
            for (var i in o) {
                r[r.length] = obj2str(o[i]);
            }
        } else {
            for (var i = 0; i < o.length; i++) {
                r[r.length] = obj2str(o[i]);
            }
        }
        return r.join("");
    }
    return o.toString();
}
function GetList(url, datas) {
    $.ajax({
        //提交数据的类型 POST GET
        type: "POST",
        //提交的网址
        url: url,
        data: "{" + datas + "}",
        async: false,
        //提交的数据 
        contentType: "application/json; charset=utf-8",
        //返回数据的格式
        datatype: "jsonp", //"xml", "html", "script", "json", "jsonp", "text".
        //在请求之前调用的函数
        beforeSend: function () {
            //alert("在请求之前调用的函数");
            //$("#table2").html(" 数据加载中。。。");
        },
        //成功返回之后调用的函数             
        success: function (data) {
            var ObjData = obj2str(data); //JSON.stringify(data); 
            //            $("#table2").html(decodeURI(ObjData)); 
            $("#table2").html(ObjData);
            PageTable();
        },
        complete: function (XMLHttpRequest, textStatus) {

        },
        error: function () {
            //请求出错处理
            // alert("错误日志");
        }
    });
}


function GetjsonpCallback(strUrl, strWhere, typeID) {
    $.ajax({
        type: "POST",
        url: strUrl + "",
        dataType: 'JSONP',
        data: strWhere,
        jsonp: "jsonpCallback",
        jsonpCallback: 'jsonpCallback',
        beforeSend: function (XMLHttpRequest) {
        },
        success: function (data) {
            JosnSel(data, typeID);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("请求失败" + strUrl+"@@@"+textStatus);
        }
    });
}
function GetJosn(url, datas, typeID,async=true, callback, errorback) {
    $.ajax({
        //提交数据的类型 POST GET
        type: "POST",
        //提交的网址
        url: url,
        data: "{" + datas + "}",
        async: async,
        //提交的数据 
        contentType: "application/json; charset=utf-8",
        //返回数据的格式
        datatype: "jsonp", //"xml", "html", "script", "json", "jsonp", "text".
        //在请求之前调用的函数
        beforeSend: function () {
            //alert("在请求之前调用的函数");
            //$("#flashcontent").html(" 数据加载中。。。");
        },
        //成功返回之后调用的函数             
        success: function (data) {
            if (callback != undefined) {
                callback(data);
            }else{
                var Josn_Obj = obj2str(data); //JSON.stringify(data);  
                //GetObj("ObjJosn");
                JosnSel(Josn_Obj, typeID);
            }
        },
        //调用执行后调用的函数
        //            complete: function(XMLHttpRequest, textStatus){
        //               alert(XMLHttpRequest.responseText);
        //               alert(textStatus);
        //                //HideLoading();
        //            },
        //调用出错执行的函数
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert(XMLHttpRequest.status);
        }
    });
}
function GetIndexJosn(url, datas, typeID) {
    $.ajax({
        //提交数据的类型 POST GET
        type: "POST",
        //提交的网址
        url: url,
        data: "{" + datas + "}",
        //提交的数据 
        contentType: "application/json; charset=utf-8",
        //返回数据的格式
        datatype: "jsonp", //"xml", "html", "script", "json", "jsonp", "text".
        //在请求之前调用的函数
        beforeSend: function () {
            //alert("在请求之前调用的函数");
            //$("#flashcontent").html(" 数据加载中。。。");
        },
        //成功返回之后调用的函数             
        success: function (data) {
            var Josn_Obj = obj2str(data); //JSON.stringify(data);  
            //GetObj("ObjJosn");
            JosnIndexSel(Josn_Obj, typeID);
        },
        //调用执行后调用的函数
        //            complete: function(XMLHttpRequest, textStatus){
        //               alert(XMLHttpRequest.responseText);
        //               alert(textStatus);
        //                //HideLoading();
        //            },
        //调用出错执行的函数
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert(XMLHttpRequest.status);
        }
    });
}
function GetText(url, datas, typeID) {
    var a = new Date();
    $.ajax({
        //提交数据的类型 POST GET
        type: "POST",
        //提交的网址
        url: url,
        data: "{" + datas + "}",
        //提交的数据 
        contentType: "application/json; charset=utf-8",
        //返回数据的格式
        datatype: "text", //"xml", "html", "script", "json", "jsonp", "text".
        //在请求之前调用的函数
        beforeSend: function () {
            //alert("在请求之前调用的函数");
            //$("#flashcontent").html(" 数据加载中。。。");
        },
        //成功返回之后调用的函数             
        success: function (data) {
            var Josn_Obj = obj2str(data); //JSON.stringify(data);  
            //GetObj("ObjJosn").value = Josn_Obj; 
            JosnSel(Josn_Obj, typeID);
        },
        //调用执行后调用的函数
        //            complete: function(XMLHttpRequest, textStatus){
        //               alert(XMLHttpRequest.responseText);
        //               alert(textStatus);
        //                //HideLoading();
        //            },
        //调用出错执行的函数
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert(XMLHttpRequest.status);
        }
    });
}
//解密
function decrypted(objData) {
    var keyHex = CryptoJS.enc.Utf8.parse('TBA_Ddzl');
    var decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(objData)
    }, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
    var result = decrypted.toString(CryptoJS.enc.Utf8);
    return result;
}
//加密
function encrypted(objData) {
    var keyHex = CryptoJS.enc.Utf8.parse('TBA_Ddzl');

    var later_passwd = CryptoJS.DES.encrypt(objData, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return later_passwd;
}
function GetJosns(url, postParam, typeID) {
        //console.log(HtmIp + "/json/reply/" + url);
        //console.log(JSON.stringify(postParam));
        var Param = { "METHOD": url, "KEYID": "admin", "PLATFORMIP": "平台", "PARAMETER": JSON.stringify(postParam) };

        jQuery.support.cors = true;   
        $.ajax({
            //url: ServerIP + "json/reply/SPI",//+ url,//SPI
            //data: Param,
            url: ServerIP + "json/reply/"+ url,//SPI
            data: postParam,
            type: "POST",
            async: true,
            cache: false,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function (ResultData) { 
                JosnSel(ResultData, typeID);

                try {
                    var strWhere = {};
                    strWhere["CREATETIME"] = new Date().format("yyyy/MM/dd HH:mm:ss");
                    strWhere["SYSUSERID"] = GetCookie("username");
                    strWhere["SYSUSERNAME"] = GetCookie("LOGINNAME");
                    strWhere["PLATFORM"] = "平台";
                    strWhere["PLATFORMNAME"] = url;
                    strWhere["INTERFACENAME"] = url;
                    strWhere["REQUESTLOGMESSAGE"] = JSON.stringify(postParam);
                    strWhere["REPORTMESSAGE"] =JSON.stringify(ResultData.data);
                    strWhere["REPORTERROR"] = ResultData.Message;
                    strWhere["RESPONSETIME"] = ResultData.ElapseTime;
                    //GetJosnsLOG("DATA_SYS_REPORTLOGAdd", strWhere, "DATA_SYS_REPORTLOGAdd");
                } catch (ex) { }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { 
                if (url == "LOGINSel") {
                    var ieV = IEVersion();
                    if (ieV >= 7 && ieV <= 10) {
                        if (confirm("当前浏览器版本过低、推荐使用360极速浏览器") == true) {
                            window.location.href = "Help.html";
                        }
                    }
                }
                console.log('请求失败！' + url);
            }
        });
    }

function GetJosnsLOG(url, postParam, typeID) {
    $.ajax({
        url: ServerIP + "json/reply/" + url,
        data: postParam,
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function (ResultData) {
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
}

function GetQXJosns(url, postParam, typeID) {
    //console.log(HtmIp + "/json/reply/" + url);
    //console.log(JSON.stringify(postParam));
    var Param = { "METHOD": url, "KEYID": "admin", "PLATFORMIP": "平台", "PARAMETER": JSON.stringify(postParam) };
 
    jQuery.support.cors = true;   
    $.ajax({
        //url: QXIP + "json/reply/SPI",//+ url,//SPI
        //data: Param,
        url: QXIP + "json/reply/"+ url,//SPI
        data: postParam,
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function (ResultData) {
            JosnSel(ResultData, typeID);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (url == "LOGINSel") {
                var ieV = IEVersion();
                if (ieV >= 7 && ieV <= 10) {
                    if (confirm("当前浏览器版本过低、推荐使用360极速浏览器") == true) {
                        window.location.href = "Help.html";
                    }
                }
            }
            console.log('请求失败！' + url);
        }
    });
}
//临时雷达图接口
function GetQXJosnsNT(url, postParam, typeID) {
    jQuery.support.cors = true;
    $.ajax({
        url:  "http://36.156.144.126:8099//FW/json/reply/" + url,//SPI
        data: postParam,
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function (ResultData) {
            JosnSel(ResultData, typeID);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (url == "LOGINSel") {
                var ieV = IEVersion();
                if (ieV >= 7 && ieV <= 10) {
                    if (confirm("当前浏览器版本过低、推荐使用360极速浏览器") == true) {
                        window.location.href = "Help.html";
                    }
                }
            }
            console.log('请求失败！' + url);
        }
    });
}

function GetJosnsFW(url, postParam, typeID) {
    //console.log(HtmIp + "/json/reply/" + url);
    //console.log(JSON.stringify(postParam));
    jQuery.support.cors = true;
    var Param = { "METHOD": FWIP +"json/reply/" + url, "KEYID": "admin", "PLATFORMIP": "平台", "PARAMETER": JSON.stringify(postParam) };
    $.ajax({
        url: ServerIP + "json/reply/SPI" ,//+ url,
        data: Param,
        type: "POST",
        async: true,
        cache: false,
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function (ResultData) {
            JosnSel(ResultData, typeID);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('请求失败！' + url);
        }
    });
}


function GetJosnsModeNew(url, postParam,_async=true,callback = null,errorback=null,getType='POST') {
    jQuery.support.cors = true;
    var ServerUrl=HuishuiApiUrl + url;
    if(url!=""){
        ServerUrl=HuishuiServerUrl + url;
    }
    var aj = $.ajax({
        url: ServerUrl,
        type: getType,
        dataType: 'json',
        data: JSON.stringify(postParam), //根据需求编辑传递参数的格式
        headers: { 
            'Content-Type': 'application/json;charset=utf-8',
            "authorization": token,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST",
            "Access-Control-Allow-Headers": "content-type"
        },
        async: _async,
        //cache: false,
        contentType: 'application/json;charset=utf-8',
        xhrFields: {
            withCredentials: true //跨域请求要想带上cookie，必须要在ajax请求里加上xhrFields: {withCredentials: true}。
        },
        error: function (err) {
            if (errorback != undefined) {
                errorback(err);
            }
            console.error('调用模型接口错误信息：', err)
            //报错的时候提示
        },
        success: function (msg) {
            callback(msg);
        }
    });
}

function  GetJosnsStormSurgeForecast(url, postParam,_async=true,callback = null,errorback=null,getType='POST') {
    jQuery.support.cors = true;
    var ServerUrl=StormSurgeForecastUrl + url;
    var aj = $.ajax({
        url: ServerUrl,
        type: getType,
        dataType: 'json',
        data: JSON.stringify(postParam), //根据需求编辑传递参数的格式
        headers: { 
            'Content-Type': 'application/json;charset=utf-8',
            "authorization": token,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST",
            "Access-Control-Allow-Headers": "content-type"
        },
        async: _async,
        //cache: false,
        contentType: 'application/json;charset=utf-8',
        xhrFields: {
            withCredentials: true //跨域请求要想带上cookie，必须要在ajax请求里加上xhrFields: {withCredentials: true}。
        },
        error: function (err) {
            if (errorback != undefined) {
                errorback(err);
            }
            console.error('调用模型接口错误信息：', err)
            //报错的时候提示
        },
        success: function (msg) {
            callback(msg);
        }
    });
}

function FixTable(TableID, FixColumnNumber, width, height) {
    /// <summary>
    ///     锁定表头和列
    ///     <para> sorex.cnblogs.com </para>
    /// </summary>
    /// <param name="TableID" type="String">
    ///     要锁定的Table的ID
    /// </param>
    /// <param name="FixColumnNumber" type="Number">
    ///     要锁定列的个数
    /// </param>
    /// <param name="width" type="Number">
    ///     显示的宽度
    /// </param>
    /// <param name="height" type="Number">
    ///     显示的高度
    /// </param>
    if ($("#" + TableID + "_tableLayout").length != 0) {
        $("#" + TableID + "_tableLayout").before($("#" + TableID));
        $("#" + TableID + "_tableLayout").empty();
    }
    else {
        $("#" + TableID).after("<div id='" + TableID + "_tableLayout' style='overflow:hidden;height:" + height + "px; width:" + width + "px;'></div>");
    }
    $('<div id="' + TableID + '_tableFix"></div>'
        + '<div id="' + TableID + '_tableHead"></div>'
        + '<div id="' + TableID + '_tableColumn"></div>'
        + '<div id="' + TableID + '_tableData"></div>').appendTo("#" + TableID + "_tableLayout");
    var oldtable = $("#" + TableID);
    var tableFixClone = oldtable.clone(true);
    tableFixClone.attr("id", TableID + "_tableFixClone");
    $("#" + TableID + "_tableFix").append(tableFixClone);
    var tableHeadClone = oldtable.clone(true);
    tableHeadClone.attr("id", TableID + "_tableHeadClone");
    $("#" + TableID + "_tableHead").append(tableHeadClone);
    var tableColumnClone = oldtable.clone(true);
    tableColumnClone.attr("id", TableID + "_tableColumnClone");
    $("#" + TableID + "_tableColumn").append(tableColumnClone);
    $("#" + TableID + "_tableData").append(oldtable);
    $("#" + TableID + "_tableLayout table").each(function () {
        $(this).css("margin", "0");
    });
    var HeadHeight = $("#" + TableID + "_tableHead thead").height();
    HeadHeight += 0;
    $("#" + TableID + "_tableHead").css("height", HeadHeight);
    $("#" + TableID + "_tableFix").css("height", HeadHeight);
    var ColumnsWidth = 0;
    var ColumnsNumber = 0;
    $("#" + TableID + "_tableColumn tr:last td:lt(" + FixColumnNumber + ")").each(function () {
        ColumnsWidth += $(this).outerWidth(true);
        ColumnsNumber++;
    });
    //ColumnsNumber+=2
    //    if ($.browser.msie) {
    //        switch ($.browser.version) {
    //            case "7.0":
    //                if (ColumnsNumber >= 3) ColumnsWidth--;
    //                break;
    //            case "8.0":
    //                if (ColumnsNumber >= 2) ColumnsWidth--;
    //                break;
    //        }
    //    }
    $("#" + TableID + "_tableColumn").css("width", width - 20);
    $("#" + TableID + "_tableFix").css("width", width - 20);
    $("#" + TableID + "_tableData").scroll(function () {
        $("#" + TableID + "_tableHead").scrollLeft($("#" + TableID + "_tableData").scrollLeft());
        $("#" + TableID + "_tableColumn").scrollTop($("#" + TableID + "_tableData").scrollTop());
    });
    $("#" + TableID + "_tableFix").css({ "overflow": "hidden", "position": "relative", "z-index": "50", "background-color": "Silver" });
    $("#" + TableID + "_tableHead").css({ "overflow": "hidden", "width": width - 17, "position": "relative", "z-index": "45", "background-color": "Silver" });
    $("#" + TableID + "_tableColumn").css({ "overflow": "hidden", "height": height - 17, "position": "relative", "z-index": "40", "background-color": "Silver" });
    $("#" + TableID + "_tableData").css({ "overflow": "scroll", "width": width, "height": height, "position": "relative", "z-index": "35" });
    if ($("#" + TableID + "_tableHead").width() > $("#" + TableID + "_tableFix table").width()) {
        $("#" + TableID + "_tableHead").css("width", $("#" + TableID + "_tableFix table").width());
        $("#" + TableID + "_tableData").css("width", $("#" + TableID + "_tableFix table").width() + 17);
    }
    if ($("#" + TableID + "_tableColumn").height() > $("#" + TableID + "_tableColumn table").height()) {
        $("#" + TableID + "_tableColumn").css("height", $("#" + TableID + "_tableColumn table").height());
        $("#" + TableID + "_tableData").css("height", $("#" + TableID + "_tableColumn table").height() + 17);
    }
    $("#" + TableID + "_tableFix").offset($("#" + TableID + "_tableLayout").offset());
    $("#" + TableID + "_tableHead").offset($("#" + TableID + "_tableLayout").offset());
    $("#" + TableID + "_tableColumn").offset($("#" + TableID + "_tableLayout").offset());
    $("#" + TableID + "_tableData").offset($("#" + TableID + "_tableLayout").offset());
}


function setHeight() {
    var hl = $(".body_left").outerHeight();
    var hr = $(".body_right").outerHeight();
    var hm = Math.max(hl, hr);
    $(".body_left").css("height", hm);
    $(".body_right").css("height", hm);
}
function Sorts(a, b) {
    return a.Sort - b.Sort;
}
function getSortFun(order, sortBy) {
    var ordAlpah = (order == 'asc') ? '>' : '<';
    var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
    return sortFun;
}
/*
@function     JsonSort 对json排序
@param        json     用来排序的json
@param        key      排序的键值
*/
function JsonSort(json, key) {
    for (var j = 1, jl = json.length; j < jl; j++) {
        var temp = json[j],
            val = temp[key],
            i = j - 1;
        while (i >= 0 && json[i][key] > val) {
            json[i + 1] = json[i];
            i = i - 1;
        }
        json[i + 1] = temp;
    }
    return json;
}

var sortBy = function (filed, rev, primer) {
    rev = (rev) ? -1 : 1;
    return function (a, b) {
        a = a[filed];
        b = b[filed];
        if (typeof (primer) != 'undefined') {
            a = primer(a);
            b = primer(b);
        }
        if (a < b) { return rev * -1; }
        if (a > b) { return rev * 1; }
        return 1;
    }
};

function AutoHeight() {

    //调用写好的插件，基中“.container > div”是你需要实现的等高列
    var temdiv = $(".div_top_border"); //.find("div[class$='div_top_border']")
    var temdiv2 = $(".divban_top_border"); //.find("div[class$='div_top_border']");

    //       setEqualHeight($("#div_top > div"));
    //        setEqualHeight($("#div_bottom > div"));
    setEqualHeight(temdiv);
    setBanEqualHeight(temdiv2);

}

function setEqualHeight(columns) {
    try {
        var tallestColumn = 0;
        columns.each(function () {
            currentHeight = $(this).height();
            if (currentHeight > tallestColumn) {
                tallestColumn = currentHeight;
            }
        });
        columns.height(tallestColumn);
    } catch (e) { }
}
function setBanEqualHeight(columns) {
    try {
        var tallestColumn = 0;
        columns.each(function () {
            currentHeight = $(this).height();
            if (currentHeight > tallestColumn) {
                tallestColumn = currentHeight;
            }
        });
        columns.height(tallestColumn);
    } catch (e) { }
}

function CloseYear() {
    $("#calendar").velocity({
        rotateZ: "0deg"
    }, {
            duration: 500
        })
    $("#year_select").velocity({
        opacity: 0,
        scaleX: 0,
        scaleY: 0
    }, {
            duration: 500
        })
}
function OpenYear() {
    $("#calendar").velocity({
        rotateZ: "180deg"
    }, {
            duration: 500
        })
    $("#year_select").velocity({
        opacity: 1,
        scaleX: 1.0,
        scaleY: 1.0
    }, {
            duration: 500
        })
}

function sortBy_Chart(Max_SW) {
    //    var max = parseFloat(Max_SW[0].toString());
    //    var min = parseFloat(Max_SW[0].toString());
    var _sw = Max_SW;
    if (_sw[0] == null) {
        _sw[0] = 0;
    }
    var max = parseFloat(_sw[0].toString());
    var min = parseFloat(_sw[0].toString());
    for (var i = 0; i < _sw.length; i++) {
        if (_sw[i] == null) {
            _sw[i] = min;
        }
        if (parseFloat(_sw[i]) > max) {
            max = _sw[i];
        }

        if (_sw[i] < min) {
            min = _sw[i];
        }
    }
    //max = max + parseFloat("0.2");
    return min + "@" + max;
}
var HeightTop = 0;
function GetFloat() {
    var navH = $("#Dvtable thead tr").offset().top;
    //滚动条事件
    $(window).scroll(function () {
        var tablewidth = $("#Dvtable").width();
        //获取滚动条的滑动距离
        var scroH = $(this).scrollTop();
        var tableRows = $("#Dvtable thead tr th").length;
        //滚动条的滑动距离大于等于定位元素距离浏览器顶部的距离，就固定，反之就不固定
        if (scroH >= navH) {
            $("#Dvtable thead").css({ "position": "fixed", "top": HeightTop, "width": tablewidth });
            $("#Dvtable tr th").css({ "width": parseFloat(tablewidth) / tableRows });
            $("#Dvtable tbody tr td").css({ "width": parseFloat(tablewidth) / tableRows });
        } else if (scroH < navH) {
            $("#Dvtable thead").css({ "position": "static" });
        }
    })
}
function downloadFile(fileName, content) {
    var aLink = document.createElement('a');
    var blob = new Blob([content]);
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.dispatchEvent(evt);
}

function GetChart(ObjID) {
    var navH = $("#" + ObjID).offset().top;
    HeightTop = $("#" + ObjID).height()
    //滚动条事件
    $(window).scroll(function () {
        var tablewidth = $("#" + ObjID).width();
        //获取滚动条的滑动距离
        var scroH = $(this).scrollTop();
        var tableRows = $("#" + ObjID).length;
        //滚动条的滑动距离大于等于定位元素距离浏览器顶部的距离，就固定，反之就不固定
        if (scroH >= navH) {
            $("#" + ObjID).css({ "position": "fixed", "top": 0, "width": tablewidth });
            $("#" + ObjID).css({ "width": parseFloat(tablewidth) / tableRows });
            $("#" + ObjID).css({ "width": parseFloat(tablewidth) / tableRows });
        } else if (scroH < navH) {
            $("#" + ObjID).css({ "position": "static" });
        }
    })
}




function Loading(obj, obj2, flag) {
    var strMsg = "";
    strMsg = '<img style="margin-left:25px;float:left; " src="/Common/imgs/wait1.gif" />';
    strMsg += '<p style="width:300px;height:50px; line-height:50px;float:left;padding:7px 20px; font-size:16px;font-family:Microsoft yahei;color:#799b76;">数据正在加载中，请稍后。。。</p>';
    if (flag != "") {
        if (obj != "") {
            GetObj(obj).innerHTML = "";
        }
        GetObj(obj2).innerHTML = strMsg;
    } else {
        GetObj(obj).innerHTML = strMsg;
        if (obj2 != "") {
            GetObj(obj2).innerHTML = "";
        }
    }
}

function convertToDate(jsonDate) {
    if (jsonDate.substr(0, 5) == "/Date") {
        var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
        return date;
    } else {
        jsonDate = jsonDate.replaceAll("-", "/");
    }
    return jsonDate;
}

String.prototype.replaceAll = function (s1, s2) {
    var re = new RegExp(s1, "g"); //定义正则表达式
    //第一个参数是要替换掉的内容，第二个参数"g"表示替换全部（global）。
    var Newstr = this.replace(re, s2); //第一个参数是正则表达式。
    //本例会将全部匹配项替换为第二个参数。

    return Newstr;//this.replace(new RegExp(s1, "gm"), s2);
}
function formatDate(objDate) { 
    return new Date(objDate.replaceAll("-", "/"));
}
Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}
//function GetQueryString(name) {
//    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
//    var r = window.location.search.substr(1).match(reg);
//    if (r != null) return decodeURIComponent(r[2]); return null;
//}
function GetQueryString(str) {
    var LocString = String(window.document.location.href);
    var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString), tmp; 
    if (tmp = rs) 
        return decodeURI(tmp[2]);
    return null;
}
function SetJson(result, objID, objPARENT) {
    var jsonstr = JSON.stringify(result);
    var jsonarray = eval('(' + jsonstr + ')');
    for (var item in jsonarray) {
        //console.log(jsonarray[item][objID] + "@@@@@@@@@@@@@@@@@@@@@@@@@" + jsonarray[item][objPARENT]);//得到键 
        if ((jsonarray[item][objID] == jsonarray[item][objPARENT]) && jsonarray[item][objPARENT] != null) {

            delete jsonarray[item][objPARENT];
        }
    }
    return jsonarray;
}
//////
///SetValueJson(data.data, "STATUS", "发送中")
/// fillData(0, grid.getPageSize(), eval(dataResult), grid);
/////
function SetValueJson(result, objID, objPARENT) {
    var jsonstr = JSON.stringify(result);
    var jsonarray = eval('(' + jsonstr + ')');
    //for (var item in jsonarray) {
    //    //console.log(jsonarray[item][objID] + "@@@@@@@@@@@@@@@@@@@@@@@@@" + jsonarray[item][objPARENT]);//得到键 
    //    if ((jsonarray[item][objID] == objPARENT) && jsonarray[item][objID] != null) {
    //        // console.log("@@@@@@@@@" + JSON.stringify(jsonarray[item]))
    //        delete jsonarray[item];
    //        //break;
    //    }
    //} 
    for (var i = 0; i < jsonarray.length; i++) { 
        if ((jsonarray[i][objID] == objPARENT) && jsonarray[i][objID] != null) { 
            jsonarray.splice(i, 1);
        }
    }
    //jsonarray = { "data": jsonarray, "total": jsonarray.length };
    return jsonarray;
}
function SetValueDataJson(result, objID, objPARENT) {
    var jsonstr = JSON.stringify(result);
    var jsonarray = eval('(' + jsonstr + ')');
    //for (var item in jsonarray) {
    //    //console.log(jsonarray[item][objID] + "@@@@@@@@@@@@@@@@@@@@@@@@@" + jsonarray[item][objPARENT]);//得到键 
    //    if ((jsonarray[item][objID] == objPARENT) && jsonarray[item][objID] != null) {
    //        // console.log("@@@@@@@@@" + JSON.stringify(jsonarray[item]))
    //        delete jsonarray[item];
    //        //break;
    //    }
    //} 
    for (var i = 0; i < jsonarray.length; i++) {
        if ((jsonarray[i][objID] == objPARENT) && jsonarray[i][objID] != null) {
            jsonarray.splice(i, 1);
        }
    }
    jsonarray = { "data": jsonarray, "total": jsonarray.length };
    return jsonarray;
}
// 删除多个指定内容 index 为每个元素的值
function JsonDelItems(JSONArray, index) {
    if (index instanceof Array) {
        for (var i = 0; i < index.length; i++) {
            for (var key in JSONArray) {
                if (JSONArray[key] == index) {
                    delete JSONArray[key];
                    //break;
                    continue;
                }
            }
        }
    }
}
//json的处理
function getArrayMian(oJson, str) {
    var aSearch = [];
    oJson.forEach(function (ele) {//循环外层数组
        if (str == ele.QX_PARENT) {
            aSearch.push(ele);
        }
    });
    return aSearch;
}

function GetMenu(data, pid) {
    //alert(data.length);
    var result = [], temp;

    for (var i = 0; i < data.length; i++) {
        if (data[i].QX_PARENT == pid) {
            //console.log(JSON.stringify(data));
            var temIcon = (data[i].QX_ICON.trim() == "暂定图片") ? "fa fa-desktop" : data[i].QX_ICON;
            var obj = { "id": data[i].QX_ID, "iconCls": " " + temIcon, "text": data[i].QX_NAME, "expanded": true, "url": data[i].QX_URL };
            temp = GetMenu(data, data[i].QX_ID);
            if (temp.length > 0) {
                obj.children = temp;
            }
            //console.log(JSON.stringify(obj));
            result.push(obj);
        }
    }
    return result;
}

//var ColoumnsName = {
//    "indexcolumn": "序号",
//    "STNM": "站名",
//    "Z": "水位(m)", };
//SetColumns(ColoumnsName, grid);
function SetColumns(objJosn,gridView ) {
    var columns = [];
    var jsonstr = JSON.stringify(objJosn);
    var jsonarray = eval('(' + jsonstr + ')'); 
    for (var item in jsonarray) { 
        if (jsonarray[item] == "序号") {
            columns.push({ type: "indexcolumn", header: "序号", headerAlign: 'center', align: 'center', width: 80 });
        } else if (jsonarray[item].lastIndexOf("时间") > -1)  {
            columns.push({ field: item, header: jsonarray[item], headerAlign: 'center', align: 'center', allowSort: true, autoescape: true, dateFormat: "yyyy/MM/dd H:mm", renderer: TMOnRenderer, width: 120 });
        } else {
            columns.push({ field: item, header: jsonarray[item], headerAlign: 'center', align: 'center', allowSort: true,  autoescape: true });
        } 
    } 
    gridView.set({ columns: columns }); 
}
function TMOnRenderer(e) {
    var record = e.record,
        value = e.value; 
    return value.replaceAll("T", " ");
}


function SetSummaryColumns(objJosn, gridView) {
    var columns = [];
    var jsonstr = JSON.stringify(objJosn);
    var jsonarray = eval('(' + jsonstr + ')');
    for (var item in jsonarray) {
        if (jsonarray[item] == "序号") {
            columns.push({ type: "indexcolumn", header: "序号", headerAlign: 'center', align: 'center', width: 50 });
        } else if (jsonarray[item].lastIndexOf("时间") > -1) {
            columns.push({ field: "" + item, header: jsonarray[item], headerAlign: 'center', align: 'center', autoescape: true });
        } else if (jsonarray[item].lastIndexOf("@") > -1) {
            columns.push({ field: "" + item, header: jsonarray[item].replace("@", ""), headerAlign: 'center', align: 'center', autoescape: true, summaryType: "max" });
        } else {
            columns.push({ field: "" + item, header: jsonarray[item], headerAlign: 'center', align: 'center', autoescape: true });
        }
    }
    gridView.set({ columns: columns });
}

function GetMenu2(strJson, objPID) {
    var mmm = 0;
    var menu_node1 = strJson.filter(function (e) {
        return e.QX_PARENT == "2018080200002";
    });
    var params = [];
    for (i = 0; i < menu_node1.length; i++) {
        var menu_node2 = strJson.filter(function (e) { return e.QX_PARENT == menu_node1[i].QX_ID; });
        //alert(menu_node2.Length.toString()); 
        var param = [];
        if (menu_node2.length > 0) {
            for (num = 0; num < menu_node2.length; num++) {
                if ("2018080200002" != menu_node2[num].QX_PARENT) {
                    var temIcon = (menu_node2[num].QX_ICON.trim() == "暂定图片") ? "fa fa-desktop" : menu_node2[num].QX_ICON;
                    console.log("temIcon" + temIcon);
                    param.push({ "id": menu_node2[num].QX_ID, "iconCls": " " + temIcon, "text": menu_node2[num].QX_NAME, "url": menu_node2[num].QX_URL });
                }
            }
        }
        if (param.length > 0) {
            var temIcon = (menu_node1[i].QX_ICON.trim() == "暂定图片") ? "fa fa-desktop" : menu_node1[i].QX_ICON;
            //console.log("param" + temIcon);
            params.push({ "id": menu_node1[i].QX_ID, "iconCls": " " + temIcon, "text": menu_node1[i].QX_NAME, "expanded": true, "children": param });
        } else {
            var temIcon = (menu_node1[i].QX_ICON.trim() == "暂定图片") ? "fa fa-desktop" : menu_node1[i].QX_ICON;
            //console.log("menu_node1" + temIcon);
            params.push({ "id": menu_node1[i].QX_ID, "iconCls": " " + temIcon, "text": menu_node1[i].QX_NAME, "expanded": true, "url": menu_node1[i].QX_URL });
        }
    }
    return params;
}

// 分页填充细节处理
function fillData(pageIndex, pageSize, dataResult, gridView) {

    var data = dataResult.data, totalCount = dataResult.total;

    var arr = [];
    var start = pageIndex * pageSize, end = start + pageSize;
    for (var i = start, l = end; i < l; i++) {
        var record = data[i];
        if (!record) continue;
        arr.push(record);
    } 

    gridView.setTotalCount(totalCount);
    gridView.setPageIndex(pageIndex);
    gridView.setPageSize(pageSize);

    gridView.setData(arr);
}
//服务端分页赋值
function PageServerFill(grid, data) { 
    grid.setTotalCount(data.total); 
    grid.setPageIndex(data.pageIndex - 1);
    grid.setPageSize(data.pageSize);
    grid.setData(data.data);
}
// 分页填充细节处理
function Fill(pageIndex, pageSize, dataResult, gridView) {

    var data = dataResul, totalCount = dataResult.total;

    var arr = [];
    var start = pageIndex * pageSize, end = start + pageSize;
    for (var i = start, l = end; i < l; i++) {
        var record = data[i];
        if (!record) continue;
        arr.push(record);
    }


    gridView.setTotalCount(totalCount);
    gridView.setPageIndex(pageIndex);
    gridView.setPageSize(pageSize);

    gridView.setData(arr);
}
//合并两个Json为一个
var extend = function (o, n) {
    for (var p in n) {
        if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p)))
            o[p] = n[p];
    }
};

/***********************************/
//修改
function editData(id, URL, name, _width, _height, _showMaxButton) {
    try {
        if (_width == undefined || _width == "" || _width == null) {
            _width = "800";
        }
        if (_height == undefined || _height == "" || _height == null) {
            _height = "600";
        }
        if (_showMaxButton == undefined || _showMaxButton == "" || _showMaxButton == null) {
            _showMaxButton = true;
        }
        var data;
        if (id == "" && id != null && id != undefined) {
            data = { action: "edit" };
        } else {
            data = {};
            data["action"] = "edit";
            var Agg1 = id.split(',');
            if (Agg1.length > 0) {
                for (II = 0; II < Agg1.length; II++) {
                    var Agg2 = Agg1[II].split('@');
                    data[Agg2[0]] = Agg2[1];
                }
            }
        }
        mini.open({
            url: URL,
            title: "" + name + "",
            iconCls: "icon-edit",
            width: _width,
            height: _height,
            showCloseButton: true,   //显示关闭按钮
            showMaxButton: _showMaxButton,     //显示最大化按钮
            showModal: true,         //显示遮罩
            onload: function () {
                var iframe = this.getIFrameEl();
                //var data = { action: "edit", ID: row.ID };
                iframe.contentWindow.SetData(data);
            },
            ondestroy: function (action) {
                search();
            }
        });
    } catch (e) { }
}
//添加
function addData(id, URL, name, _width, _height, _showMaxButton) {
    try {
        if (_width == undefined || _width == "" || _width == null) {
            _width = "800";
        }
        if (_height == undefined || _height == "" || _height == null) {
            _height = "600";
        }
        if (_showMaxButton == undefined || _showMaxButton == "" || _showMaxButton == null) {
            _showMaxButton = true;
        }
        var data;
        if (id == "" && id != null && id != undefined) {
            data = { action: "new" };
        } else {
            data = {};
            data["action"] = "new";
            var Agg1 = id.split(',');
            if (Agg1.length > 0) {
                for (II = 0; II < Agg1.length; II++) {
                    var Agg2 = Agg1[II].split('@');
                    data[Agg2[0]] = Agg2[1];
                }
            }
        }
        mini.open({
            url: URL,
            title: "" + name + "",
            iconCls: "icon-add",
            width: _width,
            height: _height,
            showCloseButton: true,   //显示关闭按钮
            showMaxButton: _showMaxButton,     //显示最大化按钮
            showModal: true,         //显示遮罩
            onload: function () {
                var iframe = this.getIFrameEl();
                //var data = { action: "edit", ID: row.ID };
                iframe.contentWindow.SetData(data);
            },
            ondestroy: function (action) {
                search();
            }
        });
    } catch (e) { }
}
//查看
function lookData(id, URL, name, _width, _height, _showMaxButton) {
    try {
        if (_width == undefined || _width == "" || _width == null) {
            _width = "800";
        }
        if (_height == undefined || _height == "" || _height == null) {
            _height = "600";
        }
        if (_showMaxButton == undefined || _showMaxButton == "" || _showMaxButton == null) {
            _showMaxButton = true;
        }
        var data;
        if (id == "" && id != null && id != undefined) {
            data = { action: "look" };
        } else {
            data = {};
            data["action"] = "look";
            var Agg1 = id.split(',');
            if (Agg1.length > 0) {
                for (II = 0; II < Agg1.length; II++) {
                    var Agg2 = Agg1[II].split('@');
                    data[Agg2[0]] = Agg2[1];
                }
            }
        }
        mini.open({
            url: URL,
            title: "" + name + "",
            iconCls: "icon-look",
            width: _width,
            height: _height,
            showCloseButton: true,   //显示关闭按钮
            showMaxButton: _showMaxButton,     //显示最大化按钮
            showModal: true,         //显示遮罩
            onload: function () {
                var iframe = this.getIFrameEl();
                //var data = { action: "edit", ID: row.ID };
                iframe.contentWindow.SetData(data);
            },
            ondestroy: function (action) {
                // search();
            }
        });
    } catch (e) {

    }
}

///////
/// var o = mini.decode(data.data[0]); 
///FromSetinnerHTML(o,"样式")
///////
function FromSetinnerHTML(objJosn, objCss) {
    try {
        var jsonstr = JSON.stringify(objJosn);
        var jsonarray = eval('(' + jsonstr + ')');
        var objClass = $("." + objCss);
        if (objClass.length > 0) {
            for (num = 0; num < objClass.length; num++) { 
                for (var item in jsonarray) {
                    try {
                        //console.log(item.toUpperCase()+"######################" + objClass[num].id)
                        if (item.toUpperCase() == objClass[num].id.toUpperCase()) {
                            //console.log(jsonarray[item]+"@@@@@@@@@@" + isNaN(jsonarray[item]))
                            if (isNaN(jsonarray[item]) && !isNaN(Date.parse(jsonarray[item]))) {
                                GetObj(objClass[num].id).innerHTML = new Date(jsonarray[item]).format("yyyy/MM/dd");
                            } else if (isNaN(jsonarray[item]) == false) {
                                GetObj(objClass[num].id).innerHTML = jsonarray[item];
                            } else {

                                GetObj(objClass[num].id).innerHTML = jsonarray[item].replaceAll("\n", "<br/>");
                            }

                        } else {
                            //console.log("######################" + objClass[num].id)
                            //GetObj(objClass[num].id).innerHTML = "&nbsp;";
                        }
                    } catch (ex) { }
                 
                }
            }
        }
    } catch (ex) {

    }
}
/*格式化修改赋值*/
function FromSetData(objJosn) {
    try {
        var jsonstr = JSON.stringify(objJosn);
        var jsonarray = JSON.parse(jsonstr);//eval('(' + jsonstr + ')');
		console.log(jsonarray)
        for (var item in jsonarray) {
            console.log(item);//得到键
            console.log(jsonarray[item]);//得到键对应的值 
            if (jsonarray[item] != "") {
                if ($("#" + item).size() > 0) {
                    try {
                        if (isNaN(jsonarray[item]) && !isNaN(Date.parse(jsonarray[item]))) {
                            mini.get(item).setValue(new Date(jsonarray[item]).format("yyyy/MM/dd HH:mm:ss"));
                        } else {
                            mini.get(item).setValue(SetNull(jsonarray[item]));
                            //GetObj(item).value = jsonarray[item];
                        }
                    } catch (ex) {
                        GetObj(item).value = SetNull(jsonarray[item]);
                        //mini.get(item).setValue(jsonarray[item]);
                    }
                }
            }
        }
    } catch (ex) {

    }
}
function SetNull(strJson) {
    if (strJson == undefined || strJson == null || strJson == "") {
        strJson = "";
    }
    return strJson;
}

/*延迟方法*/
function tipsSleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}
function GetTableID(_thecol, _thetable) {
    var strMsg = new Date().format("yyyyMMddHHmmss") + Math.floor(Math.random() * 100000 + 1);
    //tipsSleep(1000);
    //alert(new Date().format("yyyyMMddhhmmss") + Math.floor(Math.random() * 100000 + 1))
    //$.ajax({
    //    url: ServerIP + "json/reply/FunctionIDRetrieve",
    //    data: { "thecol": _thecol, "thetable": _thetable },
    //    type: "post",
    //    success: function (data) {
    //        strMsg = data.data[0].ID;
    //        alert(strMsg);
    //        //return data.data[0].ID;
    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) {
    //        strMsg = "";
    //        alert('请求失败！');
    //    }
    //}); 
    return strMsg;
}
/*多条记录时候获取编号ID*/
function GetID(objID) {
    var s_id;
    if (objID == null) {
        s_id = "";
    }
    else {
        s_id = objID;
    }
    if (s_id != "") {
        var i_id;
        if (s_id.Length != 0) {
            s_id = s_id.substring(8);
            i_id = parseInt(s_id) + 1;
            if (i_id < 10) {
                s_id = "0000" + i_id;
            }
            else if (i_id < 100) {
                s_id = "000" + i_id;
            }
            else if (i_id < 1000) {
                s_id = "00" + i_id;
            }
            else if (i_id < 10000) {
                s_id = "0" + i_id;
            }
        }
        else {
            s_id = "00001";
        }
    }
    else {
        s_id = "00001";
    }
    return s_id;
}
/**
*js中更改日期 
* y年， m月， d日， h小时， n分钟，s秒 
 * new Date().addDate('d', -1)
new Date('2018/10/20 08:00:00').addDate('d', -1)
*/
Date.prototype.addDate = function (part, value) {
    value *= 1;
    if (isNaN(value)) {
        value = 0;
    }
    switch (part) {
        case "y":
            return this.setFullYear(this.getFullYear() + value);
            break;
        case "m":
            return this.setMonth(this.getMonth() + value);
            break;
        case "d":
            return this.setDate(this.getDate() + value);
            break;
        case "h":
            return this.setHours(this.getHours() + value);
            break;
        case "n":
            return this.setMinutes(this.getMinutes() + value);
            break;
        case "s":
            return this.setSeconds(this.getSeconds() + value);
            break;
        default:

    }
}
/***计算两个时间差***/
function GetDateDiff(startTime, endTime, diffType) {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");
    //将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase();
    var sTime = new Date(startTime); //开始时间
    var eTime = new Date(endTime); //结束时间
    //作为除数的数字
    var timeType = 1;
    switch (diffType) {
        case "second":
            timeType = 1000;
            break;
        case "minute":
            timeType = 1000 * 60;
            break;
        case "hour":
            timeType = 1000 * 3600;
            break;
        case "day":
            timeType = 1000 * 3600 * 24;
            break;
        default:
            break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
}


function AddHourDate(date, hour) {
    if (hour == undefined || hour == '') {
        hour = 1;
    }
    //if (date.lastIndexOf('-') > -1) {
    //    date = date.replaceAll('-', '/');
    //}
    var mydate = formatDate(date); 
    var newdate = new Date(mydate.getTime() + hour * 60 * 60 * 1000);
    return newdate.format("yyyy/MM/dd HH:mm:ss"); 
}
//// 日期，在原有日期基础上，增加days天数，默认增加1天
function addDayDate(date, days) {
    if (days == undefined || days == '') {
        days = 0;
    }
    var dates;
    if (date.lastIndexOf('-') > -1) {
        dates = formatDate(date);
    } else {
        dates = new Date(date)
    }
    dates.setDate(dates.getDate() + days);
    var month = dates.getMonth() + 1;
    var day = dates.getDate();
    return dates.getFullYear() + '/' + getFormatDate(month) + '/' + getFormatDate(day);
}
function addDateMonth(date, days) {   // n个月后 
    if (days == undefined || days == '') {
        days = 1;
    }
    var date = new Date(date);
    date.setMonth(date.getMonth() + days);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return date.getFullYear() + '/' + getFormatDate(month) + '/' + getFormatDate(day);
}

// 日期月份/天的显示，如果是1位数，则在前面加上'0'
function getFormatDate(arg) {
    if (arg == undefined || arg == '') {
        return '';
    }

    var re = arg + '';
    if (re.length < 2) {
        re = '0' + re;
    }

    return re;
}




function ExportExcel(filename) {
    var columns = grid.columns;
    function getColumns(columns) {
        var cols = [];
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            var col = new Object();
            col[column.field] = column.header.replaceAll('<br/>','');
            if (column.columns) {
                col.columns = getColumns(column.columns);  
            }
            cols.push(col);

        }
        return cols;
    }
    var columns = getColumns(columns);

    DownLoad("/export.aspx", { type: "excel", columns: columns, data: grid.data, file: filename });
}


function ExportExcel(dataSource, grid, dataTitle) {
    mini.mask({
        el: document.body,
        cls: 'mini-mask-loading',
        html: '加载中...'
    });
    setTimeout(function () {
        var columns = grid.columns;
        function getColumns(columns) {
            var cols = [];
            for (var i = 0; i < columns.length; i++) {
                var column = columns[i];
                var col = new Object();
                if (column.type != "indexcolumn") {
                    if (column.field != null && column.field != undefined) {
                        col["value"] = column.field;
                        col["name"] = column.header;
                        if (column.columns) {
                            col.columns = getColumns(column.columns);
                        }
                        cols.push(col);
                    }
                }

            }
            return cols;
        }
        var columns = getColumns(columns);
        var strWhere = {};
        strWhere["maplist"] = dataSource;
        strWhere["columnname"] = columns;
        strWhere["title"] = dataTitle;
        strWhere["pathname"] = "temp";
        app.post("/excel/excelDownloadExport", strWhere, function (res) {
            if (res.data.length > 0) {
                window.open(HttpUrl +"/"+ res.data[0].value);
            }
            mini.unmask(document.body);
        });
    }, 100);
}

function DownLoad(url, fields) {
    //创建Form
    var submitfrm = document.createElement("form");
    submitfrm.action = url;
    submitfrm.method = "post";
    submitfrm.target = "_blank";
    document.body.appendChild(submitfrm);
    if (fields) {

        for (var p in fields) {
            var input = mini.append(submitfrm, "<input type='hidden' name='" + p + "'>");
            var v = fields[p];
            if (typeof v != "string") v = mini.encode(v);
            input.value = v;
        }
    }
    submitfrm.submit();
    setTimeout(function () {
        submitfrm.parentNode.removeChild(submitfrm);
    }, 1000);
}


/**
 * 打印当前页面
 */
function PrintPage() {
    window.print();
}

/**
 * 打印局部div
 * @param printpage 局部div的ID
 */
function PrintDiv(printpage) {
    var headhtml = "<html><head><title></title></head><body>";
    var foothtml = "</body>";
    // 获取div中的html内容
    var newhtml = document.all.item(printpage).innerHTML;
    // 获取div中的html内容，jquery写法如下
    // var newhtml= $("#" + printpage).html();

    // 获取原来的窗口界面body的html内容，并保存起来
    var oldhtml = document.body.innerHTML;

    // 给窗口界面重新赋值，赋自己拼接起来的html内容
    document.body.innerHTML = headhtml + newhtml + foothtml;
    // 调用window.print方法打印新窗口
    window.print();

    // 将原来窗口body的html值回填展示
    document.body.innerHTML = oldhtml;
    return false;
}

/**
 * 去除重复
 * @param {any} list
 */
function unique(list, objID) {
    var arr = []; 
    for (var i = 0; i < list.length; i++) {
        if (i == 0) arr.push(list[i]);
        b = false;
        if (arr.length > 0 && i > 0) {
            for (var j = 0; j < arr.length; j++) { 
                if (arr[j][objID] == list[i][objID]) {
                    b = true;
                    //break;
                }
            }
            if (!b) {
                arr.push(list[i]);
            }
        }
    }
    return arr;
}
function GetSubstring(str, Length) {
    if (str.length > Number(Length)) {
        str = str.substring(0, Length) + "...";
    }
    return str;
}

/***线图和柱状图***/
////ObjID | 显示div的ID名称
////TitleText | 左上角标题名称
////DataLegend | 显示图线集合['最高气温', '最低气温'];
////YaxisLabel|  Y坐标单位'{value} °C'
////XData | X坐标 ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
//// SerData 数据[{name: '最高气温', type: 'line',data: [11, 11, 15, 13, 12, 13, 10], markPoint: {  data: [ { type: 'max', name: '最大值' },{ type: 'min', name: '最小值' }] },
////markLine: {   data: [ { type: 'average', name: '平均值' }] } },{ name: '最低气温',type: 'line', data: [1, -2, 2, 5, 3, 2, 0], markPoint: {  data: [   { name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 } ] }, markLine: {   data: [
////{ type: 'average', name: '平均值' }, [{   symbol: 'none',  x: '90%',   yAxis: 'max'  }, {   symbol: 'circle',  label: {   normal: {  position: 'start',  formatter: '最大值' } }, type: 'max', name: '最高点'}]  ] }  }  ];
function LineChart(ObjID, TitleText, DataLegend, YaxisLabel, XData, SerData) {
    var dom = document.getElementById(ObjID);
    var myChart = echarts.init(dom);
    option = null;
    option = {
        title: {
            text: TitleText,
            x: 'center'
            //subtext: '纯属虚构', 
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: DataLegend
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                //dataView: { readOnly: false },
                magicType: { type: ['line', 'bar'] },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: XData
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: YaxisLabel
            }
        },
        series: SerData
    };
    ;
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}
// a:你要翻译的内容
// uq:tkk的值
function vq(a, uq) {
    if (null !== uq)
        var b = uq;
    else {
        b = sq('T');
        var c = sq('K');
        b = [b(), c()];
        b = (uq = window[b.join(c())] || "") || ""
    }
    var d = sq('t');
    c = sq('k');
    d = [d(), c()];
    c = "&" + d.join("") + "=";
    d = b.split(".");
    b = Number(d[0]) || 0;
    for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var l = a.charCodeAt(g);
        128 > l ? e[f++] = l : (2048 > l ? e[f++] = l >> 6 | 192 : (55296 == (l & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023),
            e[f++] = l >> 18 | 240,
            e[f++] = l >> 12 & 63 | 128) : e[f++] = l >> 12 | 224,
            e[f++] = l >> 6 & 63 | 128),
            e[f++] = l & 63 | 128)
    }
    a = b;
    for (f = 0; f < e.length; f++)
        a += e[f],
            a = tq(a, "+-a^+6");
    a = tq(a, "+-3^+b+-f");
    a ^= Number(d[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1000000;
    return c + (a.toString() + "." + (a ^ b))
};

/*--------------------------------------------------------------------------------
参数：a 为你要翻译的原文
其他外部函数：
--------------------------------------------------------------------------------*/
function sq(a) {
    return function () {
        return a
    }
}

function tq(a, b) {
    for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2);
        d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
        d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
        a = "+" == b.charAt(c) ? a + d & 4294967295 : a ^ d
    }
    return a
}

/*--------------------------------------------------------------------------------
运行：
--------------------------------------------------------------------------------*/
//window.TTK='422388.3876711001';
//var tk = vq("我是傻逼");
//console.log(tk);
///去除重复Json数据
///var arr=[{"id":"1"}, {"id":"2"}, {"id":"1"}, {"id":"3"}, {"id":"2"}, {"id":"5"}, {"id":"3"}, {"id":"4"}, {"id":"2"}, {"id":"4"}];
///arr.removeRepeatAttr();
Array.prototype.removeRepeatAttr = function () {
    var tmp = {}, a = this.slice();
    for (var i = j = 0; i < a.length; i++) {
        if (!tmp[a[i].id]) {
            tmp[a[i].id] = !0;
            j++;
        } else {
            this.splice(j, 1);
        }
    };
}
Array.prototype.unique1 = function () {
    var res = [this[0]];
    for (var i = 1; i < this.length; i++) {
        var repeat = false;
        for (var j = 0; j < res.length; j++) {
            if (this[i] == res[j]) {
                repeat = true;
                break;
            }
        }
        if (!repeat) {
            res.push(this[i]);
        }
    }
    return res;
}
/*
* 功能：对JSON对象字符串数组进行多字段（多列）排序
* 参数：
*   objArr: 目标数组
*   keyArr: 排序字段，以数组形式传递
*   type：排序方式，undefined以及asc都是按照升序排序，desc按照降序排序
* sortObjectArray(_RIVERJIEBIE.data, ['ORDERS'], 'asc');
* */
function sortObjectArray(objArr, keyArr, type) {
    if (type != undefined && type != 'asc' && type != 'desc') {
        return 'error';
    }
    var order = 1;
    if (type != undefined && type == 'desc') {
        order = -1;
    }
    var key = keyArr[0];
    objArr.sort(function (objA, objB) {
        if (objA[key] > objB[key]) {
            return order;
        } else if (objA[key] < objB[key]) {
            return 0 - order;
        } else {
            return 0;
        }
    })
    for (var i = 1; i < keyArr.length; i++) {
        var key = keyArr[i];
        objArr.sort(function (objA, objB) {
            for (var j = 0; j < i; j++) {
                if (objA[keyArr[j]] != objB[keyArr[j]]) {
                    return 0;
                }
            }
            if (objA[key] > objB[key]) {
                return order;
            } else if (objA[key] < objB[key]) {
                return 0 - order;
            } else {
                return 0;
            }
        })
    }
    return objArr;
}



//阿拉伯数字转换为简写汉字
function Arabia_To_SimplifiedChinese(Num) {
    for (i = Num.length - 1; i >= 0; i--) {
        Num = Num.replace(",", "")//替换Num中的“,”
        Num = Num.replace(" ", "")//替换Num中的空格
    }
    if (isNaN(Num)) { //验证输入的字符是否为数字
        //alert("请检查小写金额是否正确");
        return;
    }
    //字符处理完毕后开始转换，采用前后两部分分别转换
    part = String(Num).split(".");
    newchar = "";
    //小数点前进行转化
    for (i = part[0].length - 1; i >= 0; i--) {
        if (part[0].length > 10) {
            //alert("位数过大，无法计算");
            return "";
        }//若数量超过拾亿单位，提示
        tmpnewchar = ""
        perchar = part[0].charAt(i);
        switch (perchar) {
            case "0": tmpnewchar = "零" + tmpnewchar; break;
            case "1": tmpnewchar = "一" + tmpnewchar; break;
            case "2": tmpnewchar = "二" + tmpnewchar; break;
            case "3": tmpnewchar = "三" + tmpnewchar; break;
            case "4": tmpnewchar = "四" + tmpnewchar; break;
            case "5": tmpnewchar = "五" + tmpnewchar; break;
            case "6": tmpnewchar = "六" + tmpnewchar; break;
            case "7": tmpnewchar = "七" + tmpnewchar; break;
            case "8": tmpnewchar = "八" + tmpnewchar; break;
            case "9": tmpnewchar = "九" + tmpnewchar; break;
        }
        switch (part[0].length - i - 1) {
            case 0: tmpnewchar = tmpnewchar; break;
            case 1: if (perchar != 0) tmpnewchar = tmpnewchar + "十"; break;
            case 2: if (perchar != 0) tmpnewchar = tmpnewchar + "百"; break;
            case 3: if (perchar != 0) tmpnewchar = tmpnewchar + "千"; break;
            case 4: tmpnewchar = tmpnewchar + "万"; break;
            case 5: if (perchar != 0) tmpnewchar = tmpnewchar + "十"; break;
            case 6: if (perchar != 0) tmpnewchar = tmpnewchar + "百"; break;
            case 7: if (perchar != 0) tmpnewchar = tmpnewchar + "千"; break;
            case 8: tmpnewchar = tmpnewchar + "亿"; break;
            case 9: tmpnewchar = tmpnewchar + "十"; break;
        }
        newchar = tmpnewchar + newchar;
    }
    //替换所有无用汉字，直到没有此类无用的数字为止
    while (newchar.search("零零") != -1 || newchar.search("零亿") != -1 || newchar.search("亿万") != -1 || newchar.search("零万") != -1) {
        newchar = newchar.replace("零亿", "亿");
        newchar = newchar.replace("亿万", "亿");
        newchar = newchar.replace("零万", "万");
        newchar = newchar.replace("零零", "零");
    }
    //替换以“一十”开头的，为“十”
    if (newchar.indexOf("一十") == 0) {
        newchar = newchar.substr(1);
    }
    //替换以“零”结尾的，为“”
    if (newchar.lastIndexOf("零") == newchar.length - 1) {
        newchar = newchar.substr(0, newchar.length - 1);
    }
    return newchar;
}
function RetunDay(objDay) {
    switch (objDay) {
        case 1: objDay = "一"; break;
        case 2: objDay = "二"; break;
        case 3: objDay = "三"; break;
        case 4: objDay = "四"; break;
        case 5: objDay = "五"; break;
        case 6: objDay = "六"; break;
        case 0: objDay = "日"; break; //case 7: objDay = "七"; break;
    }
    return objDay;
}

/// <summary>
/// 得到文件的后缀名
/// </summary>
/// <param name="str">需要截取的字符串</param>
/// <returns>返回后缀名，比如（DOC）</returns>
function getSuffix(str) {
    var index = str.indexOf('.');
    if (index != -1) {
        return str.substring(index + 1).toUpperCase();
    }
    else {
        return "";
    }
}
function GetImage(name) {
    var houzhui = getSuffix(name);
    var img = '';
    if (houzhui == "DOC" || houzhui == "DOCX") {
        img = '<img src="/Common/miniui/themes/icons/word.gif" border=0 />';
    }
    else if (houzhui == "RAR") {
        img = '<img src="/Common/miniui/themes/icons/rar.gif" border=0 />'; 
    }
    else if (houzhui == "PDF") {
        img = '<img src="/Common/miniui/themes/icons/pdf.gif" border=0 />';  
    }
    else if (houzhui == "PPT") {
        img = '<img src="/Common/miniui/themes/icons/ppt.gif" border=0 />';   
    }
    else if (houzhui == "XLS") {
        img = '<img src="/Common/miniui/themes/icons/xls.gif" border=0 />';   
    }
    else {
        img = '<img src="/Common/miniui/themes/icons/word.gif" border=0 />';   
    }
    return img;
}


function ShowMsg(strMsg) {
    var x = "right";
    var y = "bottom";
    mini.showMessageBox({
        showModal: false,
        width: 150,
        title: "提示",
        iconCls: "mini-messagebox-warning",
        message: strMsg,
        timeout: 3000,
        x: x,
        y: y
    });
}
 
function showTips(strMsg) {
    var x = "center";
    var y = "top";
    var state = "success";
    mini.showTips({
        content: strMsg,
        state: state,
        x: x,
        y: y,
        timeout: 3000
    });
}


function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

function GUID() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
/////////
///8 character ID (base=2)
///uuid(8, 2)  //  "01001010"
/// 8 character ID (base=10)
///uuid(8, 10) // "47473046"
///uuid(8, 16) // "098F4D35"
//////////
function UUID(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}
function CreateRandomID() {
    return (Math.random() * 10000000).toString(8).substr(0, 4) + (new Date()).getTime() + Math.random().toString().substr(2, 5);
} 

//JSON数组group By排序
///  var temp = orderBy(dataResult, item => item.REPORT);
function orderBy(array, f) {
    let groups = {};
    array.forEach(function (o) {
        let group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
        return groups[group];
    });
}
/////////
///groupBy(dataResult, 'FENBU')
////////
function groupBy(array, name) {
    const groups = {}
    array.forEach(function (o) {
        const group = JSON.stringify(o[name])
        groups[group] = groups[group] || []
        groups[group].push(o)
    })
    return Object.keys(groups).map(function (group) {
        return groups[group]
    })
}
//正则匹配
//keyword是输入的值,list是存储数据的数组
function searchByRegExp(keyWord, list) {
    if (!(list instanceof Array)) {
        return;
    }
    var len = list.length;
    var arr = [];
    var reg = new RegExp(keyWord);
    for (var i = 0; i < len; i++) {
        //如果字符串中不包含目标字符会返回-1
        if (list[i].match(reg)) {
            arr.push(list[i]);
        }
    }
    return arr;
}

function CutStr(str, len) {
    var s = "";
    for (var i = 0; i < str.length; i = i + len) {
        s += str.substring(i, i + len) + "<br>";
    }
    return s;
}


//////
///数组求和
///SumJson(data.data,'drp')
//////
function SumJson(array, item) {
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i][item] != null && array[i][item] != "" && array[i][item] != undefined) {
            sum += parseFloat(array[i][item]);
        }
    }
    return sum;
}

/**
 * 获取当前月的第一天
 */
function getCurrentMonthFirst(date) {
    var date = new Date(date);
    date.setDate(1);
    return date;
}
/**
 * 获取当前月的最后一天
 */
function getCurrentMonthLast(date) {
    var date = new Date(date);
    var currentMonth = date.getMonth();
    var nextMonth = ++currentMonth;
    var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    var oneDay = 1000 * 60 * 60 * 24;
    return new Date(nextMonthFirstDay - oneDay);
}

/*ajax请求回调
 * url：后台接口
 * type：请求方法
 * data：传递给后台的参数
 * async：同步异步的参数（true：异步；false：同步）
 * callback：成功的回调方法
 * errorback：失败的回调方法
 * */
var token = localStorage.getItem("token"); //后台是否需要token
(function (app, $) {
    //发送请求
    app.send = function (url, type, data, async, callback, errorback) {
        var aj = $.ajax({
            url: ServerIP+url,
            type: type,
            dataType: 'json',
            data: type == 'get' ? data : JSON.stringify(data), //根据需求编辑传递参数的格式
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                "authorization": token,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST",
                "Access-Control-Allow-Headers": "content-type"
            },
            async: async,
            //cache: false,
            contentType: 'application/json;charset=utf-8',
            xhrFields: {
                withCredentials: true //跨域请求要想带上cookie，必须要在ajax请求里加上xhrFields: {withCredentials: true}。
            },
            error: function (err) {
                if (errorback != undefined) {
                    errorback(err);
                }
                console.error('调用模型接口错误信息：',err)
                //报错的时候提示
            },
            success: function (msg) {
                if (msg.code === "-401") {//登录失效了
                    localStorage.clear();
                    window.location.href = fullHostAddress;
                }
                else{
                    callback(msg);
                }
            }
        })
    }
    //用于查询
    app.get = function (url, data, callback, errorback) {
        app.send(url, 'get', data, true, callback, errorback);
    }
    //用于同步查询
    app.getAsync = function (url, data, callback, errorback) {
        app.send(url, 'get', data, false, callback, errorback);
    }
    //用于非查询请求
    app.post = function (url, data, callback, errorback) {
        app.send(url, 'post', data, true, callback, errorback);
    }
    //用于同步非查询
    app.postAsync = function (url, data, callback, errorback) {
        app.send(url, 'post', data, false, callback, errorback);
    }
})((window.app = {}), $)