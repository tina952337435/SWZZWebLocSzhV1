/*tab切换,在body结尾处引用*/
$(".tabXQ li").click(function () {
    var XQli = $(this).index();
    $(this).addClass("liactive");
    $(this).siblings("li").removeClass("liactive");
    $(".choselei").children("div").eq(XQli).removeClass("activeTab");
    $(".choselei").children("div").eq(XQli).siblings("div").addClass("activeTab");
    if (XQli > 1) {
        $(".flexRow").hide();
    } else {
        $(".flexRow").show();
    }
    if ("undefined" != typeof onTabChange) {
        onTabChange(XQli);
    }
})

$(".head li").click(function () {
    $(this).css({ "background-color": "#5eccf3", "color": "white" })
    $(this).siblings().css({ "background-color": "white", "color": "black" })
    var index = $(".head li").index(this);

    if ("undefined" != typeof change) {
        change(index);
    }

    hideall();
    if (document.getElementById("div" + (index + 1).toString())) {
        document.getElementById("div" + (index + 1).toString()).style.visibility = "visible";
        document.getElementById("div" + (index + 1).toString()).style.display = "block";
    }
})
function hideall() {
    if (document.getElementById("div1")) {
        document.getElementById("div1").style.visibility = "hidden";
        document.getElementById("div2").style.visibility = "hidden";
        document.getElementById("div3").style.visibility = "hidden";
        document.getElementById("div4").style.visibility = "hidden";

        document.getElementById("div1").style.display = "none";
        document.getElementById("div2").style.display = "none";
        document.getElementById("div3").style.display = "none";
        document.getElementById("div4").style.display = "none";
    }

}
function selectTab(selectIndex) {
    $(".head li").each(function (index, element) {
        if (Number(selectIndex) == index) {
            $(element).css({ "background-color": "#5eccf3", "color": "white" });
        }
        else {
            $(element).css({ "background-color": "white", "color": "black" })
        }
    });
}
