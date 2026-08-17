var modeDocID = "E12850F21A1848ED9D7DFF5EB765ADAF";
var modeSbjID = 2081203285;
//获取模型后台状态：在线，离线
gethuishuiModeState = function () {
    var strWhere = {};
    GetJosnsModeNew(modeDocID, strWhere, true, function (res) {
        var modeState = "离线";
        var modeCls = " color:red;";
        if (res.masterOnline != undefined) {
            if (res.masterOnline == true) {
                var slave = res.slave;
                if (slave.length > 0) {
                    modeState = "在线";
                    modeCls = " color:green;";
                }
            }
        }
        else {
            if (res.length > 0) {
                modeState = "在线";
                modeCls = " color:green;";
            }
        }

        $("#modeState").attr('style', modeCls);
        $("#modeState").html(modeState);
    }, function (res) {
        console.error('请求模型接口（' + modeDocID + '）报错');
    }, "GET");
}

//获取当前模型通讯健康状况 health
modelHealth = function () {
    var strWhere = {
        "version": 1,
        "api": "health"//接口名称
    }
    GetJosnsModeNew("", strWhere, true, function (res) {
        JosnSel(res, "health");
    }, function (res) {
        var status = res.status;//调用接口的状态
        var statusText = res.statusText;//调用接口的文本说明
        var modeState = "离线";
        var modeCls = " color:red;";
        $("#modeState").attr('style', modeCls);
        $("#modeState").html(modeState);
    });
}
//获取计算专题列表GetSubjectList：获取模型的基础信息，包括模型步长、专题名称等
//获取doc跟subID，后面的接口调用需要这个doc跟subID
modelGetSubjectList = function () {
    var strWhere = {
        "version": 1,
        "api": "GetSubjectList"
    }
    GetJosnsModeNew("", strWhere, true, function (res) {
        JosnSel(res, "GetSubjectList");
    });
}

//获取控制调度对象列表 GetScheduleObjList
modelGetScheduleObjList = function () {
    var strWhere = {
        "version": 1,
        "doc": $.data(myData, "docid"),
        "sbjID": parseInt($.data(myData, "sbjID")),
        "api": "GetScheduleObjList"
    }
    GetJosnsModeNew("", strWhere, true, function (res) {
        JosnSel(res, "GetScheduleObjList");
    });
}

