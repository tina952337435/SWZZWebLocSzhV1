/*
    每个模块需要引用的JS,用来访问首页地图的JS方法和图例页面的方法,调用mapIndex.js(window.parent)里的方法
*/
//获取图例页面的标签
var _globallevel = 10;
function getTLObj(str) {
    return window.parent.getTLObj(str);
}
//在地图首页,载入需要的js模块
function LoadJS(str, url) {
    window.parent.LoadJS(str, url);
}  
function dyCenter(lgtd, lttd) {
    if (lgtd != null && lttd != null && lgtd != "" && lttd != "") {
        window.parent.dyCenter(lgtd, lttd);
    }
}
function openTL(url) {
    window.parent.openTL(url);
}
function ShowYT(str, type) {
    return window.parent.ShowYT(str, type);
}
function addHDSZLine(str, szcolor, layer) {
    return window.parent.addHDSZLine(str, szcolor, layer);
}
function GlobalSelectGeometry(pahts, layer) {
    return window.parent.GlobalSelectGeometry(pahts, layer);
}
/***创建图层***/
var layers=new Array();
function CreateLayer(str) {
    var ly;
    if (window.parent.map.getLayer(str)) {
        ly = window.parent.map.getLayer(str);
    }
    else {
        ly = window.parent.CreateLayer(str);
    }
    layers.push(ly);
    return  ly;
}
//清理现有图层
function _destroy() {
    for (var j = 0; j < layers.length; j++) {
        try {
            layers[j].clear();
        } catch (ex) { }
    } 
    if ("undefined" != typeof labels && labels != null) {
        for (var i = 0; i < labels.length; i++) {
            try {
                labels[i].clear();
            } catch (ex) { }
        }
    }
    labels = new Array();
    if (this.destroy != null) {
        if (typeof (destroy) == "function") {
            destroy();
        }
    }
    if (info != null) {
        info.clear();
    }
}
//显示图层
function _show() {
    for (var j = 0; j < layers.length; j++) {
        layers[j].setVisibility(true);
    }
    if ("undefined" != typeof labels && labels != null) {
        for (var i = 0; i < labels.length; i++) {
            labels[i].show();
        }
    }
    if (this.show != null)
    {
        if (typeof (show) == "function") {
            show();
        }
    }
}
//隐藏图层
function _hide() {
    for (var j = 0; j < layers.length; j++) {
        layers[j].setVisibility(false);
    }
    if ("undefined" != typeof labels && labels != null) {
        for (var i = 0; i < labels.length; i++) {
            labels[i].hide();
        }
    }
    if (this.hide != null) {
        if (typeof (hide) == "function") {
            hide();
        }
    }
    if (info != null) {
        info.clear();
    }
}
/***创建图层***/


/***设置图层的飞行提示***/
var info;
function setLayerToolTip(layer, title, field, fieldName) { 
    require(["esri/layers/GraphicsLayer"], function (GraphicsLayer) {
        dojo.connect(layer, "onMouseOver", function (evt) {
            openinfo(evt, evt.graphic.attributes[title] == undefined ? "" : evt.graphic.attributes[title] , field, fieldName);
        });

        dojo.connect(layer, "onMouseOut", function (evt) {
            closeinfo();
        });
    });
}
function openinfo(evt, title, field, fieldname) {
    evt.currentTarget.style.cursor = "pointer";
    require(["myJs/ToolTip"], function (ToolTip) {
        if (info!=null) {
            info.clear();
        }
        info = new ToolTip(map, evt.graphic, evt.screenPoint, title, field, fieldname);
    });

}
function closeinfo() {
    if (info != null) {
        info.clear();
    }
}
/***设置图层的飞行提示***/

/***根据level 设置图层的可见性,Max:<level可见,Min:>level可见***/
function setMaxLevel(layer, level) {
    var lods = window.parent.map.__tileInfo.lods;
    var scale = 0;
    for (var i = 0; i < lods.length; i++) {
        if (lods[i].level == level) {
            scale = lods[i].scale;
            break;
        }
    }
    layer.setMaxScale(scale);
}
function setMinLevel(layer, level) {
    var lods = window.parent.map.__tileInfo.lods;
    var scale = 0;
    for (var i = 0; i < lods.length; i++) {
        if (lods[i].level == level) {
            scale = lods[i].scale;
            break;
        }
    }
    layer.setMinScale(scale);
}
/***设置图层的可见性****/


