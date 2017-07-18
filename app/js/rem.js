/*rem单位适配*/
// (function (doc, win) {
// 	var docEl = doc.documentElement,
// 	resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
// 	recalc = function () {
// 		var clientWidth = docEl.clientWidth;
// 		if (!clientWidth) return;
// 		if( clientWidth > 750) clientWidth = 750;
// 		docEl.style.fontSize = 100* (clientWidth / 750) + 'px';
// 	};
// 	if (!doc.addEventListener) return;
// 	win.addEventListener(resizeEvt, recalc, false);
// 	doc.addEventListener('DOMContentLoaded', recalc, false);
// })(document, window); 
new function (){
       var _self = this;
       _self.width = 750;
       _self.fontSize = 100;
       _self.widthProportion = function(){
       		var p = (document.body&&document.body.clientWidth||document.getElementsByTagName("html")[0].offsetWidth)/_self.width;

       		return p>1?1:p;
       	};

       _self.changePage = function(){
           document.getElementsByTagName("html")[0].setAttribute("style","font-size:"+_self.widthProportion()*_self.fontSize+"px !important");
       }

       _self.changePage();
       window.addEventListener("resize",function(){_self.changePage();},false);
}; 