var param = {
	url : window.location,
	type : '6',
	count : '',
	/** 是否显示分享数，1显示(可选) */
	appkey : '',
	/** 您申请的应用appkey,显示分享来源(可选) */
	title : '',
	/** 分享的文字内容(可选，默认为所在页面的title) */
	pic : '',
	/** 分享图片的路径(可选) */
	ralateUid : '',
	/** 关联用户的UID，分享微博会@该用户(可选) */
	language : 'zh_cn',
	/** 设置语言，zh_cn|zh_tw(可选) */
	rnd : new Date().valueOf()
};

function share(params) {
	var temp = [];
	for ( var p in params) {
		temp.push(p + '=' + encodeURIComponent(param[p] || ''));
	}
	window.open('http://v.t.sina.com.cn/share/share.php?' + temp.join('&'));
}

//打印
function doprint(){
	bdhtml=$("#maincontent").html(); 
	sprnstr="<!--startimage-->"; 
	eprnstr="<!--endimage-->"; 
	prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+17);
	prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));
	
	sprnstr="<!--starttext-->"; 
	eprnstr="<!--endtext-->"; 
	prnhtmlt=bdhtml.substr(bdhtml.indexOf(sprnstr)+16);
	prnhtmlt=prnhtmlt.substring(0,prnhtmlt.indexOf(eprnstr));
	window.document.body.innerHTML=prnhtml+prnhtmlt;
	window.print();
	window.location.href=window.location.href;
}

function hightlight(){
	$('#text p').hover(function(){
		$(this).find("a").each(function(){
			this.onclick = function(){return true;}
			this.style.color = "#3e9ce2";
			this.style.cursor = "pointer";
			});
	},function(){
		$(this).find("a").each(function(){
		this.onclick = function(){return false;}
		this.style.color = "#000000";
		this.style.cursor = "text";
		});
	});
}

$(function(){
	// 工具栏功能
	// 当前播放图片索引
	var currentPlayIndex = 0;
	var total = $('#mycarousel li').length;
	var timeInterval = 1000;
	var timer=null;
	$('#mycarousel li').click(function(){
	     var $this = $(this);
	    $('#YTImg').attr('src', $this.find('img').attr('data-original').replace('small','medium'));
		$this.find('.img').addClass('actived').parent().siblings().find('.img').removeClass('actived');		
		var index = $this.index('#mycarousel li');
		var $fff = $('#fff-list > ul > li').eq(index);
		$('#fff').text($fff.text());
		$fff.find('>a').addClass('actived').parent().siblings().find('>a').removeClass('actived');
		
		currentPlayIndex = $this.index('#mycarousel li');
		
		if(data[data_index[currentPlayIndex]].html_path.length > 0){
			$('#text').load(ctx + '/fetch?contentUrl=' + data[data_index[currentPlayIndex]].html_path,function(){
				hightlight();
			});
		}
		$('#plist')[0].selectedIndex = currentPlayIndex;
	});
	
	$('#plist').change(function(){
		var $this = $(this);
		var selectedIndex = $this.find(':selected').index();
		$('#mycarousel li').eq(selectedIndex).trigger('click');
	});
	
	$('#fff-list').mouseover (function(){
		var $this = $(this);
		$this.find('ul').show();
	});
	$('#fff-list > ul').hover(function(){
	},function(){
		var $this = $(this);
		$this.hide();
	});
	$('#fff-list > ul > li').click(function(){
		var $this = $(this);
		var index = $this.index('#fff-list > ul > li');
		$('#mycarousel li').eq(index).trigger('click');
		$('#fff').text($this.text());
		$this.find('>a').addClass('actived').parent().siblings().find('>a').removeClass('actived');
	});
	
	$('.playinter').change(function(){
		var val = $(this).val();
		timeInterval = parseInt(val) * 1000;
		$('.playinter').val(val);
		if(timer != null) {
			clearInterval(timer);
			timer = null;
			$('.play').text('播放');
		}
	});
	
	// 上一张
	function pre(){
		currentPlayIndex = (currentPlayIndex - 1) < 0 ? (total - 1) : (currentPlayIndex - 1);
		$('#mycarousel li').eq(currentPlayIndex).trigger('click');
	}
	// 下一张
	function next(){
		currentPlayIndex = (currentPlayIndex + 1) > (total - 1) ? 0 : (currentPlayIndex + 1);
		$('#mycarousel li').eq(currentPlayIndex).trigger('click');
	}
	$('.firstpic').click(function(){
		$('#mycarousel li:first').trigger('click');
	});
	$('.lastpic').click(function(){
		$('#mycarousel li:last').trigger('click');
	});
	$('#left-arrow,.prepic').click(function(){
		if(playMode == 1){
			next();
		} else {
			pre();
		}
	});
	$('#right-arrow,.nextpic').click(function(){
		if(playMode == 1){
			pre();
		} else {
			next();
		}
	});
	$('.play').click(function(){
		if(timer != null) {
			clearInterval(timer);
			timer = null;
			$('.play').text('播放');
		} else {
			$('.play').text('暂停');
			timer = setInterval(function(){
				if(playMode == 1){
					pre();
				} else {
					next();
				}
			},timeInterval);
		}
	});
	
	$('#tplay').click(function(){
		if(timer != null) {
			clearInterval(timer);
			timer = null;
			$('#tplay').attr('title','播放').removeClass('tstop').addClass('tplay');
		} else {
			$('#tplay').attr('title','暂停').removeClass('tplay').addClass('tstop');
			timer = setInterval(function(){
				if(playMode == 1){
					pre();
				} else {
					next();
				}
			},timeInterval);
		}
	});
	
	$(".share").click(function(){
		var title = document.title;
		$("#text p").each(function(k,v){
			if($(this).text().length > 0){
				title = $(this).text();
				return false;
			}
		});
		param.title = title;
		var pic = $("#YTImg").attr('src');
		if(typeof pic != 'undefined' && pic.length > 0){
			param.pic = pic;
		}
		share(param);
	});
	
	// 打印
	$('.print').click(function(){
		doprint();
	});
	
	$('#left-arrow').hover(function(){
		$(this).addClass('leftarrow');
	},function(){
		$(this).removeClass('leftarrow');
	});
	$('#right-arrow').hover(function(){
		$(this).addClass('rightarrow');
	},function(){
		$(this).removeClass('rightarrow');
	});
	
       
       // 当前位置导航二级产品菜单显隐
       $('.navigation > div').hover(function(){
			 var $this = $(this);
			 $this.addClass('actived').find(' > ul').show();
			 $this.siblings().find(' > ul').hide();
		 },function(){
			 var $this = $(this);
			 $this.removeClass('actived').find(' > ul').hide();
		 });
});/*! jQuery UI - v1.9.2 - 2015-01-22
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.slider.js
* Copyright 2015 jQuery Foundation and other contributors; Licensed MIT */

