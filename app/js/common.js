/*
 *   说明 : 公用Js
 *   依赖 : zepto.js
 *   编写 : 张志成
 *   时间 : 2016-03-04
 */

"use strict";
var common = {
	/*
	 *   说明 : 返回顶部按钮效果
	 *   编写 : 张志成
	 *   时间 : 2016-03-04
	 */
	backtop:function(){
		$("body").append("<!-- 返回顶部按钮 --><a class='btn btn-backtop'></a><!-- 返回顶部按钮 -->");
		$(window).scroll(function(){
			var t = $("body").scrollTop(),
			    h = $(window).height();
			if(t>h){
				$(".btn-backtop").css("opacity","1");
			}else{
				$(".btn-backtop").css("opacity","0");
			}
		})
		$(".btn-backtop").click(function(){
			$("body").scrollTop(0);
		})
	},
  /*
	 *   说明 : 模拟下拉表单
	 *   编写 : 张志成
	 *   时间 : 2016-03-07
	 */
  divselect:function(divselectid,inputselectid,height){
    var ul = $("#"+divselectid+" ul"),
        inputselect = $("#"+inputselectid);
    //下拉框tab切换
    $(".base-info-wrap .info-cont").eq(0).show();
    var msgTab = function(i){
      $(".base-info-wrap .info-cont").hide();
      $(".base-info-wrap .info-cont").eq(i).show();
    }
    $("#"+divselectid+' cite').click(function(){
      var h = $("#"+divselectid+" ul li").size()* 26;

      if(ul.css("height")=="0px"){
        ul.css("border","1px solid #ddd");
        ul.css("height",h+"px");
      }else{
        ul.css("height","0px");
        setTimeout(function(){
          ul.css("border","0");
        },300)
      }
    });
    $("#"+divselectid).on("click","ul li",function(){
      var txt = $(this).text(),
          index = $(this).index();
      $("#"+divselectid+' cite').html(txt);
      var value = $(this).text();
      inputselect.val(value);
      ul.css("height","0px");
      setTimeout(function(){
        ul.css("border","0");
      },300)
      msgTab(index);
    });
    $(document).on("click",function(e){
      var a = $("#"+divselectid+" ul")[0],
          d = $("#"+divselectid+" cite")[0],
          t = e.target;
      if(a != t && d != t)
      {
        ul.css("height","0px");
        setTimeout(function(){
          ul.css("border","0");
        },300)
      }
    })
  },
  /*
   *  张志成  2016-3-8
   *  调用swiper，主推户型左右滑动效果
   */
  touchList:function(content,num){
    var swiper = new Swiper("."+content+" .swiper-container-list", {
        slidesPerView: num,
        paginationClickable: true,
        setWrapperSize :true
    });
  },
  /**
   * 张志成 2016-3-10
   * @param  {[string]} method [接口名称 形式为a.b.c]
   * @return {[type]}        [description]
   */
  getSuccessMethod: function(method){
    var str_tempmethod = method.substring(method.indexOf(".")+1);
    str_tempmethod = str_tempmethod.replace(/\./g, "_");
    str_tempmethod += "_response";
    return str_tempmethod;
  },
  /*
   * 张志成  2016-3-10
   * 请求的通用方法
   * @param  {[string]}   method   [请求的接口名称]
   * @param  {[string]}   type     [请求的类型，默认为get]
   * @param  {[obj]}      params   [请求的参数]
   * @param  {Function}   callback [回调函数]
   * @return {[type]}              [description]
   */
  ajax: function(method, type, params, callback){
    params = $.extend(params, {
      method : method
    });
    var successResponse = common.getSuccessMethod(method);
    if (params.Requrl) {
      var url = params.Requrl;
      delete params.Requrl;
    }
    $.ajax({
      type: type||"Get",
      url: url,
      data: params,
      dataType: "json",
      success: function(res){
        if(callback){
          callback(res,successResponse);
        }
      },
      error: function(res){
        console.log(res.responseText);
      }
    });
  },
  /*
   * 张志成  2016-5-17
   * jsonp请求的通用方法
   * @param  {[string]}   method   [请求的接口名称]
   * @param  {[string]}   type     [请求的类型，默认为get]
   * @param  {[obj]}      params   [请求的参数]
   * @param  {Function}   callback [回调函数]
   * @return {[type]}              [description]
   */
  jsonp: function(method, type, params, callback){
    params = $.extend(params, {
      method : method
    });
    var successResponse = common.getSuccessMethod(method);
    if (params.Requrl) {
      var url = params.Requrl;
      var callbackname = params.jsoncallback;
      delete params.Requrl;
      delete params.jsoncallback;
    }
    $.ajax({
      url: url || ucurl,
      type: type || "GET",
      dataType: 'jsonp',
      jsonp: callbackname || 'uccallback',
      data: params,
      success: function(res) {//客户端jquery预先定义好的callback函数,成功获取跨域服务器上的json数据后,会动态执行这个callback函数
        if(callback){
          callback(res,successResponse);
        }
      },
      error: function(res){
        //jsonp 方式此方法不被触发.原因可能是dataType如果指定为jsonp的话,就已经不是ajax事件了
        //请求出错处理
        console.log(params.method+">>"+res.responseText);
      }
    });
  },
  notfind:function(){
    this.src='http://img3.fdc.com.cn/m/images/notfind.png';
  },
  /*
   * 张志成  2016-3-11
   * 搜索的通用方法
   * @param  {[string]}  model       [请求模块，如：新房0001，二手房0002，租房0003]
   * @param  {[string]}  PageSize    [页面长度，默认为10]
   * @param  {[string]}  pageIndex   [页码]
   * @param  {string}    requrl      [请求地址]
   * @param  {string}    sortMehtod  [排序方式，如：默认：1；总价从高到低：2；总价从低到高：3]
   * @param  {string}    scrMehtod   [房源筛选及优惠，如：全部： 1；个人房源：2；中介房源：3；有图房源：4；只看优惠楼盘：5]
   */
  search:function(model){
    $(".search-input").on("input",function(){
      var keyword = $(".search-page-wrap .search-input").val(),
          len = keyword.length;
      if(len<=4&&len>0){
        var method = "",
            reqUrl = "";
        switch(model){
          case "0001" : method = "New.House.Name";
                        reqUrl = newhouse_api;
          break;
          default : method = "searchna.m.eget";
                    reqUrl = oldhouse_api;
        }
        common.ajax(method,"post",{buildnickname:keyword,Requrl:reqUrl},function(res,success){
          if(res[success]){
            $(".head-search .search-show").find("li").remove();
            if(model=="0001"){
              for(var i=0;i<res[success].length;i++){
                var title = res[success][i].buildname.replace(keyword,"<b>"+keyword+"</b>");
                $(".head-search .search-show").append("<li><a href='"+house+"/wuhan/"+res[success][i].buildnickname+"'>"+title+"</a></li>");
              }
            }else{
              for(var i=0;i<res[success].data.length;i++){
                $(".head-search .search-show").append("<li>"+res[success].data[i].buildname+"</li>");
              }
            }
            $(".head-search .search-show").show();
          }else{
            console.log("数据请求失败....");
          }
        })
      }else{
        $(".head-search .search-show").find("li").remove();
        $(".head-search .search-show").hide();
      }

    })
  },
  /*
   * 张志成 2016-3-11
   * 发起请求
   */
  changeCity:function(){
    var fromPage = window.location.search.split("&");
    if(fromPage[1]){
      $(".city-name").text(common.switchCity(fromPage[1]));
    }
    $(".city-list").click(function(){
      var txt = $(this).attr("city-name");
      switch(fromPage[0]){
        case "?index": window.location.href= index+"/"+txt;
        break;
        case "?new": window.location.href= house+"/"+txt;
        break;
        case "?sec": window.location.href= oldhouse+"/"+txt;
        break;
        default : window.location.href= zufang+"/"+txt;
      }
    })
  },
  /*
   * 张志成 2016-3-11
   * 更改当前城市
   */
  changeNowCity:function(model){
    var cityName,
        city,
        placeholder;
    if(window.location.search){
      cityName = decodeURIComponent(window.location.search.split(",")[1] || "wuhan");
    }else{
      cityName = decodeURIComponent(window.location.href.split("/")[3].split(".")[0] || "wuhan");
    }
    if(window.location.href.slice("-1")=="/"){
      placeholder = "../";
    }else{
      placeholder = "";
    }
    if(cityName){
      city = common.switchCity(cityName);
      $(".head-location").text(city);
      $(".form-address-btn").text(city);
    }
    if(cityName=="wuhan"){
      $("#newlist,#btn-newlist").attr("href",house);
      $("#seclist,#btn-seclist").attr("href",oldhouse);
      $("#relist,#btn-relist").attr("href",zufang);
    }else{
      $("#newlist,#btn-newlist").attr("href",house+"/"+cityName);
      $("#seclist,#btn-seclist").attr("href",oldhouse+"/"+cityName);
      $("#relist,#btn-relist").attr("href",zufang+"/"+cityName);
    }
    switch(model){
      case "0001" : $(".head-location").attr("href",placeholder+"checkcity.html?new&"+cityName+"");
                    $(".form-address-btn").attr("href","checkcity.html?new&"+cityName+"");
      break;
      case "0002" : $(".head-location").attr("href",placeholder+"checkcity.html?sec&"+cityName+"");
                    $(".form-address-btn").attr("href","checkcity.html?sec&"+cityName+"");
      break;
      case "0003" : $(".head-location").attr("href",placeholder+"checkcity.html?re&"+cityName+"");
                    $(".form-address-btn").attr("href",placeholder+"checkcity.html?re&"+cityName+"");
      break;
      default : $(".head-location").attr("href",placeholder+"checkcity.html?index&"+cityName+"");
                $(".form-address-btn").attr("href",placeholder+"checkcity.html?index&"+cityName+"");
    }
  },
  /*
   * 张志成 2016-4-26
   * 将城市的拼音改为中文
   */
  switchCity:function(cityname){
    switch(cityname){
      case "wuhan" : return "武汉";
      break;
      case "yichang" : return "宜昌";
      break;
      case "xiangyang" : return "襄阳";
      break;
      case "huanggang" : return "黄冈";
      break;
      case "ezhou" : return "鄂州";
      break;
      case "xianning" : return "咸宁";
      break;
      case "xiantao" : return "仙桃";
      break;
      case "jingzhou" : return "荆州";
      break;
      case "xiaogan" : return "孝感";
      break;
      case "suizhou" : return "随州";
      break;
      case "shiyan" : return "十堰";
      break;
      case "huangshi" : return "黄石";
      break;
      default : return "武汉";
    }
  },
  /*
   * 张志成 2016-3-11
   * 当城市为其他分站时，改变regionID和districtID
   */
  changeRegion:function(model,city,regionID){
    if(model=="0001"){
      switch(city){
        case "宜昌" : regionID = 1;
        break;
        case "黄石" : regionID = 7;
        break;
        case "襄阳" : regionID = 13;
        break;
        case "仙桃" : regionID = 18;
        break;
        case "孝感" : regionID = 21;
        break;
        case "恩施" : regionID = 27;
        break;
        case "十堰" : regionID = 31;
        break;
        case "随州" : regionID = 36;
        break;
        case "黄冈" : regionID = 40;
        break;
        case "鄂州" : regionID = 46;
        break;
        case "咸宁" : regionID = 51;
        break;
        case "荆州" : regionID = 55;
        break;
        default : regionID = regionID;
      }
    }else{
      switch(city){
        case "宜昌" : regionID = 1;
        break;
        case "黄石" : regionID = 2;
        break;
        case "襄阳" : regionID = 3;
        break;
        case "仙桃" : regionID = 4;
        break;
        case "孝感" : regionID = 5;
        break;
        case "恩施" : regionID = 6;
        break;
        case "十堰" : regionID = 7;
        break;
        case "随州" : regionID = 8;
        break;
        case "黄冈" : regionID = 9;
        break;
        case "鄂州" : regionID = 10;
        break;
        case "咸宁" : regionID = 11;
        break;
        case "荆州" : regionID = 12;
        break;
        default : regionID = regionID;
      }
    }
    return regionID;
  },
  /*
   * 根据时间戳(秒)生成时间 1436412956699 -> 2015-07-09 12:00
   * @param  {[int]} d [时间戳]
   */
  getDate: function(d){
    if(typeof d != "number"){
      d = parseInt(d) * 1000;
    }
    return d ? new Date(d).Format("yyyy-MM-dd hh:mm") : "0000-00-00 00:00";
  },
  /*
   * 根据时间戳(秒)生成时间 1436412956699 -> 2015-07-09
   * @param  {[int]} d [时间戳]
   */
  getDate2: function(d){
    if(typeof d != "number"){
      d = parseInt(d) * 1000;
    }
    return d ? new Date(d).Format("yyyy-MM-dd") : "0000-00-00";
  },
  /*
   * 黄毅 2016-4-11
   * 加载完成后显示页面
   */
  loadShowPage:function(res){
    $("."+res).removeClass("container-hide");
    $("body footer").show();
    $(".blank-white").hide();//隐藏正在加载中...
  },
  /*
   * 黄毅 2016-4-13
   * 所有申请页面高度自适应
   */
  autoApp:function(autoApp){
    var h = $(window).height() - 44;
    $(autoApp).css("min-height",h+"px");
  },
  /*
   * zzc 2016-8-22
   * 通过key去获取地址栏的参数
   */
  getUrlParam:function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
  },
  /*
   * zzc 2016-7-28
   * 全站导航切换事件
   */
  changeSiteMenu:function(){
    $(".header-icon-a").unbind("click").on("click",function(event) {
      $("footer").toggle();
      $(".content-toggle").toggle().siblings().not(".head,.head-wrap,script,#buildnickname,.blank-white,footer,#pcurl,.height-44,.search-page-wrap,.click-comment,.search-wrap,.share-container").toggle();
      $(".head-wrap .head-search").toggle();
    });
  },
  /*
   * zzc 2016-8-3
   * 面包屑地址生成方法
   */
  crumbsLink:function(){
    var city,nickName;
    if(window.location.search){
      if(window.location.search.split("&")[0]&&window.location.search.split("&")[1]){
        nickName =decodeURIComponent(window.location.search.split("&")[0].split("=")[1].replace("?",""));
        city = decodeURIComponent(window.location.search.split("&")[1].split("=")[1]);
      } 
    }else{
      nickName =decodeURIComponent(window.location.href.split("/")[4]);
      city = decodeURIComponent(window.location.href.split("/")[3]);
    }
    if(city!="wuhan"){
      $(".crumbs-house").attr("href","http://house.m.fdc.com.cn/"+city);
      $(".crumbs-oldhouse").attr("href","http://oldhouse.m.fdc.com.cn/"+city);
      $(".crumbs-zufang").attr("href","http://zufang.m.fdc.com.cn/"+city);
    }
    $(".crumbs-floor").attr("href","http://house.m.fdc.com.cn/"+city+"/"+nickName);
  },
  /*
   * zzc 2016-8-11
   * 旧自动列表页加载动画高度
   */
  oldAutoHeight:function (){
    var h = $(window).height()-86;
    $(".blank-white").css("height",h+"px");
    $(".blank-white .revolve").css("margin-top",h/2-"45"+"px");
    $(".blank-white").show();
  },
  /*
   * zzc 2016-8-11
   * 新自动列表页加载动画高度
   */
  newAutoHeight:function(){
    var h = $(window).height()-243;
    $(".blank-white,.not-found-wrap").css("height",h+"px");
    $(".blank-white .revolve").css("margin-top",h/2-"45"+"px");
    $(".blank-white").show();
  },
  /*
   * zzc 2016-8-3
   * 新房、二手房、租房底部关键词切换
   */
  kerwordsTab:function(){
    $(".title-list").click(function(){
      var index = $(this).index();
      $(this).addClass("active").siblings().removeClass("active");
      $(".content-item-wrap").eq(index).addClass("show").siblings().removeClass("show");
    })
  },
  /*
   * luxing 2016-8-10
   * 多图切换滑动
   * parame  [string]  content  class名
   * parame  [string]  pageDom  分页器class名
   */
  bannerList:function(content,pageDom){
    var swiper = new Swiper("."+content, {
      slidesPerView : 1,
      setWrapperSize :true,
      pagination: '.'+pageDom || ".swiper-pagination",
      paginationType: 'fraction',
      lazyLoading : true,
      preloadImages: false
    });
  },
  /*
   * zzc 2016-8-17
   * 倒计时
   * params  [string]  value  隐藏元素的class
   * params  [string]  target 渲染值的目标class
   * params  [string]  btn    按钮的目标class
   */
  countDown:function(value,target,btn){
    var sec = $(value).text(),
        timer;
    var timeFun = function(){
      sec--;
      if(sec>=0){
        var d = parseInt(sec / 86400),
          h = parseInt(( sec - d * 86400 ) / 3600) ,
          m = parseInt(( sec - d * 86400 - h * 3600 ) / 60) ,
          s = parseInt(sec - d * 86400 - h * 3600 - m * 60) ;
        $(target).text("倒计时："+d+"天"+h+"时"+m+"分"+s+"秒");
      }else{
        clearInterval(timer);
        if(typeof $(btn)[0] !== 'undefined'){
          $(btn).eq(0).css({'border':'1px solid #999','color':'#999'}).text('活动结束').attr("href","javascript:;");
        }
      }
    }
    timer = setInterval(timeFun,1000);
  },
  /*
   * zzc 2016-8-22
   * 报名出错弹窗提示
   */
  
  applyErrorDialog:function(errorTxt){
    var timer;
    if($('.error-dialog').length==0){
      $("body").append("<div  class='error-dialog'>"+errorTxt+"</div>");
    }
    timer = setTimeout(function(){
      $('.error-dialog').remove();
    },2000)
  },
}
/**
 * n cookie名称
 * v 值
 * e 失效时间
 * p 路径
 * d 域名
 * s 大小
 * @type {Object}
 */
