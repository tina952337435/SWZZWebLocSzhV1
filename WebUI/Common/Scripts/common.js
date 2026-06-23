var bodyW = document.documentElement.clientWidth;	
	//header
		$(".headerlifirst").mouseover(function() {
			$(this).children("div").show();
			$(this).css({
				"background-color": "#f1f1f1",
				"border-color": "#ddd"
			})
		});
		$(".headerlifirst").mouseout(function() {
			$(this).children("div").hide();
			$(this).css({
				"background-color": "#ffffff",
				"border-color": "#FCFCFC"
			})
		})

        //addtab
		function dd(dd, titlename) {
		    $.ajax({
		        type: "POST",
		        url: HtmIp + "/json/reply/QX_Menu",
		        success: function (data) {
		            var oJson = eval(data);
		            var aSearch = [];
		            var aTwoJson = [];
		            aSearch = getArrayMian(oJson, dd);
		            var newmenuHTML = '';
		            aSearch.forEach(function (ele) {//循环外层数组
		                aTwoJson = getArrayTwo(oJson, ele.QX_ID);
		                if (aTwoJson.length > 0) {
		                    newmenuHTML += '<li>';
		                    newmenuHTML += '<div><img class="ffimg" src="../img/ico/' + ele.QX_ICON + '.png" />' + ele.QX_NAME + '<img class="seeimg" src="../img/ico/left.png" /></div> '
		                    aTwoJson.forEach(function (eleT) {
		                        newmenuHTML += '<p onclick="addTab(\'' + eleT.QX_NAME + '\', \'' + eleT.QX_URL + '\', \'' + titlename + '@' + ele.QX_NAME + '@' + eleT.QX_NAME + "@" + '\', \'' + eleT.QX_NAME + '\')"><img src="../img/ico/' + eleT.QX_ICON + '.png" />' + eleT.QX_NAME + '</p>';
		                    })
		                    newmenuHTML += '</li>';
		                } else {
		                    newmenuHTML += '<li>';
		                    newmenuHTML += '<div onclick="addTab(\'' + ele.QX_NAME + '\', \'' + ele.QX_URL + '\',\'' + titlename + '@' + ele.QX_NAME + "@" + '\', \'' + ele.QX_NAME + '\')"><img class="ffimg" src="../img/ico/' + ele.QX_ICON + '.png" />' + ele.QX_NAME + '</div>';
		                    newmenuHTML += '</li>';
		                }
		            });
		            $("#newmenul").html(newmenuHTML);
		            $(".newmenuul li div").click(function () {
		                var ffimg = document.getElementsByClassName("ffimg");
		                var ffimglen = ffimg.length;
		                var ffimgind;
		                for (ffimgind = 0; ffimgind < ffimglen; ffimgind++) {
		                    var imgsrc = ffimg[ffimgind].src;
		                    if (imgsrc.indexOf("@.png") > -1) {
		                        var newimgsrc = imgsrc.replace("@.png", ".png");
		                        ffimg[ffimgind].src = newimgsrc;
		                    }
		                }
		                var seeimg = document.getElementsByClassName("seeimg");
		                var seeimglen = seeimg.length;
		                var seeimgind;
		                for (seeimgind = 0; seeimgind < seeimglen; seeimgind++) {
		                    seeimg[seeimgind].src = "../img/ico/left.png";
		                }

		                var seediv = $(this).siblings("p").css("display");
		                var huiimg = $(this).children(".ffimg").attr("src");

		                if (huiimg.indexOf("@.png") > -1) {
		                    var huiimg = huiimg.replace("@.png", ".png");
		                }
		                else {
		                    var huiimg = huiimg.replace(".png", "@.png");
		                }
		                if ($(this).siblings("p").length > 0) {
		                    if (seediv == "none") {
		                        $(this).addClass("seediv");
		                        $(this).children(".seeimg").attr("src", "../img/ico/down.png");
		                        $(this).children(".ffimg").attr("src", huiimg)
		                        $(this).parent("li").css("border", "none"),
                                $(this).parent("li").siblings("li").children("div").removeClass("seediv");
		                        $(this).parent("li").siblings("li").children("p").css("display", "none");
		                        //$(this).parent("li").siblings("li").css({ "border": "1px solid #E3E3E3", "border-top": "none" });
		                        $(this).siblings("p").click(function () {
		                            $(this).addClass("newp");
		                            $(this).siblings("p").removeClass("newp")
		                        })
		                    } else {
		                        $(this).removeClass("seediv");
		                        $(this).children(".seeimg").attr("src", "../img/ico/left.png")
		                        $(this).children(".ffimg").attr("src", huiimg)
		                        //$(this).parent("li").css({ "border": "1px solid #E3E3E3", "border-top": "none" });
		                    }
		                    $(this).siblings("p").slideToggle("fast", "linear", "")
		                } else {
		                    $(this).addClass("seediv");
		                    $(this).children(".ffimg").attr("src", huiimg)
		                    $(this).parent("li").siblings("li").children("div").removeClass("seediv");
		                    //$(this).parent("li").siblings("li").css({ "border": "1px solid #E3E3E3", "border-top": "none" });
		                    $(this).parent("li").siblings("li").children("p").slideUp();
		                }

		            });
		        }
		    });

		}

		function addTab(title, url, icon, tabname) {
		    var tabs = mini.get("mainTabs");
		    var tab = tabs.getTab(tabname);
		    if (!tab) {
		        var tab = { title: title, url: url, iconStyle: "", showCloseButton: true, name: tabname };
		        //控制tba页关闭事件。
		        if (tab.url == "map.html") {
		            $(".ather").addClass("csp")
		        } else {
		            $(".ather").removeClass("csp")
		        }
		        if (tab.url.indexOf("map.html") > -1) {
		            $("#nomap").css("display", "none");
		            $(".newmenu").css("display", "none");
		            $(".menu").find(".csp").removeClass("csp");
		            $(".ather").addClass("csp");
		            $("#mainTabs").css({ height: "-webkit-calc(100% - 0px)", heigth: "-moz-calc(100% - 0px)", height: "calc(100% - 0px)", width: "100%", margin: "auto" });
		            $(".newright").css({ width: "-webkit-calc(100% - 0px)", width: "-moz-calc(100% - 0px)", width: "calc(100% - 0px)", })
		        } else {
		            $("#nomap").css("display", "block");
		            $(".newmenu").css("display", "block");
		            $(".newright").css({ width: "-webkit-calc(100% - 190px)", width: "-moz-calc(100% - 190px)", width: "calc(100% - 190px)", });
                    $("#mainTabs").css({ height: "100%", width: "100%", margin: "auto" });
		            var strTitle = '<span>当前位置:&nbsp;';
		            var arr = icon.substring(0, icon.length - 1).split('@');
		            var style = '';
		            for (var i = 0; i < arr.length; i++) {
		                if (i != arr.length - 1) {
		                    style = "style='color:#3390F8;cursor: pointer;'"
		                } else {
		                    style = '';
		                }
		                strTitle += '<span ' + style + '>' + arr[i] + '>></span>';
		            }
		            $("#nomapTitle").html(strTitle.substring(0, strTitle.lastIndexOf('>>')) + "</span>");
		        }
		        tab.ondestroy = function (e) {
		            var tabs = e.sender;
		            var iframe = tabs.getTabIFrameEl(e.tab);
		            //获取子页面返回数据
		            var pageReturnData = iframe.contentWindow.getData ? iframe.contentWindow.getData() : "";
		            //alert(e.tab.removeAction + " : " + pageReturnData);
		            //如果禁止销毁的时候，自动active一个新tab：e.autoActive = false;
		        }
		        removeTab();
		        tab = tabs.addTab(tab);
		    }
		    tabs.activeTab(tab);
		}

		function removeTab() {
		    var tabs = mini.get("mainTabs");
		    var tab = tabs.getActiveTab();
		    if (tab) {
		        if (tab != tabs.getTab("first"))
		            tabs.removeTab(tab);
		    }
		}