//设置预报调度任务SetTask
modelSetTask = function () {
    var bjData = $.data(myData, "bjModelData");
    var bjZhan = $.data(myData, "bjModelZhan");
    var stime = $.data(myData, "stime");
    var etime = $.data(myData, "etime");
    var hour = GetDateDiff(stime, etime, 'hour');
    var hydroID = parseInt($.data(myData, "huishuimodehdyroID"));
    var timeStep = $.data(myData, "timeStep");//步数
    var timeStepHydro = $.data(myData, "timeStepHydro");//步数
    var predictSteps = (3600 * hour) / timeStepHydro;//预见期
    var scheduleObjs = [];
    for (var num = 0; num < bjZhan.length; num++) {
        var res = bjZhan[num];
        if (res.id == 30000000) {
            break;
        }
        var valType = res.type;
        if (res.type == 0) {
            valType = 22;//降雨量
        }
        // else if(res.type==3){
        //     valType=4;
        // }
        var item = {
            "id": res.id,
            "type": res.type,
            "valType": valType,//流量、规则等调度方式
            "vals": []
        };
        var bjDataTemp = bjData.filter(p => {
            return p.zhanid == res.id;
        });
        var vals = [];
        if (bjDataTemp.length == 0) {//无数据的用0代替
            for (var _index = 0; _index < predictSteps; _index++) {
                vals.push(0.0);
            }
            //console.error(res.name,bjDataTemp,vals);
        }
        else {
            for (var _index = 0; _index < bjDataTemp.length; _index++) {
                var bj = bjDataTemp[_index];
                var gcDATA = bj.zhandata;
                if (res.type == 3) {//工程
                    if (isNaN(gcDATA)) {
                        var plan = res.plan;
                        var planTemp = plan.filter(p => {
                            return p.name == gcDATA;
                        });
                        item.valType = 4;//4代表是采用规则调度
                        var valIdex = planTemp.length > 0 ? planTemp[0].index : 0;
                        if (_index == 0) {
                            vals.push(valIdex);//给一个值
                            // break;//跳出循环
                        }
                    } else {
                        item.valType = 2;//2代表是采用流量调度
                        vals.push(gcDATA);
                        // break;//跳出循环
                    }
                }
                else if (res.type == 0) {//雨量需要小时转5分钟
                    var drp = Number(gcDATA) / 12;
                    for (var minu = 0; minu < 12; minu++) {
                        vals.push(drp);
                    }
                } else {//边界潮水位
                    if (_index > 0) {//依据时间的不要
                        vals.push(Number(bj.zhandata));
                    }
                }
            }
        }
        console.error(res.id, res.name, vals.length);
        item.vals = vals;
        scheduleObjs.push(item);
    }

    //设置预报调度数据
    //scheduleObjs=[];
    var taskData = {
        "version": 1,
        "api": "SetTask",
        "user": GetCookie("username"),
        "hydroID": hydroID,//水文序列
        "doc": $.data(myData, "docid"),
        "sbjID": parseInt($.data(myData, "sbjID")),
        //"parentTask": "", 
        //"description": "", 
        "name": GetCookie("LOGINNAME"),
        "actions": [
            {
                "type": "预报调度",
                "time": stime,
                "predictSteps": predictSteps,
                "scheduleObjs": scheduleObjs
            }
        ]
    }
    console.log("传给模型的参数：", JSON.stringify(taskData));
    GetJosnsModeNew("", taskData, true, function (res) {
        JosnSel(res, "SetTask");
    });
}
//获取模型任务状态GetTaskStatus
modelGetTaskStatus = function () {
    var taskID = $.data(myData, "taskID");
    var strWhere = {
        "version": 1,
        "taskID": taskID,
        "api": "GetTaskStatus"
    }
    GetJosnsModeNew("", strWhere, true, function (res) {
        JosnSel(res, "GetTaskStatus");
    });
}

//主图形：获取预制输出项列表GetPresetResultInfoList
modelGetPresetResultInfoList = function () {
    console.error("doc", $.data(myData, "docid"));
    console.error("sbjID", $.data(myData, "sbjID"));
    var strWhere = {
        "version": 1,
        "doc": $.data(myData, "docid"),
        "sbjID": parseInt($.data(myData, "sbjID")),//专题id
        "api": "GetPresetResultInfoList"
    }
    GetJosnsModeNew("", strWhere, true, function (res) {
        JosnSel(res, "GetPresetResultInfoList");
    });
}

//获取预制输出项结果GetResultPresetByTimePeriod：主图形输出的计算结果
modelGetResultPresetByTimePeriod = function (id, stime, etime) {
    var stime = stime != undefined ? stime : $.data(myData, "stime");
    var etime = etime != undefined ? etime : $.data(myData, "etime");
    var taskID = $.data(myData, "taskID");
    var strWhere = {
        "version": 1,
        "api": "GetResultPresetByTimePeriod",
        "id": id,//主图形编号
        "startTM": stime,
        "endTM": etime,
        "taskID": taskID
    }
    GetJosnsModeNew("", strWhere, true, function (res) {
        JosnSel(res, "GetResultPresetByTimePeriod");
    });
}

//获取纳雨能力数据modelGetRainReceivingCapacity
modelGetRainReceivingCapacity = function () {
    var stime = $.data(myData, "stime");
    var strWhere = {
        "version": 1,
        "api": "GetRainReceivingCapacity",
        "doc": $.data(myData, "docid"),
        "sbjID": parseInt($.data(myData, "sbjID")),//专题id
        "time": stime
    }
    GetJosnsModeNew("", strWhere, true, function (res) {
        JosnSel(res, "GetRainReceivingCapacity");
    });
}

