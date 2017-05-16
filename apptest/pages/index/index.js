//ie8支持bind方法
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function 
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
    var aArgs = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP = function () {},
      fBound = function () {
        return fToBind.apply(this instanceof fNOP && oThis ?
          this :
          oThis,
          aArgs.concat(Array.prototype.slice.call(arguments)));
      };
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
  };
}

//彈出方法 袁文 2016 12 26 需引入$.actual
var dialog = {
  calcPosition: function ($ele, $dialog) {
    var pos = $ele.offset();
    // console.log(pos.left + $ele.outerWidth()/2 - $dialog.actual('outerWidth')/2)
    return {
      top: pos.top - $dialog.actual('outerHeight') - 10,
      left: pos.left + $ele.outerWidth() / 2 - $dialog.actual('outerWidth') / 2
    }
  },
  /**
   * dialog.showAlert({
   *  ele:'#id',
   *  msg:'hahaha'
   * })
   */
  showAlert: function (opts) {
    var $ele=typeof opts.ele=='string' ? $(opts.ele) : opts.ele;
    // console.log($ele);
    $('.showlog-pos').remove();
    var $dialog = $('<div class="showlog-pos"><div class="showlog-content">' + opts.msg +
      '<i class="showlog-icon"></i><div class="triangle"><em>◆</em><span>◆</span></div>' +
      '</div></div>');

    var Timer = null;
    $dialog.find(".showlog-icon").click(_closeDialog);
    Timer = setTimeout(_closeDialog, 3000)

    function _closeDialog() {
      clearInterval(Timer);
      $dialog.fadeOut(500, function () {
        $dialog.remove();
      });
    }

    $('body').append($dialog.hide());
    var offset = this.calcPosition($ele, $dialog);
    $dialog.css({
      'top': offset.top,
      'left': offset.left
    }).show()
  }
}

//延迟加载
$("img.lazy").lazyload({
    effect : "fadeIn"
});

//百叶窗效果
$(".rank-item").mouseover(function(){
  if($(this).find(".itemopen").length > 0){
    $(this).addClass("active").siblings().removeClass("active");
  }
});

//placeholder兼容
// $(function(){
//   $('input,textarea').placeholder();  
//})

//倒计时
(function($){
$.fn.countDown = function(num){
  this.each(function(){
    var displayTime;
    var endTime = $(this).data("time");
    var speed = num*1000 || 100;
    var _this = $(this);
    function showTime(){
      var closeTime = endTime - new Date().getTime();
      var day = Math.floor(closeTime / (1000 * 60 * 60 * 24));
      var hou = Math.floor(closeTime / (3600000)) - (day * 24);
      var min = Math.floor(closeTime / (60000)) - (day * 24 * 60) - (hou * 60);
      var sec = Math.floor(closeTime / 1000) - (day * 24 * 60 * 60) - (hou * 60 * 60) - (min * 60);
      min = min > 0 ? min : 0;
      sec = sec > 0 ? sec : 0;
      _this.find(".day").text(day);
      _this.find(".hour").text(hou);
      _this.find(".minute").text(min);
      _this.find(".second").text(sec);
      if(closeTime < 0){
        clearInterval(displayTime);
        return true;
      }
    }
    showTime();
    displayTime = setInterval(function(){
        showTime();
    }, speed)
  })
}
})(jQuery);