var uc_cookie={
  //读取COOKIES,n为COOKIE名
  Get:function(n){
    var re=new RegExp(n+'=([^;]*);?','gi');
    var r=re.exec(document.cookie)||[];
    return (r.length>1?r[1]:null)
  },
  Get1:function(n){
    var re=new RegExp(n+'=([^;]*);?','gi');
    var r=re.exec(document.cookie)||[];
    return unescape(r.length>1?r[1]:null)
  },
  //写入COOKIES,n为Cookie名，v为value
  Set:function(n,v,e,p,d,s){
    var t=new Date;
    p = p ||'/';
    d = d || '.fdc.com.cn';
    // e = e || 30;
    if(e){
      // 8.64e7 一天 3.6e6 一小时
      t.setTime(t.getTime() + (e*8.64e7));
    }
    document.cookie=n+'='+v+'; '+(!e?'':'; expires='+t.toUTCString())+(!p?'':'; path='+p)+(!d?'':'; domain='+d)+(!s?'':'; secure') // Set cookie
  },
  Set1:function(n,v,e,p,d,s){
    var t=new Date;
    p = p ||'/';
    d = d || '.fdc.com.cn';
    e = e || 12;
    if(e){
      // 8.64e7 一天 3.6e6 一小时
      t.setTime(t.getTime() + (e*2.592e9));
    }
    document.cookie=n+'='+escape(v)+'; '+(!e?'':'; expires='+t.toUTCString())+(!p?'':'; path='+p)+(!d?'':'; domain='+d)+(!s?'':'; secure') // Set cookie
  },
  Del:function(n,p,d){
    var t=uc_cookie.Get(n);
    p = p ||'/';
    d = d || '.fdc.com.cn';
    document.cookie=n+'='+(!p?'':'; path='+p)+(!d?'':'; domain='+d)+'; expires=Thu, 01-Jan-70 00:00:01 GMT';
    return t
  }
};
/*
 * 张志成 2016-3-11
 * 自执行函数
 */
