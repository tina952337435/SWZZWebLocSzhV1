var LayerID = "backIndex_dyLayer4";
var normalGraphicLayer = null;
var labels = new Array();
var _globallevel = 5;
setTimeout(function () {
    normalGraphicLayer = CreateLayer(LayerID);
    /*设置图层的飞行提示*/
    //setLayerToolTip(normalGraphicLayer, "STNM", "STNM,STATE", "站名,状态");
    normalGraphicLayer.on("click", onSQClick);
}, 1000);

var Interval = 0;
function onSQClick(evt) {
    if (evt.graphic.attributes != undefined) {
        var stcd = evt.graphic.attributes.STCD;
        var stnm = evt.graphic.attributes.STNM;
        var isuse = evt.graphic.attributes.S_ISUSE;
        if (isuse != undefined && isuse.trim() != "") {
            stnm += isuse;
        } else {
            WindowsOpen("DanZhan/SZLine.html?stcd=" + stcd + "&stnm=" + (stnm), stnm + "", "1200@550");
        }
    }
}
function addMark(obj) {
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
        //console.error(JSON.stringify(obj))
        for (var i = 0; i < obj.length; i++) {
            //console.log(obj[i])
            //console.log("LGTD===" + obj[i].LGTD)
            //console.log("LTTD===" + obj[i].LTTD)
            if (obj[i].LGTD == undefined && obj[i].LTTD == undefined) {
                continue;
            }
            //console.log("LTTD22==="+obj[i].LTTD)
            var state = obj[i].STATE;
            //addHDSZLine(obj[i].MAP_LINE, state, normalGraphicLayer);

            var state = obj[i].STATE;
            obj[i].STNMS = obj[i].STNM;


            var tempColor = "";
            var LineColor = ['#D3CFCF', '#56D4FD', '#1AA9F1', '#5ED624', '#FEC307', '#FD5508', '#FD5508', '#D3CFCF'];
            var cls = " waterText";
            var tempFlag = true;
            var STATE = "";
            if (tempFlag == true) {
                if (state == "0") {
                    tempColor = LineColor[state];
                    breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/green_hd.gif", 22, 22);
                    state = "I类";
                    cls = " szoneText";
                    STATE = "正常";
                } else if (state == "1") {
                    tempColor = LineColor[state];
                    breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/s_yellow_u1.gif", 22, 22);
                    state = "II类";
                    cls = " sztwoText";
                    STATE = "告警";
                } else if (state == "2") {
                    tempColor = LineColor[state];
                    breakSymbol = new PictureMarkerSymbol("/arcgis_js_api/myJs/images/s_red_u1.gif", 22, 22);
                    state = "III类";
                    cls = " szthreeText";
                    STATE = "故障";
                } 
            }
            obj[i].STATE = STATE;
            var point = new Point({ "x": obj[i].LGTD, "y": obj[i].LTTD, "spatialReference": { "wkid": 4326 } });

            //if (window.parent.SpanBiaoZhu() == false) {
            //    cls += "@";
            //}
            var _align = "bottom";
            var tempTITLE = obj[i].STNM + "\n" + state + "";
            if (obj[i].S_ISUSE != undefined) {
                if (obj[i].S_ISUSE.replaceAll(" ", "") != "") {
                    tempTITLE = obj[i].STNMS;
                }
            }
            var label = new MapText(map, point, obj[i], tempTITLE, _globallevel, _align, cls, 12);
            labels.push(label);
            cls = cls.replaceAll(' ', '');
            tempTITLE = "";
            if (_align == "bottom") {
                tempTITLE = "▴";
            } else if (_align == "top") {
                tempTITLE = "▾";
            } else if (_align == "left") {
                tempTITLE = "▸";
            } else if (_align == "right") {
                tempTITLE = "◂";
            }
            label = new MapText(map, point, obj[i], tempTITLE, _globallevel, _align, cls, 12);
            labels.push(label);

            var graphic = new Graphic(point, breakSymbol, obj[i], null);
            normalGraphicLayer.add(graphic);
        }
    });
}
//图标闪现