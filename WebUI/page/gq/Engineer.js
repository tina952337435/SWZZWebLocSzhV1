var map = window.parent.map; //获取地图对象 
//var LayerID = "gq_layer";
//var normalGraphicLayer = map.getLayer(LayerID);
//if (normalGraphicLayer != null) {
//    map.removeLayer(normalGraphicLayer);
//}
//normalGraphicLayer = CreateLayer(LayerID);

var normalGraphicLayer;
var LayerID = "gq_layer";
try {
    normalGraphicLayer = map.getLayer(LayerID);
    if (normalGraphicLayer != null) {
        map.removeLayer(normalGraphicLayer);
    }
} catch (e) {
	window.location.reload();
}
setTimeout(function () {
    normalGraphicLayer = CreateLayer(LayerID);
    /*设置图层的最小可见度*/
    /*设置图层的飞行提示*/
    setLayerToolTip(normalGraphicLayer, "stnm", "SHIKUANG,TMS", "实况,时间");
    normalGraphicLayer.on("click", onSQClick);
},300);

var labels = new Array();
var _globallevel = 5; 
function onSQClick(evt) {
    var stcd = evt.graphic.attributes.stcd;
    var stnm = evt.graphic.attributes.stnm;
    //var tm = mini.get("end").getFormValue();
    //var tempTM = new Date(tm.replaceAll("-", "/") + ":00");
    //var stime = "", etime = "";
    //if (parseInt(new Date().format("HH")) > 8) {
    //    stime = addDayDate(tempTM.format("yyyy/MM/dd"), -1) + " 08:00:00";
    //} else {
    //    stime = tempTM.format("yyyy/MM/dd 08:00:00");
    //}
    //etime = tempTM.format("yyyy/MM/dd HH:mm:ss");
    //var typeName = "运行状态";
    //var param ="stcd="+ stcd + "&stnm=" + (stnm) + "&stime=" + stime + "&etime=" + etime + "&TYPENAME=" + typeName;
    //var url = "/DanZhan/GQVIEWNew.html?" + param;
    //openChart(url, stnm + "工情监视", stcd);

    Trans(stcd,stnm,"运行状态")
}