$(function(){
  //返回历史记录上一页
  $(".btn-back-history,.popclose-icon").click(function(){
    window.history.back();
    return false;
  })
  //打开搜索页面
  $(".j-click-input,.input-character").click(function(){
    $(".search-wrap").show().siblings().hide();
    $(".search-page-wrap").show().css("opacity","1").siblings().hide();
    $(".search-page-wrap .secondhouse-container").show();
    $(".container-find").hide();
  });
  //返回列表页
  $(".btn-back").click(function(){
    $(".search-page-wrap,.search-wrap").hide();
    $(".search-page-wrap,.search-wrap").siblings("header,section,footer,.height-44,.screen-wrap").not(".content-toggle").show();
    $(".space").show();
  });
  //搜索页点击输入框显示特色搜索
  $(".head-search .foot").click(function(){
    $(".search-page-wrap .secondhouse-container").hide();
    $(".container-find").show();
  });
  // 调用底部关键词切换方法
  common.kerwordsTab();
  // 对Date的扩展，将 Date 转化为指定格式的String
  // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
  // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
  // 例子：
  // (new Date()).Format("yyyy-MM-dd hh:mm:s=s.S") ==> 2006-07-02 08:09:04.423
  // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
  Date.prototype.Format = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

})

/*!
 *  Echo v1.4.0
 *  Lazy-loading with data-* attributes, offsets and throttle options
 *  Project: https://github.com/toddmotto/echo
 *  by Todd Motto: http://toddmotto.com
 *  Copyright. MIT licensed.
 */