(function(e,t){function i(t,i){var n,a,o,r=t.nodeName.toLowerCase();return"area"===r?(n=t.parentNode,a=n.name,t.href&&a&&"map"===n.nodeName.toLowerCase()?(o=e("img[usemap=#"+a+"]")[0],!!o&&s(o)):!1):(/input|select|textarea|button|object/.test(r)?!t.disabled:"a"===r?t.href||i:i)&&s(t)}function s(t){return e.expr.filters.visible(t)&&!e(t).parents().andSelf().filter(function(){return"hidden"===e.css(this,"visibility")}).length}var n=0,a=/^ui-id-\d+$/;e.ui=e.ui||{},e.ui.version||(e.extend(e.ui,{version:"1.9.2",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({_focus:e.fn.focus,focus:function(t,i){return"number"==typeof t?this.each(function(){var s=this;setTimeout(function(){e(s).focus(),i&&i.call(s)},t)}):this._focus.apply(this,arguments)},scrollParent:function(){var t;return t=e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t},zIndex:function(i){if(i!==t)return this.css("zIndex",i);if(this.length)for(var s,n,a=e(this[0]);a.length&&a[0]!==document;){if(s=a.css("position"),("absolute"===s||"relative"===s||"fixed"===s)&&(n=parseInt(a.css("zIndex"),10),!isNaN(n)&&0!==n))return n;a=a.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++n)})},removeUniqueId:function(){return this.each(function(){a.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,s){return!!e.data(t,s[3])},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var s=e.attr(t,"tabindex"),n=isNaN(s);return(n||s>=0)&&i(t,!n)}}),e(function(){var t=document.body,i=t.appendChild(i=document.createElement("div"));i.offsetHeight,e.extend(i.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0}),e.support.minHeight=100===i.offsetHeight,e.support.selectstart="onselectstart"in i,t.removeChild(i).style.display="none"}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(i,s){function n(t,i,s,n){return e.each(a,function(){i-=parseFloat(e.css(t,"padding"+this))||0,s&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),n&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var a="Width"===s?["Left","Right"]:["Top","Bottom"],o=s.toLowerCase(),r={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+s]=function(i){return i===t?r["inner"+s].call(this):this.each(function(){e(this).css(o,n(this,i)+"px")})},e.fn["outer"+s]=function(t,i){return"number"!=typeof t?r["outer"+s].call(this,t):this.each(function(){e(this).css(o,n(this,t,!0,i)+"px")})}}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),function(){var t=/msie ([\w.]+)/.exec(navigator.userAgent.toLowerCase())||[];e.ui.ie=t.length?!0:!1,e.ui.ie6=6===parseFloat(t[1],10)}(),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.extend(e.ui,{plugin:{add:function(t,i,s){var n,a=e.ui[t].prototype;for(n in s)a.plugins[n]=a.plugins[n]||[],a.plugins[n].push([i,s[n]])},call:function(e,t,i){var s,n=e.plugins[t];if(n&&e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType)for(s=0;n.length>s;s++)e.options[n[s][0]]&&n[s][1].apply(e.element,i)}},contains:e.contains,hasScroll:function(t,i){if("hidden"===e(t).css("overflow"))return!1;var s=i&&"left"===i?"scrollLeft":"scrollTop",n=!1;return t[s]>0?!0:(t[s]=1,n=t[s]>0,t[s]=0,n)},isOverAxis:function(e,t,i){return e>t&&t+i>e},isOver:function(t,i,s,n,a,o){return e.ui.isOverAxis(t,s,a)&&e.ui.isOverAxis(i,n,o)}}))})(jQuery);(function(e,t){var i=0,s=Array.prototype.slice,n=e.cleanData;e.cleanData=function(t){for(var i,s=0;null!=(i=t[s]);s++)try{e(i).triggerHandler("remove")}catch(a){}n(t)},e.widget=function(i,s,n){var a,o,r,h,l=i.split(".")[0];i=i.split(".")[1],a=l+"-"+i,n||(n=s,s=e.Widget),e.expr[":"][a.toLowerCase()]=function(t){return!!e.data(t,a)},e[l]=e[l]||{},o=e[l][i],r=e[l][i]=function(e,i){return this._createWidget?(arguments.length&&this._createWidget(e,i),t):new r(e,i)},e.extend(r,o,{version:n.version,_proto:e.extend({},n),_childConstructors:[]}),h=new s,h.options=e.widget.extend({},h.options),e.each(n,function(t,i){e.isFunction(i)&&(n[t]=function(){var e=function(){return s.prototype[t].apply(this,arguments)},n=function(e){return s.prototype[t].apply(this,e)};return function(){var t,s=this._super,a=this._superApply;return this._super=e,this._superApply=n,t=i.apply(this,arguments),this._super=s,this._superApply=a,t}}())}),r.prototype=e.widget.extend(h,{widgetEventPrefix:o?h.widgetEventPrefix:i},n,{constructor:r,namespace:l,widgetName:i,widgetBaseClass:a,widgetFullName:a}),o?(e.each(o._childConstructors,function(t,i){var s=i.prototype;e.widget(s.namespace+"."+s.widgetName,r,i._proto)}),delete o._childConstructors):s._childConstructors.push(r),e.widget.bridge(i,r)},e.widget.extend=function(i){for(var n,a,o=s.call(arguments,1),r=0,h=o.length;h>r;r++)for(n in o[r])a=o[r][n],o[r].hasOwnProperty(n)&&a!==t&&(i[n]=e.isPlainObject(a)?e.isPlainObject(i[n])?e.widget.extend({},i[n],a):e.widget.extend({},a):a);return i},e.widget.bridge=function(i,n){var a=n.prototype.widgetFullName||i;e.fn[i]=function(o){var r="string"==typeof o,h=s.call(arguments,1),l=this;return o=!r&&h.length?e.widget.extend.apply(null,[o].concat(h)):o,r?this.each(function(){var s,n=e.data(this,a);return n?e.isFunction(n[o])&&"_"!==o.charAt(0)?(s=n[o].apply(n,h),s!==n&&s!==t?(l=s&&s.jquery?l.pushStack(s.get()):s,!1):t):e.error("no such method '"+o+"' for "+i+" widget instance"):e.error("cannot call methods on "+i+" prior to initialization; "+"attempted to call method '"+o+"'")}):this.each(function(){var t=e.data(this,a);t?t.option(o||{})._init():e.data(this,a,new n(o,this))}),l}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,s){s=e(s||this.defaultElement||this)[0],this.element=e(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this.bindings=e(),this.hoverable=e(),this.focusable=e(),s!==this&&(e.data(s,this.widgetName,this),e.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===s&&this.destroy()}}),this.document=e(s.style?s.ownerDocument:s.document||s),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(i,s){var n,a,o,r=i;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof i)if(r={},n=i.split("."),i=n.shift(),n.length){for(a=r[i]=e.widget.extend({},this.options[i]),o=0;n.length-1>o;o++)a[n[o]]=a[n[o]]||{},a=a[n[o]];if(i=n.pop(),s===t)return a[i]===t?null:a[i];a[i]=s}else{if(s===t)return this.options[i]===t?null:this.options[i];r[i]=s}return this._setOptions(r),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!t).attr("aria-disabled",t),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(i,s,n){var a,o=this;"boolean"!=typeof i&&(n=s,s=i,i=!1),n?(s=a=e(s),this.bindings=this.bindings.add(s)):(n=s,s=this.element,a=this.widget()),e.each(n,function(n,r){function h(){return i||o.options.disabled!==!0&&!e(this).hasClass("ui-state-disabled")?("string"==typeof r?o[r]:r).apply(o,arguments):t}"string"!=typeof r&&(h.guid=r.guid=r.guid||h.guid||e.guid++);var l=n.match(/^(\w+)\s*(.*)$/),u=l[1]+o.eventNamespace,c=l[2];c?a.delegate(c,u,h):s.bind(u,h)})},_off:function(e,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(t).undelegate(t)},_delay:function(e,t){function i(){return("string"==typeof e?s[e]:e).apply(s,arguments)}var s=this;return setTimeout(i,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,s){var n,a,o=this.options[t];if(s=s||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],a=i.originalEvent)for(n in a)n in i||(i[n]=a[n]);return this.element.trigger(i,s),!(e.isFunction(o)&&o.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,i){e.Widget.prototype["_"+t]=function(s,n,a){"string"==typeof n&&(n={effect:n});var o,r=n?n===!0||"number"==typeof n?i:n.effect||i:t;n=n||{},"number"==typeof n&&(n={duration:n}),o=!e.isEmptyObject(n),n.complete=a,n.delay&&s.delay(n.delay),o&&e.effects&&(e.effects.effect[r]||e.uiBackCompat!==!1&&e.effects[r])?s[t](n):r!==t&&s[r]?s[r](n.duration,n.easing,a):s.queue(function(i){e(this)[t](),a&&a.call(s[0]),i()})}}),e.uiBackCompat!==!1&&(e.Widget.prototype._getCreateOptions=function(){return e.metadata&&e.metadata.get(this.element[0])[this.widgetName]})})(jQuery);(function(e){var t=!1;e(document).mouseup(function(){t=!1}),e.widget("ui.mouse",{version:"1.9.2",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var t=this;this.element.bind("mousedown."+this.widgetName,function(e){return t._mouseDown(e)}).bind("click."+this.widgetName,function(i){return!0===e.data(i.target,t.widgetName+".preventClickEvent")?(e.removeData(i.target,t.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):undefined}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(i){if(!t){this._mouseStarted&&this._mouseUp(i),this._mouseDownEvent=i;var s=this,n=1===i.which,a="string"==typeof this.options.cancel&&i.target.nodeName?e(i.target).closest(this.options.cancel).length:!1;return n&&!a&&this._mouseCapture(i)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){s.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(i)&&this._mouseDelayMet(i)&&(this._mouseStarted=this._mouseStart(i)!==!1,!this._mouseStarted)?(i.preventDefault(),!0):(!0===e.data(i.target,this.widgetName+".preventClickEvent")&&e.removeData(i.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(e){return s._mouseMove(e)},this._mouseUpDelegate=function(e){return s._mouseUp(e)},e(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),i.preventDefault(),t=!0,!0)):!0}},_mouseMove:function(t){return!e.ui.ie||document.documentMode>=9||t.button?this._mouseStarted?(this._mouseDrag(t),t.preventDefault()):(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,t)!==!1,this._mouseStarted?this._mouseDrag(t):this._mouseUp(t)),!this._mouseStarted):this._mouseUp(t)},_mouseUp:function(t){return e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,t.target===this._mouseDownEvent.target&&e.data(t.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(t)),!1},_mouseDistanceMet:function(e){return Math.max(Math.abs(this._mouseDownEvent.pageX-e.pageX),Math.abs(this._mouseDownEvent.pageY-e.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}})})(jQuery);(function(e){var t=5;e.widget("ui.slider",e.ui.mouse,{version:"1.9.2",widgetEventPrefix:"slide",options:{animate:!1,distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null},_create:function(){var i,s,n=this.options,a=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),o="<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",r=[];for(this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget"+" ui-widget-content"+" ui-corner-all"+(n.disabled?" ui-slider-disabled ui-disabled":"")),this.range=e([]),n.range&&(n.range===!0&&(n.values||(n.values=[this._valueMin(),this._valueMin()]),n.values.length&&2!==n.values.length&&(n.values=[n.values[0],n.values[0]])),this.range=e("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header"+("min"===n.range||"max"===n.range?" ui-slider-range-"+n.range:""))),s=n.values&&n.values.length||1,i=a.length;s>i;i++)r.push(o);this.handles=a.add(e(r.join("")).appendTo(this.element)),this.handle=this.handles.eq(0),this.handles.add(this.range).filter("a").click(function(e){e.preventDefault()}).mouseenter(function(){n.disabled||e(this).addClass("ui-state-hover")}).mouseleave(function(){e(this).removeClass("ui-state-hover")}).focus(function(){n.disabled?e(this).blur():(e(".ui-slider .ui-state-focus").removeClass("ui-state-focus"),e(this).addClass("ui-state-focus"))}).blur(function(){e(this).removeClass("ui-state-focus")}),this.handles.each(function(t){e(this).data("ui-slider-handle-index",t)}),this._on(this.handles,{keydown:function(i){var s,n,a,o,r=e(i.target).data("ui-slider-handle-index");switch(i.keyCode){case e.ui.keyCode.HOME:case e.ui.keyCode.END:case e.ui.keyCode.PAGE_UP:case e.ui.keyCode.PAGE_DOWN:case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:if(i.preventDefault(),!this._keySliding&&(this._keySliding=!0,e(i.target).addClass("ui-state-active"),s=this._start(i,r),s===!1))return}switch(o=this.options.step,n=a=this.options.values&&this.options.values.length?this.values(r):this.value(),i.keyCode){case e.ui.keyCode.HOME:a=this._valueMin();break;case e.ui.keyCode.END:a=this._valueMax();break;case e.ui.keyCode.PAGE_UP:a=this._trimAlignValue(n+(this._valueMax()-this._valueMin())/t);break;case e.ui.keyCode.PAGE_DOWN:a=this._trimAlignValue(n-(this._valueMax()-this._valueMin())/t);break;case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:if(n===this._valueMax())return;a=this._trimAlignValue(n+o);break;case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:if(n===this._valueMin())return;a=this._trimAlignValue(n-o)}this._slide(i,r,a)},keyup:function(t){var i=e(t.target).data("ui-slider-handle-index");this._keySliding&&(this._keySliding=!1,this._stop(t,i),this._change(t,i),e(t.target).removeClass("ui-state-active"))}}),this._refreshValue(),this._animateOff=!1},_destroy:function(){this.handles.remove(),this.range.remove(),this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all"),this._mouseDestroy()},_mouseCapture:function(t){var i,s,n,a,o,r,h,l,u=this,c=this.options;return c.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),i={x:t.pageX,y:t.pageY},s=this._normValueFromMouse(i),n=this._valueMax()-this._valueMin()+1,this.handles.each(function(t){var i=Math.abs(s-u.values(t));n>i&&(n=i,a=e(this),o=t)}),c.range===!0&&this.values(1)===c.min&&(o+=1,a=e(this.handles[o])),r=this._start(t,o),r===!1?!1:(this._mouseSliding=!0,this._handleIndex=o,a.addClass("ui-state-active").focus(),h=a.offset(),l=!e(t.target).parents().andSelf().is(".ui-slider-handle"),this._clickOffset=l?{left:0,top:0}:{left:t.pageX-h.left-a.width()/2,top:t.pageY-h.top-a.height()/2-(parseInt(a.css("borderTopWidth"),10)||0)-(parseInt(a.css("borderBottomWidth"),10)||0)+(parseInt(a.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(t,o,s),this._animateOff=!0,!0))},_mouseStart:function(){return!0},_mouseDrag:function(e){var t={x:e.pageX,y:e.pageY},i=this._normValueFromMouse(t);return this._slide(e,this._handleIndex,i),!1},_mouseStop:function(e){return this.handles.removeClass("ui-state-active"),this._mouseSliding=!1,this._stop(e,this._handleIndex),this._change(e,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation="vertical"===this.options.orientation?"vertical":"horizontal"},_normValueFromMouse:function(e){var t,i,s,n,a;return"horizontal"===this.orientation?(t=this.elementSize.width,i=e.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(t=this.elementSize.height,i=e.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),s=i/t,s>1&&(s=1),0>s&&(s=0),"vertical"===this.orientation&&(s=1-s),n=this._valueMax()-this._valueMin(),a=this._valueMin()+s*n,this._trimAlignValue(a)},_start:function(e,t){var i={handle:this.handles[t],value:this.value()};return this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._trigger("start",e,i)},_slide:function(e,t,i){var s,n,a;this.options.values&&this.options.values.length?(s=this.values(t?0:1),2===this.options.values.length&&this.options.range===!0&&(0===t&&i>s||1===t&&s>i)&&(i=s),i!==this.values(t)&&(n=this.values(),n[t]=i,a=this._trigger("slide",e,{handle:this.handles[t],value:i,values:n}),s=this.values(t?0:1),a!==!1&&this.values(t,i,!0))):i!==this.value()&&(a=this._trigger("slide",e,{handle:this.handles[t],value:i}),a!==!1&&this.value(i))},_stop:function(e,t){var i={handle:this.handles[t],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._trigger("stop",e,i)},_change:function(e,t){if(!this._keySliding&&!this._mouseSliding){var i={handle:this.handles[t],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._trigger("change",e,i)}},value:function(e){return arguments.length?(this.options.value=this._trimAlignValue(e),this._refreshValue(),this._change(null,0),undefined):this._value()},values:function(t,i){var s,n,a;if(arguments.length>1)return this.options.values[t]=this._trimAlignValue(i),this._refreshValue(),this._change(null,t),undefined;if(!arguments.length)return this._values();if(!e.isArray(arguments[0]))return this.options.values&&this.options.values.length?this._values(t):this.value();for(s=this.options.values,n=arguments[0],a=0;s.length>a;a+=1)s[a]=this._trimAlignValue(n[a]),this._change(null,a);this._refreshValue()},_setOption:function(t,i){var s,n=0;switch(e.isArray(this.options.values)&&(n=this.options.values.length),e.Widget.prototype._setOption.apply(this,arguments),t){case"disabled":i?(this.handles.filter(".ui-state-focus").blur(),this.handles.removeClass("ui-state-hover"),this.handles.prop("disabled",!0),this.element.addClass("ui-disabled")):(this.handles.prop("disabled",!1),this.element.removeClass("ui-disabled"));break;case"orientation":this._detectOrientation(),this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation),this._refreshValue();break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":for(this._animateOff=!0,this._refreshValue(),s=0;n>s;s+=1)this._change(null,s);this._animateOff=!1;break;case"min":case"max":this._animateOff=!0,this._refreshValue(),this._animateOff=!1}},_value:function(){var e=this.options.value;return e=this._trimAlignValue(e)},_values:function(e){var t,i,s;if(arguments.length)return t=this.options.values[e],t=this._trimAlignValue(t);for(i=this.options.values.slice(),s=0;i.length>s;s+=1)i[s]=this._trimAlignValue(i[s]);return i},_trimAlignValue:function(e){if(this._valueMin()>=e)return this._valueMin();if(e>=this._valueMax())return this._valueMax();var t=this.options.step>0?this.options.step:1,i=(e-this._valueMin())%t,s=e-i;return 2*Math.abs(i)>=t&&(s+=i>0?t:-t),parseFloat(s.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},_refreshValue:function(){var t,i,s,n,a,o=this.options.range,r=this.options,h=this,l=this._animateOff?!1:r.animate,u={};this.options.values&&this.options.values.length?this.handles.each(function(s){i=100*((h.values(s)-h._valueMin())/(h._valueMax()-h._valueMin())),u["horizontal"===h.orientation?"left":"bottom"]=i+"%",e(this).stop(1,1)[l?"animate":"css"](u,r.animate),h.options.range===!0&&("horizontal"===h.orientation?(0===s&&h.range.stop(1,1)[l?"animate":"css"]({left:i+"%"},r.animate),1===s&&h.range[l?"animate":"css"]({width:i-t+"%"},{queue:!1,duration:r.animate})):(0===s&&h.range.stop(1,1)[l?"animate":"css"]({bottom:i+"%"},r.animate),1===s&&h.range[l?"animate":"css"]({height:i-t+"%"},{queue:!1,duration:r.animate}))),t=i}):(s=this.value(),n=this._valueMin(),a=this._valueMax(),i=a!==n?100*((s-n)/(a-n)):0,u["horizontal"===this.orientation?"left":"bottom"]=i+"%",this.handle.stop(1,1)[l?"animate":"css"](u,r.animate),"min"===o&&"horizontal"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({width:i+"%"},r.animate),"max"===o&&"horizontal"===this.orientation&&this.range[l?"animate":"css"]({width:100-i+"%"},{queue:!1,duration:r.animate}),"min"===o&&"vertical"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({height:i+"%"},r.animate),"max"===o&&"vertical"===this.orientation&&this.range[l?"animate":"css"]({height:100-i+"%"},{queue:!1,duration:r.animate}))}})})(jQuery);/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */
(function(d){function e(a){var b=a||window.event,c=[].slice.call(arguments,1),f=0,e=0,g=0,a=d.event.fix(b);a.type="mousewheel";b.wheelDelta&&(f=b.wheelDelta/120);b.detail&&(f=-b.detail/3);g=f;b.axis!==void 0&&b.axis===b.HORIZONTAL_AXIS&&(g=0,e=-1*f);b.wheelDeltaY!==void 0&&(g=b.wheelDeltaY/120);b.wheelDeltaX!==void 0&&(e=-1*b.wheelDeltaX/120);c.unshift(a,f,e,g);return(d.event.dispatch||d.event.handle).apply(this,c)}var c=["DOMMouseScroll","mousewheel"];if(d.event.fixHooks)for(var h=c.length;h;)d.event.fixHooks[c[--h]]=
d.event.mouseHooks;d.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=c.length;a;)this.addEventListener(c[--a],e,false);else this.onmousewheel=e},teardown:function(){if(this.removeEventListener)for(var a=c.length;a;)this.removeEventListener(c[--a],e,false);else this.onmousewheel=null}};d.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery);/*
 * iviewer Widget for jQuery UI
 * https://github.com/can3p/iviewer
 *
 * Copyright (c) 2009 - 2012 Dmitry Petrov
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * Author: Dmitry Petrov
 * Version: 0.7.1
 */

( function( $, undefined ) {

//this code was taken from the https://github.com/furf/jquery-ui-touch-punch
var mouseEvents = {
    touchstart: 'mousedown',
    touchmove: 'mousemove',
    touchend: 'mouseup'
};

/**
 * Convert a touch event to a mouse-like
 */
function makeMouseEvent (event) {
    var touch = event.originalEvent.changedTouches[0];

    return $.extend(event, {
        type:    mouseEvents[event.type],
        which:   1,
        pageX:   touch.pageX,
        pageY:   touch.pageY,
        screenX: touch.screenX,
        screenY: touch.screenY,
        clientX: touch.clientX,
        clientY: touch.clientY,
        isTouchEvent: true
    });
}

var mouseProto = $.ui.mouse.prototype,
    _mouseInit = $.ui.mouse.prototype._mouseInit;

mouseProto._mouseInit = function() {
    var self = this;
    self._touchActive = false;

    this.element.bind( 'touchstart.' + this.widgetName, function(event) {
        self._touchActive = true;
        return self._mouseDown(makeMouseEvent(event));
    })

    var self = this;
    // these delegates are required to keep context
    this._mouseMoveDelegate = function(event) {
        if (self._touchActive) {
            return self._mouseMove(makeMouseEvent(event));
        }
    };
    this._mouseUpDelegate = function(event) {
        if (self._touchActive) {
            self._touchActive = false;
            return self._mouseUp(makeMouseEvent(event));
        }
    };

    $(document)
        .bind('touchmove.'+ this.widgetName, this._mouseMoveDelegate)
        .bind('touchend.' + this.widgetName, this._mouseUpDelegate);

    _mouseInit.apply(this);
}

/**
 * Simple implementation of jQuery like getters/setters
 * var val = something();
 * something(val);
 */
var setter = function(setter, getter) {
    return function(val) {
        if (arguments.length === 0) {
            return getter.apply(this);
        } else {
            setter.apply(this, arguments);
        }
    }
};

/**
 * Internet explorer rotates image relative left top corner, so we should
 * shift image when it's rotated.
 */
var ieTransforms = {
        '0': {
            marginLeft: 0,
            marginTop: 0,
            filter: 'progid:DXImageTransform.Microsoft.Matrix(M11=1, M12=0, M21=0, M22=1, SizingMethod="auto expand")'
        },

        '90': {
            marginLeft: -1,
            marginTop: 1,
            filter: 'progid:DXImageTransform.Microsoft.Matrix(M11=0, M12=-1, M21=1, M22=0, SizingMethod="auto expand")'
        },

        '180': {
            marginLeft: 0,
            marginTop: 0,
            filter: 'progid:DXImageTransform.Microsoft.Matrix(M11=-1, M12=0, M21=0, M22=-1, SizingMethod="auto expand")'
        },

        '270': {
            marginLeft: -1,
            marginTop: 1,
            filter: 'progid:DXImageTransform.Microsoft.Matrix(M11=0, M12=1, M21=-1, M22=0, SizingMethod="auto expand")'
        }
    },
//    useIeTransforms = (jQuery.browser.msie && parseInt(jQuery.browser.version, 10) <= 8);
    useIeTransforms = (/msie/.test(navigator.userAgent.toLowerCase()) && ('undefined' == typeof(document.body.style.maxHeight)));

$.widget( "ui.iviewer", $.ui.mouse, {
    widgetEventPrefix: "iviewer",
    options : {
        /**
        * start zoom value for image, not used now
        * may be equal to "fit" to fit image into container or scale in %
        **/
        zoom: "fit",
        /**
        * base value to scale image
        **/
        zoom_base: 100,
        /**
        * maximum zoom
        **/
        zoom_max: 800,
        /**
        * minimum zoom
        **/
        zoom_min: 25,
        /**
        * base of rate multiplier.
        * zoom is calculated by formula: zoom_base * zoom_delta^rate
        **/
        zoom_delta: 1.4,
        /**
        * whether the zoom should be animated.
        */
        zoom_animation: true,
        /**
        * if true plugin doesn't add its own controls
        **/
        ui_disabled: false,
        /**
         * If false mousewheel will be disabled
         */
        mousewheel: true,
        /**
        * if false, plugin doesn't bind resize event on window and this must
        * be handled manually
        **/
        update_on_resize: true,
        /**
        * event is triggered when zoom value is changed
        * @param int new zoom value
        * @return boolean if false zoom action is aborted
        **/
        onZoom: jQuery.noop,
        /**
        * event is triggered when zoom value is changed after image is set to the new dimensions
        * @param int new zoom value
        * @return boolean if false zoom action is aborted
        **/
        onAfterZoom: jQuery.noop,
        /**
        * event is fired on drag begin
        * @param object coords mouse coordinates on the image
        * @return boolean if false is returned, drag action is aborted
        **/
        onStartDrag: jQuery.noop,
        /**
        * event is fired on drag action
        * @param object coords mouse coordinates on the image
        **/
        onDrag: jQuery.noop,
        /**
        * event is fired on drag stop
        * @param object coords mouse coordinates on the image
        **/
        onStopDrag: jQuery.noop,
        /**
        * event is fired when mouse moves over image
        * @param object coords mouse coordinates on the image
        **/
        onMouseMove: jQuery.noop,
        /**
        * mouse click event
        * @param object coords mouse coordinates on the image
        **/
        onClick: jQuery.noop,
        /**
        * event is fired when image starts to load
        */
        onStartLoad: null,
        /**
        * event is fired, when image is loaded and initially positioned
        */
        onFinishLoad: null
    },

    _create: function() {
        var me = this;

        //drag variables
        this.dx = 0;
        this.dy = 0;

        /* object containing actual information about image
        *   @img_object.object - jquery img object
        *   @img_object.orig_{width|height} - original dimensions
        *   @img_object.display_{width|height} - actual dimensions
        */
        this.img_object = {};

        this.zoom_object = {}; //object to show zoom status

        this._angle = 0;

        this.current_zoom = this.options.zoom;

        if(this.options.src === null){
            return;
        }

        this.container = this.element;

        this._updateContainerInfo();

        //init container
        this.container.css("overflow","hidden");

        if(this.options.update_on_resize == true)
        {
            $(window).resize(function()
            {
                me._updateContainerInfo();
            });
        }

        this.img_object = new $.ui.iviewer.ImageObject(this.options.zoom_animation);

        if (this.options.mousewheel) {
            this.img_object.object()
                .mousewheel(function(ev, delta)
                {
                    //this event is there instead of containing div, because
                    //at opera it triggers many times on div
                    var zoom = (delta > 0)?1:-1;
                    me.zoom_by(zoom);
                    return false;
                });
        }

        //init object
        this.img_object.object()
            //bind mouse events
            .click(function(e){return me._click(e)})
                .prependTo(this.container);

        this.container.bind('mousemove', function(ev) { me._handleMouseMove(ev); });

        this.loadImage(this.options.src);

        if(!this.options.ui_disabled)
        {
            this.createui();
        }

        this._mouseInit();
    },

    destroy: function() {
        this._mouseDestroy();
    },

    _updateContainerInfo: function()
    {
        this.options.height = this.container.height();
        this.options.width = this.container.width();
    },

    loadImage: function( src )
    {
        this.current_zoom = this.options.zoom;
        var me = this;

        this._trigger('onStartLoad', 0, src);

        this.container.addClass("iviewer_loading");
        this.img_object.load(src, function() {
            me._imageLoaded(src);
            me.setCoords(view.left, view.top);
        });
    },

    _imageLoaded: function(src) {
        this.container.removeClass("iviewer_loading");
        this.container.addClass("iviewer_cursor");

//        if(this.options.zoom == "fit"){
//            this.fit(true);
//        }
//        else {
            this.set_zoom(view.zoom, true);
//        }

        this._trigger('onFinishLoad', 0, src);
    },

    /**
    * fits image in the container
    *
    * @param {boolean} skip_animation
    **/
    fit: function(skip_animation)
    {
        var aspect_ratio = this.img_object.orig_width() / this.img_object.orig_height();
        var window_ratio = this.options.width /  this.options.height;
        var choose_left = (aspect_ratio > window_ratio);
        var new_zoom = 0;

        if(choose_left){
            new_zoom = this.options.width / this.img_object.orig_width() * 100;
        }
        else {
            new_zoom = this.options.height / this.img_object.orig_height() * 100;
        }
      this.set_zoom(new_zoom, skip_animation);
    },

    /**
    * center image in container
    **/
    center: function()
    {
        this.setCoords(-Math.round((this.img_object.display_width() - this.options.width)/2),
                -Math.round((this.img_object.display_height() - this.options.height)/2));
    },

    /**
    *   move a point in container to the center of display area
    *   @param x a point in container
    *   @param y a point in container
    **/
    moveTo: function(x, y)
    {
        var dx = x-Math.round(this.options.width/2);
        var dy = y-Math.round(this.options.height/2);

        var new_x = this.img_object.x() - dx;
        var new_y = this.img_object.y() - dy;

        this.setCoords(new_x, new_y);
    },

    /**
     * Get container offset object.
     */
    getContainerOffset: function() {
        return jQuery.extend({}, this.container.offset());
    },

    /**
    * set coordinates of upper left corner of image object
    **/
    setCoords: function(x,y)
    {
        //do nothing while image is being loaded
        if(!this.img_object.loaded()) { return; }

        var coords = this._correctCoords(x,y);
        
        view.top = y;
        view.left = x;
        
        this.img_object.x(coords.x);
        this.img_object.y(coords.y);
    },

    _correctCoords: function( x, y )
    {
        x = parseInt(x, 10);
        y = parseInt(y, 10);

        //check new coordinates to be correct (to be in rect)
        if(y > 0){
            y = 0;
        }
        if(x > 0){
            x = 0;
        }
        if(y + this.img_object.display_height() < this.options.height){
            y = this.options.height - this.img_object.display_height();
        }
        if(x + this.img_object.display_width() < this.options.width){
            x = this.options.width - this.img_object.display_width();
        }
        if(this.img_object.display_width() <= this.options.width){
            x = -(this.img_object.display_width() - this.options.width)/2;
        }
        if(this.img_object.display_height() <= this.options.height){
            y = -(this.img_object.display_height() - this.options.height)/2;
        }

        return { x: x, y:y };
    },


    /**
    * convert coordinates on the container to the coordinates on the image (in original size)
    *
    * @return object with fields x,y according to coordinates or false
    * if initial coords are not inside image
    **/
    containerToImage : function (x,y)
    {
        var coords = { x : x - this.img_object.x(),
                 y :  y - this.img_object.y()
        };

        coords = this.img_object.toOriginalCoords(coords);

        return { x :  util.descaleValue(coords.x, this.current_zoom),
                 y :  util.descaleValue(coords.y, this.current_zoom)
        };
    },

    /**
    * convert coordinates on the image (in original size, and zero angle) to the coordinates on the container
    *
    * @return object with fields x,y according to coordinates
    **/
    imageToContainer : function (x,y)
    {
        var coords = {
                x : util.scaleValue(x, this.current_zoom),
                y : util.scaleValue(y, this.current_zoom)
            };

        return this.img_object.toRealCoords(coords);
    },

    /**
    * get mouse coordinates on the image
    * @param e - object containing pageX and pageY fields, e.g. mouse event object
    *
    * @return object with fields x,y according to coordinates or false
    * if initial coords are not inside image
    **/
    _getMouseCoords : function(e)
    {
        var containerOffset = this.container.offset();
            coords = this.containerToImage(e.pageX - containerOffset.left, e.pageY - containerOffset.top);

        return coords;
    },

    /**
    * set image scale to the new_zoom
    *
    * @param {number} new_zoom image scale in %
    * @param {boolean} skip_animation
    **/
    set_zoom: function(new_zoom, skip_animation)
    {
        if (this._trigger('onZoom', 0, new_zoom) == false) {
            return;
        }

        //do nothing while image is being loaded
        if(!this.img_object.loaded()) { return; }

        if(new_zoom <  this.options.zoom_min)
        {
            new_zoom = this.options.zoom_min;
        }
        else if(new_zoom > this.options.zoom_max)
        {
            new_zoom = this.options.zoom_max;
        }

        /* we fake these values to make fit zoom properly work */
        if(this.current_zoom == "fit")
        {
            var old_x = Math.round(this.options.width/2 + this.img_object.orig_width()/2);
            var old_y = Math.round(this.options.height/2 + this.img_object.orig_height()/2);
            this.current_zoom = 100;
        }
        else {
            var old_x = -this.img_object.x() + Math.round(this.options.width/2);
            var old_y = -this.img_object.y() + Math.round(this.options.height/2);
        }

        var new_width = util.scaleValue(this.img_object.orig_width(), new_zoom);
        var new_height = util.scaleValue(this.img_object.orig_height(), new_zoom);
        var new_x = util.scaleValue( util.descaleValue(old_x, this.current_zoom), new_zoom);
        var new_y = util.scaleValue( util.descaleValue(old_y, this.current_zoom), new_zoom);

        new_x = this.options.width/2 - new_x;
        new_y = this.options.height/2 - new_y;

        this.img_object.display_width(new_width);
        this.img_object.display_height(new_height);

        var coords = this._correctCoords( new_x, new_y ),
            self = this;

        this.img_object.setImageProps(new_width, new_height, coords.x, coords.y,
                                        skip_animation, function() {
            self._trigger('onAfterZoom', 0, new_zoom );
        });
        this.current_zoom = new_zoom;

        this.update_status();
        view.zoom = new_zoom;
    },

    /**
    * changes zoom scale by delta
    * zoom is calculated by formula: zoom_base * zoom_delta^rate
    * @param Integer delta number to add to the current multiplier rate number
    **/
    zoom_by: function(delta)
    {
        var closest_rate = this.find_closest_zoom_rate(this.current_zoom);

        var next_rate = closest_rate + delta;
        var next_zoom = this.options.zoom_base * Math.pow(this.options.zoom_delta, next_rate)
        if(delta > 0 && next_zoom < this.current_zoom)
        {
            next_zoom *= this.options.zoom_delta;
        }

        if(delta < 0 && next_zoom > this.current_zoom)
        {
            next_zoom /= this.options.zoom_delta;
        }

        this.set_zoom(next_zoom);
    },

    /**
    * Rotate image
    * @param {num} deg Degrees amount to rotate. Positive values rotate image clockwise.
    *     Currently 0, 90, 180, 270 and -90, -180, -270 values are supported
    *
    * @param {boolean} abs If the flag is true if, the deg parameter will be considered as
    *     a absolute value and relative otherwise.
    * @return {num|null} Method will return current image angle if called without any arguments.
    **/
    angle: function(deg, abs) {
        if (arguments.length === 0) { return this.img_object.angle(); }

        if (deg < -270 || deg > 270 || deg % 90 !== 0) { return; }
        if (!abs) { deg += this.img_object.angle(); }
        if (deg < 0) { deg += 360; }
        if (deg >= 360) { deg -= 360; }

        if (deg === this.img_object.angle()) { return; }

        this.img_object.angle(deg);
        //the rotate behavior is different in all editors. For now we  just center the
        //image. However, it will be better to try to keep the position.
        this.center();
        this._trigger('angle', 0, { angle: this.img_object.angle() });
    },

    /**
    * finds closest multiplier rate for value
    * basing on zoom_base and zoom_delta values from settings
    * @param Number value zoom value to examine
    **/
    find_closest_zoom_rate: function(value)
    {
        if(value == this.options.zoom_base)
        {
            return 0;
        }

        function div(val1,val2) { return val1 / val2 };
        function mul(val1,val2) { return val1 * val2 };

        var func = (value > this.options.zoom_base)?mul:div;
        var sgn = (value > this.options.zoom_base)?1:-1;

        var mltplr = this.options.zoom_delta;
        var rate = 1;

        while(Math.abs(func(this.options.zoom_base, Math.pow(mltplr,rate)) - value) >
              Math.abs(func(this.options.zoom_base, Math.pow(mltplr,rate+1)) - value))
        {
            rate++;
        }

        return sgn * rate;
    },

    /* update scale info in the container */
    update_status: function()
    {
        if(!this.options.ui_disabled)
        {
            var percent = Math.round(100*this.img_object.display_height()/this.img_object.orig_height());
            if(percent)
            {
                this.zoom_object.html(percent + "%");
            }
        }
    },

    /**
     * Get some information about the image.
     *     Currently orig_(width|height), display_(width|height), angle, zoom and src params are supported.
     *
     *  @param {string} parameter to check
     *  @param {boolean} withoutRotation if param is orig_width or orig_height and this flag is set to true,
     *      method will return original image width without considering rotation.
     *
     */
    info: function(param, withoutRotation) {
        if (!param) { return; }

        switch (param) {
            case 'orig_width':
            case 'orig_height':
                if (withoutRotation) {
                    return (this.img_object.angle() % 180 === 0 ? this.img_object[param]() :
                            param === 'orig_width' ? this.img_object.orig_height() : 
                                                        this.img_object.orig_width());
                } else {
                    return this.img_object[param]();
                }
            case 'display_width':
            case 'display_height':
            case 'angle':
                return this.img_object[param]();
            case 'zoom':
                return this.current_zoom;
            case 'src':
                return this.img_object.object().attr('src');
            case 'coords':
                return {
                    x: this.img_object.x(),
                    y: this.img_object.y()
                };
        }
    },

    /**
    *   callback for handling mousdown event to start dragging image
    **/
    _mouseStart: function( e )
    {
        $.ui.mouse.prototype._mouseStart.call(this, e);
        if (this._trigger('onStartDrag', 0, this._getMouseCoords(e)) === false) {
            return false;
        }

        /* start drag event*/
        this.container.addClass("iviewer_drag_cursor");

        this.dx = e.pageX - this.img_object.x();
        this.dy = e.pageY - this.img_object.y();
        return true;
    },

    _mouseCapture: function( e ) {
        return true;
    },

    /**
     * Handle mouse move if needed. User can avoid using this callback, because
     *    he can get the same information through public methods.
     *  @param {jQuery.Event} e
     */
    _handleMouseMove: function(e) {
        this._trigger('onMouseMove', e, this._getMouseCoords(e));
    },

    /**
    *   callback for handling mousemove event to drag image
    **/
    _mouseDrag: function(e)
    {
        $.ui.mouse.prototype._mouseDrag.call(this, e);
        var ltop =  e.pageY - this.dy;
        var lleft = e.pageX - this.dx;
        
        this.setCoords(lleft, ltop);
        this._trigger('onDrag', e, this._getMouseCoords(e));
        return false;
    },

    /**
    *   callback for handling stop drag
    **/
    _mouseStop: function(e)
    {
        $.ui.mouse.prototype._mouseStop.call(this, e);
        this.container.removeClass("iviewer_drag_cursor");
        this._trigger('onStopDrag', 0, this._getMouseCoords(e));
    },

    _click: function(e)
    {
        this._trigger('onClick', 0, this._getMouseCoords(e));
    },

    /**
    *   create zoom buttons info box
    **/
    createui: function()
    {
        var me=this;

        $("<div>", { 'class': "iviewer_zoom_in iviewer_common iviewer_button"})
                    .bind('mousedown touchstart',function(){me.zoom_by(1); return false;})
                    .appendTo(this.container);

        $("<div>", { 'class': "iviewer_zoom_out iviewer_common iviewer_button"})
                    .bind('mousedown touchstart',function(){me.zoom_by(- 1); return false;})
                    .appendTo(this.container);

        $("<div>", { 'class': "iviewer_zoom_zero iviewer_common iviewer_button"})
                    .bind('mousedown touchstart',function(){me.set_zoom(100); return false;})
                    .appendTo(this.container);

        $("<div>", { 'class': "iviewer_zoom_fit iviewer_common iviewer_button"})
                    .bind('mousedown touchstart',function(){me.fit(this); return false;})
                    .appendTo(this.container);

        this.zoom_object = $("<div>").addClass("iviewer_zoom_status iviewer_common")
                                    .appendTo(this.container);

        $("<div>", { 'class': "iviewer_rotate_left iviewer_common iviewer_button"})
                    .bind('mousedown touchstart',function(){me.angle(-90); return false;})
                    .appendTo(this.container);

        $("<div>", { 'class': "iviewer_rotate_right iviewer_common iviewer_button" })
                    .bind('mousedown touchstart',function(){me.angle(90); return false;})
                    .appendTo(this.container);

        this.update_status(); //initial status update
    }

} );

/**
 * @class $.ui.iviewer.ImageObject Class represents image and provides public api without
 *     extending image prototype.
 * @constructor
 * @param {boolean} do_anim Do we want to animate image on dimension changes?
 */
$.ui.iviewer.ImageObject = function(do_anim) {
    this._img = $("<img>")
            //this is needed, because chromium sets them auto otherwise
            .css({ position: "absolute", top :"0px", left: "0px"});

    this._loaded = false;
    this._swapDimensions = false;
    this._do_anim = do_anim || false;
    this.x(0, true);
    this.y(0, true);
    this.angle(0);
};


/** @lends $.ui.iviewer.ImageObject.prototype */
(function() {
    /**
     * Restore initial object state.
     *
     * @param {number} w Image width.
     * @param {number} h Image height.
     */
    this._reset = function(w, h) {
        this._angle = 0;
        this._swapDimensions = false;
        this.x(0);
        this.y(0);

        this.orig_width(w);
        this.orig_height(h);
        this.display_width(w);
        this.display_height(h);
    };

    /**
     * Check if image is loaded.
     *
     * @return {boolean}
     */
    this.loaded = function() { return this._loaded; };

    /**
     * Load image.
     *
     * @param {string} src Image url.
     * @param {Function=} loaded Function will be called on image load.
     */
    this.load = function(src, loaded) {
        var self = this;

        loaded = loaded || jQuery.noop;
        this._loaded = false;

        //If we assign new image url to the this._img IE9 fires onload event and image width and
        //height are set to zero. So, we create another image object and load image through it.
        var img = new Image();
        img.onload = function() {
            self._loaded = true;
            self._reset(this.width, this.height);

            self._img
                .removeAttr("src")
                .removeAttr("width")
                .removeAttr("height")
                .removeAttr("style")
                .css({ position: "absolute", top :"0px", left: "0px"})

            self._img[0].src = src;
            loaded();
        };

        img.src = src;
        this.angle(0);
    };

    this._dimension = function(prefix, name) {
        var horiz = '_' + prefix + '_' + name,
            vert = '_' + prefix + '_' + (name === 'height' ? 'width' : 'height');
        return setter(function(val) {
                this[this._swapDimensions ? horiz: vert] = val;
            },
            function() {
                return this[this._swapDimensions ? horiz: vert];
            });
    };

    /**
     * Getters and setter for common image dimensions.
     *    display_ means real image tag dimensions
     *    orig_ means physical image dimensions.
     *  Note, that dimensions are swapped if image is rotated. It necessary,
     *  because as little as possible code should know about rotation.
     */
    this.display_width = this._dimension('display', 'width'),
    this.display_height = this._dimension('display', 'height'),
    this.display_diff = function() { return Math.floor( this.display_width() - this.display_height() ) };
    this.orig_width = this._dimension('orig', 'width'),
    this.orig_height = this._dimension('orig', 'height'),

    /**
     * Setter for  X coordinate. If image is rotated we need to additionaly shift an
     *     image to map image coordinate to the visual position.
     *
     * @param {number} val Coordinate value.
     * @param {boolean} skipCss If true, we only set the value and do not touch the dom.
     */
    this.x = setter(function(val, skipCss) { 
            this._x = val;
            if (!skipCss) {
                this._img.css("left",this._x + (this._swapDimensions ? this.display_diff() / 2 : 0) + "px");
            }
        },
        function() {
            return this._x;
        });

    /**
     * Setter for  Y coordinate. If image is rotated we need to additionaly shift an
     *     image to map image coordinate to the visual position.
     *
     * @param {number} val Coordinate value.
     * @param {boolean} skipCss If true, we only set the value and do not touch the dom.
     */
    this.y = setter(function(val, skipCss) {
            this._y = val;
            if (!skipCss) {
                this._img.css("top",this._y - (this._swapDimensions ? this.display_diff() / 2 : 0) + "px");
            }
        },
       function() {
            return this._y;
       });

    /**
     * Perform image rotation.
     *
     * @param {number} deg Absolute image angle. The method will work with values 0, 90, 180, 270 degrees.
     */
    this.angle = setter(function(deg) {
            var prevSwap = this._swapDimensions;

            this._angle = deg;
            this._swapDimensions = deg % 180 !== 0;
            
            if (prevSwap !== this._swapDimensions) {
                var verticalMod = this._swapDimensions ? -1 : 1;
                this.x(this.x() - verticalMod * this.display_diff() / 2, true);
                this.y(this.y() + verticalMod * this.display_diff() / 2, true);
            };

            var cssVal = 'rotate(' + deg + 'deg)',
                img = this._img;

            jQuery.each(['', '-webkit-', '-moz-', '-o-', '-ms-'], function(i, prefix) {
                img.css(prefix + 'transform', cssVal);
            });

            if (useIeTransforms) {
                jQuery.each(['-ms-', ''], function(i, prefix) {
                    img.css(prefix + 'filter', ieTransforms[deg].filter);
                });

                img.css({
                    marginLeft: ieTransforms[deg].marginLeft * this.display_diff() / 2,
                    marginTop: ieTransforms[deg].marginTop * this.display_diff() / 2
                });
            }
        },
       function() { return this._angle; });

    /**
     * Map point in the container coordinates to the point in image coordinates.
     *     You will get coordinates of point on image with respect to rotation,
     *     but will be set as if image was not rotated.
     *     So, if image was rotated 90 degrees, it's (0,0) point will be on the
     *     top right corner.
     *
     * @param {{x: number, y: number}} point Point in container coordinates.
     * @return  {{x: number, y: number}}
     */
    this.toOriginalCoords = function(point) {
        switch (this.angle()) {
            case 0: return { x: point.x, y: point.y }
            case 90: return { x: point.y, y: this.display_width() - point.x }
            case 180: return { x: this.display_width() - point.x, y: this.display_height() - point.y }
            case 270: return { x: this.display_height() - point.y, y: point.x }
        }
    };

    /**
     * Map point in the image coordinates to the point in container coordinates.
     *     You will get coordinates of point on container with respect to rotation.
     *     Note, if image was rotated 90 degrees, it's (0,0) point will be on the
     *     top right corner.
     *
     * @param {{x: number, y: number}} point Point in container coordinates.
     * @return  {{x: number, y: number}}
     */
    this.toRealCoords = function(point) {
        switch (this.angle()) {
            case 0: return { x: this.x() + point.x, y: this.y() + point.y }
            case 90: return { x: this.x() + this.display_width() - point.y, y: this.y() + point.x}
            case 180: return { x: this.x() + this.display_width() - point.x, y: this.y() + this.display_height() - point.y}
            case 270: return { x: this.x() + point.y, y: this.y() + this.display_height() - point.x}
        }
    };

    /**
     * @return {jQuery} Return image node. this is needed to add event handlers.
     */
    this.object = setter(jQuery.noop,
                           function() { return this._img; });

    /**
     * Change image properties.
     *
     * @param {number} disp_w Display width;
     * @param {number} disp_h Display height;
     * @param {number} x
     * @param {number} y
     * @param {boolean} skip_animation If true, the animation will be skiped despite the
     *     value set in constructor.
     * @param {Function=} complete Call back will be fired when zoom will be complete.
     */
    this.setImageProps = function(disp_w, disp_h, x, y, skip_animation, complete) {
        complete = complete || jQuery.noop;

        this.display_width(disp_w);
        this.display_height(disp_h);
        this.x(x, true);
        this.y(y, true);

        var w = this._swapDimensions ? disp_h : disp_w;
        var h = this._swapDimensions ? disp_w : disp_h;

        var params = {
            width: w,
            height: h,
            top: y - (this._swapDimensions ? this.display_diff() / 2 : 0) + "px",
            left: x + (this._swapDimensions ? this.display_diff() / 2 : 0) + "px" 
        };

        if (useIeTransforms) {
            jQuery.extend(params, {
                marginLeft: ieTransforms[this.angle()].marginLeft * this.display_diff() / 2,
                marginTop: ieTransforms[this.angle()].marginTop * this.display_diff() / 2
            });
        }

        var swapDims = this._swapDimensions,
            img = this._img;

        //here we come: another IE oddness. If image is rotated 90 degrees with a filter, than
        //width and height getters return real width and height of rotated image. The bad news
        //is that to set height you need to set a width and vice versa. Fuck IE.
        //So, in this case we have to animate width and height manually.
        if(useIeTransforms && swapDims) {
            var ieh = this._img.width(),
                iew = this._img.height(),
                iedh = params.height - ieh;
                iedw = params.width - iew;

            delete params.width;
            delete params.height;
        }

        if (this._do_anim && !skip_animation) {
            this._img.animate(params, {
                duration: 200, 
                complete: complete,
                step: function(now, fx) {
                    if(useIeTransforms && swapDims && (fx.prop === 'top')) {
                        var percent = (now - fx.start) / (fx.end - fx.start);

                        img.height(ieh + iedh * percent);
                        img.width(iew + iedw * percent);
                        img.css('top', now);
                    }
                }
            });
        } else {
            this._img.css(params);
            setTimeout(complete, 0); //both if branches should behave equally.
        }
    };

}).apply($.ui.iviewer.ImageObject.prototype);



var util = {
    scaleValue: function(value, toZoom)
    {
        return value * toZoom / 100;
    },

    descaleValue: function(value, fromZoom)
    {
        return value * 100 / fromZoom;
    }
};

 } )( jQuery, undefined );
var view = new ShowImgView();
$(document).ready(function() {
	
	if(typeof data == "undefined"){
		var src = $("#zoom_pic").attr("href");
		if(src){
			src = src.substr(view.root.length);
			view.data.push({imgLargePath:src});
		}
	} else {
		view.setData(data);
	}
	$("#YTImg,.zoom").click(function() {
		if(typeof _stop != 'undefined'){
			_stop();
		}
		var src = $("#YTImg").attr('src').replace('/medium','');
		view.img_show(src);
		
		if(view.getDataLength() <= 1){
			$("#IV_playBtn").hide();
			$("#IV_preBtn").hide();
			$("#IV_nextBtn").hide();
			$("#select").hide();
			$("#playCurrent").hide();
			$("#beginTime").hide();
			$("#endTime").hide();
		}
		
		// 设置当前显示的图片属性信息
		$.each(view.data,function(k,v){
			if(view.root + v.imgLargePath == src){
				if(typeof data_index !== 'undefined'){
					view.currentIndex = parseInt(data_index[k]);
					view.preLoadImg(view.getData(k), k);
					view.setBeginAndEndTip();
				}
				// $('#beginSel')[0].selectedIndex = k;
				return false;
			}
		});
		this.blur();
		return false;
	});
});
/**
 * 图片显示
 */
function ShowImgView() {
	this.top = 0;
	this.left = 0;
	this.zoom = 100;
	this.time = 1000;// 播放频率,默认1秒
	this.viewer = null;
	this.preLoadIndex = 0;// 预加载到的索引位置
	this.preLoadSize = 3;// 预加载图片数量
	this.root = 'http://image.nmc.cn';
	this.currentIndex = 0; // 当前播放索引位置
	this.timer = null; // 自动播放定时对象
	this.data = new Array(); // 数据集合对象
}

ShowImgView.prototype.setRange = function(values){
	this.range = values;
}

ShowImgView.prototype.iv_remove = function(){
	if(this.timer != null){
		window.clearInterval(this.timer);
		this.timer = null;
	}
	this.zoom = 100;
	this.currentIndex = 0;
	// 移除图像展示层
	$('#IV_box').remove();
	// 移除遮挡层
	$('#IV_overlay').remove();
}
/**
 * 设置数据
 * 
 * @param {}
 *            data
 */
ShowImgView.prototype.setData = function(datas) {
	if(datas.length == 1){
		$("#IV_playBtn").hide();
		$("#IV_preBtn").hide();
		$("#IV_nextBtn").hide();
		$("#select").hide();
		$("#playCurrent").hide();
		$("#beginTime").hide();
		$("#endTime").hide();
	}
	this.data = new Array();
	for(var i=0;i<datas.length;i++){
		//var index = parseInt(data_index[i]);
		//var imgLargePath = datas[index][1];
		var d = datas[i];
		this.data.push({imgLargePath:d.img_path});
	}
}
/**
 * 通过下标获取数据项
 * 
 * @param {}
 *            index
 * @return {}
 */
ShowImgView.prototype.getData = function(index) {
	if(index >= 0 && index < this.data.length){
		return this.data[index];
	} else {
		return null;		
	}
}

ShowImgView.prototype.getDataLength = function() {
	return this.data.length;
}

ShowImgView.prototype.show = function(data) {
	// 预加载图片
	this.preLoad();
	// 如果图片已经加载过,则不显示正在加载中的动画效果
	if (data.preImgLargePath != null && data.loadLargeFlag) {
		this.viewer.iviewer('loadImage', data.preImgLargePath.src);
	} else {
		// 图片未加载,则显示加载动画效果,并将加载后的图片放入预加载
		$("#IV_iviewer").fadeIn().trigger('fadein');
		$("#IV_loader").show();
		$("#IV_viewer").hide();
		
		this.preLoadImg(data,this.currentIndex);
		this.viewer.iviewer('loadImage',
				this.root + data.imgLargePath);
	}
	this.setBeginAndEndTip();
}

ShowImgView.prototype.setBeginAndEndTip = function(){
	//var beginTime = $("#play_"+data_index[this.currentIndex]).text().replace(/(\s*)/g, "");
	var beginTime = data[this.currentIndex].ymd;
	/**
	var ymd = beginTime.substr(0,8);
	var ttmimi = beginTime.substr(8,5);
	var fffmm = beginTime.substring(13,Math.max(13,beginTime.indexOf('小时')));
	fffmm = (fffmm.length > 0) ? "+" + fffmm + "h" : fffmm;
	if(ttmimi == '00:00'){
		ttmimi = '00';
	} else if(fffmm.length > 0) {
		ttmimi = ttmimi.substring(0, Math.max(0,ttmimi.indexOf(":")));
	}**/
	//$("#beginTime").text(ymd + " " + ttmimi + fffmm);
	$("#beginTime").text(beginTime);
}

/**
 * 图片预先加载
 * 
 * @param data
 * @param index
 * @return
 */
ShowImgView.prototype.preLoadImg = function(data,index){
	var img = new Image();
	$(img).load(function(){
		if($(this).attr("index") != undefined){
			view.getData($(this).attr("index")).loadLargeFlag = true;
		}
	}).error(function(){
		alert('图片加载失败!');
	}).attr("src",this.root + data.imgLargePath).attr("index",index);
	data.preImgLargePath = img;
}

/**
 * 预加载图片
 */
ShowImgView.prototype.preLoad = function(){
	var flag = (this.currentIndex + this.preLoadSize) < this.data.length ? true : false;
	if(flag){
		for(var i = this.currentIndex; i < (this.currentIndex + this.preLoadSize); i++){
			var data = this.data[parseInt(data_index[i])];
			if(data.preImgLargePath == null || !data.loadLargeFlag){
				this.preLoadImg(data, parseInt(data_index[i]));
			}
		}
	}
}

ShowImgView.prototype.autoPlay = function(){
	$("#IV_playBtn").removeClass("tp_11").addClass("tp_09").attr('title','停止播放');
	if(playMode == 1){
		this.timer = window.setInterval('pre()', this.time);
	} else {
		this.timer = window.setInterval('next()', this.time);
	}
}

function next(){
	var max = Math.max(view.range[0],view.range[1]);
	var min = Math.min(view.range[0],view.range[1]);
	view.currentIndex = ((view.currentIndex + 1) < view.data.length) && ((view.currentIndex + 1) <= max) ? (view.currentIndex + 1) : min;
	view.show(view.getData(parseInt(data_index[view.currentIndex])));
}

function pre(){
	var max = Math.max(view.range[0],view.range[1]);
	var min = Math.min(view.range[0],view.range[1]);
	
	view.currentIndex = ((view.currentIndex -1) > -1) && ((view.currentIndex -1) >= min) ? (view.currentIndex -1) : max;
		
	view.show(view.getData(parseInt(data_index[view.currentIndex])));
}

ShowImgView.prototype.stopPlay = function(){
	if(this.timer != null){
		$("#IV_playBtn").removeClass("tp_09").addClass("tp_11").attr('title','自动播放');
		window.clearInterval(this.timer);
		this.timer = null;
	}
}

/**
 * 下一张
 */
ShowImgView.prototype.next = function() {
	var max = Math.max(this.range[0],this.range[1]);
	var min = Math.min(this.range[0],this.range[1]);
	
	this.currentIndex = ((this.currentIndex + 1) < this.data.length) && ((this.currentIndex + 1) <= max) ? (this.currentIndex + 1) : min;
	this.show(this.getData(parseInt(data_index[this.currentIndex])));
}
/**
 * 上一张
 * 
 * @return
 */
ShowImgView.prototype.pre = function(){
	var max = Math.max(this.range[0],this.range[1]);
	var min = Math.min(this.range[0],this.range[1]);
	
	this.currentIndex = ((this.currentIndex -1) > -1) && ((this.currentIndex -1) >= min) ? (this.currentIndex -1) : max;
		
	this.show(this.getData(parseInt(data_index[this.currentIndex])));
}


ShowImgView.prototype.imageBox = function(){
	return $("body");
}

ShowImgView.prototype.setBeginTimeText = function(){
	// 升序
	if(parseInt(data_index[0]) == 0){
		// 起点时间下拉框
		for(var i=0;i<this.getDataLength();i++){
			var text = data[i].ymd;
			$("#beginSel").append("<option value=\""+parseInt(data_index[i])+"\">"+text+"</option>");
		}
		$('#beginSel')[0].selectedIndex = 0;
		$("#beginSel").change(function(){
			view.setRange([parseInt($(this).val()), parseInt($("#endSel option:selected").val())]);
			view.currentIndex = parseInt($(this).val());
			view.show(view.getData(parseInt(data_index[view.currentIndex])));
		});
	} else {// 降序
		// 起点时间下拉框
		for(var i=this.getDataLength() - 1;i >= 0;i--){
			var text = data[i].ymd;
			$("#beginSel").append("<option value=\""+parseInt(data_index[i])+"\">"+text+"</option>");
		}
		$('#beginSel')[0].selectedIndex = 0;
		$("#beginSel").change(function(){
			view.setRange([parseInt($(this).val()), parseInt($("#endSel option:selected").val())]);
			view.currentIndex = parseInt($(this).val());
			view.show(view.getData(parseInt(data_index[view.currentIndex])));
		});
	}
}

ShowImgView.prototype.setEndTimeText = function(){
	// 升序
	if(parseInt(data_index[0]) == 0){
		// 终点时间下拉框
		for(var i=(this.getDataLength() - 1);i >= 0;i--){
			var text = data[i].ymd;
			$("#endSel").append("<option value=\""+parseInt(data_index[i])+"\">"+text+"</option>");
		}
		$('#endSel')[0].selectedIndex = 0;
		$('#endSel').change(function(){
			view.setRange([parseInt($(this).val()), parseInt($("#beginSel option:selected").val())]);
			view.currentIndex = parseInt($(this).val());
			//view.show(view.getData(parseInt(data_index[view.currentIndex])));
		});
		
	} else {// 降序
		// 终点时间下拉框
		for(var i=0;i < this.getDataLength() - 1;i++){
			var text = data[i].ymd;
			$("#endSel").append("<option value=\""+parseInt(data_index[i])+"\">"+text+"</option>");
		}
		$('#endSel')[0].selectedIndex = 0;
		$('#endSel').change(function(){
			view.setRange([parseInt($(this).val()), parseInt($("#beginSel option:selected").val())]);
			view.currentIndex = parseInt($(this).val());
			//view.show(view.getData(parseInt(data_index[view.currentIndex])));
		});
	}
}

ShowImgView.prototype.img_show = function(src){
	var target = this;
	// 添加遮挡层
	this.imageBox().append("<div id=\"IV_overlay\"></div>");
	$("#IV_overlay").css({height:$(document).height()});
	$("#IV_overlay").click(function() {
		view.iv_remove();
			});

	var group_silder = "<div id='IV_playBtn' class='tp_11' title='自动播放'></div><div id='IV_preBtn' class='tp_13' title='上一时次'></div><div id='IV_nextBtn' class='tp_15' title='下一时次'></div><div id='IV_copy' class='copy' title='复制图片'></div><div id='IV_open' class='open' title='打开图片'></div><div id='playCurrent'></div><div id='beginTime' title='当前播放'></div><div id='select'>播放跨度：<select id='beginSel'></select>至<select id='endSel'></select></div><div id='endTime' title='结束时间'></div>";

	this.imageBox()
			.append("<div id=\"IV_box\"><div id=\"View_toolbar\"><a id=\"IV_zoomIn\" class=\"tb_03\" title=\"图像缩小,支持鼠标滚轮缩小\"></a><div class=\"separator\"></div><a id=\"IV_zoomOut\" class=\"tb_05\" title=\"图像放大,支持鼠标滚轮放大\"></a><div class=\"separator\"></div><a id=\"IV_zoomAuto\" class=\"tp_06\" title=\"实际大小\"></a><div class=\"separator\"></div><a id=\"IV_zoomFix\" class=\"tp_03\" title=\"合适大小\"></a><div class=\"separator\"></div>"
					+ group_silder
					+ "<div id=\"IV_close\" title='关闭窗口,支持ESC' class='tp_17'></div></div><div id=\"IV_loader\"></div><div id=\"IV_viewer\"></div></div>");
	var left = ($(window).width() - $("#IV_box").width()) / 2;
	var top = ($(window).height() - $("#IV_box").height()) / 2;
	$("#IV_box").css({
				left : (left > 0 ? left : 0),
				top : (top > 0 ? top : 0)
			});

	$("#IV_close").click(function() {
		view.iv_remove();
			});

	view.setRange([0,(view.getDataLength() - 1)]);
	this.viewer = $("#IV_viewer").css({
				height : $("#IV_box").height() - $("#View_toolbar").outerHeight()
			}).iviewer({
				ui_disabled : true,
				src : src,
				zoom : view.zoom,
				onFinishLoad : function(ev) {
					$("#IV_loader").fadeOut();
					$("#IV_viewer").fadeIn();
				}
			});
	
	
	if(typeof data_index !== 'undefined'){
		view.setBeginTimeText();
		view.setEndTimeText();
		view.setBeginAndEndTip();
	}
	
	
	$("#IV_nextBtn").click(function() {
		if(playMode == 1){
			view.pre();
		} else {
			view.next();
		}
	});

	$("#IV_preBtn").click(function() {
		if(playMode == 1){
			view.pre();
		} else {
			view.next();
		}
	});
	var autoPlayObj = null;
	$('#IV_playBtn').click(function(){
		if($(this).hasClass('tp_09')) {
			view.stopPlay();
		} else {
			view.autoPlay();
		}
	});

	function play() {
		autoPlayObj = window.setInterval(view.next, 1000);
	}


	$("#IV_zoomIn").click(function() {
		view.viewer.iviewer('zoom_by', -1);
			});

	$("#IV_zoomOut").click(function() {
		view.viewer.iviewer('zoom_by', 1);
			});

	$("#IV_zoomAuto").click(function() {
		view.viewer.iviewer('set_zoom', 100);
			});

	$("#IV_zoomFix").click(function() {
		view.viewer.iviewer('fit');
			});

	$("#IV_open").click(function(){
		window.top.open($("#IV_viewer img:first-child").attr('src'));
	});
	$("#IV_copy").click(function(){
		CopyImage($("#IV_viewer img:first-child").get(0));
	});
	
	
	document.onkeydown = function(e) {
		var keycode = null;
		if (e == null) {
			keycode = event.keyCode;
		} else {
			keycode = e.which;
		}
		if (keycode == 27) {
			view.iv_remove();
		}
	}
}

function CopyImage(img) {
	if (img.tagName != 'IMG') {
		return;
	}
	if (typeof img.contentEditable == 'undefined') {
		alert('提示：当前浏览器不支持图片复制!');
		return;
	}
	if (!document.body.createControlRange) {
		alert('提示：当前浏览器不支持图片复制!');
		return;
	}
	var ctrl = document.body.createControlRange();
	img.contentEditable = true;
	ctrl.addElement(img);
	ctrl.execCommand('Copy');
	img.contentEditable = false;
	alert('提示：图片已经复制到剪切板,使用CTRL+V粘贴即可!');
}