function addMark2(obj) {
    if (normalGraphicLayer != null) {
        normalGraphicLayer.clear();
        normalGraphicLayer.setVisibility(true);
    }
    if (obj == null)
        return;
    require(["esri/geometry/Point",
        "esri/graphic",
        "myJs/MapText",
        "esri/symbols/PictureMarkerSymbol",
        "esri/InfoTemplate",
        "esri/dijit/InfoWindow",
        "esri/layers/GraphicsLayer",
        "esri/geometry/webMercatorUtils", "esri/symbols/TextSymbol", "dojo/domReady!"
    ], function (Point, Graphic, MapText, PictureMarkerSymbol, InfoTemplate, InfoWindow, GraphicsLayer, webMercatorUtils, TextSymbol) {

        var breakSymbol;
        _destroy();
        var arrgObj = [];
        var AllSum = 0;

        for (var i = 0; i < obj.length; i++) {

            var omzs =obj[i].flpq==null?0: Number(obj[i].flpq);
            var IINum = 0;

            if (undefined != obj[i].tm && null != obj[i].tm) {
                obj[i].TMS = new Date(convertToDate(obj[i].tm)).format("yyyy-MM-dd HH:mm");
            } else {
                obj[i].TMS = "";
            }

            if (obj[i].lgtd == undefined || obj[i].lttd == undefined) {
                continue;
            }
            var point = new Point({ "x": obj[i].lgtd, "y": obj[i].lttd, "spatialReference": { "wkid": 4326 } });
            var objID = "gqColor" + obj[i].stcd;
            var cls = " waterText' id='" + objID + "";

            var _align = "bottom";

            var tempMsg = "";
            var tempValue = "";
            var item = obj[i];

            if ("63306300".lastIndexOf(item.stcd) > -1) {
                _align = "left";
            } else if ("63300006,63300008".lastIndexOf(item.stcd) > -1) {
                _align = "right";
            } else if ("63307100,63309301,63300004,63307701,63300003".lastIndexOf(item.stcd) > -1) {
                _align = "top";
            }
            var tempFlag = false;
            var NumCountKQ = 0;
            if (omzs > 0) {
                for (index = 1; index <= omzs; index++) {
                    var tempindex = "";
                    var tempTM = new Date(new Date().format("yyyy/MM/dd 00:00:00"));
                    var temAgg = item.gateList.filter(function (e) {
                        return e.EQPTP == "泵站状态" && e.EXKEY == index && Number(e.gtq) > 0.002 && new Date(convertToDate(e.tm)) > tempTM;
                    });
                    if (temAgg.length > 0) {
                        tempFlag = true;
                        NumCountKQ++;
                        tempindex = '<span class="gqGreen">&nbsp;&nbsp;</span>';
                    }
                    else {
                        tempindex ='<span class="gqRed">&nbsp;&nbsp;</span>';
                    }
                    tempMsg += tempindex;
                }
                //obj[i].OMCNUMSS = NumCountKQ + "/" + obj[i].flpq;
                obj[i].SHIKUANG = "泵【" + NumCountKQ + "/" + obj[i].flpq + "】";
            }
            //else {
            var gtNumCountKQ = 0;
            omzs =item.flpq==null?0: Number(item.flpq);
            //console.log(obj[i].stnm + "=======" + omzs)
            if (omzs > 0) {
                for (index = 1; index <= omzs; index++) {
                    var tempindex = "";
                    var pValue = "";
                    var tempTM = new Date(new Date().format("yyyy/MM/dd 00:00:00"));
                    var temAgg = [];

                    //if (stcds.indexOf(item.stcd) > -1) {
                    //    temAgg = item.gateList.filter(function (e) {
                    //        return e.EQPTP == "闸坝开度" && e.EXKEY == index && Number(e.gtq) < 0.002 && new Date(convertToDate(e.tm)) > tempTM;
                    //    });
                    //} else {
                        temAgg = item.gateList.filter(function (e) {
                            return e.EQPTP == "闸坝开度" && e.EXKEY == index && Number(e.gtq) > 0.002 && new Date(convertToDate(e.tm)) > tempTM;
                        });
                    //}
                    if (temAgg.length > 0) {
                        tempFlag = true;
                        item.KD = Number(temAgg[0].gtq).toFixed(2);
                        gtNumCountKQ++;
                        tempindex = '<span class="Grentsquare">&nbsp;&nbsp;</span>';
                        pValue = "<div style='width:30px;float:left;'>" + Number(temAgg[0].gtq).toFixed(2) + "</div>";
                    }
                    else {
                        tempindex = '<span class="HUIsquare">&nbsp;&nbsp;</span>';
                        pValue = "<div style='width:30px;float:left;'>&nbsp;</div>";
                        item.KD = "—";
                    }
                    tempMsg += tempindex;
                    //tempValue += pValue;
                }
                //if (item.KD != "—") {
                //    obj[i].KDS = "(" + item.KD + ")" + gtNumCountKQ + "/" + omzs;
                //} else {
                //    obj[i].KDS = gtNumCountKQ + "/" + omzs;
                //}
                if (item.KD != "—") {
                    if (obj[i].SHIKUANG != undefined) {
                        obj[i].SHIKUANG += "，闸【" + "(" + item.KD + ")" + gtNumCountKQ + "/" + omzs + "】";
                    } else {
                        obj[i].SHIKUANG = "";
                        obj[i].SHIKUANG += "闸【" + "(" + item.KD + ")" + gtNumCountKQ + "/" + omzs + "】";
                    }
                } else {
                    if (obj[i].SHIKUANG != undefined) {
                        obj[i].SHIKUANG += "，闸【" + gtNumCountKQ + "/" + omzs + "】";
                    } else {
                        obj[i].SHIKUANG = "";
                        obj[i].SHIKUANG += "闸【" + gtNumCountKQ + "/" + omzs + "】";
                    }
                }
            }
            tempValue += "<div style='width:30px;clear:none;'></div>";
            var pUrl="././arcgis_js_api//myJs/images/";
            var imgUrl="";
            if (item.OMCN == 1) {
                imgUrl="z_green_1.png";
            }
            else if (item.OMCN == 0) {
                imgUrl="z_red_1.png";
            }
            else {
                imgUrl="z_blur_1.png";
            }
            breakSymbol = new PictureMarkerSymbol(pUrl+imgUrl,17, 10);
            if (tempMsg != "") {
                arrgObj.push({ "ID": objID, "stnm": obj[i].stnm, "NAME": tempMsg });
            }
            else {
                arrgObj.push({ "ID": objID, "stnm": obj[i].stnm });
            }
            if (tempMsg != "") {
                var strTitle = obj[i].stnm;
                if (strTitle != undefined) {
                    var length_w = strTitle.length * 16;
                } else {
                    strTitle = "";
                }

                var TEMPZ = "";
                if (obj[i].UPZ != null) {
                    if (Number(obj[i].UPZ) > 0) {
                         TEMPZ += "<br/>水位：" + obj[i].UPZ + "m";
                    }
                }
                //if (obj[i].SFQ != undefined) {
                //    if (NumCountKQ > 0) {
                //        if (Number(obj[i].SFQ) > 0) {
                //            TEMPZ += "<br/>泵站流量：" + Number(Number(obj[i].SFQ) * NumCountKQ).toFixed(1) + "m³/s";
                //            AllSum += Number(obj[i].SFQ) * NumCountKQ;
                //        }
                //    }
                //}

                var tempST_GATE_RBZ = obj[i].gateList.filter(function (e) {
                    return e.EQPTP == '泵站流量' && Number(e.gtq) > 0;
                });
                if (tempST_GATE_RBZ.length > 0) {
                    var tempQ = 0;
                    for (num = 0; num < tempST_GATE_RBZ.length; num++) {
                        tempQ += Number(tempST_GATE_RBZ[num].gtq);
                    }
                    TEMPZ += "<br/>泵站流量：" + tempQ.toFixed(1) + "m³/s";
                }

                var tempST_GATE_R = obj[i].gateList.filter(function (e) {
                    return e.EQPTP == '闸坝流量' && Number(e.gtq) > 0;
                });
                if (tempST_GATE_R.length > 0) {
                    var tempQ = 0;
                    for (num = 0; num < tempST_GATE_R.length; num++) {
                        tempQ += Number(tempST_GATE_R[num].gtq);
                    }
                    TEMPZ += "<br/>过闸流量：" + tempQ.toFixed(1) + "m³/s";
                }
                //if (obj[i].VIEWNAME != null && obj[i].VIEWNAME != undefined) {
                //    TEMPZ += "<br/>运行调度：" + obj[i].VIEWNAME;
                //}
                tempMsg = tempMsg + TEMPZ;
                if (window.parent.SpanBiaoZhu() == false) {
                    cls += "@";
                }
                
                if (_align == "top") {
                    cls += " topheight";
                    cls = cls.replaceAll("'", " topheight'");
                }

                var textMapStr = strTitle + "<br />" + tempMsg;
                if (obj[i].Q != undefined) {
                    textMapStr += "<br />流量：" + obj[i].Q + "m³/s";
                }
                cls = cls.replaceAll("topheight", "");
                var label = new MapText(map, point, obj[i], textMapStr , _globallevel, _align, cls, 12);
                labels.push(label);
                //console.error("样式1：", cls);
                cls = cls.replaceAll(' ', '');
                if (_align == "bottom") {
                    strTitle = "▴";
                } else if (_align == "top") {
                    //console.log(cls)
                    //cls = cls.replaceAll("'id", " gqtop' id");
                    //console.warn(cls)
                    cls = cls.replaceAll("topheight", "");
                    strTitle = "▾";
                } else if (_align == "left") {
                    strTitle = "▸";
                } else if (_align == "right") {
                    strTitle = "◂";
                }
                label2 = new MapText(map, point, obj[i], strTitle, _globallevel, _align, cls, 12);
                labels.push(label2);
                //console.error("样式2：", cls);
            }
            else {
                var strTitle2 = obj[i].stnm;
                var length_w = 0;
                if (strTitle2 != undefined) {
                    length_w = strTitle2.length * 16
                } else {
                    strTitle2 = "";
                }
                if (obj[i].Q != undefined) {
                    if (Number(obj[i].Q) > 0) {
                        strTitle2 += ":" + obj[i].Q + "m³/s";
                        AllSum += Number(obj[i].Q);
                    }
                    length_w = length_w + 52;
                }
                if (obj[i].UPZ != null) {
                    if (Number(obj[i].UPZ) > 0) {
                            strTitle2 += "<br/>水位：" + obj[i].UPZ + "m";
                        
                    }
                }
                if (window.parent.SpanBiaoZhu() == false) {
                    cls += "@";
                }
                if (_align == "top") {
                    cls += " topheight";
                    cls = cls.replaceAll("'", " topheight'");
                }
                var label2 = new MapText(map, point, obj[i], strTitle2, _globallevel, _align, cls, 12);
                labels.push(label2);
                cls = cls.replaceAll(' ', '');
                if (_align == "bottom") {
                    strTitle2 = "▴";
                } else if (_align == "top") {
                    //cls = cls.replaceAll("'id", " gqtop' id");
                    //console.warn(cls)
                    cls = cls.replaceAll("topheight", "");
                    strTitle2 = "▾";
                } else if (_align == "left") {
                    strTitle2 = "▸";
                } else if (_align == "right") {
                    strTitle2 = "◂";
                }
                cls = cls.replaceAll("topheight", "");
                label2 = new MapText(map, point, obj[i], strTitle2, _globallevel, _align, cls, 12);
                labels.push(label2);
            }
            
            var graphic = new Graphic(point, breakSymbol, obj[i], null);
            graphic.attr('id',obj[i].stcd);
            graphic.attr('name',obj[i].stnm);
            graphic.id=obj[i].stcd;
            graphic.name=obj[i].stnm;
            normalGraphicLayer.add(graphic);


            // if(obj[i].stnm=="华田泾枢纽"){
            //     console.error(item.stnm,item.OMCN,item.lgtd,item.lttd,imgUrl,"tempMsg",tempMsg);
            //     console.error('breakSymbol',breakSymbol,'graphic',graphic);
            // }
        }
        $.data(myData, "arrgObj", arrgObj);
    });
}