//获取某时刻全流域计算结果GetResultAllModelByTime
modeGetResultAllModelByTime = function (time, taskID, typeID) {
    var strWhere = {
        "version": 1,
        "api": "GetResultAllModelByTime",
        "time": time,
        "taskID": taskID //注意有taskID返回预报期数据，无taskID返回模拟期数据
    }
    GetJosnsModeNew("", strWhere, true, function (res) {
        typeID = typeID != undefined ? typeID : "GetResultAllModelByTime";
        JosnSel(res, typeID);
    });
}

//获取时段单个对象的计算结果GetResultModelsByTimePeriod
modeGetResultModelsByTimePeriod = function (stime, etime, taskID, modelIDs) {
    var hydroID = parseInt($.data(myData, "huishuimodehdyroID"));
    var strWhere = {
        "version": 1,
        "api": "GetResultModelsByTimePeriod",//获取指定模型计算结果
        "startTM": new Date(stime).format('yyyy-MM-d H:mm'),//开始时间
        "endTM": new Date(etime).format('yyyy-MM-d H:mm'),//结束时间
        "doc": $.data(myData, "docid"),//模型文档id，可选
        "hydroID": hydroID,//水文序列ID，如果给定taskID可不用给该字段
        "sbjID": $.data(myData, "sbjID"),//专题ID，如果给定taskID可不用给该字段
        "taskID": taskID,//任务ID，如果只查模拟结果，可以不用给定该字段
        "modelIDs": modelIDs,// [67110166, 67110158]//需要查询的模型ID列表
    }
    GetJosnsModeNew("", strWhere, true, function (res) {
        JosnSel(res, "GetResultModelsByTimePeriod");
    });
}


//获取水文序列列表GetHydroSeriesList
modeGetHydroSeriesList = function () {
    var strWhere = {
        "version": 1,
        "api": "GetHydroSeriesList",
    }
    GetJosnsModeNew("", strWhere, true, function (res) {
        JosnSel(res, "GetHydroSeriesList");
    });
}


