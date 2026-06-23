/*flex不支持ie9及以下版本，给出提示，不显示布局乱的页面*/
(function(window) {
	var theUA = window.navigator.userAgent.toLowerCase();
	if ((theUA.match(/msie\s\d+/) && theUA.match(/msie\s\d+/)[0]) || (theUA.match(/trident\s?\d+/) && theUA.match(
			/trident\s?\d+/)[0])) {
		var ieVersion = theUA.match(/msie\s\d+/)[0].match(/\d+/)[0] || theUA.match(/trident\s?\d+/)[0];
		if (ieVersion < 11) {
			var str = "Please update your browser to IE 10 or higher version for a better browsing experience. ";
			var str2 = "呃哦，您的IE浏览器版本过低，请升级IE10以上版本，来获取不一般的视觉效果！";
			document.writeln(
				"<pre style='text-align:center;color:#fff;background-color:#0cc; height:100%;border:0;position:fixed;top:0;left:0;width:100%;z-index:1234;font-family:Georgia'>" +
				"<h2 style='padding-top:200px; line-height:40px;margin:0;'><strong>" + str +
				"<br/></strong></h2><p style='font-family: 微软雅黑'>" +
				str2 + "</p></pre>");
			document.execCommand("Stop");
		};
	}
})(window);// 水位监测if ($(".m-list1").length > 0) {
	var galleryThumbs = new Swiper('.gallery-thumbs', {
		spaceBetween: 0,
		slidesPerView: 'auto',
		freeMode: true,
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
	});
	//var galleryTop = new Swiper('.gallery-top', {
	//	spaceBetween: 0,
	//	thumbs: {
	//		swiper: galleryThumbs
	//	}
	//});
	// Swiper鼠标悬停时停止滚动
	//$('.gallery-top').hover(function() {
	//	galleryTop.autoplay.stop();
	//}, function() {
	//	galleryTop.autoplay.start();
	//});
}if ($(".m-list2").length > 0) {
	var galleryThumbs1 = new Swiper('.gallery-thumbs1', {
		spaceBetween: 0,
		slidesPerView: 'auto',
		freeMode: true,
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
	});
	//var galleryTop1 = new Swiper('.gallery-top1', {
	//	spaceBetween: 0,
	//	thumbs: {
	//		swiper: galleryThumbs1
	//	}
	//});
	// Swiper鼠标悬停时停止滚动
	//$('.gallery-top').hover(function() {
	//	galleryTop.autoplay.stop();
	//}, function() {
	//	galleryTop.autoplay.start();
	//});
}
$(function() {
	// 初始化滚动动画
	var wow = new WOW({
		boxClass: 'wow',
		animateClass: 'animated',
		offset: 0,
		mobile: true,
		live: true,
		callback: function(box) {},
		scrollContainer: null
	});
	wow.init();
})
