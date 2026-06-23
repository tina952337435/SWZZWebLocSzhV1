
var myData = [];
var modeParamMoreJson=GetQueryString("modeParamMoreJson");
if(modeParamMoreJson!=null&&modeParamMoreJson!=""){
    modeParamMoreJson="{"+modeParamMoreJson+"}";
    var modeParamMoreJsonObj=JSON.parse(modeParamMoreJson);
    if (modeParamMoreJsonObj != null && modeParamMoreJsonObj != undefined && modeParamMoreJsonObj != "") {
        // console.error('modeParamMoreJsonObj', modeParamMoreJsonObj);
        $.data(myData, "stime", modeParamMoreJsonObj.stime);
        $.data(myData, "etime", modeParamMoreJsonObj.etime);
        $.data(myData, "DD_ID", modeParamMoreJsonObj.DD_ID);
        $.data(myData, "DD_EVALUE", modeParamMoreJsonObj.DD_EVALUE);
        $.data(myData, "ModeJYDan", modeParamMoreJsonObj.ModeJYDan);
        $.data(myData, "huishuimodehdyroID", modeParamMoreJsonObj.huishuimodehdyroID);//水文序列
        $.data(myData, "docid", modeParamMoreJsonObj.docid);//模型文档id
        $.data(myData, "sbjID", modeParamMoreJsonObj.sbjID);//模型专题ID
        $.data(myData, "timeStepHydro", modeParamMoreJsonObj.timeStepHydro);//模型步长
        $.data(myData, "timeStep", modeParamMoreJsonObj.timeStep);//模型步数
        $.data(myData, "taskID", modeParamMoreJsonObj.taskID);//模型任务编号
    }
}


//更新边界初始数据
upDataZhandianData = function () {
    var stime = mini.get("TM").getFormValue() + " " + mini.get("startHour").getValue() + ":00:00";
    var etime = mini.get("ETM").getFormValue() + " " + mini.get("endHour").getValue() + ":00:00";
    stime = new Date(stime).format("yyyy-MM-dd HH:mm:ss");
    etime = new Date(etime).format("yyyy-MM-dd HH:mm:ss");
    $.data(myData, "stime", stime);
    $.data(myData, "etime", etime);
    var num = GetDateDiff(stime, etime, 'hour');
    $.data(myData, "HOUR", num);
    var tempID = $.data(myData, "DD_ID");
    if (tempID == null || tempID == "") {
        tempID = "0";
    }
    var s_where = {
        "startdate": $.data(myData, "stime"),
        "enddate": $.data(myData, "etime"),
        "solutionid": tempID,
        "jydatatype": JYDATATYPE,
        "gcdatatype": GCDATATYPE,
        "scwdatatype": null,
        "username": GetCookie("LOGINNAME")
    };
    //从相似台风弹开过来的页面
    if (GetQueryString("ApplicationModel") != null) {
        s_where.AppModelstime = $.data(myData, "AppModelstime");
        s_where.AppModeletime = $.data(myData, "AppModeletime");
        JYDATATYPE += "@AppModelXIANGSITide";
        s_where.jydatatype = JYDATATYPE;
    }
    app.post("/SWZZ_MODE_ES_ZHANDIANDATA/MODIFY_MODEZHANDData", s_where, function (res) {
        JosnSel(res, "UPDATA_MODEZHANDDataApi");
    });
}
function StartModelCalculation() {
    var modeState = $('#modeState').html();
    // if (modeState == "在线") {
    if (SOLUTIONID == null) {//代表不是重算
        var _dd_id = GetTableID();
        console.error("存储在Cookie的方案编号：", _dd_id);
        console.error("设置的方案编号：", _dd_id);
        $.data(myData, "DD_ID",_dd_id);
    }
    Calculation = false;
    checkData();
    // } else {
    //     mini.alert("模型" + modeState + ",请联系模型开发人员！");
    // }
}
//智能一键操作begin
//步骤：获取令牌----->模型预处理----->设置依据时间----->更新边界条件----->启动模型计算
function znStartModelCalculation() {
    // var modeState = $('#modeState').html();
    // if (modeState == "在线") {
    if (SOLUTIONID == null) {//代表不是重算
        var _dd_id = GetTableID();
        $.data(myData, "DD_ID",_dd_id);
    }
    Calculation = true;
    checkData();
    // }else{
    //     mini.alert("模型"+modeState+",请联系模型开发人员！");
    // }
}
function ClickFirst() {
    var url="Initialization.html?current1=1";
    Next_Click(url);
}
function ClickSecond() {
    //边界条件
    if (GetCookie("two") != null && GetCookie("two") != "") {
        var url="JiangYuSet.html";
        Next_Click(url);
    } else {
        mini.alert("不可执行，请先进行模型初始化");
        mini.unmask(document.body);
    }
}
function ClickThird() {
    //模型计算
    if (GetCookie("three") != null && GetCookie("three") != "") {
        var url="ShuiWei.html";
        Next_Click(url);
    } else {
        mini.alert("不可执行，请先进行边界条件");
        mini.unmask(document.body);
    }
}
function ClickFourth() {
    //边界条件
    if (GetCookie("four") != null && GetCookie("four") != "") {
        var url="GongCheng.html";
        Next_Click(url);
    } else {
        mini.alert("不可执行，请先进行模型初始化");
        mini.unmask(document.body);
    }
}
function ClickFifth() {
    //模型计算
    if (GetCookie("five") != null && GetCookie("five") != "") {
        var url="JiSuan.html";
        Next_Click(url);
    } else {
        mini.alert("不可执行，请先进行边界条件");
        mini.unmask(document.body);
    }
}
function Next_Click(url) {
    //处理参数
    var modeParamMore = {
        stime: $.data(myData, "stime"),
        etime: $.data(myData, "etime"),
        DD_ID: $.data(myData, "DD_ID"),
        DD_EVALUE: $.data(myData, "DD_EVALUE"),
        ModeJYDan:$.data(myData, "ModeJYDan"),
        huishuimodehdyroID:$.data(myData, "huishuimodehdyroID"),//水文序列
        docid: $.data(myData, "docid"),//模型文档id
        sbjID: $.data(myData, "sbjID"),//模型专题ID
        timeStepHydro: $.data(myData, "timeStepHydro"),//模型步长
        timeStep: $.data(myData, "timeStep"),//模型步数
        taskID:$.data(myData, "taskID"),//模型任务
    }
    var modeParamMoreJson=JSON.stringify(modeParamMore).replace("{","").replace("}","");
    // alert(modeParamMoreJson);
    if(url.indexOf('?')>-1){
        url+="&"
    }else{
        url+="?"
    }
    url+=url+"modeParamMoreJson="+modeParamMoreJson;
    window.location.href = url;
}


