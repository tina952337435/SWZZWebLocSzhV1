$(function ($, window) {
    var hourTimestamp = 3600 * 1000; // 一个小时的时间戳
    var dayTimestamp = hourTimestamp * 24; // 一天的时间戳

    window.formatDateS = function (date, type) {
        if ((date.getTime || new Date(date).getTime()) && typeof type === "string") {
            date = type.replace(/YYYY|MM|DD|HH|hh|MM|mm|SS|ss/g, function ($) {
                switch ($) {
                    case "YYYY":
                        return date.getFullYear();
                    case "MM":
                        return date.getMonth() >= 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
                    case "mm":
                        return date.getMonth() + 1;
                    case "DD":
                        return date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
                    case "dd":
                        return date.getDate();
                    case "HH":
                        return date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
                    case "hh":
                        return date.getHours();
                    case "MM":
                        return date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
                    case "mm":
                        return date.getMinutes();
                    case "SS":
                        return date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
                    case "ss":
                        return date.getSeconds();
                    default:
                        return $;
                }
            });
        }
        return date;
    }

    function ProgressTime(options) {
        this.options = {
            container: "container", // 容器ID名称 
            startTime: new Date(formatDateS(new Date(new Date().getTime() - dayTimestamp * 10), "YYYY/MM/DD 00:00:00")), // 开始时间：2000/10/20 00:00:00
            endTime: new Date(formatDateS(new Date(), "YYYY/MM/DD 00:00:00")), // 结束时间：2000/10/30 00:00:00
            currentTime: new Date(new Date().getTime() - dayTimestamp * 7), // 当前时间: 2000/10/25 00:00:00
            delay: 2000, // 自动播放动画时间                                            
            isNow: true, // 是否显示右侧回到当前时间
            toPlay: true, // 渲染是否完成
            animateFinish: true, // 动画是否完成
            hoursInterval: 3,
            formatterDate: function (timer) { // 自定义时间格式
                return formatDateS(new Date(timer), "MM月DD日");
            },
            animateCallback: function (config) { // 动画完成回调

            },
            callback: function (config) { // 单击事件回成回调

            }
        }
        this.options = $.extend(this.options, options);
        this.id = this.options.container;
        this.startTime = this.options.startTime;
        this.endTime = this.options.endTime;
        this.currentTime = this.options.currentTime;
        this.currentTimeTemp = null;
        this.timer = null;
        this.init();

    }
    ProgressTime.prototype.init = function () {
        this.createDom();
        this.bindEvent();
        this.resize();
        return this;
    }
    ProgressTime.prototype.createDom = function () {
        var left = $("<div class='" + this.id + "-left'></div>");
        var center = $("<div class='" + this.id + "-center'></div>");
        var isRight = this.options.isNow ? "" : "hide";
        var right = $("<div class='" + this.id + "-right " + isRight + "'></div>");

        var leftHtml = "<div class='" + this.id + "-left-t'></div><div class='" + this.id + "-left-b'><span class='" + this.id + "-left-b-start'></span></div>";
        left.append(leftHtml);

        var centerHtml = "<div class='" + this.id + "-center-t'><div class='" + this.id + "-center-t-bar'></div></div><div class='" + this.id + "-center-c'></div><div class='" + this.id + "-center-b'></div>";
        center.append(centerHtml);

        var rightHtml = "<div class='" + this.id + "-right-now'>回到当前</div>";
        right.append(rightHtml);

        $("#" + this.id).append(left).append(center).append(right);

        this.createCenter(); // 创建内容的DOM
    }
    ProgressTime.prototype.createCenter = function () {
        var cTop = $("." + this.id + "-center-t");

        var cCenter = $("." + this.id + "-center-c");
        var cbottom = $("." + this.id + "-center-b");

        cTop.append("<div class='" + this.id + "-center-t-tooltip'></div><div class='" + this.id + "-center-t-tooltipTemp hide'></div>");
        var days = (this.endTime.getTime() - this.startTime.getTime()) / dayTimestamp;
        days = Math.ceil(days);
        //alert(days);
        var tempTime, cTopHtml = "",
            cCenterHtml = "",
            cBottomHtml = "",
            width = (cTop.width() / days) / cTop.width() * 100 + "%"; // 计算出每一天的时间轴长度，必需用百分比不然计算不准确
        // 循环天数
        for (var i = 0; i < days; i++) {
            var tempTime2 = new Date(this.startTime.getTime() + (i * dayTimestamp)); // 当前时间
            tempTime = this.options.formatterDate(tempTime2);
            cTopHtml += "<li style='width:" + width + ";'></li>";
            cCenterHtml += "<li class='" + this.id + "-center-c-ul-li' style='width:" + width + ";'></li>";
            cBottomHtml += "<li style='width:" + width + ";'>" + tempTime + "</li>";
        }
        cTop.append("<ul class='" + this.id + "-center-t-ul'>" + cTopHtml + "</ul>");
        cCenter.append("<ul class='" + this.id + "-center-c-ul'>" + cCenterHtml + "</ul>");
        cbottom.append("<ul class='" + this.id + "-center-b-ul'>" + cBottomHtml + "</ul>");

        // 按3小时来间隔
        var spanHtml = "";
        var liWidth = $("." + this.id + "-center-c-ul-li")[0].getBoundingClientRect().width; //
        var hoursWidth = liWidth / 24; // 计算每个小时所占的宽度
        var intervalCount = 24 / this.options.hoursInterval;
        for (var i = 1; i < intervalCount; i++) {
            var temp = (hoursWidth * i * this.options.hoursInterval) / liWidth * 100 + "%";
            spanHtml += "<span style='left:" + temp + ";'>" + (i * this.options.hoursInterval) + "</span>";
        }
        $("." + this.id + "-center-c-ul-li").append(spanHtml)

        this.setTime();
    }
    ProgressTime.prototype.setConfig = function (config) {
        var _this = this;
        var text = formatDateS(new Date(config.time), "YYYY年MM月DD日 hh时");

        var widthPercent = (config.width / $("." + this.id + "-center-t").width()) * 100 + "%"; // 用百分比，解决时间播放结束出现自适应问题
        // 灵活的tooltip
        if (config.type === "mousemove") {
            $("." + this.id + "-center-t-tooltipTemp").removeClass("hide").text(text).css({
                "left": widthPercent
            });
            return;
        }

        // 时间轴的长度
        $("." + this.id + "-center-t-tooltip").text(text).stop().animate({
            "left": widthPercent
        });

        // 固定的tooltip
        $("." + this.id + "-center-t-bar").stop().animate({
            width: widthPercent
        }, function () { // 动画完成 
            _this.options.animateFinish = true;
            typeof _this.options.animateCallback === "function" && _this.options.animateCallback(config);
        });

        typeof this.options.callback === "function" && this.options.callback(config);
    }
    ProgressTime.prototype.setTime = function (e) {
        var layerX = e && e.originalEvent.layerX;
        var type = e && e.type;
        var hoursWidth = $("." + this.id + "-center-t-ul li")[0].getBoundingClientRect().width / 24; // 计算每个小时所占的宽度
        var tooltipTimestamp = this.currentTimeTemp || this.currentTime.getTime(); // 返回当前的时间的时间戳
        var num = Math.floor((tooltipTimestamp - this.startTime.getTime()) / hourTimestamp); // 计算出多少小时
        num = layerX !== undefined ? Math.round(layerX / hoursWidth) : num;
        var progressWidth = num * hoursWidth; // 计算出时间条的长度

        if (layerX) { // 移动或点击重新求距离
            tooltipTimestamp = Math.floor(this.startTime.getTime() + num * hourTimestamp);

            if (type === "click") {
                this.currentTimeTemp = tooltipTimestamp; // 点击储存当前时间，自适应用
            }
        }
        var time = formatDateS(new Date(tooltipTimestamp), "YYYY/MM/DD hh:00:00");
        this.setConfig({
            time: time,
            width: progressWidth,
            type: type
        });
    }

    ProgressTime.prototype.bindEvent = function () {
        var _this = this;

        // 点击
        $("." + this.id + "-center-t-ul").on("click", function (e) {
            _this.setTime(e);
        });

        // 移动移出
        $("." + this.id + "-center-t-ul").on("mousemove", function (e) {
            _this.setTime(e);
        }).on("mouseleave", function () {
            $("." + _this.id + "-center-t-tooltipTemp").addClass("hide");
        });

        // 回到当前
        $("." + this.id + "-right-now").on("click", function () {
            _this.currentTimeTemp = _this.currentTime.getTime(); // 重置
            _this.setTime();
        });

        // 播放
        var flag = true;
        $("." + this.id + "-left-b-start").on("click", function () {
            var self = $(this);
            if (flag && _this.currentTimeTemp < _this.endTime) {
                _this.currentTimeTemp = _this.currentTimeTemp ? _this.currentTimeTemp : _this.currentTime.getTime(); // 加一小时的时间戳
                flag = false;
                self.addClass("stop");
                if (!_this.timer) {
                    _this.timer = setInterval(function () {
                        if (_this.options.toPlay && _this.options.animateFinish) { // 动画完成后，并且页面渲染后再调用
                            console.log("aaa");
                            _this.options.toPlay = false;
                            _this.options.animateFinish = false;
                            _this.currentTimeTemp += hourTimestamp;
                            if (_this.currentTimeTemp >= _this.endTime) { // 时间边界判定
                                flag = true;
                                self.removeClass("stop");
                                clearInterval(_this.timer);
                                _this.timer = null;
                            }
                            _this.setTime();
                        }
                    }, _this.options.delay);
                }
            } else {
                flag = true;
                self.removeClass("stop");
                clearInterval(_this.timer);
                _this.timer = null;
            }
        });
    }

    ProgressTime.prototype.resize = function () { // 自适应只调用一次，解决浏览器触发多次resize方法
        var _this = this;
        var tempTimer = null;
        $(window).resize(function () {
            if (!tempTimer && !_this.timer) { // 浏览器缩放会重置时间轴，这里判断_this.timer是否存在再重置
                tempTimer = setTimeout(function () {
                    _this.setTime();
                    clearTimeout(tempTimer);
                    tempTimer = null;
                }, 0);
            }
        });
    }
    $.fn.extend({
        ProgressTime: function (options) {
            window.progressTime = new ProgressTime(options);
        }
    });
}(jQuery, window));