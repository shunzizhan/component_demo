/**
 *   说明 : 新房列表页
 *   依赖 : zepto
 *   编写 : 张志成
 *   时间 : 2016-03-07
 */

"use strict";
// 筛选数据默认值
var fliterData  = {
  keyword: "",
  dictCode: "",
  dictSubcode: "",
  lineId: "",
  station: "",
  pricemin: "",
  pricemax: "",
  sorttype: "",
  roomType: "",
  acreagemin: "",
  acreagemax: "",
  estate: "",
  feature: "",
  opentime: "",
  salestatus: "",
  pageIndex: "1",
  pageSize: "20"
}
var newhouse = {
  /*
   *  zzc 2016-8-10
   *  新房列表页入口方法
   */ 
  newListEnter:function(){
    // 返回顶部按钮方法
    common.backtop();
    // 加载动画高度
    common.newAutoHeight();
    // 请求列表数据
    newhouse.getNewHouseData({});
    // 请求筛选数据
    newhouse.getNewHouseScreenData();
    // 请求热门楼盘数据
    newhouse.getHotHousesList();
    // 搜索页内容高度自适应
    newhouse.setSearchHeight();
    // 城市切换
    common.changeNowCity("0001");
    // 加载更多
    var i = 1;
    $(".newhouse-content-wrap").on("click",".btn-more",function(){
      i++;
      fliterData.pageIndex = i;
      newhouse.getNewHouseData();
      newModel.onload("1");
    })
  },
  /*
   *  zzc 2016-8-10
   *  筛选、搜索操作方法
   */
  screenFun:function(){
    // 筛选类型切换
    $(".screen-tit-list").click(function(){
      var i = $(this).index();
      if($(this).hasClass("active")){
        $(this).removeClass("active");
        $(".screen-content-list").eq(i).hide();
        if($(this).index()=='3'){
          newhouse.resetOtherData();
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
    $(".other-list-wrap").css("max-height",h+"px");
    // 切换区域和地铁数据
    $(".screen-1-list").click(function(){
      var type = $(this).data("type");
      newModel.dictOrline(type);
      $(".screen-2-list,.screen-3-list").removeClass('active');
    })
    // 切换区域或者地铁的二级数据
    $(".area-list-wrap").on("click",".screen-2-list",function(){
      var key = $(this).data("key"),
          type = $(".screen-1-list.active").data("type");
      if(key){
        if(type=="dict"){
          newModel.dictSubcode(newModel.screenData().secDistrict[key]);
        }else if(type=="line"){
          newModel.station(newModel.screenData().subwayStations[key])
        }
      }else{
        if(type=="dict"){
          newModel.dictSubcode([]);
        }else if(type=="line"){
          newModel.station([])
        }
      }
    })
    // 区域、价格、排序筛选条件的点击事件
    $(".screen-content-wrap").on("click",".screen-item-list",function(){
      if(!$(this).hasClass("screen-1-list")){
        var txt,status;
        $(this).addClass("active").siblings().removeClass("active");
        // 调用筛选条件数据集合方法
        txt = $(this).text();
        status = $(this).hasClass("screen-2-list");
        if(txt=='不限'|| !status){
          newhouse.checkScreenData();
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
      newhouse.checkOtherData();
      $(".screen-tit-list").removeClass("active");
      $(".screen-content-list").hide();
      $("html").removeClass("html-unscrollable");
      $(".screen-shade").hide();
    })
    // 更多筛选条件取消事件
    $(".screen-confirm-wrap .btn-cancel").click(function(){
      newhouse.resetOtherData();
    })
    // 搜索事件
    $(".search-wrap .confirm").click(function(){
      var keyword = $(".j-val-input").val();
      fliterData.keyword = keyword || "";
      $(".search-wrap").hide().siblings(".height-44,.head-wrap,.screen-wrap,.newhouse-content-wrap,footer").show();
      newhouse.loadFun().getNewHouseData();
    })
    // 点击空白区域筛选条件隐藏
    $(".screen-shade").click(function(){
      $(".screen-tit-list").removeClass("active");
      $(".screen-content-list").hide();
      $("html").removeClass("html-unscrollable");
      $(".screen-shade").hide();
    })
    // 监听搜索
    $(".j-val-input").on("input",function(){
      fliterData.keyword = $(this).val();
      if(fliterData.keyword){
        newhouse.getRelatedHousesList();
      }else{
        newModel.relatedData([]);
      }
    })
  },
  /*
   *  zzc 2016-8-10
   *  检查区域、地铁、价格、排序筛选条件，然后赋值
   */ 
  checkScreenData:function(){
    var key,keyArr,area1,area2,price,sort;
    area1 = $(".screen-2-list.active").text();
    area2 = $(".screen-3-list.active").text();
    price = $(".screen-price-list.active").text();
    sort = $(".screen-sort-list.active").text();
    // 给筛选的区域标题赋值
    if( area1 == '不限' ){
      $(".screen-tit-text").eq(0).text('区域');
    }else if(area2){
      $(".screen-tit-text").eq(0).text(area2);
    }
    // 给筛选的价格标题赋值
    // 给筛选的价格标题赋值
    if(price == '不限'){
      $(".screen-tit-text").eq(1).text('价格');
    }else if(price){
      $(".screen-tit-text").eq(1).text(price);
    }
    // 给筛选的排序标题赋值
    if(sort){
      $(".screen-tit-text").eq(2).text(sort);
    }
    fliterData.dictCode = $(".dict-2-list.active").data("key");
    fliterData.dictSubcode = $(".dict-3-list.active").data("key");
    fliterData.lineId = $(".line-2-list.active").data("key");
    fliterData.station = $(".line-3-list.active").data("key");
    fliterData.sorttype = $(".screen-sort-list.active").data("key");
    // 拆分价格的最大和最小值
    key = $(".screen-price-list.active").data("key");
    keyArr = key ? key.split("-") : "";
    fliterData.pricemin = keyArr[0];
    fliterData.pricemax = keyArr[1];
    // 调用列表数据请求方法
    newhouse.loadFun().getNewHouseData();
  },
  /*
   *  zzc 2016-8-14
   *  检查更多选项里的筛选条件，然后赋值
   */
  checkOtherData:function(){
    var key,keyArr,num;
    num = $('.other-screen-list.active').length;
    if(num){
      $(".screen-tit-text").eq(3).text('更多('+num+')');
    }
    fliterData.roomType = $(".roomtype-list.active").data("key");
    // 拆分面积的最大和最小值
    key = $(".acreage-list.active").data("key");
    keyArr = key ? key.split("-") : "";
    fliterData.acreagemin = keyArr[0];
    fliterData.acreagemax = keyArr[1];
    // 调用列表数据请求方法
    fliterData.estate = $(".estate-list.active").data("key");
    fliterData.feature = $(".feature-list.active").data("key");
    fliterData.opentime = $(".opentime-list.active").data("key");
    fliterData.salestatus = $(".salestatus-list.active").data("key");
    // 调用列表数据请求方法
    newhouse.loadFun().getNewHouseData();
  },
  /*
   *  zzc 2016-8-14
   *  清空列表数据并进入加载状态
   */
  loadFun:function(){
    fliterData.pageIndex = '1';
    newModel.listData([]);
    $(".screen-shade").hide();
    $(".blank-white").show().siblings(".newhouse-list-wrap,.keywords-wrap,.not-found-wrap").hide();
    return this;
  },
  /*
   *  zzc 2016-8-14
   *  重置更多选项里的筛选条件
   */
  resetOtherData:function(){
    $(".screen-tit-text").eq(3).text('更多');
    $(".other-screen-list").removeClass("active");
    $(".sourceType-list").eq(2).addClass("active");
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
   *  parame  [string]  pricemin         价格下限
   *  parame  [string]  pricemin         价格上限
   *  parame  [string]  acreagemin       面积下限
   *  parame  [string]  acreagemax       面积上限
   *  parame  [string]  propertytype     物业类型
   *  parame  [string]  housespecial     楼盘特色
   *  parame  [string]  sellinfo         销售状态
   *  parame  [string]  roomno           房型
   *  parame  [string]  residentialname  搜索关键词
   *  parame  [string]  sort             排序
   *  parame  [string]  currentPage      当前页码
   *  parame  [string]  rowsPerPage      每页数据长度
   */
  getNewHouseData:function(){
    var parames;
    parames = {
      dictitemcode: fliterData.dictCode ||decodeURIComponent(common.getUrlParam('dictitemcode') || ""),
      dictitemsubcode: fliterData.dictSubcode ||decodeURIComponent(common.getUrlParam('dictitemsubcode') || ""),
      lineid: fliterData.lineId ||decodeURIComponent(common.getUrlParam('lineid') || ""),
      station: fliterData.station ||decodeURIComponent(common.getUrlParam('station') || ""),
      pricemin: fliterData.pricemin ||decodeURIComponent(common.getUrlParam('pricemin') || ""),
      pricemax: fliterData.pricemax ||decodeURIComponent(common.getUrlParam('pricemax') || ""),
      acreagemin: fliterData.acreagemin ||decodeURIComponent(common.getUrlParam('acreagemin') || ""),
      acreagemax: fliterData.acreagemax ||decodeURIComponent(common.getUrlParam('acreagemax') || ""),
      roomno: fliterData.roomType ||decodeURIComponent(common.getUrlParam('roomno') || ""),
      propertytype: fliterData.estate ||decodeURIComponent(common.getUrlParam('propertytype') || ""),
      housespecial: fliterData.feature ||decodeURIComponent(common.getUrlParam('housespecial') || ""),
      opentime: fliterData.opentime ||decodeURIComponent(common.getUrlParam('opentime') || ""),
      sellinfo: fliterData.salestatus ||decodeURIComponent(common.getUrlParam('sellinfo') || ""),
      residentialname: fliterData.keyword || decodeURIComponent(common.getUrlParam('residentialname') || ""),
      sorttype: fliterData.sorttype || decodeURIComponent(common.getUrlParam('sorttype') || ""),
      currentPage: fliterData.pageIndex,
      rowsPerPage: fliterData.pageSize,
      Requrl: newApi
    }
    common.jsonp("homenhapi.homepage.search","get",parames,function(res,success){
      if(res[success]){
        for(var i=0; i<res[success].data.data.length; i++){
          res[success].data.data[i].publicTime = common.getDate2(res[success].data.data[i].publicTime);
          res[success].data.data[i].averagePrice = res[success].data.data[i].averagePrice ? res[success].data.data[i].averagePrice : "";
          newModel.listData.push(res[success].data.data[i]);
        }
        if(fliterData.pageIndex<res[success].data.totalPage){
          newModel.moreStatus("2");  
        }else{
          newModel.moreStatus("1");  
        }
        if(res[success].data.total == '0'){
          $(".not-found-wrap").show();
        }else{
          $(".not-found-wrap").hide();
        }
        // 显示列表
        $(".J-recommend-list").show();
        newModel.onload("2");
        common.changeSiteMenu();
        $("html").removeClass("html-unscrollable");
        $(".screen-shade").hide();
        $(".blank-white").hide().siblings(".newhouse-list-wrap,.keywords-wrap").show();
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
  getNewHouseScreenData:function(site){

    common.jsonp("homenhapi.homepage.getSearchCondition","get",{Requrl: newApi},function(res,success){
      if(res[success]){
        var data = res[success].data;
        newModel.screenData(data);
        newModel.dictCode(data.district);
        newModel.line(data.subwayLines);
        newModel.price(data.avgpriceRanges);
        newModel.sort(data.houseStyles);
        newhouse.splitArrFun("roomType",data.houseStyles);
        newhouse.splitArrFun("acreage",data.acreageRange);
        newhouse.splitArrFun("estateType",data.propertyTypes);
        newhouse.splitArrFun("feature",data.housespecial);
        newhouse.splitArrFun("openTime",data.selltimes);
        newhouse.splitArrFun("saleStatus",data.sellinfos);
        newModel.dictOrline("dict");
        // 调用筛选方法
        newhouse.screenFun();
      }else{
        console.log("您没有提供调用函数……");
      }
    }) 
  },
  /*
   *  zzc 2016-8-10
   *  筛选条件数组分割，4个一组
   *  parame  [string]  key          newModel的属性
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
      newModel[key] && newModel[key].push(_arr);
    }
  },
  /*
   *  zzc  2016-8-25
   *  楼盘自动联想,接口由二手房团队提供
   *  [parmas]  {number}  from   来源，11代表新房，12代表二手房
   */
  getRelatedHousesList:function(){
    var parmas = {
      from: '11',
      name: fliterData.keyword,
      Requrl: secApi
    }
    common.jsonp("homeoldapi.restful.inter.keyword.getResidential","get",parmas,function(res,success){
      if(res[success]){
        newModel.relatedData(res[success].data);
      }
    })
  },
  /*
   *  zzc  2016-8-25
   *  热门楼盘
   */
  getHotHousesList:function(){
    var parmas = {
      curpage: "1",
      pagesize: "10",
      Requrl: newApi
    }
    common.jsonp("homenhapi.homepage.getRecommentHouses","get",parmas,function(res,success){
      if(res[success]){
        newModel.HotData(res[success].data);
      }
    })
  },
  /*
   *  zzc  2016-8-26
   *  搜索页内容高度自适应
   */
  setSearchHeight:function(){
    var h = $(window).height()-98
    $(".search-related-wrap").css("height",h);
  },
  /*
   *  黄毅  2016-3-8
   *  搜索页面tab切换
   */ 
  tabLocation:function(){
    $(".search-page-wrap").hide();
    $(".swiper-bottom").hide();
    //左侧栏目切换
    $(".location-left>li").click(function() {
      $(this).addClass("left-tab").siblings().removeClass("left-tab");
      var index = $(this).index();
      $(".location-right").eq(index).addClass("location-show").siblings().removeClass("location-show");
    });
    //右侧切换
    $(".area-tit").click(function(){
      $(this).find("i.ar").toggleClass("ar-angle-down").toggleClass("ar-angle-right");
      $(this).siblings().find("i.ar").toggleClass("ar-angle-right").toggleClass("ar-angle-down");
      $(".swiper-bottom").toggle();
      $(".swiper-top").toggle();
      $(".swiper-station").addClass("station-none");
    });
    //当房型为写字楼时，价格发生变化
    $(".room-wrap .right-area").click(function(){
      var txt = $(this).find("label").text();
      if (txt == "写字楼"){
        $(".rent-another-wrap").css("display","block");
        $(".rent-another-wrap").siblings().css("display","none");
      }else{
        $(".rent-another-wrap").css("display","none");
        $(".rent-another-wrap").siblings().css("display","block");
      }
    })
    /*
     *  黄毅  2016-3-15
     *  搜索页地铁站三级子栏目
     */ 
    $(".swiper-station").addClass("station-none");
    $(".subway-list-wrap").on("click",".subway-list",function(){
      $(this).addClass("slide-blue").siblings().removeClass("slide-blue");
      var i = $(this).index();
      $(".swiper-station").eq(i-1).removeClass("station-none").siblings(".swiper-station").addClass("station-none");
    });
    $(".subway-list-wrap .right-area").eq(0).click(function(){
      $(this).addClass("slide-blue").siblings().removeClass("slide-blue");
      $(".swiper-station").addClass("station-none");
    });
  },
  /*
   *  黄毅  2016-3-29
   *  所有搜索页页面自适应全屏显示
   */ 
  searchAuto:function(){
    var h = $(window).height()-89;
    $(".location-right").css("height",h+"px");
  },
  /*
   *  黄毅  2016-3-11
   *  调用swiper，搜索选择类上下滑动效果
   */ 
  touchColumn:function(){
    var mySwiper = new Swiper ('.swiper-container', {
      direction: 'vertical',
      slidesPerView: 5.4,
      freeMode: true,
      freeModeMomentum:true,
      freeModeMomentumRatio:1,
      setWrapperSize :true
    }); 
  },
	/*
   *  张志成  2016-3-10
   *  租房列表页
   */ 
  houseModel:function(model){
    var regionID,districtID,subwayID,stationID,areaID,priceID,propertyType,salesFlag,way,src,type,city;
    var orderType = "1",
        discount = "0",
        propertyType = "0";
    //获取位置
    if(window.location.search){
      var arr = window.location.search.split(","),
          city = decodeURIComponent(arr[1] || "wuhan"),
          keyword = decodeURIComponent(arr[0].replace("?","") || " "),
          pageIndex;
    }else{
      city = decodeURIComponent(window.location.href.split("/")[3].split(".")[0] || "wuhan");
    }
    //给页面添加TDK
    var city_zh=common.switchCity(city);
    $("title").text(city_zh+"租房_"+city_zh+"租房信息网_"+city_zh+"亿房网");
    $("meta[name=keywords]").attr("content",city_zh+"租房,"+city_zh+"租房信息网");
    $("meta[name=description]").attr("content","亿房网"+city_zh+"租房频道提供及时有效的"+city_zh+"租房信息!若您需发布租房信息,寻找合适房源,欢迎来亿房网!");
    if(type){
      model = type;
    }
    var n="1";
    // 调用加载动画高度计算方法
    common.oldAutoHeight();
  	//调用getHouseMsg请求方法
  	newhouse.getHouseMsg(model,city,pageIndex,regionID,districtID,subwayID,stationID,areaID,priceID,propertyType,salesFlag,way,keyword,orderType,discount,src);
    //调用getScreenInfo请求方法
    newhouse.getScreenInfo(model,city);
  	/*
	   *  张志成  2016-3-10
	   *  租房列表页排序
	   */ 
  	$(".sort-privilege .btn-sort").click(function(){
      if($(this).hasClass("btn-click")){
        $(this).removeClass("btn-click");
        $(".shade").css({"display":"none","opacity":"0"});
        $(".screen-list").removeClass("sort-show");
        $("body").css("overflow","auto");
      }else{
        $(".shade").css({"display":"block","opacity":"1"});
        $(this).addClass("btn-click").siblings().removeClass("btn-click");
        var i = $(this).index();
        $(".screen-list").eq(i).addClass("sort-show").siblings().removeClass("sort-show");
        $("body").css("overflow","hidden");
      }
  		
    })
    $(".screen-list li").click(function(){
      $(this).addClass("sort-right").siblings().removeClass("sort-right");
      $(".screen-list").removeClass("sort-show");
      $(".ico-loading").css({"display":"block","opacity":"1"});
      $(".recommend-content-wrap ul").find("li").remove();
      $(".btn-click").removeClass("btn-click");
      $("body").css("overflow","auto");
      var state = $(this).parents(".shadow").index();
      if(state == "0"){
      	var id = $(this).attr("id");
      	switch(id){
      		case "1" : orderType = "1";
      		break;
      		case "2" : orderType = "2";
      		break;
          case "3" : orderType = "3";
          break;
          case "4" : orderType = "4";
          break;
          case "5" : orderType = "5";
          break;
          case "6" : orderType = "6";
          break;
      		default : orderType = "7";
      	}
      }else if(state == "1"){
      	var id = $(this).attr("id");
      	switch(id){
          case "0" : discount = "0";
          break;
      		case "1" : src = "1";
                     discount = "1";
      		break;
      		case "2" : src = "2";
      		break;
      		case "3" : src = "3";
      		break;
      		default : src = "4";
      	}
      }
      n = '1';
      newhouse.getHouseMsg(model,city,n,regionID,districtID,subwayID,stationID,areaID,priceID,propertyType,salesFlag,way,keyword,orderType,discount,src);
    })
    //点击半透明遮罩退出
    $(".bottom-btn .shade").click(function(){
      $(".btn-click").removeClass("btn-click");
    	$(".shade").css({"display":"none","opacity":"0"});
    	$(".screen-list").removeClass("sort-show");
      $("body").css("overflow","auto");
    })
    //点击加载更多
    $(".btn-more").click(function(){
    	n++;
    	$(this).text("正在加载").prepend("<i class='ar ar-loading-b revolve'></i>");
      newhouse.getHouseMsg(model,city,n,regionID,districtID,subwayID,stationID,areaID,priceID,propertyType,salesFlag,way,keyword,orderType,discount,src);
    }) 
    //筛选确定
    $(".confirm").click(function(){
      $(".area-wrap input").each(function(){
        if($(this).is(":checked")){
          if(city=="wuhan"){
           regionID = $(this).attr("class");
          }else{
            districtID = $(this).attr("class");
          }
        }
      })
      $(".railway-wrap input").each(function(){
        if($(this).is(":checked")){
           subwayID =$(this).attr("class");
        }
      })
      $(".swiper-station ul input").each(function(){
        if($(this).is(":checked")){
           stationID =$(this).attr("class");
        }
      })
      $(".proportion-wrap input").each(function(){
        if($(this).is(":checked")){
           areaID =$(this).attr("class");
        }
      })
      if($(".rent-wrap").css("display") != "none"){
        $(".rent-wrap input").each(function(){
          if($(this).is(":checked")){
             priceID =$(this).attr("class");
          }
        })
      }else{
        $(".rent-another-wrap input").each(function(){
          if($(this).is(":checked")){
             priceID =$(this).attr("class");
          }
        })
      }
      $(".room-wrap input").each(function(){
        if($(this).is(":checked")){
           propertyType =$(this).attr("class");
        }
      })
      $(".sale-wrap input").each(function(){
        if($(this).is(":checked")){
           salesFlag =$(this).attr("class");
        }
      })
      $(".way-wrap input").each(function(){
        if($(this).is(":checked")){
           way =$(this).attr("class");
        }
      })
      keyword = $(".search-page-wrap .search-input").val();
      // $(".search-input").val("");
      var f = $(".head-search .input-val").val();
      $(".head-search .input-character").val(f);

      newhouse.getHouseMsg(model,city,n,regionID,districtID,subwayID,stationID,areaID,priceID,propertyType,salesFlag,way,keyword,orderType,discount,src);
      $(".recommend-content-wrap ul").find("li").remove();
      $(".search-page-wrap").hide();
      $(".search-page-wrap").siblings("header,section,footer,div").not(".content-toggle").show();
      $(".head-search .search-show").hide();
    })
    //调用搜索方法，只有城市为武汉时，调用联想搜索
    if(city=="wuhan"){
      common.search(model);
    }
    $(".search-show").on("click","li",function(){
      var txt = $(this).text();
      if(model!="0001"){
        $(".search-input").val(txt);
      }
      $(".head-search .search-show").hide();
    })
    //特色搜索标签、新房列表底部标签点击立即搜索
    $(".character-search, .bottom-search").click(function(){
      $(".search-page-wrap").hide().css("opacity","0");
      $(".search-page-wrap").siblings("header,section,footer,.height-44").show();
      newhouse.loadContentUp();
      var tagid=$(this).attr("data-id");
      $(".recommend-content-wrap").find("li").remove();
      newhouse.getHouseMsg(model,city,n,regionID,districtID,subwayID,stationID,areaID,priceID,propertyType,salesFlag,way,keyword,"","","","",tagid);
    })
  },
  /*
   * 张志成 2016-3-10
   * 发起请求
   * @param  {[string]}  model       [请求模块，如：新房0001，二手房0002，租房0003]
   * @param  {[string]}  adderss     [地址]
   * @param  {[string]}  PageSize    [页面长度，默认为10]
   * @param  {[string]}  pageIndex   [页码]
   * @param  {string}    requrl      [请求地址]
   * @param  {string}    city        [城市]
   * @param  {string}    regionID    [行政区域,当城市为武汉时，该参数不变，当城市为其他分站时，该参数变为分站ID，区域变为districtID]
   * @param  {string}    districtID  [当城市为其他分站时，改参数为行政区域]
   * @param  {string}    subwayID    [地铁]
   * @param  {string}    stationID   [地铁站点]
   * @param  {string}    areaID      [面积]
   * @param  {string}    priceID     [价格]
   * @param  {string}    propertyType[房型]
   * @param  {string}    salesFlag   [出售状态]
   * @param  {string}    way         [租房方式]
   * @param  {string}    keyword     [关键词]
   * @param  {string}    orderType   [排序方式，如：默认：1；总价高到低：2；总价低到高：3；性价比高到低：4；低到高：5；单价高到低：6；单价低到高:7]
   * @param  {string}    discount    [只看优惠楼盘，选择了就为1，没选择就为0]
   * @param  {string}    src         [二手房右侧筛选，默认：1，个人：2，中介：3，有图：4]
   * @param  {string}    tagid       [特色搜索的id]
   */
  getHouseMsg:function(model,city,pageIndex,regionID,districtID,subwayID,stationID,areaID,priceID,propertyType,salesFlag,way,keyword,orderType,discount,src,from,tagid){
    var method = "",
        reqUrl = "",
        pageindex = pageIndex || '1';
    if (city=="undefined"){
      city = "wuhan";
    }
    if(city=="wuhan"){
      reqUrl = oldhouse_api;
    }else{
      reqUrl = oldhouse_api_fz;
    }
    var city_zh=common.switchCity(city);
    regionID = common.changeRegion(model,city_zh,regionID);
    common.ajax("Zufang.List.Get","post",{PageSize:"20",Pageindex:pageindex,OrderType :orderType ||"1",Discount:discount||"0",Requrl:reqUrl,RegionID:regionID||"0",DistrictID:districtID||"0",SubwayID:subwayID||"0",StationID:stationID||"0",AreaID:areaID||"0",PriceID:priceID||"0",PropertyType:propertyType||"0",SalesFlag:salesFlag||"0",Src:src||"1",Keyword:keyword||"",Way:way||"0",TagID:tagid||""},function(res,success){
      if(newhouse.loadHouseMsg && res[success]){
        $(".secondhouse-container,.secondhouse-container-rd").find(".not-found-wrap").remove();
        newhouse.loadHouseMsg(res[success],"",city);
        if(pageindex<res[success].pagecount){
          $(".recommend-content-wrap .btn-more").show();
        }else{
          $(".recommend-content-wrap .btn-more").hide();
        }
        common.changeSiteMenu();
      }else{
        console.log("您没有提供调用函数……");
      }
    }) 
  },
    /*
   * 张志成 2016-3-10
   * 接收返回的数据并分发处理
   * @param  {[string]}  n          [区分首页新房、二手房、租房的位置]
   */
  loadHouseMsg:function(accdata,n,city){
    var notfound = "<div class='not-found-wrap'>"
                  +"  <p class='tip-tit'>抱歉，没有找到信息</p>"
                  +"  <p class='tip-cont'>请换个搜索方式</p>"
                  +"</div>";
    if(accdata.data.length>0){
      for(var i=0; i<accdata.data.length; i++){
        newhouse.reHouseData(accdata.data[i],accdata.typeid,n,accdata.iszhuzhan,city);
      }
    }else{
      $(".secondhouse-container-rd .recommend-content-wrap").prepend(notfound);
      $(".recommend-content-wrap .btn-more").hide();
    }
    $(".shade,.ico-loading").css({"display":"none","opacity":"0"});
    $(".space").show();
    $(".ne-loadBtn, .bottom-label, .recommend-content-wrap").show();
    //搜索结果页面显示
    $("body .container,body footer").removeClass("container-hide");
    $(".space").removeClass("container-hide");
    //租房、二手房页面显示
    $(".secondhouse-container-rd").removeClass("container-hide");
    //隐藏正在加载中...
    $(".blank-white").hide();
    //显示底部关键词
    $(".keywords-wrap").show(); 

    //未找到信息提示页面自适应个屏幕
    var h = $(window).height()-139;
    $(".not-found-wrap").css("height",h+"px").show();
  },
  /*
   * 张志成 2016-3-10
   * 处理租房返回的数据
   */
  reHouseData:function(data,type,n,iszhuzhan,city){
    data.room = data.room || '';
    data.area = data.area || '';
    data.floors = data.floors || '';
    var s,pri;
    if(data.src){
      s = "<span class='tag tag-purple'>"+data.src+"</span>";
    }
    if(data.imageurl){
      s+="<span class='tag tag-green'>有图</span>";
    }else{
      data.imageurl = data.imageurl || 'http://img3.fdc.com.cn/m/images/notfind.png';
    }
    if(data.fitment){
      s+="<span class='tag tag-yellow'>"+data.fitment+"</span>"
    }
    if(data.price!="面议"){
      if(type=="0002"){
        pri = "<b>"+data.price+"万</b>";
      }else if(type=="0003"){
        pri = "<b>"+parseInt(data.price)+"</b>元/月";
      }
    }else{
      if(type=="0002"){
        pri = "<b>"+data.price+"</b>";
      }else{
        pri = "<b>"+data.price+"</b>";
      }
    }
    //判断二手房还是租房
    var href;
    if (type == "0002")
    {
      href = oldhouse+"/"+city+"/"+data.fid+".html";
    }else{
      href= zufang+"/"+city+"/"+data.fid+".html";
    }
    //判断图片格式
    var format = data.imageurl.slice(-3);
    $(".recommend-content-wrap").eq(n||"0").children("ul").append("<li class='recommend-list list-border'>"
                                            + "  <a href='"+href+"'>"
                                            +"     <div class='img'>"
                                            +"       <i class='ico ico-update'>["+data.publicdate+" 更新]</i>"
                                            +"       <img class='img-lazy' src='http://img3.fdc.com.cn/m/images/icon/loading.gif' data-echo='"+data.imageurl+img_size[0]+"' onerror='common.notfind()'>"
                                            +"     </div>"
                                            +"     <div class='text'>"
                                            +"       <h3>"+data.title+"</h3>"
                                            +"       <p class='grade-wrap'>"
                                            +"         <span>"+data.room+"</span><span>"+data.area+"㎡</span>"
                                            +"         <span>"+data.floors+"</span>"
                                            +"       </p>"
                                            +"       <p class='price price-font'>"
                                            +"         <em>"+data.xqname+"["+data.regionname+" "+data.districtname+"]</em>"
                                            +"         <span>"
                                            + pri
                                            +"         </span>"
                                            +"       </p>"
                                            +"       <p class='tag-list'>"+s+"</p>"
                                            +"     </div>"
                                            +"   </a>"
                                            +" </li>");

    Echo.init({
      offset: 0,
      throttle: 0
    });
    $(".shade,.ico-loading").css({"display":"none","opacity":"0"});
    if($(".btn-more").hasClass('load-other')){
      $(".btn-more").text("查看更多").append('<i class="morebtn-ico-r"></i>');
    }else{
      $(".btn-more").text("查看更多").prepend('<i class="morebtn-ico"></i>');
    }
  },
  /*
   * 张志成 2016-3-14
   * 请求筛选条件数据
   */
  getScreenInfo:function(model,city){
    var method = "",
        reqUrl = "",
        regionID;
    if(city=="wuhan"){
      reqUrl = oldhouse_api;
    }else{
      reqUrl = oldhouse_api_fz;
    }
    var city_zh=common.switchCity(city);
    regionID=common.changeRegion(model,city_zh);
    common.ajax("zufang.search.get","post",{Requrl:reqUrl,RegionID:regionID||"0"},function(res,success){
      if(newhouse.loadSecScreen && res[success]){
        newhouse.loadSecScreen(res[success].data);
      }else{
        console.log("您没有提供调用函数……");
      }
    }) 
  },
  /*
   * 张志成 2016-3-14
   * 渲染租房搜索条件数据
   */
  loadSecScreen:function(accdata){
    //行政区域条件
    if(accdata.districtlist){
      for(var i=0; i<accdata.districtlist.length; i++){
      $(".area-wrap").append("<li class='right-area swiper-slide'>"
                              +"  <input type='radio' name='area' id='area-"+accdata.districtlist[i].id+"' class='"+accdata.districtlist[i].id+"'>"
                              +"  <label for='area-"+accdata.districtlist[i].id+"'>"+accdata.districtlist[i].name+"</label>"
                              +"</li>");
      }
    }else{
      for(var i=0; i<accdata.listRegion.length; i++){
      $(".area-wrap").append("<li class='right-area swiper-slide'>"
                              +"  <input type='radio' name='area' id='area-"+accdata.listRegion[i].id+"' class='"+accdata.listRegion[i].id+"'>"
                              +"  <label for='area-"+accdata.listRegion[i].id+"'>"+accdata.listRegion[i].name+"</label>"
                              +"</li>");
      }
    }
    
    //地铁线路
    if(accdata.subwaylist){
      for(var i=0; i<accdata.subwaylist.length; i++){
        $(".subway-list-wrap").append("<li class='right-area swiper-slide subway-list'>"+accdata.subwaylist[i].Name+"</li>");
        $(".location-right").eq(0).append("<div class='swiper-container swiper-station'>"
                                          +"  <ul class='swiper-wrapper'>"
                                          +"    <li class='right-area swiper-slide'>"
                                          +"      <input type='radio' name='area' id='all-"+i+"' class='0'>"
                                          +"      <label for='all-"+i+"'>不限</label>"
                                          +"    </li>"
                                          +"  </ul>"
                                          +"</div>");
      }
    }
    //地铁站点
    if(accdata.stationlist){
      for(var i=0; i<accdata.stationlist.length; i++){
        for(var j=0; j<accdata.subwaylist.length; j++){
          if(accdata.stationlist[i].SubwayID==(j+1)){
            $(".swiper-station ul").eq(j).append("<li class='right-area swiper-slide'>"
                                                  +"  <input type='radio' name='area' id='station-"+accdata.stationlist[i].ID+"' class='"+accdata.stationlist[i].Spelling+"'>"
                                                  +"  <label for='station-"+accdata.stationlist[i].ID+"'>"+accdata.stationlist[i].Name+"</label>"
                                                  +"</li>");
          }
        }
      }
    }
    //面积条件
    for(var i=0; i<accdata.listArea.length; i++){
        $(".proportion-wrap").append("<li class='right-area'>"
                                    +"  <input type='radio' name='proportion' id='pro-"+accdata.listArea[i].id+"' class='"+accdata.listArea[i].id+"'>"
                                    +"  <label for='pro-"+accdata.listArea[i].id+"'>"+accdata.listArea[i].name+"</label>"
                                    +"</li>");
    }
    //价格条件
    for(var i=0; i<accdata.listPrice.length; i++){
      $(".rent-wrap").append("<li class='right-area'>"
                                  +"  <input type='radio' name='rent' id='rent-"+accdata.listPrice[i].id+"' class='"+accdata.listPrice[i].id+"'>"
                                  +"  <label for='rent-"+accdata.listPrice[i].id+"'>"+accdata.listPrice[i].name+"</label>"
                                  +"</li>");
    }
    //房型条件
    for(var i=0; i<accdata.listunit.length; i++){
      $(".room-wrap").append("<li class='right-area'>"
                                    +"  <input type='radio' name='room' id='room-"+accdata.listunit[i].id+"' class='"+accdata.listunit[i].id+"'>"
                                    +"  <label for='room-"+accdata.listunit[i].id+"'>"+accdata.listunit[i].name+"</label>"
                                    +"</li>");
    }
    //方式条件
    for(var i=0; i<accdata.listWay.length; i++){
      $(".way-wrap").append("<li class='right-area'>"
                                    +"  <input type='radio' name='way' id='way-"+accdata.listWay[i].id+"' class='"+accdata.listWay[i].id+"'>"
                                    +"  <label for='way-"+accdata.listWay[i].id+"'>"+accdata.listWay[i].name+"</label>"
                                    +"</li>");
    }
    newhouse.touchColumn();
    newhouse.tabLocation();
    $(".input-character").removeAttr("disabled");
  },
  /*
   * 张志成 2016-3-22
   * 楼盘信息请求入口
   */
  floorInfo:function(){
    var nickName,
        city;
    if(window.location.search){
      nickName =decodeURIComponent(window.location.search.split("&")[0].replace("?",""));
      city = decodeURIComponent(window.location.search.split("&")[1]);
    }else{
      nickName =decodeURIComponent(window.location.href.split("/")[4]);
      city = decodeURIComponent(window.location.href.split("/")[3]);
    }
    $(".btn-back").attr("href",house+"/"+city+"/"+nickName);
  },
  /*
   * zzc 2016-9-26
   * 替换app页面的链接（如果app已登录，app地址增加一个userid参数）
   * @param  {[string]}  className   [class名称]
   */
  replaceAppUrl:function(){
    // 获取userid
    var nUserid = common.getUrlParam('userid');
    if(!userid) return;
    //给导航链接加上userid
    var domNav = $(".top-nav a");
    if(domNav.length){
      for (var i=0; i<domNav.length; i++) {
        var _url = domNav[i].attr('href');
        domNav[i].attr("href",_url+"?userid="+nUserid);
      }
    }
  },
  /*
   * zzc 2016-8-16
   * 户型详情头部图片切换
   * @param  {[string]}  className   [class名称]
   */
  picSlide:function(className){
    var swiper = new Swiper("."+className, {
      slidesPerView : 1,
      setWrapperSize :true,
      lazyLoading : true,
      preloadImages: false,
      onInit: function(){
        var total = $(".swiper-slide").length;
        $(".pagination-all").text(total);
      },
      onSlideChangeEnd: function(){
        var i = $(".swiper-slide-active").index() + 1;
        $(".pagination-now").text(i);
      }
    });
  },
  /*
   * 张志成 2016-8-15
   * 户型详情入口
   * @param  {[string]}  Typeid   [区分热销和其他条件]
   */
  roomTypeDetail:function(){
    common.backtop();
    newhouse.picSlide("roomtype-img-wrap");
    common.changeSiteMenu();
    newhouse.typeheadxiala();
    common.countDown(".dataofftime",".residue-time",".btn-server-apply")
    var pageindex = "1";
    $(".btn-more").click(function(){
      pageindex++;
      viewModel.onload(1);
      newhouse.getTypecomdata(pageindex);
    })
    // 户型分析高度判断
    var h = $(".analyze-text p").height();
    if(h>104){
      $(".btn-hide-more").show();
      $(".analyze-text p").css("height","104px");
    }
    $(".btn-hide-more").click(function(){
      $(".btn-hide-more").hide();
      $(".analyze-text p").css("height","auto");
    })
    // 跳转户型点评判断
    $(".btn-comment-href").click(function(){
      var token = decodeURIComponent(uc_cookie.Get("uc_token")),
          name = $("#pinyin").val(),
          aid = $("#apartmentId").val(),
          curUrl = window.location.href;
      if(token !== "null"){
        window.location.href = newHref + "/wuhan/" + name + "/housetype/" + aid + "/comment/write";
      }else{
        uc_cookie.Set("ucm_curUrl", curUrl, null, null, null, null);
        common.applyErrorDialog("请先登录！");
        setTimeout(function(){
          window.location.href = uc_login;
        },2000)
      }
    })
    // 跳转户型点评判断
    $(".btn-comment-href-app").click(function(){
      var token = window.location.href.match(/\/id(\w+)?/)[1],
          id_app = token ? 'id'+token : '',
          name = $("#pinyin").val(),
          aid = $("#apartmentId").val();
      if(token !== "null"&&token !== ""&&token !== undefined){
        window.location.href = newHref + "/app/wuhan/" + name + "/housetype/" + aid + "/comment/write/"+id_app;
      }else{
        common.applyErrorDialog("请先登录！");
        setTimeout(function(){
          window.location.href = uc_login;
        },2000)
      }
    })
    Echo.init({
      offset: 0,
      throttle: 0
    });
   },
   /*
   * 余莽 2016-8-18
   * 请求户型详情页评论区数据
   * @param  {[string]}  Typeid   
   */
  getTypecomdata:function(pageindex){
    var params;
    params={
      apartmentid: $("#roomid").val() || "",
      typemodel: pageindex,
      pagesize: "20",
      Requrl: newApi
    }             
    common.jsonp("homenhapi.getCriticInfoByPage","get",params,function(res,success){
      if(res[success]){
        for (var i = 0; i < res[success].datalist.length;i++) {
          res[success].datalist[i].gmt_created = common.getDate(res[success].datalist[i].gmt_created);
          viewModel.listData.push(res[success].datalist[i]);
        }
        if(pageindex<res[success].totalpages){
          viewModel.moreStatus(2);
        }else{
          viewModel.moreStatus(1);
        }
        viewModel.onload(2);
      }
      else{
          console.log("您没有提供调用函数……");
       }
    })
  },
  /*
   * 张志成 2016-3-22
   * 多图浏览页面
   */
  slidePic:function(){
    var pictabIndex,      //主题角标
        residentialId,    //主题类型   
        imgType,         //小区id
        name;             //楼盘名
    name = window.location.href.split("/")[4];
    imgType = window.location.href.split("/")[6] || '5';
    residentialId = $("#bid").val();
    switch(imgType){
      case "5": pictabIndex = 0;
      break;
      case "3": pictabIndex = 1;
      break;
      case "2": pictabIndex = 2;
      break;
      case "7": pictabIndex = 3;
      break;
      case "4": pictabIndex = 4;
      break;
      default: pictabIndex = 0;
    }
    $(".np-pictab").eq(pictabIndex).addClass("active").siblings().removeClass("active");
    newhouse.backDetail(name);
    newhouse.getSlidePic(imgType,residentialId);
    //点击底部tab图片切换
    $(".np-pictab").on("click",function(){
      var i=$(this).index(),
          url = newHref+"/wuhan/";
      switch(i){
        case 0: imgType = 5;
        break;
        case 1: imgType = 3;
        break;
        case 2: imgType = 2;
        break;
        case 3: imgType = 7;
        break;
        case 4: imgType = 4;
        break;
        default: imgType = 5;
      }
      window.location.href= url + name + '/album/' + imgType;
      // window.location.href = url + "?" + imgType;
    });
  },
  /*
   * 张志成 2016-3-22
   * app多图浏览页面
   */
  slidePic2:function(){
    var pictabIndex,      //主题角标
        residentialId,    //主题类型
        imgType,          //小区id
        name,            //楼盘名
        id_app;          //用户id
    name = window.location.href.split("/")[5];
    imgType = window.location.href.split("/")[7] || '5';
    id_app =$("#id_app").val();
    if(id_app == undefined||id_app==null){
      id_app=''
    }
    residentialId = $("#bid").val();
    switch(imgType){
      case "5": pictabIndex = 0;
      break;
      case "3": pictabIndex = 1;
      break;
      case "2": pictabIndex = 2;
      break;
      case "7": pictabIndex = 3;
      break;
      case "4": pictabIndex = 4;
      break;
      default: pictabIndex = 0;
    }
    $(".np-pictab").eq(pictabIndex).addClass("active").siblings().removeClass("active");
    newhouse.backDetail(name);
    newhouse.getSlidePic(imgType,residentialId);
    //点击底部tab图片切换
    $(".np-pictab").on("click",function(){
      var i=$(this).index(),
      // url = "http://house.m.fdc.com.cn/wuhan/";
      // url = "file:///E:/work/fdc_Mobile/app2.0/newpopup.html";
          url = newHref+"/app/wuhan/";
      //url = "http://local.nhouse.fdc.com.cn/app/wuhan/"
      switch(i){
        case 0: imgType = 5;
        break;
        case 1: imgType = 3;
        break;
        case 2: imgType = 2;
        break;
        case 3: imgType = 7;
        break;
        case 4: imgType = 4;
        break;
        default: imgType = 5;
      }
      window.location.href= url + name + '/album/' + imgType+"/id"+id_app;
    })
  },
  /*
   * 张志成 2016-3-22
   * 请求图片数据
   * @param  {string}    imgType        [主题类型，依次对应是：1-效果图；2-实景图；3-样板间房；4-工程进度；5-交通图]
   * @param  {string}    residentialid  [小区ID]
   */
  getSlidePic:function(imgType,residentialId){
    var param = {
      residentialId: residentialId,
      imgType: imgType,
      Requrl: newApi
    }
    common.jsonp("homenhapi.HouseAlbumList","get",param,function(res,success){
      var picData = "";
      if(res[success]){
        console.log(res[success]);
        popupModel.mData(res[success].dataList);
      }
      $(".hide-info").html(picData);
      // newhouse.backDetail();
      //图片手势滑动的效果
      var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationType: 'fraction',
        preloadImages: false,
        lazyLoading: true
      });
    }) 
  },
  /*
   * 黄毅 2016-4-29
   * 户型弹窗返回详情页
   * @param  {string}    name  [url后的name]
   */
  backDetail:function(name){
    $(".back-detail").on("click",function(){
      window.location.href = newHref + '/wuhan/' + name;
    });
    $(".back-detail-app").on("click",function(){
       window.history.back();
    });
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
   * lx 2016-8-15
   * 新房读取评论详情
   */
  loadMore:function(rHeight){
    var tag = $(".load-hidden");
    var flag = true;
    tag.each(function(i){
      var height = $(this).prev().height();
      if(height>=rHeight){
        $(this).css("display","block").prev().height(rHeight).addClass("pMask");
      }else{
        $(this).prev().height("auto");
      }
    })
    tag.click(function(){
      if(flag){
        flag = false;
        $(this).prev().height("auto").removeClass("pMask");
        $(this).find("a").addClass("transform");
      }else{
        flag = true;
        $(this).prev().height(rHeight).addClass("pMask");
        $(this).find("a").removeClass("transform");
      }
    })
  },
  /*
   * lx 2016-8-15
   * 新房楼盘首页
   */
  housesInit:function(){
    newhouse.bannerList("houses-banner");
    newhouse.commonSwiper("swiper-li",2.96,10);
    newhouse.commonSwiper("hot-swiper-li",2.97,17);
    newhouse.hiddenShow(43);
    newhouse.changeTitle();
    newhouse.liHiddenShow(162);
    newhouse.typeheadxiala();
    newhouse.checkToComment("btn-comment-href");
    newhouse.checkToComment("btn-comment-href-app",newHref+"/app");
    common.changeSiteMenu();
    common.backtop();
    common.countDown(".differSec",".countdown",".serve-li .J-apply");
    Echo.init({
      offset: 0,
      throttle: 0
    });
  },
  /*
   * zzc 2016-9-2
   * 跳转口碑发点评判断
   * [parmas]  {string}  klass  class名
   * [parmas]  {string}  link   自定义地址
   */ 
  checkToComment:function(klass,link){
    $("."+klass).click(function(){
      var curUrl = window.location.href,
          id_app = curUrl.split('/id')[1] ? 'id'+curUrl.split('/id')[1] : '',
          token = uc_cookie.Get("uc_token") ? decodeURIComponent(uc_cookie.Get("uc_token")) : id_app,
          name = $("#pinyin").val(),
          url = link || newHref ;
          
      if(token !== "null"&&token !== ""){
        window.location.href = url + "/wuhan/" + name + "/comment/write/" + id_app;
      }else{
        uc_cookie.Set("ucm_curUrl", curUrl, null, null, null, null);
        common.applyErrorDialog("请先登录！");
        setTimeout(function(){
          window.location.href = uc_login;
        },2000)
      }
    })
  },
  /*
   * lx 2016-8-15
   * 轮播
   *  parame  [string]  content   类名
   *  parame  [num]     num       slidesPerCiew参数
   */
  bannerList:function(className){
    var swiper = new Swiper("."+className, {
      slidesPerView : 1,
      setWrapperSize :true,
      lazyLoading : true,
      preloadImages: false,
      onInit: function(){
        var total = $(".tagSlide").length;
        $(".pagination-all").text(total);
      },
      onSlideChangeEnd: function(){
        var i = $(".swiper-slide-active").index() + 1;
        $(".pagination-now").text(i);
      }
    });
  },
  /*
   *  parame  [string]  content   类名
   *  parame  [num]     num       slidesPerCiew参数
   *  parame  [num]     margin    spaceBetween参数，间距
   */
  
  commonSwiper:function(content,num,margin){
    var swiper = new Swiper("."+content, {
      slidesPerView : num,
      setWrapperSize :true,
      spaceBetween : margin,
      slidesOffsetBefore: margin,
      slidesOffsetAfter: margin
    });
  },
  /*楼盘选项卡*/
  changeTitle:function(){
    var tag = $(".info-nav-title ul li");
    var li = $(".info-nav .swiper-li");
    $(function(){ 
      li.eq(0).siblings().css({"display":"none"})
    });
    tag.click(function(){
      var index = $(this).index();
      $(this).siblings().find("span").removeClass("spc");
      $(this).find("span").addClass("spc");
      li.each(function(){
        $(this).css({"display":"none"})
      })
      li.eq(index).css({"display":"block"})
    });
    
  },
  /*
   *显示隐藏
   *  parame  [num]  rHeight   评论隐藏高度设定
   */
  hiddenShow:function(rHeight){
    var tag = $(".load-hidden");
    var flag = true;
    tag.each(function(i){
      var height = $(this).prev().height();
      if(height>rHeight){
        $(this).prev().height(rHeight).addClass("two-row");
        $(this).css("display","block");
      }else{
        $(this).prev().height("auto");
      }
    })
    tag.click(function(){
      if(flag){
        flag = false;
        $(this).prev().height("auto").removeClass("two-row");
        $(this).find("a").addClass("transform");
      }else{
        flag = true;
        $(this).prev().height(rHeight).addClass("two-row");
        $(this).find("a").removeClass("transform");
      }
    })
  },
  /*
   *显示隐藏
   *  parame  [num]  rHeight   评论隐藏高度设定
   */
  liHiddenShow:function(rHeight){
    var li = $(".counselor-li");
    var tag = $(".l-more");
    var flag = true;
    if(li.length>2){
      li.parent().height(rHeight).css("overflow","hidden");
    }else{
      li.parent().height("auto");
      tag.css("display","none");
    }
    tag.click(function(){
      li.parent().height("auto");
      if(flag){
        flag = false;
        $(this).prev().height("auto");
        $(this).find("a").addClass("transform");
      }else{
        flag = true;
        $(this).prev().height(rHeight);
        $(this).find("a").removeClass("transform");
      }
    })
  },
  /*
   * 余莽 2016-8-22
   * 户型列表页
   */
  roomlistpage:function(){
    newhouse.typeslidelist();
    newhouse.typeheadxiala();
    common.changeSiteMenu();
    var current="1";
    $('.btn-more').click(function(){
      current++;
      viewModel.onload(1);
      newhouse.getTypelistdata(current);
    })
    Echo.init({
      offset: 0,
      throttle: 0
    });
  },
  //户型图滑动效果
  typeslidelist:function(){
    var mySwiper = new Swiper ('.swiper-container-inform', {
      slidesPerView: 4.5,
      setWrapperSize: true
    }); 
  },
  //户型图头部下拉
  typeheadxiala:function(){
    var xialabtn=$('.head-tit .head-xiala');
    var showUl=$('.head-nav-ul');
    var oLis=$('.head-nav-ul li');
    $('.shade').hide();
    xialabtn.click(function(event) {
      showUl.toggle();
      xialabtn.toggleClass('transform');
      $("html").toggleClass('html-unscrollable')
      $('.shade').toggle() 
    });
    $('.shade').click(function(event){
      showUl.toggle();
      xialabtn.toggleClass('transform');
      $("html").toggleClass('html-unscrollable')
      $('.shade').toggle() 
    })
  },
  //户型列表获取数据
  getTypelistdata:function(current){
    var params;
    params={
      residentialInfoId: $("#bid").val(),
      curpage:current,
      pagesize: "20",
      shortKey: $("#shortKey").val() || "hot",
      Requrl: newApi
    } 
    common.jsonp("homenhapi.HouseUnitList","get",params,function(res,success){
      if(res[success]){
        for (var i = 0; i < res[success].HouseTypeList.length;i++) {
          viewModel.listData.push(res[success].HouseTypeList[i]);
        }
        if(current<res[success].totalpage){
          viewModel.moreStatus(2);
        }else{
          viewModel.moreStatus(1);
        }
        viewModel.onload(2);
      }
      else{
        console.log("您没有提供调用函数……");
      }
    })
  },
   /*
   *  zzc  2016-8-22
   *  报名页面入口
   */
  applyEntrance:function(){
    //点击《亿房网看房团活动申明》，显示其详情
    $(".active-desc").click(function(){
      $(".dialog-active-state").show();
      $(".shade-st").css({"display":"block","opacity":"1"});
    })
    //点击遮罩层隐藏
    $(".shade-st, .dialog-active-state .ar-cancel").click(function(){
      $(".dialog-active-state").hide();
      $(".shade-st").css({"display":"none","opacity":"0"});
    })
    common.autoApp(".regist-wrap");
    common.autoApp(".adver-img img",".apply-info");
    //点击发送验证码
    newhouse.validateSignAct();
    newhouse.getwillinghouse();
  },
  /*
   *  zzc  2016-8-22
   *  发送验证码
   */
  postCheckCode:function(){
    var phone = $("#phonetxt").val();
    common.jsonp("homenhapi.sendSmsCode","get",{telephone: phone,Requrl:newApi},function(res,success){
        if(res[success]){
          if(res[success].msg == "短信发送成功"){
            common.applyErrorDialog('短信发送成功');
          }else{
            common.applyErrorDialog('短信发送失败');
          }
        }else{
          console.log("您没有提供调用函数……");
        }
    })
  },
  /*
   *  zzc  2016-8-22
   *  报名方法
   *  parmas  [number]  id   商品id
   *  parame  [num] pageType 提交页面类型   1.申请优惠，看房团报名，胖哥陪狗 
   *                                        2.为我荐房 
   */
  applyFun:function(pageType){
    var parmas,
        id = $("#gid") || "",
        name = $("#nametxt").val() || "",
        phone = $("#phonetxt").val(),
        code = $("#codetxt").val(),
        num = $("#counttext").val() || "",
        wihouse = $('#wilinghouse').val() || "",
        houseid = $("#wilinghouse").data("id") || "";
    parmas = {
      gid: $("#gid").val() || "5791b54298540a1e24dfe191",
      username: name,
      telephone: phone,
      smsCode: code,
      number: num,
      name : wihouse,
      houseid: houseid,
      Requrl: newApi
    }
    common.jsonp("homenhapi.signUpOrder","get",parmas,function(res,success){
      newhouse.controlDialog(res,success,pageType);
    })
  },
  /*
   * 余莽 2016-8-30
   * 控制报名后弹出对话框显示隐藏
   *  parame  [num] pageType 提交页面类型   1.申请优惠，看房团报名，胖哥陪狗 
   *                                        2.为我荐房 
   */
  controlDialog:function(res,success,pageType){
    if(res[success]){
      $(".shade-revolve, .ico-loading").hide();
      if(pageType == 1){
        var result = res[success].msg;
        if(result.indexOf("报名失败") != -1){
          $('.dialogfail').show();
          // $('.shade').show();
        }else if(result.indexOf("验证码有误") != -1){
          common.applyErrorDialog('验证码有误!');
          var timer = setTimeout(function(){
            $('.shade').hide();
          },2000)
          return false;
        }else{
          $('.dialog-success').show();
        }
      }else if(pageType == 2){
        console.log(res[success])
        if(res[success].success){
          $('.dialog-success').show();
        }else if(res[success].msg.indexOf("验证码校验失败") != -1){
          common.applyErrorDialog('验证码有误!');
          var timer = setTimeout(function(){
            $('.shade').hide();
          },2000)
          return false;
        }else{
          $('.dialogfail').show();
        }
      }
    }
    $('.shade, .closeimg').click(function() {
      $('.dialogfail').hide();
      $('.dialog-success').hide();
      $('.shade').hide();
    });
    $('.backtopre').click(function() {
      window.history.back();
    });
  },
  /*
   * 黄毅 2016-4-20
   * app系列表单验证
   * parame  [num]  pageType  页面类型   1.申请优惠，看房团报名，胖哥陪狗 
   *                                     2.为我荐房
   */
  submitTxt:function(pageType){
    var username = $("#nametxt").val(),
        tel = $("#phonetxt").val(),
        code = $("#codetxt").val(),
        check = $("#check-id").prop("checked"),
        people = $(".count-wrap input").val();
       
    if (username == "") {
      //弹出错误信息
      common.applyErrorDialog('请输入真实姓名');
      return false ;
    }
    if (tel == "") {
      common.applyErrorDialog('手机号不能为空');
      return false ;
    }
    if (!/^1[34578]\d{9}$/.test(tel)) {
      common.applyErrorDialog('请输入11位有效手机号码');
      return false ;
    }
    if($(".count-wrap .count")[0]){
      if(people==""){
        common.applyErrorDialog('报名人数不能为空');
        return false ;
      }if(code == ""){
        common.applyErrorDialog('请输入验证码');
        return false ;
      }
    }
    if (code == "") {
      common.applyErrorDialog('请输入验证码');
      return false ;
    }    
    if (check == false) {
      common.applyErrorDialog('请同意《亿房网看房团活动申明》');
      return false ;
    }

    $(".shade-revolve, .ico-loading").show().css("opacity","1");
    $(".shade").show();
    //登录以及活动报名
    if(pageType == 1){
      newhouse.applyFun(pageType);
    }else if(pageType == 2){
      newhouse.getrecommSum(pageType);
    }
    return false;
  },
  /*
   * 报名页面验证
   */
  validateSignAct:function(){
    $(".shade, .btn-affirm").click(function () {
        window.history.back();
    });
    //报名验证码
    var issend = true;
    var send_t = 90;
    var send_time;
    var ele_time = $(".btn-acquire");
    function sendTime() {
      clearTimeout(send_time);
      send_t--;
      ele_time.html(send_t + "秒后再次获取");
      if (send_t == 0) {
        clearTimeout(send_time);
        ele_time.html("获取验证码");
        send_t = 90;
        issend = true;
        ele_time.css({ "background-color": "#fc6565", "color":"#fff"});
      } else {
        send_time = setTimeout(function() {
            sendTime();
        }, 1000);
      }
    }
    ele_time.on("click", function () {
      if (issend) {
        if ($("#phonetxt").val() == "") {
            common.applyErrorDialog('手机号不能为空');    
        } else if (!/^1[34578]\d{9}$/.test($("#phonetxt").val())) {
            common.applyErrorDialog('手机号格式错误');    
        } else {
          issend = false;
          $(".error").text("");
          $(".error").hide();
          sendTime(); //启动计时
          var tel = $("#phonetxt").val();
          ele_time.css({ "background-color": "#eee", "color":"#333"});
          newhouse.postCheckCode(); //发送验证码
        }
      }          
    }) 
    //报名验证码:END
  },

  /*
   * 获取意向楼盘下拉联想
   * 余莽 2016-08-26
   */
  getwillinghouse:function(){
    // 监听用户输入，联想楼盘
    $('#wilinghouse').on('input',function(){
      var wantname=$(this).val();
      var params;
      params={
        name: wantname,
        from: "12",
        Requrl: secApi
      }
      common.jsonp("homeoldapi.restful.inter.keyword.getResidential","get",params,function(res,success){
        if(res[success]){
           for(var i=0; i<res[success].data.length; i++){
            viewModel.listData.push(res[success].data[i])
           }
           if(wantname!=''){
            $('.msgtips').show();
           }else{
            $('.msgtips').hide();
           }
        }else{
          console.log("您没有提供调用函数……");
        }
      })
    })
    // 选取楼盘
    $('.msgtips').on('click',"li",function() {
      var house = $(this).text(),
          id = $(this).data("id");
      $('#wilinghouse').val(house).attr("data-id",id);
      $('.msgtips').hide();
   })
  },
  /*
   * 余莽 2016-8-26
   * 获取荐房条件
   */
  gethouseItem:function(){
    var params;
    params={
      Requrl : newApi
    }
    common.jsonp("homenhapi.recommendhouse.getRecommentCondition","get",params,function(res,success){
      if (res[success]) {
        viewModel.listData(res[success].data.districts);
        viewModel.acreageData(res[success].data.acreageRange);
        viewModel.priceData(res[success].data.housePriceRanges);
      }else{
        console.log("您没有提供调用函数……");
      }
    }) 
  },
  //为我荐房报名入口
  getrecommSum:function(pageType){
    var params,
        name= $('#nametxt').val(),
        phoneNum= $('#phonetxt').val(),
        code= $('#codetxt').val(),
        acreage=$('.budget li').eq(1).text();
    params={
      realName :name ,
      phoneNum :phoneNum,
      verifyCode: code,
      acreage: acreage,
      Requrl: newApi
    }
    common.jsonp("homenhapi.recommendhouse.recommendHouse","get",params,function(res,success){
       newhouse.controlDialog(res,success,pageType);
    })
  },

  /*
   * lx 2016-8-24
   * 口碑点评入口
   */ 
  praiseInit:function(){
    var pageindex = 1;
    newhouse.typeheadxiala();
    newhouse.commentNum();
    // newhouse.getPraiseInfo(pageindex);
    newhouse.checkToComment("btn-comment-fixed");
    newhouse.checkToComment("btn-comment-fixed-app",newHref + "/app");
    //加载更多
    $(".comment").on("click",".btn-more",function(){
      pageindex++;
      praiseModel.onload(1);
      newhouse.getPraiseInfo(pageindex);
    })
  },
  /*
   * lx 2016-8-24
   * 请求图片数据
   * @param  {string}    typeId         [图片类型，依次对应是：1-效果图；2-实景房；3-样板间房；4-户型图；5-平面图；6-交通图]
   * @param  {string}    nickname       [楼盘名称]
   * @param  {string}    pageindex      [页码]
   */
  getPraiseInfo: function(pageindex){
    var param = {
      page: pageindex,
      pageSize: "20",
      bid: $("#bid").val() || "",
      Requrl: newApi
    }
    common.jsonp("homenhapi.wordofmouth.gethouseComments","get",param,function(res,success){
      if(res[success]){
        var result = res[success].data;
        for(var i=0;i<result.content.length;i++){
          result.content[i].praiseTime = common.getDate(result.content[i].gmt_modified);
          result.content[i].imgLength = result.content[i].has_img == 1?result.content[i].imgs.length:0
          result.content[i].addDiv = result.content[i].imgLength != 0 ? result.content[i].imgLength%3 : 0;
          praiseModel.dataList.push(result.content[i])
        }
        if(pageindex<result.totalPage){
          praiseModel.moreStatus(2);
        }else{
          praiseModel.moreStatus(1);
        }
        praiseModel.onload(2);
        newhouse.loadMore(73);
      }
    });
  },
  /*
   * lx 2016-8-24
   * 点评分数限制
   */ 
  commentNum: function(){
    // var tagNum = $(".praise-comment>.comment-title>b"),
        // num = tagNum.html().split("."),
    var tagComment = $(".praise-comment>.comment-content>p>em");
    tagComment.each(function(){
      var comment = $(this).html().split("&nbsp;&nbsp;");
      $(this).html(comment[0] + "&nbsp;&nbsp;" +comment[1].slice(0,1)) 
    })
    // num[1] ? tagNum.html("<span>"+num[0]+"</span>."+num[1].slice(0,1)) : tagNum.html("<span>"+num[0]+"</span>.0");
  },
  /*
   *  zzc  2016-9-2
   *  地图页
   *  [parmas]  {string}   name    楼盘名
   *  [parmas]  {number}   x       经度
   *  [parmas]  {string}   y       纬度
   *  [parmas]  {string}   h       map容器高度
   */ 
  mapDetail:function(){
    var name,x,y,h;
    common.changeSiteMenu();
    newhouse.typeheadxiala();
    name = $("#residentialName").val();
    x = $("#xsite").val();
    y = $("#ysite").val();
    //计算map容器高度
    h = $("body").height() - 44;
    $(".mobilemap").css("height",h+'px');
    //创建和初始化地图函数：
    function initMap(){
      createMap();//创建地图
      setMapEvent();//设置地图事件
      addMapControl();//向地图添加控件
      addMapOverlay();//向地图添加覆盖物
    }
    function createMap(){ 
      map = new BMap.Map("map"); 
      map.centerAndZoom(new BMap.Point(x,y),15);
    }
    function setMapEvent(){
      map.enableScrollWheelZoom();
      map.enableKeyboard();
      map.enableDragging();
      map.enableDoubleClickZoom()
    }
    function addClickHandler(target,window){
      target.addEventListener("click",function(){
        target.openInfoWindow(window);
      });
    }
    function addMapOverlay(){
      var markers = [
        {content:"我的备注",title: name,imageOffset: {width:0,height:3},position:{lat:y,lng:x}}
      ];
      for(var index = 0; index < markers.length; index++ ){
        var point = new BMap.Point(markers[index].position.lng,markers[index].position.lat);
        var marker = new BMap.Marker(point,{icon:new BMap.Icon("http://api.map.baidu.com/lbsapi/createmap/images/icon.png",new BMap.Size(20,25),{
          imageOffset: new BMap.Size(markers[index].imageOffset.width,markers[index].imageOffset.height)
        })});
        var label = new BMap.Label(markers[index].title,{offset: new BMap.Size(25,5)});
        var opts = {
          width: 200,
          title: markers[index].title,
          enableMessage: false
        };
        var infoWindow = new BMap.InfoWindow(markers[index].content,opts);
        marker.setLabel(label);
        addClickHandler(marker,infoWindow);
        map.addOverlay(marker);
      };
    }
    //向地图添加控件
    function addMapControl(){
      var scaleControl = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
      scaleControl.setUnit(BMAP_UNIT_IMPERIAL);
      map.addControl(scaleControl);
      var navControl = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
      map.addControl(navControl);
      var overviewControl = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:true});
      map.addControl(overviewControl);
    }
    var map;
    initMap();
  }

}

  
