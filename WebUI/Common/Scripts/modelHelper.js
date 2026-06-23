//返回令牌
function GetOrReturnToken(type) {
    if (type == "get") {
        GetJosns("WJ_GetToken", { username: GetCookie("username"), loginname: GetCookie("LOGINNAME")}, "WJ_GetToken");
    }
    //else if (type = "znget") {
    //    GetJosns("WJ_GetToken", {}, "WJ_GetTokenZN");
    //}
    else {
        //归还令牌
        GetJosns("WJ_ReturnToken", {}, "WJ_ReturnToken");
    }
}

function ClickFirst() {
    //模型初始化
    //window.parent.addTab("模型初始化", "/DD_MX/Initialization.html?current1=1", "", "模型初始化");
    window.location.href = "/DD_MX/Initialization.html?current1=1&stime=" + $.data(myData, "stime") + "&etime=" + $.data(myData, "etime");
}
function ClickSecond() {
    //边界条件
    if (GetCookie("two") != null && GetCookie("two") != "") {
        window.location.href = "/DD_MX/JiangYuSet.html?stime=" + $.data(myData, "stime") + "&etime=" + $.data(myData, "etime");
    } else {
        mini.alert("不可执行，请先进行模型初始化");
        mini.unmask(document.body);
    }
}
function ClickThird() {
    //模型计算
    if (GetCookie("three") != null && GetCookie("three") != "") {
        window.location.href = "/DD_MX/shuiwei.html?stime=" + $.data(myData, "stime") + "&etime=" + $.data(myData, "etime");
    } else {
        mini.alert("不可执行，请先进行边界条件");
        mini.unmask(document.body);
    }
}
function ClickFourth() {
    //边界条件
    if (GetCookie("four") != null && GetCookie("four") != "") {
        window.location.href = "/DD_MX/gongcheng.html?stime=" + $.data(myData, "stime") + "&etime=" + $.data(myData, "etime");
    } else {
        mini.alert("不可执行，请先进行模型初始化");
        mini.unmask(document.body);
    }
}
function ClickFifth() {
    //模型计算
    if (GetCookie("five") != null && GetCookie("five") != "") {
        window.location.href = "/DD_MX/JiSuan.html?stime=" + $.data(myData, "stime") + "&etime=" + $.data(myData, "etime");
    } else {
        mini.alert("不可执行，请先进行边界条件");
        mini.unmask(document.body);
    }
}
function Next_Click(url) {
    window.location.href = "/DD_MX/" + url;
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
    var selected = grid.getSelected();
    if (selected) {
        var s_where = { "ZhanData": e.value, "ZhanTime": new Date(selected.TM).format("yyyy-MM-dd HH:mm:ss"), "ZhanID": e.sender.getName() }
        GetJosns("FH_UpdataMethod", s_where, "UpdataMethod");
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
    var s_where = "";
    var tempID = GetCookie("DD_ID");
    if (tempID == null || tempID == "") {
        tempID = "0";
    }
    var DayHour="DAY";
    try {
        DayHour = mini.get("RbRain").getValue();
    } catch (e) {
    }
    var s_where = { "ZhanData": fieldText, "ZhanID": field, "DayHour": DayHour, "dd_id": tempID };
    GetJosns("FH_update_batch", s_where, "update_batch");
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

function StartModelCalculation(){
    var modeState=$('#modeState').html();
    // if(modeState!=""){
    //     if(modeState=="在线"){
            Calculation = false;
            checkData();
        // }else{
        //     mini.alert("模型"+modeState+",请联系模型开发人员！");
        // }
    //}
}

//智能一键操作begin
//步骤：获取令牌----->模型预处理----->设置依据时间----->更新边界条件----->启动模型计算
function znStartModelCalculation() {
    Calculation = true;
    checkData();
}

function startJisuan() {
    mini.mask({
        el: document.body,
        cls: 'mini-mask-loading',
        html: '开始模型计算'
    });
    var strWhere = { ddfs: GCDATATYPE, "yj_time": $.data(myData, "stime") };
    GetJosns("FH_startMadel", strWhere, "finish_method");
}

//计算完成
function getMadelFilish() {
    GetJosns("FH_redicretion_finishmethod", {}, "redicretion_finishmethod");
}
//智能一键操作end