//设置预报调度任务SetTask：调度预案和之前的方式不同
modelSetTaskSZH = function () {
    var bjData = $.data(myData, "bjModelData");
    var bjDataFQ = $.data(myData, "bjModelDataFQ");//分区预案
    var bjZhan = $.data(myData, "bjModelZhan");
    var yuanZhan = $.data(myData, "yuanZhan");
    var stime = $.data(myData, "stime");
    var etime = $.data(myData, "etime");
    var hour = GetDateDiff(stime, etime, 'hour');
    var hydroID = parseInt($.data(myData, "huishuimodehdyroID"));
    var timeStep = $.data(myData, "timeStep");//步数
    var timeStepHydro = $.data(myData, "timeStepHydro");//步数
    var predictSteps = (3600 * hour) / timeStepHydro;//预见期
    var scheduleObjs = [];
    for (var num = 0; num < bjZhan.length; num++) {
        var res = bjZhan[num];
        if (res.id == 30000000) {
            break;
        }
        var valType = res.type;
        if (res.type == 0) {
            valType = 22;//降雨量
        }
        // else if(res.type==3){
        //     valType=4;
        // }
        var item = {
            "id": res.id,
            "type": res.type,
            "valType": valType,//流量、规则等调度方式
            "vals": []
        };
        var bjDataTemp = bjData.filter(p => {
            return p.zhanid == res.id;
        });
        var vals = [];
        if (bjDataTemp.length == 0) {//无数据的用0代替
            item = {};
            vals = [];
            // for(var _index = 0; _index < predictSteps; _index++){
            //     vals.push(0.0);
            // }
            //console.error(res.name,bjDataTemp,vals);
        }
        else {
            var yuanZhanTemp = yuanZhan.filter(function (yuan) {
                return yuan.zhanid == res.id;
            });
            for (var _index = 0; _index < bjDataTemp.length; _index++) {
                var bj = bjDataTemp[_index];
                var gcDATA = bj.zhandata;
                if (res.type == 3) {//工程
                    if (isNaN(gcDATA)) {
                        // var valIdex=0;
                        // if(gcDATA=="调度预案"){//采用模型的缺省预案
                        //     valIdex=-1;                            
                        // }
                        // else {
                        //    var  yuanZhanTempT=yuanZhanTemp.filter(function(yuan){
                        //         return yuan.normal==gcDATA;
                        //     });                        
                        //     if(yuanZhanTempT.length>0){
                        //         valIdex=yuanZhanTempT[0].cz;
                        //     }
                        // }                                               

                        // // var plan = res.plan;
                        // // var planTemp = plan.filter(p => {
                        // //     return p.name == gcDATA;
                        // // });
                        // // item.valType = 4;//4代表是采用规则调度
                        // // var valIdex = planTemp.length > 0 ? planTemp[0].index : 0;
                        // if(_index==0){
                        //     vals.push(valIdex);//给一个值
                        //     // break;//跳出循环
                        // }
                        break;//使用分区预案
                    } else {
                        item.valType = 2;//2代表是采用流量调度
                        vals.push(Number(gcDATA));
                        // break;//跳出循环
                    }
                }
                else if (res.type == 0) {//雨量需要小时转5分钟
                    var drp =parseFloat( (Number(gcDATA) / 12).toFixed(2));
                    for (var minu = 0; minu < 12; minu++) {
                        vals.push(drp);
                    }
                } else {//边界潮水位
                    // if(res.id=="1778384904")
                    //     {
                    //         console.error(res.id,bj.zhandata,"长度",bjDataTemp.length,_index);
                    //     }
                    //if (_index > 0) {//依据时间的不要                        
                        if (Number(bj.zhandata) != -1000) {
                            // console.error("有",res.id,Number(bj.zhandata));
                            vals.push(Number(bj.zhandata));
                        }
                        else {
                            // console.error("无",res.id,Number(bj.zhandata));
                            vals = [];//如果为-1000，则不采用,使用模型默认的潮位
                        }
                    //}
                }
            }
        }
        // console.error(res.id,res.name,vals.length);

        if (SetNull(item.id) != "") {
            if (vals.length > 0) {
                item.vals = vals;
                scheduleObjs.push(item);
                // if (res.type == 1){
                //      console.error(res.id,res.name,vals.length);
                // }
            }
        }
    }

    //分区调度预案
    if (SetNull(bjDataFQ) != "") {
        var itemFQ = {
            "id": 30000000,
            "type": 3,
            "valType": 4,//规则
            "vals": []
        };
        var valsFQ=[];
        for (var i = 0; i < bjDataFQ.length; i++) {
            valsFQ.push(parseInt( bjDataFQ[i].zhandata));
        }
        if (valsFQ.length > 0) {
            itemFQ.vals = valsFQ;
            scheduleObjs.push(itemFQ);
        }
        // console.error('itemFQ',itemFQ);
    }
    //分区调度预案
    
    //设置预报调度数据
    // scheduleObjs=[];
    var taskData = {
        "version": 1,
        "api": "SetTask",
        "user": GetCookie("username"),
        "hydroID": hydroID,//水文序列
        "doc": $.data(myData, "docid"),
        "sbjID": parseInt($.data(myData, "sbjID")),
        //"parentTask": "", 
        //"description": "", 
        "name": GetCookie("LOGINNAME"),
        "actions": [
            {
                "type": "预报调度",
                "time": stime,
                "predictSteps": predictSteps,
                "scheduleObjs": scheduleObjs
            }
        ]
    }
    console.log("传给模型的参数：", JSON.stringify(taskData));
    GetJosnsModeNew("", taskData, true, function (res) {
        JosnSel(res, "SetTask");
    });
}

modelSetTaskSZHNew=function(){
    var stime = $.data(myData, "stime");
    var etime = $.data(myData, "etime");
    var hour = GetDateDiff(stime, etime, 'hour');
    var localDD_ID = $.data(myData, "DD_ID");
    if (localDD_ID == null || localDD_ID == "") {
        localDD_ID = "0";
    }
    var s_where={
        startdate:stime,
        enddate:etime,
        dd_id:localDD_ID,
        fpdr:hour
    };
    app.post("/SWZZ_MODE_ES_ZHANDIANDATA/modelSetTaskSZH", s_where,function(res){
        console.error("结果：：：：：：：：",res);
        JosnSel(res, "SetTask");
    });
}