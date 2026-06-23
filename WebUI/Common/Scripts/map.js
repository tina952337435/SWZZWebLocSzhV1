var bodyW = document.documentElement.clientWidth;
var ii = 0;
$(".xy").click(function () {
    ii++;
    if (ii % 2 == 1) {
        $(this).text("收起")
        $(this).css({ "border-radius": "0 50% 50% 0", "background-color": "#71C27F" })
    } else {
        $(this).text("展开")
        $(this).css({ "border-radius": "50% 0 0 50%", "background-color": "#55A1EF" })
    }
    $(".mapQH").toggle()
})
$(".toggle").click(function () {
    $(".toggle").each(function () {
        $(this).removeClass("toggleselect");
    });
    $(this).addClass("toggleselect");
});

function doInit() {
    //菜单详情nav maplist
    $(".maplist ul li").click(function () {
        $(this).addClass("lihover");
        var srcimg = $(this).children(".liimg").attr("src");
        if (srcimg != undefined) {
            var ffimg = document.getElementsByClassName("liimg");
            var ffimglen = ffimg.length;
            var ffimgind;
            for (ffimgind = 0; ffimgind < ffimglen; ffimgind++) {
                var imgsrc = ffimg[ffimgind].src;
                if (imgsrc.indexOf("@.png") > -1) {
                    var newimgsrc = imgsrc;//.replace("@.png", ".png");
                    ffimg[ffimgind].src = newimgsrc;
                }
            }

            var newsrc = "";
            //避免里面菜单出现两个@@，导致图标无法显示。
            if (srcimg.indexOf("@.png") >= 0) {
                newsrc = srcimg;
            }
            else {
                newsrc = srcimg.replace(".png", "@.png");
            }

            $(this).children(".liimg").attr("src", newsrc);
        }
        
        $(this).children("div").removeClass("active");
        $(this).siblings("li").children("div").addClass("active");
        $(this).siblings("li").removeClass("lihover");
    })
    $(".maplist ul li").mouseover(function () {
        $(this).children("div").removeClass("active");
        $(this).siblings("li").children("div").addClass("active");
    })
    $(".maplist ul li").mouseleave(function () { 
        var e = event || window.event;
        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        var x = e.pageX || e.clientX + scrollX;
        var y = e.pageY || e.clientY + scrollY;
        var xleft2 = parseInt(bodyW) - 406;
        var xleft1 = parseInt(bodyW) - 456;
        if (x >= xleft1 && x >= xleft2) {
            $(".maplist ul li").children("div").addClass("active");
        }
    })
    $(".maplist ul li").children("div").mouseleave(function () {
        $(this).addClass("active");
    })
}

var bodyH = document.documentElement.clientHeight;
var centerH = bodyH - 75;
$(".center").css("min-height", centerH)