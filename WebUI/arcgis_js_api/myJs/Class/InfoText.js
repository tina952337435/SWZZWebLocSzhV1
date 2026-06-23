/***********
带关闭图标的textsymbol,new InfoText(map, mappoint, null, text, 0, "bottom-right", true);
参数:map:地图对象,mappoint:标点位置,attr:数据,text:显示文本,visiblelevel:显示的最小层级>visiblelevel显示,showClose是否显示关闭按钮
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
        "dojo/domReady!"], function (declare, Graphic,Geometry, Point, Extent, on, lang,Evented, dom, domStyle, domConstruct,domUtils, screenUtils) {
            return declare([Evented], {
                _isShow:true,
                _text: null,
                _node:null,
                _map: null,
                _attr: null,
                _mapPoint: null,
                _layer: null,
                _text: null,
                _class:null,
                _width:null,
                _height:null,
                _offsetX:null,
                _offsetY:null,
                _offset:8,
                _eventhandler:null,//事件
                _closeImg:null,
                _place:"top",
                _level:0,
                _ShowCloseButton:true,
                constructor: function (map,mappoint,attr,text,visiblelevel,place,showClose) {
                    this._map = map;
                    this._text = text;
                    this._attr = attr;
                    this._mapPoint = mappoint;
                    this._text=text;
                    if(visiblelevel>0)
                    {
                        this._level=visiblelevel;
                    }
                    if(place!="" && place!=null)
                    {
                        this._place=place;
                    }
                    if(map.getLevel()>=visiblelevel)
                    {
                        this._isShow=true;
                    }
                    else
                    {
                        this._isShow=false;
                    }

                    this._class="InfoText";
                    var spanRight="0px";
                    if(showClose)
                    {
                        this._ShowCloseButton=showClose;
                        spanRight="25px";
                    }

                    if(text.toString().indexOf("</")>-1)
                    {
                        this._node=text;
                    }
                    else
                    {
                        text = text.replace(/\n/g,"<br/>");
                        this._node = domConstruct.toDom("<div class='"+ this._class+"'></div>");

                        domConstruct.create("span", {
                            innerHTML: text,
                            style: {
                                marginRight:spanRight,
                                marginLeft: "5px"
                            }
                        }, this._node);
                    }
                    
                    if(this._ShowCloseButton)
                    {
                      this._closeImg=domConstruct.create("img", {
                          src: "/arcgis_js_api/myJs/images/close.png",
                            style: {
                                position:"absolute",
                                top:"4px",
                                right:"3px",
                                cursor:"pointer"
                            }
                        }, this._node);
                    }
                    this.init();
                },
                init: function () {
                    if (this._map && this._mapPoint ) {
                        this.drawText();
                        this._onEvent();
                    }
                },
                _onEvent: function () {
                    on(this._map, "pan", lang.hitch(this, this._panEvent));
                    on(this._map, "zoom-start", lang.hitch(this, this._zoomStartEvent));
                    on(this._map, "zoom-end", lang.hitch(this, this._zoomEvent));
                    //on(this._map, "zoom", lang.hitch(this, this._zoomEvent));
                },
                _panEvent: function (e) {
                    this.panchangeText(e);
                },
                _zoomStartEvent: function (e) {
                    this._hide();
                },
                _zoomEvent: function (e) {
                    this.zoomchangeText(e);
                    //alert(this._map.getLevel().toString());
                    if(this._map.getLevel()>=this._level)
                    {
                        this._show();
                    }
                },
                hide:function()
                {
                    this._isShow=false;
                    this._hide();
                },
                _hide: function () {
                    domUtils.hide(this._node);
                },
                 show:function ()
                {
                    this._isShow=true;
                    this._show();
                },
                _show: function () {
                    if(this._isShow)
                    {
                        domUtils.show(this._node);
                    }
                },
                getScreentPoint: function () {
                    var screenPoint;
                    if (this._mapPoint) {
                        screenPoint = screenUtils.toScreenPoint(this._map.extent,
                        this._map.width,
                        this._map.height,
                        this._mapPoint);
                    }
                    return screenPoint;
                },
                drawText: function () {
                    var ss = this._map.container;//this._layer.getNode();//dom.byId(this._gl.id);
                    ss.appendChild(this._node);
                    
                    var xy = this.getScreentPoint();
                    
                    this._width=this._node.offsetWidth;
                    this._height=this._node.offsetHeight;

                    this.setOffset();

                    domStyle.set(this._node, {
                        left: xy.x+this._offsetX + "px",
                        top: xy.y+this._offsetY+ "px",
                        position: "absolute",
                        zIndex: "1"
                    });
                    if(this._map.getLevel()<this._level)
                    {
                        this._hide();
                    }
                },
                setOffset:function()
                {
                    if(this._place=="top"){
                        this._offsetX=0-this._width/2;
                        this._offsetY=0-this._height-this._offset;
                    }
                    else if(this._place=="bottom"){
                        this._offsetX=0-this._width/2;
                        this._offsetY=this._offset;
                    }
                    else if(this._place=="left"){
                        this._offsetX=0-this._width-this._offset;
                        this._offsetY=0-this._height/2;
                    }
                    else if(this._place=="right"){ 
                        this._offsetX=this._offset;
                        this._offsetY=0-this._height/2;
                    }
                    else if(this._place=="top_left"){
                        this._offsetX=0-this._width-this._offset;
                        this._offsetY=0-this._height-this._offset;
                    }
                    else if(this._place=="top_right"){
                        this._offsetX=this._offset;
                        this._offsetY=0-this._height-this._offset;
                    }
                    else if(this._place=="bottom_left"){
                        this._offsetX=0-this._width-this._offset;
                        this._offsetY=this._offset;
                    }
                    else if(this._place=="bottom_right"){
                        this._offsetX=this._offset;
                        this._offsetY=this._offset;
                    }
                },
                panchangeText:function(e){
                    var dx=e.delta.x;
                    var dy=e.delta.y;
                    var dd =this.getScreentPoint();
                    domStyle.set(this._node, {
                          left: dd.x+dx+this._offsetX+"px",
                          top: dd.y+dy+this._offsetY+"px",
                      });
                },
                zoomchangeText: function (e) {
                    var dx = e.anchor.x;
                    var dy = e.anchor.y;
                    var dd =this.getScreentPoint();
                    domStyle.set(this._node, {
                      left: dd.x+this._offsetX+"px",
                      top: dd.y+this._offsetY+"px",
                    });
                },
                clear:function(){
                    domConstruct.destroy(this._node);
                },
                addEvent:function(a,b){
                    this._eventhandler=b;
                    on(this._closeImg,a,lang.hitch(this, this.EventHandler));
                },
                EventHandler:function(e){
                    var option={
                         mapPoint:this._mapPoint,
			             attr:this._attr
		            };
                    this._eventhandler(option);
                },
                startup:function()
                {}
            });
        });  