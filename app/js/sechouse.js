/**
 *   说明 : 二手房列表页
 *   依赖 : zepto、knockout
 *   编写 : 张志成
 *   时间 : 2016-08-10
 */

"use strict";
var sechouse = {
  /*
   *  zzc 2016-9-25
   *  筛选数据默认值
   */
  fliterData:{
    keyword: "",
    dictCode: "",
    dictSubcode: "",
    lineId: "",
    station: "",
    price: "",
    roomType: "",
    acreage: "",
    decorateType: "",
    floor: "",
    propertyRight: "",
    propertyType: "",
    propertyAge: "",
    source: "",
    sorttype: "",
    pageIndex: "1",
    pageSize: "10"
  },
  /*
   *  zzc 2016-8-10
   *  二手房列表页入口方法
   */
  secListEnter:function(){
    // 返回顶部按钮方法
    common.backtop();
    // 加载动画高度
    common.newAutoHeight();
    // 请求列表数据
    sechouse.getSecHouseData({});
    // 请求筛选数据
    sechouse.getSecHouseScreenData();
    // 城市切换
    common.changeNowCity("0002");
    // 加载更多
    var i = 1;
    $(".sechouse-content-wrap").on("click",".btn-more",function(){
      i++;
      sechouse.fliterData.pageIndex = i;
      sechouse.getSecHouseData();
      secModel.onload("1");
    })
  },
  /*
   *  zzc 2016-8-10
   *  筛选操作方法
   */
  screenFun:function(){
    // 筛选类型切换
    $(".screen-tit-list").click(function(){
      var i = $(this).index();
      if($(this).hasClass("active")){
        $(this).removeClass("active");
        $(".screen-content-list").eq(i).hide();
        if($(this).index()=='3'){
          sechouse.resetOtherData();
        }
        $("html").removeClass("html-unscrollable");
        $(".screen-shade").hide();
      }else{
        $(this).addClass("active").siblings().removeClass("active");
        $(".screen-content-list").eq(i).show().siblings().hide();
        $("html").addClass("html-unscrollable");
        $(".screen-shade").show();
      }
    })
    // 初始化更多选项模块的最大高度
    var h = $(window).height()-190;
    // var st = $(".screen-content-list").eq(3).scrollTop() + h;
    // if(st == $(window).height()){
    //   alert(1);
    // }
    $(".other-list-wrap").css("max-height",h+"px");
    // 切换区域和地铁数据
    $(".screen-1-list").click(function(){
      var type = $(this).data("type");
      secModel.dictOrline(type);
      $(".screen-2-list,.screen-3-list").removeClass('active');
    })
    // 切换区域或者地铁的二级数据
    $(".area-list-wrap").on("click",".screen-2-list",function(){
      var key = $(this).data("key"),
          type = $(".screen-1-list.active").data("type");
      if(key){
        if(type=="dict"){
          secModel.dictSubcode(secModel.screenData().disctrictSubs[key]);
        }else if(type=="line"){
          secModel.station(secModel.screenData().subwayStations[key])
        }
      }else{
        if(type=="dict"){
          secModel.dictSubcode([]);
        }else if(type=="line"){
          secModel.station([])
        }
      }
    })
    // 区域、价格、户型筛选条件的点击事件
    $(".screen-content-wrap").on("click",".screen-item-list",function(){
      if(!$(this).hasClass("screen-1-list")){
        var txt,status;
        $(this).addClass("active").siblings().removeClass("active");
        // 调用筛选条件数据集合方法
        txt = $(this).text();
        status = $(this).hasClass("screen-2-list");
        if(txt=='不限'|| !status){
          sechouse.checkScreenData();
          $(".screen-content-list").hide();
          $(".screen-tit-list").removeClass("active");
        }
      }
    })
    // 更多筛选条件点击事件
    $(".screen-content-wrap").on("click",".other-screen-list",function(){
      $(this).addClass("active").siblings().removeClass("active");
      $(this).parent().siblings().children().removeClass("active");
    })
    // 更多筛选条件确认事件
    $(".screen-confirm-wrap .btn-confirm").click(function(){
      sechouse.checkOtherData();
      $(".screen-tit-list").removeClass("active");
      $(".screen-content-list").hide();
      $("html").removeClass("html-unscrollable");
      $(".screen-shade").hide();
    })
    // 更多筛选条件取消事件
    $(".screen-confirm-wrap .btn-cancel").click(function(){
      sechouse.resetOtherData();
    })
    // 搜索事件
    $(".search-wrap .confirm").click(function(){
      var keyword = $(".j-val-input").val();
      sechouse.fliterData.keyword = keyword;
      $(".search-wrap").hide().siblings(".height-44,.head-wrap,.screen-wrap,.sechouse-content-wrap,footer").show();
      sechouse.loadFun().getSecHouseData();
    })
    // 点击空白区域筛选条件隐藏
    $(".screen-shade").click(function(){
      $(".screen-tit-list").removeClass("active");
      $(".screen-content-list").hide();
      $("html").removeClass("html-unscrollable");
      $(".screen-shade").hide();
    })
  },
  /*
   *  zzc 2016-8-10
   *  检查区域、地铁、价格、户型筛选条件，然后赋值
   */ 
  checkScreenData:function(){
    var area1,area2,price,room,_fliterData;
    _fliterData = this.fliterData;
    area1 = $(".screen-2-list.active").text();
    area2 = $(".screen-3-list.active").text();
    price = $(".screen-price-list.active").text();
    room = $(".screen-roomtype-list.active").text();
    // 给筛选的区域标题赋值
    if( area1 == '不限' ){
      $(".screen-tit-text").eq(0).text('区域');
    }else if(area2){
      $(".screen-tit-text").eq(0).text(area2);
    }
    // 给筛选的价格标题赋值
    if(price == '不限'){
      $(".screen-tit-text").eq(1).text('价格');
    }else if(price){
      $(".screen-tit-text").eq(1).text(price);
    }
    // 给筛选的排序标题赋值
    if(room == '不限'){
      $(".screen-tit-text").eq(2).text('户型');
    }else if(room){
      $(".screen-tit-text").eq(2).text(room);
    }
    _fliterData.dictCode = $(".dict-2-list.active").data("key");
    _fliterData.dictSubcode = $(".dict-3-list.active").data("key");
    _fliterData.lineId = $(".line-2-list.active").data("key");
    _fliterData.station = $(".line-3-list.active").data("key");
    _fliterData.price = $(".screen-price-list.active").data("key");
    _fliterData.roomType = $(".screen-roomtype-list.active").data("key");
    // 调用列表数据请求方法
    sechouse.loadFun().getSecHouseData();
  },
  /*
  *  zzc 2016-8-14
  *  检查更多选项里的筛选条件，然后赋值
  */
  checkOtherData:function(){
    var num,_fliterData;
    _fliterData = this.fliterData;
    num = $('.other-screen-list.active').length;
    if(num){
      $(".screen-tit-text").eq(3).text('更多('+num+')');
    }
    _fliterData.acreage = $(".acreage-list.active").data("key");
    _fliterData.decorateType = $(".fitment-list.active").data("key");
    _fliterData.floor = $(".floor-list.active").data("key");
    _fliterData.houesType = $(".housetype-list.active").data("key");
    _fliterData.propertyRight = $(".property-list.active").data("key");
    _fliterData.propertyType = $(".propertyType-list.active").data("key");
    _fliterData.propertyAge = $(".propertyAge-list.active").data("key");
    _fliterData.source = $(".sourceType-list.active").data("key");
    _fliterData.sorttype = $(".sort-list.active").data("key");
    // 调用列表数据请求方法
    sechouse.loadFun().getSecHouseData();
  },
  /*
  *  zzc 2016-8-14
  *  加载动画
  */
  loadFun:function(){
    this.fliterData.pageIndex = '1';
    secModel.listData([]);
    $(".blank-white").show().siblings(".sechouse-list-wrap,.keywords-wrap").hide();
    $(".screen-shade").hide();
    return this;
  },
  /*
  *  zzc 2016-8-14
  *  重置更多选项里的筛选条件
  */
  resetOtherData:function(){
    $(".other-screen-list").removeClass("active");
    $(".sourceType-list").eq(0).addClass("active");
    $(".supOrdem-list").eq(0).addClass("active");
    $(".sort-list").eq(0).addClass("active");
  },
  /*
   *  zzc 2016-8-10
   *  请求列表的数据
   *  zzc 2016-8-10
   *  parame  [json]    screenParmas     筛选条件参数
   *  parame  [string]  dictitemcode     区域
   *  parame  [string]  dictitemsubcode  片区
   *  parame  [string]  lineid           线路
   *  parame  [string]  station          站点
   *  parame  [string]  price            价格
   *  parame  [string]  acreage          面积
   *  parame  [string]  roomno           房型
   *  parame  [string]  decoratetype     装修情况
   *  parame  [string]  floor            楼层
   *  parame  [string]  housetype        房屋类型
   *  parame  [string]  propertyright    产权情况
   *  parame  [string]  propertyrighttype产权类型
   *  parame  [string]  propertyrightyear产权年限
   *  parame  [string]  name             小区名
   *  parame  [string]  source           房源
   *  parame  [string]  sort             字段排序
   *  parame  [string]  order            排序
   *  parame  [string]  currentPage      当前页码
   *  parame  [string]  rowsPerPage      每页数据长度
   */
  getSecHouseData:function(){
    var parames,_fliterData;
    _fliterData = this.fliterData;
    parames = {
      dictitemcode: _fliterData.dictCode || decodeURIComponent(common.getUrlParam('dictitemcode') || ""),
      dictitemsubcode: _fliterData.dictSubcode || decodeURIComponent(common.getUrlParam('dictitemsubcode') || ""),
      lineid: _fliterData.lineId || decodeURIComponent(common.getUrlParam('lineid') || ""),
      station: _fliterData.station || decodeURIComponent(common.getUrlParam('station') || ""),
      price: _fliterData.price || decodeURIComponent(common.getUrlParam('price') || ""),
      acreage: _fliterData.acreage || decodeURIComponent(common.getUrlParam('acreage') || ""),
      roomno: _fliterData.roomType || decodeURIComponent(common.getUrlParam('roomno') || ""),
      decoratetype: _fliterData.decorateType || decodeURIComponent(common.getUrlParam('decoratetype') || ""),
      floorno: _fliterData.floor || decodeURIComponent(common.getUrlParam('floorno') || ""),
      housetype: _fliterData.houesType || decodeURIComponent(common.getUrlParam('housetype') || ""),
      propertyright: _fliterData.propertyRight || decodeURIComponent(common.getUrlParam('propertyright') || ""),
      propertyrighttype: _fliterData.propertyType || decodeURIComponent(common.getUrlParam('propertyrighttype') || ""),
      propertyrightyear: _fliterData.propertyAge || decodeURIComponent(common.getUrlParam('propertyrightyear') || ""),
      name: _fliterData.keyword || decodeURIComponent(common.getUrlParam('name') || ""),
      source: _fliterData.source || decodeURIComponent(common.getUrlParam('source') || ""),
      sorttype: _fliterData.sorttype || decodeURIComponent(common.getUrlParam('sorttype') || ""),
      currentPage: _fliterData.pageIndex,
      rowsPerPage: _fliterData.pageSize,
      Requrl: secApi
    }
    common.jsonp("homeoldapi.restful.inter.oldhouse.getlist","get",parames,function(res,success){
      if(res[success]){
        for(var i=0; i<res[success].data.length; i++){
          res[success].data[i].publicTime = common.getDate2(res[success].data[i].publicTime);
          if(res[success].data[i].houseSpecial){
            res[success].data[i].houseSpecial = JSON.parse(res[success].data[i].houseSpecial.replace(/'/g,'"'));
          }
          secModel.listData.push(res[success].data[i]);
        }
        if(_fliterData.pageIndex<res[success].total){
          secModel.moreStatus("2");  
        }else{
          secModel.moreStatus("1");  
        }
        if(res[success].total == '0'){
          $(".not-found-wrap").show();
        }else{
          $(".not-found-wrap").hide();
        }
        secModel.onload("2");
        common.changeSiteMenu();
        $("html").removeClass("html-unscrollable");
        $(".screen-shade").hide();
        $(".blank-white").hide().siblings(".sechouse-list-wrap,.keywords-wrap").show();
        Echo.init({
          offset: 0,
          throttle: 0
        });
      }else{
        console.log("您没有提供调用函数……");
      }
    }) 
  },
  /*
   *  zzc 2016-8-10
   *  请求筛选条件的数据
   *  parame  [string]  site          位置
   */
  getSecHouseScreenData:function(site){
    common.jsonp("homeoldapi.restful.inter.oldhouse.getparameters","get",{Requrl: secApi},function(res,success){
      if(res[success]){
        var data = res[success].data;
        secModel.screenData(data);
        secModel.dictCode(data.disctricts);
        secModel.line(data.subwayLines);
        secModel.station(data.subwayStations);
        secModel.price(data.prices);
        secModel.roomType(data.houseStyles);
        sechouse.splitArrFun("acreage",data.acreages);
        sechouse.splitArrFun("decorateType",data.decorations);
        sechouse.splitArrFun("floor",data.floorNums);
        sechouse.splitArrFun("houesType",data.houseSourceTypes);
        secModel.propertyRight(data.propertyRights);
        sechouse.splitArrFun("propertyType",data.propertyRightTypes);
        sechouse.splitArrFun("propertyAge",data.propertyRightYears);
        secModel.dictOrline("dict");
        // 调用筛选方法
        sechouse.screenFun();
      }else{
        console.log("您没有提供调用函数……");
      }
    }) 
  },
  /*
   *  zzc 2016-8-10
   *  筛选条件数组分割，4个一组
   *  parame  [string]  key          secModel的属性
   *  parame  [string]  value        后台传的属性值
   */
  splitArrFun:function(key,value){
    var val = value ? value : "",
        len = Math.ceil((val.length)/4);
    for(var i=0; i<len; i++){
      var _arr = [],flag;
      for(var j=0; j<4; j++){
        flag = typeof(value[4*i+j]) == "undefined";
        if(!flag){
          _arr.push(value[4*i+j]);
        }else{
          _arr.push("");
        } 
      }
      secModel[key] && secModel[key].push(_arr);
    }
  },
  /*
   * luxing 2016-8-10
   * 二房详情页入口
   */
  sechouseInit: function(lat,lon){
    sechouse.bannerList("house-banner-contain",1);
    sechouse.facilityList();
    sechouse.mapPosition(lat,lon);
    sechouse.share();
    Echo.init({
          offset: 0,
          throttle: 0
        });
  },
  /*
   * luxing 2016-8-10
   * 二房详情页切换滑动
   * parame  [string]  content  class名
   */
  bannerList:function(content,num){
    var swiper = new Swiper("."+content, {
      slidesPerView : num,
      setWrapperSize :true,
      pagination: '.swiper-pagination',
      paginationType: 'fraction',
      lazyLoading : true,
      preloadImages: false
    });
  },
  facilityList:function(){
    var swiper = new Swiper(".facility", {
      slidesPerView : 3.5,
      setWrapperSize :true
    });
  },

   /*
   * luxing 2016-8-10
   * 二房详情页地图
   * parame  [string]  lat  经度
   * parame  [string]  lng  纬度
   */
  mapPosition:function(lat,lng){
    // lat = 114.265215;
    // lng = 30.597912;
    function initialize(){ 
      var mp = new BMap.Map('map'); 
      var point = new BMap.Point(lat,lng);
      mp.centerAndZoom(point, 11); 
      var marker = new BMap.Marker(point);// 创建标注
      mp.addOverlay(marker);
    } 
    window.onload = initialize; 
  },
  /*
   * luxing 2016-10-12
   * 分享
   */
  share: function(){
    var _this = this,
        url = window.location.href,
        title = $(".house-title h2").html(),
        picurl = $('.swiper-slide a img')[0].currentSrc
    $(".houses-attention").on("click",".ar-share-right",function(){
      $(".share-container").show();
    });
    $(".share-container").on("click",".btn-close,.layer-shade",function(){
      $(".share-icon-wrap").show();
      $(".share-container,.cory-link-wrap").hide();
    });
    _this.shareAddress = function(){
      $(".share-icon-wrap").hide();
      $(".cory-link-wrap").show();
      $(".cory-cont a").attr("href",url).html(url)
    };
    _this.wb = function(){
      var sharesinastring='http://v.t.sina.com.cn/share/share.php?title='+title+'&url='+url+'&content=utf-8&sourceUrl='+url+'&pic='+picurl;  
      window.open(sharesinastring);
    };
    _this.qq = function(){
      var shareqqConnect = 'http://connect.qq.com/widget/shareqq/index.html?url=' + url + '&title=' + title + '&description=' + '' + '&charset=utf-8'
      window.open(shareqqConnect);
    };
    _this.qqZone = function(){
      var shareqqzonestring='http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?site=www.tuan2.com&title=' + '' + '&desc=' + title + '&summary=' + '分享分享' + '&url=' + url + 'pic' + picurl;  
      window.open(shareqqzonestring);
    }
    $(".share-icon-item").click(function(){
      var tag = $(this).attr("id");
      switch(tag){
        case "wx": _this.shareAddress();
        break;
        case "wx-zone": _this.shareAddress();
        break;
        case "wb": _this.wb();
        break;
        case "qq": _this.qq();
        break;
        case "qq-zone": _this.qqZone();
        break;
      }
    });
    $(".cory-cont-link").click(function(e){
      //阻止href跳转
      e.preventDefault();
      e.stopPropagation();
    })
  }
}


