window.Echo = (function(window, document, undefined) {
  var store = [],
  offset,
  throttle,
  poll;
  var Watermark = "%7Cwatermark=1&object=d2F0ZXJtYXJrL3dhdGVybWFya2NvbG9yLnBuZ0AyMFA=&t=100&p=9&x=10&y=10";
  var _inView = function(el) {
    var coords = el.getBoundingClientRect();
    return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight) + parseInt(offset));
  };

  var _pollImages = function() {
    for (var i = store.length; i--;) {
      var self = store[i];
      if (_inView(self)) {
        var url = self.getAttribute('data-echo');
        store.splice(i, 1);
        var parame = self.getAttribute('data-para') ? self.getAttribute('data-para') : "",
            _hostname = url ? url.split('/')[2].split('.')[0] : "",
            imgUrl;
        if(_hostname == 'static'){
          imgUrl = url + parame + Watermark;
        }else{
          imgUrl = url + parame;
        }
        self.src = imgUrl;
      }
    }
  };

  var _throttle = function() {
    clearTimeout(poll);
    poll = setTimeout(_pollImages, throttle);
  };

  var init = function(obj) {
    var nodes = document.querySelectorAll('[data-echo]');
    var opts = obj || {};
    offset = opts.offset || 0;
    throttle = opts.throttle || 250;

    for (var i = 0; i < nodes.length; i++) {
      store.push(nodes[i]);
    }

    _throttle();

    if (document.addEventListener) {
      window.addEventListener('scroll', _throttle, false);
    } else {
      window.attachEvent('onscroll', _throttle);
    }
  };

  return {
    init: init,
    render: _throttle
  };

})(window, document);

(function() {
    /**
     * 动态加载js文件
     * @param  {string}   url      js文件的url地址
     * @param  {Function} callback 加载完成后的回调函数
     */
    var _getScript = function(url, callback) {
        var head = document.getElementsByTagName('head')[0],
            js = document.createElement('script');

        js.setAttribute('type', 'text/javascript'); 
        js.setAttribute('src', url); 

        head.appendChild(js);

        //执行回调
        var callbackFn = function(){
                if(typeof callback === 'function'){
                    callback();
                }
            };

        if (document.all) { //IE
            js.onreadystatechange = function() {
                if (js.readyState == 'loaded' || js.readyState == 'complete') {
                    callbackFn();
                }
            }
        } else {
            js.onload = function() {
                callbackFn();
            }
        }
    }

    //如果使用的是zepto，就添加扩展函数
    if(Zepto){
        $.getScript = _getScript;
    }
    
})();