//令牌丢失之后，清除步骤Cookie
function DelCookieStep() {
    DelCookie("one");
    DelCookie("two");
    DelCookie("three");
    DelCookie("four");
    DelCookie("five");
}


//表格中单修改某个文本框
function onValueChanged(e) {
    var localDD_ID = $.data(myData, "DD_ID");
    if (localDD_ID == null || localDD_ID == "") {
        localDD_ID = "0";
    }
    var selected = grid.getSelected();
    if (selected) {
        var s_where = {
            "zhanData": e.value,
            "zhanTime": new Date(selected.TM).format("yyyy-MM-dd HH:mm:ss"),
            "zhanID": e.sender.getName(),
            "solutionid": localDD_ID
        }
        app.post("/SWZZ_MODE_ES_ZHANDIANDATA/FH_ModifyMethod", s_where, function (res) {
            JosnSel(res, "UpdataMethod");
        });
    }
}


//表格中批量修改多个文本框begin
//用个全局变量存放当前点击列
var currentColumnIndex = 0;
function onBeforeOpen1(e) {
    //根据文本找到column的序号，有点问题的（比如header有相同部分什么）
    function findColumnIndex(field) {
        var columns = grid.getColumns();
        for (var i = 0, l = columns.length; i < l; i++) {
            var column = columns[i];
            if (!column.field) continue;
            if (column.header.indexOf(field) != -1) return i;
        }

    }
    //右键点击的表头元素的文本的前2个字符串（方便判断）
    var text = e.htmlEvent.target.innerHTML.substr(0, 2);
    //没有field的直接给0，比如序号列展开列之类的
    currentColumnIndex = findColumnIndex(text) || 0;
}
function onItemClick(e) {
    if (currentColumnIndex == 0) return
    var field = grid.getColumn(currentColumnIndex).field;
    if (e.item.name == "jiangyu") {
        getJY(field);
    }
}
function getJY(field) {
    var row = grid.getSelected();
    if (row) {
        var celltext = row[grid.getColumn(currentColumnIndex).field];
        methodJY(field, celltext);
    } else {
        mini.alert("请选中填充列！");
        mini.unmask(document.body);
    }
}
function methodJY(field, fieldText) {
    var localDD_ID = $.data(myData, "DD_ID");
    if (localDD_ID == null || localDD_ID == "") {
        localDD_ID = "0";
    }
    var DayHour = "DAY";
    try {
        DayHour = mini.get("RbRain").getValue();
    } catch (e) {
    }
    var s_where = {
        "zhanData": fieldText,
        "zhanID": field,
        "dayhour": DayHour,
        "solutionid": localDD_ID,
        "stime": $.data(myData, "stime")
    };
    app.post("SWZZ_MODE_ES_ZHANDIANDATA/FH_modify_batch", s_where, function (res) {
        JosnSel(res, "update_batch");
    });
}
function onFilterChanged(e) {
    var field = e.sender.getId();
    var value = e.value;
    if (isNaN(value)) {
        mini.alert("请输入数字！");
        return;
    }
    if (value == "") {
        return;
    }
    methodJY(field, value);
}
//表格中批量修改多个文本框end


