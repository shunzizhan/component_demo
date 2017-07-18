/**
 *   说明 : 新房列表页
 *   依赖 : zepto
 *   编写 : 黄毅
 *   时间 : 2016-03-14
 */

"use strict";


var news = {
/*
 *  黄毅  2016-3-14
 *  调用swiper，资讯主页左右滑动
 */ 
  touchNav:function(){
    //导航栏主栏目
    var mySwiper = new Swiper ('.swiper-container-inform', {
      slidesPerView: 4.5,
      paginationClickable: true
    });    
    //导航栏子栏目
    var mySwiperNd = new Swiper ('.swiper-container-st', {
      slidesPerView: 4.5,
      paginationClickable: true,
      setWrapperSize :true
    });
    //顶部轮播图    
    var swiperTopPic = new Swiper ('.top-pic', {
      pagination: '.swiper-pagination',
      paginationClickable: true,
      loop : true,
      setWrapperSize :true,
      autoplay : 2000
    });    
    //精彩图集轮播图    
    var swiperHopPic = new Swiper ('.wonderful-pic', {
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      loop : true,
      paginationClickable: true,
      setWrapperSize :true,
      autoplay : 2000
    });        
  },

  /*
   *  黄毅  2016-3-22
   *  购房流程新房二手房切换
   */ 
  newSecond:function(){
    $(".new-second .nav-list").click(function(){
      $(this).addClass("active").siblings().removeClass("active");
      var i = $(this).index();
      $(".newsecond-container ul").eq(i).addClass("newsecond-show").siblings().removeClass("newsecond-show");
    })
  },
  /*
   *  黄毅  2016-3-22
   *  亿房专栏弹出层
   */ 
  Popup:function(){
    $(".trait-expert-st").click(function(){
      $(".column-boss").toggle();
      $(".trait-expert-st .ar-angle-down").toggleClass("ar-angle-up");
    })    
    $(".column-alert .ar-angle-up").click(function(){
      $(".column-boss").toggle();
      $(".trait-expert-st .ar-angle-down").toggleClass("ar-angle-up");
    })
  },
  /*
   *  黄毅  2016-3-14
   *  导航栏二级菜单
   */ 
  navNd:function(){
    $(".swiper-container-inform .swiper-slide:last-child").click(function(){
      // if($(this).hasClass("nav-blue")){
      //   $(this).removeClass("nav-blue");
      //   $(".swiper-container-st").toggle();
      // }else{
      //   $(this).addClass("nav-blue");
      //   $(".swiper-container-st").toggle();
      // }
      $(".swiper-container-st").show();
    })
  },
  /*
   * 张志成 2016-3-19
   * 首页请求入口
   */
  newsInfo:function(){
    news.getNewsMsg();
    var n=1;
    $(".btn-more").click(function(){
      n++;
      $(this).text("正在加载").prepend("<i class='ar ar-loading-b'></i>");
      news.getColumnMsg("228,250,246,241,6",n,"5");
    })
  },
  /*
   * 黄毅 2016-3-16
   * 获取资讯首页信息数据
   */
  getNewsMsg:function(){
    var pageIndex;
    common.ajax("Index.Info.Get","post",{PageSize:"20",Pageindex:pageIndex||"1",Requrl:news_api},function(res,success){
      if(news.loadNews && res[success]){
         news.loadNews(res[success]);
         common.changeSiteMenu();
      }else{
        console.log("您没有提供调用函数……");
      }
    })
  },
  /*
   * 黄毅 2016-3-17
   * 接收处理首页数据
   */
  loadNews:function(accdata){
    var data = accdata.data;
    news.loadTopPic(data.toppic);
    news.loadHotlist(data.hotlist);
    news.loadHotpic(data.hotpic);
    news.loadDcjh(data.dcjh);
    news.loadYjgd(data.yjgd);
    news.loadOther(data.other);
    news.touchNav();
    news.navNd();
     $(".swiper-container-st").hide();
  },
  /*
   * 张志成 2016-3-19
   * 渲染轮播图板块
   */
  loadTopPic:function(data){
    var url,type;
    for(var i=0; i<data.length; i++){
      type = data[i].contentid.substring(0,6);
      // 当数据为thread时，意味着这是论坛的帖子
      if(type=="thread"){
        url = "http://bbs.m.fdc.com.cn/"+data[i].contentid+".html";
      }else if(type==""){
        // 当类型为空时,意味着该数据既不是论坛帖子,也不是资讯文章,具体是什么地址,和后台沟通
        url = "http://zt.fdc.com.cn/2017zt/2017fdcndbgx/";
      }else{
        url = news_index+"/"+data[i].contentid+".html";
      }
      $(".top-pic .swiper-wrapper").append("<a href='"+url+"' class='swiper-slide'>"
                                            +"  <img class='top-img' src='"+data[i].thumb+"'>"
                                            +"  <div class='area-nav'>"+data[i].title+"</div>"
                                            +"  <div class='head-bottom'>"
                                            +"    <span class='head-content'>"+data[i].description+"</span>"
                                            +"</div></a>");
    }
  },
  /*
   * 黄毅 2016-3-17
   * 渲染每日热点板块
   */
  loadHotlist:function(data){
    for(var i=0; i<data.length; i++){
    var str = data[i].time + '';
    var commonTime = common.getDate2(str);
    var type,url;
    type = data[i].contentid.substring(0,6);
    if(type=="thread"){
      url = "http://bbs.m.fdc.com.cn/"+data[i].contentid+".html";
    }else{
      url = news_index+"/"+data[i].contentid+".html";
    }
    $(".day-trait").append("<a href='"+url+"' class='body-block'>"
                          +"  <div class='background-shade'>"
                          +"    <img src='"+data[i].thumb+"' alt=''>"
                          +"  </div>"
                          +"  <h3>"+data[i].title+"</h3>"
                          +"  <span class='date-after'>"+commonTime+"</span>"
                          +"</a>");
    }
  },
  /*
   * 黄毅 2016-3-17
   * 渲染精彩图集板块
   */
  loadHotpic:function(data){
    var url,type;
    for(var i=0; i<data.length; i++){
      type = data[i].contentid.substring(0,6);
      if(type=="thread"){
        url = "http://bbs.m.fdc.com.cn/"+data[i].contentid+".html";
      }else{
        url = news_index+"/"+data[i].contentid+".html";
      }
      $(".wonderful-pic .shade-two").append("<a href='"+url+"' class='wood-ground swiper-slide'>"
                                           +"  <img src='"+data[i].thumb+"' alt=''>"
                                           +"  <div class='head-bottom'>"+data[i].title+"</div>"
                                           +"</a>");
    };
  },
  /*
   * 黄毅 2016-3-17
   * 渲染地产江湖板块
   */
  loadDcjh:function(data){
    for(var i=0; i<data.length; i++){
      $(".trait-estate").append("<a href='"+news_index+"/"+data[i].contentid+".html' class='body-block'>"
                               +"  <div class='background-shade shade-three'>"
                               +"    <img class='boss-ground' src="+data[i].thumb+" alt=''>"
                               +"    <div class='boss-sound'>"+data[i].subtitle+"</div>"
                               +"  </div>"
                               +"  <h2 class='caption-lee'>"+data[i].title+"</h2>"
                               +"  <p class='lee-content'>"+data[i].description+"<span>[全文]</span></p>"
                               +"</a>");
      $(".estate-link").attr("href",news_index+"/"+data[i].contentid+".html");
    };
  },
  /*
   * 黄毅 2016-3-17
   * 渲染业界观点板块
   */
  loadYjgd:function(data){
    for(var i=0; i<data.length; i++){
      var s = data[i].title,
          cut = s.split("：");
      if(s.indexOf("：") != -1){
        $(".industry-view").append("<a class='body-block' href='"+news_index+"/"+data[i].contentid+".html' class='caption-view'>"+cut[0]+"："+"<span class='author-words'>"+cut[1]+"</span></a>");
      }else{
        $(".industry-view").append("<a class='body-block' href='"+news_index+"/"+data[i].contentid+".html' class='caption-view'>"+s+"</a>");
      }
    }
  },
  /*
   * 黄毅 2016-3-17
   * 渲染其他资讯板块
   */
  loadOther:function(data){
    for(var i=0; i<data.length; i++){
      var time = common.getDate2(data[i].published);
      $(".other-inform").append("<a href='"+news_index+"/"+data[i].contentid+".html'class='body-block'>"
                               +"<h3 class='caption-else'>"+data[i].title+"</h3>"
                               +"  <span class='read-else'><span>" +data[i].pv+"</span></span>"
                               +"  <span class='date-after'>"+time+"</span>"
                               +"  <span class='tag tag-purple'>"+data[i].catname+"</span>"
                               +"</a>");
    }
  },
  /*
   * 张志成 2016-3-19
   * 栏目请求数据入口
   */
  columnInfo:function(type,City,Col){
    var city,col;
    city = City || "";
    col = Col || "";
    $("body footer").hide();
    news.getColumnMsg(type,"1","",city,col);
    news.touchNav();
    news.navNd();
    if(type=="254"||type=="541"||type=="542"||type=="544"||type=="545"||type=="547"||type=="210"||type=="885"||type==""){
      $(".swiper-container-st").show();
    }else{
      $(".swiper-container-st").hide();
    }
    
    //加载更多
    var i=1;
    $(".btn-more").click(function(){
      i++;
      $(this).text("正在加载").prepend("<i class='ar ar-loading-b'></i>");
      news.getColumnMsg(type,i,"",city,col);
    })

  },
  /*
   * 张志成 2016-3-19
   * 获取栏目数据
   */
  getColumnMsg:function(type,pageIndex,pageSize,City,col){
    var pageIndex,
        method,
        Cateid,
        Catelist,
        Isthumb;
    if(type=="789"){
      method="Cate.List.Get";
      Cateid = type;
    }else{
      method="News.List.Get";
      Catelist = type;
    }
    if(type=="526,880,881,882,883"||type=="878,100,104,879"){
      Isthumb=true;
    }else{
      Isthumb="";
    }
    common.ajax(method,"post",{cateid:Cateid||"",catelist:Catelist||"1",isthumb:Isthumb,psize: pageSize||"10",pindex:pageIndex||"1",city: City || "",column: col || "",Requrl:news_api},function(res,success){
      if(news.loadColumn && res[success]){
        news.loadColumn(res[success],type);
        if(res[success].pcount == pageIndex){
          $(".btn-more").hide();
        }
        common.changeSiteMenu();
      }else{
        console.log("您没有提供调用函数……");
      }
    })
  },
  /*
   * 张志成 2016-3-19
   * 分发处理栏目数据
   */
  loadColumn:function(accdata,type){
    if(type=="248"||type=="237"||type=="254"||type=="541"||type=="542"||type=="544"||type=="545"||type=="547"||type=="210"||type=="885"||type==""){
      news.loadWatch(accdata.data);
    }else if(type=="526,880,881,882,883"||type=="878,100,104,879"){
      news.loadDissertation(accdata.data);
    }else if(type=="789"){
      news.loadExpertInfo(accdata.data);
    }else{
      news.loadOtherNews(accdata.data);
    }
    $(".btn-more").text("查看更多");
    $(".btn-more").prepend('<i class="morebtn-ico"></i>');
  },
  /*
   * 张志成 2016-3-19
   * 
   */
  loadOtherNews:function(data){
    for(var i=0;i<data.length;i++){
      $(".other-inform").append("<a href='"+news_index+"/"+data[i].contentid+".html'class='body-block'>"
                                 +"<h3 class='caption-else'>"+data[i].title+"</h3>"
                                 +"  <span class='read-else'><span>" +data[i].pv+"</span></span>"
                                 +"  <span class='date-after'>"+common.getDate2(data[i].published)+"</span>"
                                 +"  <span class='tag tag-purple'>"+data[i].catname+"</span>"
                                 +"</a>");
    }
    common.loadShowPage("inform-content");
  },
  /*
   * 张志成 2016-3-19
   * 加载亿房视点、城市规划、政策直通车数据
   */
  loadWatch:function(data){
    for(var i=0;i<data.length;i++){
      $(".inform-wrap").append("<a href='"+news_index+"/"+data[i].contentid+".html' class='inform-block'>"
                                +"  <h3>"+data[i].title+"</h3>"
                                +"  <p>"+data[i].description+"</p>"
                                +"  <div class='icon-bottom'>"
                                +"    <span><i class='icon-read-cont icon-read'></i>"+data[i].pv+"</span>"
                                +"  </div>"
                                +"</a>");
    }
    common.loadShowPage("inform-content");
  },
  /*
   * 张志成 2016-3-19
   * 加载热点专题、图说武汉数据
   */
  loadDissertation:function(data){
    for(var i=0;i<data.length;i++){
      $(".inform-wrap").append("<a href='"+news_index+"/"+data[i].contentid+".html' class='background-shade shade-radius body-img'>"
                                +"  <img src='"+data[i].thumb+"'>"
                                +"  <h3>"+data[i].title+"</h3>"
                                +"</a>");
    }
    common.loadShowPage("inform-content");
  },
  /*
   * 张志成 2016-3-19
   * 加载专家论市数据
   */
  loadExpertInfo:function(data){
    for(var i=0;i<data.length;i++){
      var time = common.getDate(data[i].published);
      $(".trait-wrap").append("<a href='"+news_index+"/expert/"+data[i].contentid+".html' class='trait-expert'>"
                            +"  <div class='background-shade'>"
                            +"    <img src='"+data[i].thumb+"'>"
                            +"  </div>"
                            +"  <div class='expert-title'>"
                            +"    <h2>"+data[i].catname+"</h2>"
                            +"    <h4>"+data[i].catedes+"</h4>"
                            +"  </div>"
                            +"  <div class='author-place'><span class='tag tag-green'>文章</span>"
                            +"  <h3>"+data[i].title+"</h3></div>"
                            +"  <div class='num-time'><span class='read-bottom'>"+data[i].pv+"</span>"
                            +"  <span class='date-after'>"+time+"</span></div>"
                            +"</a>");
    }
    common.loadShowPage("trait-wrap");
  },
  /*
   * 张志成 2016-7-20
   * 面包屑栏目取值
   */
  getColumnName:function(){
    var name = $("#catename").val(),
        url;
    switch(name){
      case "亿房视点" : url = "sd.shtml";
      break;
      case "热点专题" : url = "zt.shtml";
      break;
      case "专家论事" : url = "expert.shtml";
      break;
      case "图片新闻" : url = "tp.shtml";
                       name = "图说武汉";
      break;
      case "城建规划" : url = "cjgh.shtml";
      break;
      case "政策动向" : url = "zcdx.shtml";
      break;
      case "市场管理" : url = "scgl.shtml";
      break;
      case "税费管理" : url = "sfgl.shtml";
      break;
      case "土地政策" : url = "tdzc.shtml";
      break;
      case "物业管理" : url = "wygl.shtml";
      break;
      case "房贷金融" : url = "zfjr.shtml";
      break;
      case "房屋产权" : url = "cqydy.shtml";
      break;
      case "拆迁政策" : url = "cqzc.shtml";
      break;
      default: url = "http://news.m.fdc.com.cn";
    }
    $(".column-name").text(name).attr("href",url);
  },
  /*
   * 陈丽娜 2017-3-17
   * 资讯专题入口
   */
  newsZhuanti:function() {
    news.getWeatherDay();
    news.recommendNewHouse();
    common.backtop();
    common.changeSiteMenu();
  },
  getWeatherDay:function(){
    var mydate = new Date(),str,day;
    str = "" + mydate.getFullYear() + "年";
    str += (mydate.getMonth()+1) + "月";
    str += mydate.getDate() + "日";
    $(".ns-date").text(str);
    $.getScript("http://php.weather.sina.com.cn/js.php?" + $.param({
      city : "武汉",
      day : 0,
      password : "DJOYnieT8234jlsK"
    }) , function(json){
      $(".ns-temperature").text(temperature1+ '°');
      switch(mydate){
        case 0:
          day="星期日";
          break;
        case 1:
          day="星期一";
          break;
        case 2:
          day="星期二";
          break;
        case 3:
          day="星期三";
          break;
        case 4:
          day="星期四";
          break;
        case 5:
          day="星期五";
          break;
        default:
          day="星期六";
          break;
      }
      $(".ns-day").text(day);
      $(".ns-weather").text(status1);
    });
  },
  recommendNewHouse:function(){
    var mySwiper = new Swiper('.ns-newhouse', {
      setWrapperSize :true,
      slidesPerView : 2.8,
      spaceBetween : 15
    })
  }
}