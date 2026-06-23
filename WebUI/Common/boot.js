var bootPATH = bootPath = __CreateJSPath("boot.js");

mini_debugger = true;                                           //


function GetCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) {
        return unescape(arr[2]);
    } else {
        return "";
    }
}



function GetQueryString(str) {
    var LocString = String(window.document.location.href);
    var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString), tmp;
    if (tmp = rs)
        return decodeURI(tmp[2]);
    return null;
}

function SetCookie(name, value, day) {
    var date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = name + '=' + value + ';expires=' + date;
};

// console.error("登录token信息:::::::::",localStorage.getItem("token"));
if(localStorage.getItem("token") != null){        
    SetCookie("LOGINNAME",localStorage.getItem("USERNAME"), 3);
    SetCookie("username",localStorage.getItem("loginname"), 3);
    SetCookie("GROUPID", localStorage.getItem("GROUPID"), 3);
}
else{
    try {
        parent.parent.window.location.href = window.location.origin;
    } catch (e) {
        window.location.href = window.location.origin;
    }
}



var skin = GetCookie("miniuiSkin") || 'bootstrap';             //skin cookie   cupertino
var mode = GetCookie("miniuiMode") || 'medium';                 //mode cookie     medium     

//miniui
document.write('<script src="' + bootPATH + 'jquery-3.5.1.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'miniui/miniui.js" type="text/javascript" ></sc' + 'ript>');
//document.write('<script src="' + bootPATH + 'Scripts/jQuery.XDomainRequest.js" type="text/javascript" ></sc' + 'ript>');
//document.write('<script src="' + bootPATH + 'Scripts/jquery.xdomainrequest.min.js" type="text/javascript" ></sc' + 'ript>');

document.write('<link href="' + bootPATH + 'miniui/res/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'miniui/themes/default/miniui.css" rel="stylesheet" type="text/css" />');

//common
document.write('<link href="' + bootPATH + 'res/css/common.css" rel="stylesheet" type="text/css" />');
document.write('<script src="' + bootPATH + 'res/js/common.js" type="text/javascript" ></sc' + 'ript>');

//skin
if (skin && skin != "default") document.write('<link href="' + bootPATH + 'miniui/themes/' + skin + '/skin.css" rel="stylesheet" type="text/css" />');

//mode
if (mode && mode != "default") document.write('<link href="' + bootPATH + 'miniui/themes/default/' + mode + '-mode.css" rel="stylesheet" type="text/css" />');

//icon
document.write('<link href="' + bootPATH + 'miniui/themes/icons.css" rel="stylesheet" type="text/css" />');
//刘彬 
document.write('<link href="' + bootPATH + 'CSS/PublicCss.css" rel="stylesheet" type="text/css" />'); 
document.write('<script src="' + bootPATH + 'JSMy.js?ver=1.0.3" type="text/javascript" ></sc' + 'ript>'); 
//document.write('<script src="' + bootPATH + 'Scripts/jquery.ba-resize.min.js" type="text/javascript" ></sc' + 'ript>'); 
////////////////////////////////////////////////////////////////////////////////////////


function __CreateJSPath(js) {
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