/****miniopen*****/
function openChart(url, title, stcd) {
    var _width = 1200, _height =620;
    if (stcd.lastIndexOf('@') > -1) {
        var aggSTCD = stcd.split('@');
        _width = aggSTCD[0];
        _height = aggSTCD[1];
    }
    mini.open({
        url: url,
        title: title,
        width: _width,
        height: _height,
        showCloseButton: true,   //显示关闭按钮
        showMaxButton: true,
        onload: function () {
        },
        ondestroy: function (action) {
            //grid.reload();
        }
    });
}
/****miniopen*****/

/****鼠标悬浮显示位置*****/
function CreateLayerID(str, LayerID) {
    var ly;
    try {
        if (window.parent.map.getLayer(str)) {
            ly = window.parent.map.getLayer(str);
        } else {
            ly = window.parent.CreateLayerID(str, LayerID);
        }
        layers.push(ly);
    } catch (ex) {
        // location.reload();
    }

    return ly;
}
function showTipPoint(lgtd, lttd, LayerGraphicLayer) {
    window.parent.showTipPoint(lgtd, lttd, LayerGraphicLayer);
}
function removeLayerID(objID) {
    window.parent.removeLayerID(objID);
}
var TipLayerID = "TipLayer";
function showRowPoint(grid) {
    removeLayerID(TipLayerID);
    grid.on("rowmouseover", function (res) {
        var row = res.row,
            column = res.column,
            field = res.field,
            value = res.value;
        rowIndex = res.rowIndex;
        var record = res.record;
        var TipLayerGraphicLayer = CreateLayerID(TipLayerID, 9999);
        TipLayerGraphicLayer.clear();
        showTipPoint(record.LGTD, record.LTTD, TipLayerGraphicLayer);
    });
    grid.on("rowmouseout", function (res) {
        var row = res.row,
            column = res.column,
            field = res.field,
            value = res.value;
        rowIndex = res.rowIndex;
        var record = res.record;
        removeLayerID(TipLayerID);
    });
}
/****鼠标悬浮显示位置*****/

