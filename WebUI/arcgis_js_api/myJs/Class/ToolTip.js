/***********
鼠标放在点上的飞行提示;new ToolTip(map, evt.graphic, evt.screenPoint, title, "DRP", "累计雨量(mm)");
参数:map:地图对象,graphic:要素类对象,scp:屏幕点,title:标题,field:字段,fieldname:字段名称,screenpoint:窗口坐标
graphic,和scp,两者只需要任意一个,scp优先
***********/
define(["dojo/_base/declare",
        "esri/graphic",
        "esri/geometry/Geometry",
        "esri/geometry/Point",
        "esri/geometry/Extent",
        "dojo/on",
        "dojo/_base/lang",
        "esri/Evented",
        "dojo/dom",
        "dojo/dom-style",
        "dojo/dom-construct",
        "esri/domUtils",
        "esri/geometry/screenUtils",
        "dojo/domReady!"], function (declare, Graphic, Geometry, Point, Extent, on, lang, Evented, dom, domStyle, domConstruct, domUtils, screenUtils) {
            return declare([Evented], {
                _map: null,
                _mappoint: null,
                _screenpoint: null,
                _graphic: null, //事件
                _title: null,
                _data: null,
                _field: null,
                _fieldname: null,
                _attr: null, //数据内容
                _offset: 8, //偏移量
                constructor: function (map, graphic, scp, title, field, fieldname) {
                    this._map = map;
                    this._graphic = graphic;
                    this._title = title;
                    this._field = field;
                    this._fieldname = fieldname;
                    this._attr = graphic.attributes;
                    this._screenpoint = scp;
                    this.getCenter(graphic);
                    this.init();
                },
                init: function () {
                    if (this._map && this._screenpoint) {
                        this.drawText();
                    }
                },
                createInfo: function () {
                    var attr = this._attr;
                    var fdarr = this._field.split(",");
                    var fdnarr = this._fieldname.split(",");
                    var html = "";
                    html += "<p class='TipTitle'>" + this._title + "</p>";
                    if (this._field != "" && this._fieldname != "") {
                        fdarr.forEach(function (val, index, arr) {
                            var field = arr[index]; 
                            var value = attr[field]; 
                            if (value == null || value == "" || value == undefined) {
                                value = "-";
                            } 
                            var tempDdnarr = fdnarr[index].split("@");
                            var temp1 = tempDdnarr[0], temp2 = "";
                            if (tempDdnarr.length > 1) {
                                temp2 = tempDdnarr[1]; 
                                if (value == "-") {
                                    temp2 = "";
                                }
                            }
                            html += "<p class='TipClass'>" + temp1 + "：<span>" + value + temp2+ "</span></p>";
                        });
                    } else {
                        fdarr.forEach(function (val, index, arr) {
                            var tempDdnarr = fdnarr[index].split("@");
                            var temp1 = tempDdnarr[0], temp2 = "";
                            if (tempDdnarr.length > 1) {
                                temp2 = tempDdnarr[1];
                            }
                            html += "<p class='TipClass'>" + temp1 + "：-</p>";
                        });
                    }
                    this._node = domConstruct.toDom("<div class='TipBox'>" + html + "</div>");
                },
                getCenter: function (gra) {
                    var type = gra.geometry.type;
                    if (type == "point") {
                        this._mappoint = gra.geometry;
                    }
                    else if (type == "polyline") {
                        this._mappoint = gra.geometry.getPoint(0, 0);
                    }
                    else if (type == "polygon") {
                        this._mappoint = gra.geometry.getCentroid();
                    }
                    else if (type == "extent") {
                        this._mappoint = gra.geometry.getCenter();
                    }
                },
                hide: function () {
                    domUtils.hide(this._node);
                },
                show: function () {
                    domUtils.show(this._node);
                },
                getScreentPoint: function () {
                    var screenPoint;
                    if (this._screenpoint) {
                        screenPoint = this._screenpoint;
                    }
                    else {
                        if (this._mapPoint) {
                            screenPoint = screenUtils.toScreenPoint(this._map.extent,
                            this._map.width,
                            this._map.height,
                            this._mapPoint);
                        }
                    }
                    return screenPoint;
                },
                drawText: function () {
                    this.createInfo();

                    var ss = this._map.root; //dom.byId(this._map.id);
                    ss.appendChild(this._node);

                    var _width = this._node.clientWidth;
                    var _height = this._node.clientHeight;


                    var xy = this.getScreentPoint();

                    var left = xy.x + this._offset;
                    var top = xy.y + this._offset;

                    //alert(left + "," + _width + "," + xy.x);
                    if (_width + left > this._map.width) {

                        left = xy.x - _width - this._offset;
                    }

                    if (_height + top > this._map.height) {
                        top = xy.y - _height - this._offset;
                    }

                    domStyle.set(this._node, {
                        left: left + "px",
                        top: top + "px",
                        position: "absolute",
                        zIndex: "2"
                    });
                },
                clear: function () {
                    domConstruct.destroy(this._node);
                }
            });
        });  