function startJisuan() {
    timeout = false;//可以重新计算
    mini.mask({
        el: document.body,
        cls: 'mini-mask-loading',
        html: '开始模型计算'
    });
    var localDD_ID = $.data(myData, "DD_ID");
    if (localDD_ID == null || localDD_ID == "") {
        localDD_ID = "0";
    }
    var strWhere = { "strExp": localDD_ID };
    app.post("SWZZ_MODE_ES_ZHANDIANDATA/findResult", strWhere, function (res) {
        JosnSel(res, "DATASel");
    });
}
//智能一键操作end


//************加载表头begin
function ModeZhanGridColum(ptype) {
    var strWhere = {
        "pattem": ptype
    }
    app.post("SWZZ_MODE_ES_ZHANDIAN/findResult", strWhere, function (res) {
        var data = {};
        var GridColumStr = "";
        var listNew = res.data;
        GridColumStr += "{\"columns\":[{ \"field\":  \"TM\", \"header\": \"降雨时间\", \"headerAlign\": \"center\", \"align\": \"center\", \"autoescape\": \"true\",\"width\":\"150\",\"dateFormat\": \"yyyy-MM-dd HH:mm:ss\" }";

        for (var num = 0; num < listNew.length; num++) {
            GridColumStr += ",{ \"header\": \"" + listNew[num].zhanname + "\", \"field\": \"" + listNew[num].zhanid + "\", \"headerAlign\": \"center\", \"align\": \"center\",\"decimalPlaces\":\"1\", \"dataType\": \"float\", \"summaryType\": \"sum\", \"editor\": { \"type\":\"textbox\",\"name\":\"" + listNew[num].zhanid + "\",\"onValueChanged\":\"onValueChanged\"} "
                + ",\"filter\":{\"id\":\"" + listNew[num].zhanid + "\",\"onvaluechanged\":\"onFilterChanged\",\"type\":\"textbox\",\"width\":\"80%\",\"emptyText\":\"批量输入\"}"
                + "}";
        }
        GridColumStr += "]}";
        data.data = GridColumStr;
        JosnSel(data, "GridColum");
    });
}

function ModeZhanGridColumJY(ptype) {
    var strWhere = {
        "pattem": 134
    }
    app.post("SWZZ_MODE_ES_SLTONGJI/findResult", strWhere, function (res) {
        var data = {};
        var GridColumStr = "";
        var listNew = res.data;
        GridColumStr += "{\"columns\":[{ \"field\":  \"TM\", \"header\": \"降雨时间\", \"headerAlign\": \"center\", \"align\": \"center\", \"autoescape\": \"true\",\"width\":\"150\",\"dateFormat\": \"yyyy-MM-dd HH:mm:ss\" }";

        for (var num = 0; num < listNew.length; num++) {
            GridColumStr += ",{ \"header\": \"" + listNew[num].title + "\", \"field\": \"" + listNew[num].id + "\", \"headerAlign\": \"center\", \"align\": \"center\",\"decimalPlaces\":\"1\", \"dataType\": \"float\", \"summaryType\": \"sum\", \"editor\": { \"type\":\"textbox\",\"name\":\"" + listNew[num].id + "\",\"onValueChanged\":\"onValueChanged\"} "
                + ",\"filter\":{\"id\":\"" + listNew[num].id + "\",\"onvaluechanged\":\"onFilterChanged\",\"type\":\"textbox\",\"width\":\"80%\",\"emptyText\":\"批量输入\"}"
                + "}";
        }
        GridColumStr += "]}";
        data.data = GridColumStr;
        JosnSel(data, "GridColum");
    });
}