/***得到表格字体颜色****/
function getCellColor(TYPE, val, ZHANTYPE) {
    var result = 0;
    var colors = ["#D3CFCF", "#1D8ADD", "#47c714", "#FED202", "#F91005", "#ed07c5", "#000000"];
    if (Number(val) == 10000) {
        result = 0;
    } else if (TYPE == "PH" || TYPE == "EPH" || TYPE == "ph") {
        if (Number(val) <= 9 && Number(val) >= 6) {
            result = 6;
        } else {
            result = 2;
        }
    }
    else if (TYPE == "TP" || TYPE == "ETP" || TYPE == "tp") {
        if (ZHANTYPE == "1") {
            if (Number(val) <= 0.01) {
                result = 1;
            }
            if (Number(val) > 0.01 && Number(val) <= 0.025) {
                result = 2;
            }
            if (Number(val) > 0.025 && Number(val) <= 0.05) {
                result = 3;
            }
            if (Number(val) > 0.05 && Number(val) <= 0.1) {
                result = 4;
            }
            if (Number(val) > 0.1 && Number(val) <= 0.2) {
                result = 5;
            }
            if (Number(val) > 0.2) {
                result = 6;
            }
        } else {
            if (Number(val) <= 0.02) {
                result = 1;
            }
            if (Number(val) > 0.02 && Number(val) <= 0.1) {
                result = 2;
            }
            if (Number(val) > 0.1 && Number(val) <= 0.2) {
                result = 3;
            }
            if (Number(val) > 0.2 && Number(val) <= 0.3) {
                result = 4;
            }
            if (Number(val) > 0.3 && Number(val) <= 0.4) {
                result = 5;
            }
            if (Number(val) > 0.4) {
                result = 6;
            }
        }
    }
    else if (TYPE == "DO" || TYPE == "EDO" || TYPE == "O2" || TYPE == "DOX" || TYPE =="dox") {
        if (Number(val) >= 7.5) {
            result = 1;
        }
        if (Number(val) >= 6 && Number(val) < 7.5) {
            result = 2;
        }
        if (Number(val) >= 5 && Number(val) < 6) {
            result = 3;
        }
        if (Number(val) >= 3 && Number(val) < 5) {
            result = 4;
        }
        if (Number(val) >= 2 && Number(val) < 3) {
            result = 5;
        }
        if (Number(val) < 2) {
            result = 6;
        }
    }
    else if (TYPE == "COD" || TYPE == "ECOD" || TYPE == "CODCR" || TYPE == "codcr") {
        if (Number(val) < 15) {
            result = 1;
        }
        if (Number(val) == 15) {
            result = 2;
        }
        if (Number(val) > 15 && Number(val) <= 20) {
            result = 3;
        }
        if (Number(val) > 20 && Number(val) <= 30) {
            result = 4;
        }
        if (Number(val) > 30 && Number(val) <= 40) {
            result = 5;
        }
        if (Number(val) > 40) {
            result = 6;
        }
    }
    else if (TYPE == "CODMN" || TYPE == "ECODMN" || TYPE == "codmn") {
        if (Number(val) <= 2) {
            result = 1;
        }
        if (Number(val) > 2 && Number(val) <= 4) {
            result = 2;
        }
        if (Number(val) > 4 && Number(val) <= 6) {
            result = 3;
        }
        if (Number(val) > 6 && Number(val) <= 10) {
            result = 4;
        }
        if (Number(val) > 10 && Number(val) <= 15) {
            result = 5;
        }
        if (Number(val) > 15) {
            result = 6;
        }
    }
    else if (TYPE == "AN" || TYPE == "EAN" || TYPE == "NH3N" || TYPE == "nh3n") {
        if (Number(val) <= 0.15) {
            result = 1;
        }
        if (Number(val) > 0.15 && Number(val) <= 0.5) {
            result = 2;
        }
        if (Number(val) > 0.5 && Number(val) <= 1.0) {
            result = 3;
        }
        if (Number(val) > 1.0 && Number(val) <= 1.5) {
            result = 4;
        }
        if (Number(val) > 1.5 && Number(val) <= 2) {
            result = 5;
        }
        if (Number(val) > 2) {
            result = 6;
        }

    }
    else if (TYPE == "TN" || TYPE == "ETN" || TYPE == "tn") {

        if (Number(val) <= 0.3) {
            result = 1;
        }
        if (Number(val) > 0.3 && Number(val) <= 0.5) {
            result = 2;
        }
        if (Number(val) > 0.5 && Number(val) <= 1) {
            result = 3;
        }
        if (Number(val) > 1 && Number(val) <= 1.5) {
            result = 4;
        }
        if (Number(val) > 1.5 && Number(val) <= 2) {
            result = 5;
        }
        if (Number(val) > 2) {
            result = 6;
        }
    }
    else if (TYPE == "SZTYPE" || TYPE == "ESZTYPE" || TYPE == "STATE") {
        result = Number(val);
    }
    return "color:" + colors[result];
}
/***得到表格字体颜色****/


/******/
function GetSort(arr) {
    arr.sort(compare);
    var _min=arr[0];
    var _max = arr[arr.length - 1];

    var i_min = _min * 10;
	var i_max = _max * 10;
	var i_deta = (i_max - i_min) / 7.0;
	var d_tmp;
	i_min = Number(i_min) - Number(i_deta);
	i_max = Number(i_max) + Number(i_deta);
	d_tmp = i_max - i_min;
				
	i_deta = 5 - (d_tmp % 5);
				
	_min = (i_min - (i_deta / 2)) / 10.0;
	_max = (i_max + i_deta - (i_deta / 2)) / 10.0;

	if (_min < 0) {
	    _min = 0;
    }

	return { min: _min, max: _max };
}
//方法按照升序排列数组项
function compare(val1, val2) {
    return val1 - val2;
};
/******/