function ModeZhanGridColumSW(ptype) {
    var strWhere = {
        "pattem": ptype
    }
    app.post("SWZZ_MODE_ES_ZHANDIAN/findResult", strWhere, function (res) {
        var data = {};
        var GridColumStr = "";
        var listNew = res.data;
        GridColumStr += "{\"columns\":[{ \"field\":  \"TM\", \"header\": \"时间\", \"headerAlign\": \"center\", \"align\": \"center\", \"autoescape\": \"true\",\"width\":\"150\",\"dateFormat\": \"yyyy-MM-dd HH:mm:ss\" }";

        for (var num = 0; num < listNew.length; num++) {
            var zhanid = listNew[num]["zhanid"];
            var zhanname = listNew[num]["zhanname"];
            var zhandians = "1728053248,1728053250,1728053251,1728053252";
            if (zhandians.indexOf(zhanid) > -1) {
                GridColumStr += ",{ \"header\": \"" + zhanname + "\", \"field\": \"" + zhanid + "\", \"headerAlign\": \"center\", \"align\": \"center\",\"decimalPlaces\":\"2\", \"dataType\": \"float\", \"summaryType\": \"max\", \"editor\": { \"type\":\"textbox\",\"name\": \"" + zhanid + "\",\"onValueChanged\":\"onValueChanged\"},\"filter\":{\"id\":\"" + zhanid + "\",\"onvaluechanged\":\"onFilterChanged\",\"type\":\"textbox\",\"width\":\"100%\",\"emptyText\":\"输入水位\"} }";
            }
            else {
                GridColumStr += ",{ \"header\": \"" + zhanname + "\", \"field\": \"" + zhanid + "\", \"headerAlign\": \"center\", \"align\": \"center\",\"decimalPlaces\":\"2\", \"dataType\": \"float\", \"summaryType\": \"max\", \"editor\": { \"type\":\"textbox\",\"name\": \"" + zhanid + "\",\"onValueChanged\":\"onValueChanged\"},\"filter\":{\"id\":\"" + zhanid + "\",\"onvaluechanged\":\"onFilterChanged\",\"type\":\"textbox\",\"width\":\"100%\",\"emptyText\":\"输入增水值\"} }";
            }
        }
        GridColumStr += "]}";
        data.data = GridColumStr;
        JosnSel(data, "GridColum");
    });
}
function ModeZhanGridColumGC(ptype) {
    var strWhere = {
        "pattem": ptype
    }
    app.post("SWZZ_MODE_ES_ZHANDIAN/findResult", strWhere, function (res) {
        var data = {};
        var GridColumStr = "";
        var listNew = res.data;
        GridColumStr += "{\"columns\":[{ \"field\":  \"TM\", \"header\": \"时间\", \"headerAlign\": \"center\", \"align\": \"center\", \"autoescape\": \"true\",\"width\":\"150\",\"dateFormat\": \"yyyy-MM-dd HH:mm:ss\" }";

        for (var num = 0; num < listNew.length; num++) {
            var zhanid = listNew[num]["zhanid"];
            var zhanname = listNew[num]["zhanname"];
            var tempName = zhanname.split('_');
            // console.error(zhanname,tempName);
            if (tempName.length > 0) {
                zhanname = tempName[tempName.length - 1];
            }
            GridColumStr += ",{ \"header\": \"" + zhanname + "\", \"field\": \"" + zhanid + "\", \"headerAlign\": \"center\", \"align\": \"center\",\"decimalPlaces\":\"2\", \"dataType\": \"float\", \"summaryType\": \"max\", \"editor\": { \"type\":\"textbox\",\"name\": \"" + zhanid + "\",\"onValueChanged\":\"onValueChanged\"},\"filter\":{\"id\":\"" + zhanid + "\",\"onvaluechanged\":\"onFilterChanged\",\"type\":\"textbox\",\"width\":\"100%\",\"emptyText\":\"批量输入恒定流量\"} }";
        }
        GridColumStr += "]}";
        data.data = GridColumStr;
        JosnSel(data, "GridColum");
    });
}
//************加载表头end

