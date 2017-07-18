/**
 *   说明 : 首页模块效果
 *   依赖 : zepto.js
 *   编写 : 张志成
 *   时间 : 2016-03-01
 */

"use strict";
var status,searchArr=[];
var home={
	/*
	 *  张志成  2016-3-2
	 *  调用swiper
	 */ 
	init:function(){
		var swiper = new Swiper('.swiper-container', {
			slidesPerView:1,
			slidesPerColumn: 1,
			spaceBetween: 0,
			onSlideChangeStart: function(){
				$('.rec-nav-tit').eq(swiper.activeIndex).addClass('active').siblings().removeClass("active");
			}
	  });
	  //栏目切换
		$('.rec-nav-tit').click(function(){
			$(this).addClass("active").siblings().removeClass("active");
			var i = $(this).index();
			switch(i){
				case 0 : swiper.slideTo(0, 1000, true);
				break;
				case 1 : swiper.slideTo(1, 1000, true);
				break;
				default : swiper.slideTo(2, 1000, true);
			}	
		})
		//调用获取会员人数方法
		home.getPersonNum();
    //ios的safari浏览器提示
    if(navigator.userAgent.match(/iPhone|iPad/i)!=null){
      if(navigator.userAgent.indexOf("Safari")!="-1"){
        $(".tipsAdd").show();
        setTimeout(function(){
          $(".tipsAdd").hide();
        },5000)
      }
    }
    //if(false)alert("0k");
    $("body").on("click",".close-tip",function(){
      $(".tipsAdd").hide();
    })
	},
	/*
	 *  张志成  2016-3-2
	 *  转换时间
	 */ 
	seehouse:function(){
		var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth()+1;
		var d = date.getDate();
		$(".date-input").val(y+"-"+m+"-"+d);
	},
	/*
	 *  张志成  2016-3-2
	 *  调用swiper
	 */ 
	lineInfo:function(){
		var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true
    });
	},
	/*
	 *  张志成  2016-3-17
	 *  首页数据请求入口
	 */
	homeEntrance:function(){
    home.init();
    common.backtop();
    home.getAdMsg();
    home.newListRecomm();
    home.secListRecomm();
    home.reListRecomm();
    home.setSearchHeight();
    home.searchResult();
		//调用当前城市方法
		common.changeNowCity();
		//获取位置
    var city,
    		index = 0;
    if(window.location.search){
    	city = decodeURIComponent(window.location.search.split(",")[1] || "wuhan");
    }else{
    	city = decodeURIComponent(window.location.href.split("/")[3] || "wuhan");
    }
		home.getNewsMsg();
		//换一换功能
		$(".chart-content").eq(0).show();
		$(".btn-change").click(function(){
			index++;
			if(index>=0&&index<4){
				$(".chart-content").eq(index).show().siblings(".chart-content").hide();
			}else{
				index=0;
				$(".chart-content").eq(index).show().siblings(".chart-content").hide();
			}
		})
		
    //进行页面跳转
    $(".confirm-btn").click(function(){
    	var keyword = $(".search-page-wrap .search-input").val();
    	window.location.href=house+"/searchresult.html?"+keyword+","+city+"";
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
	 *  张志成  2016-3-17
	 *  请求大家都在聊模块的论坛数据
	 */ 
	getForumMsg:function(){
		common.jsonp("snsapi.inter.forM.getHotTopic","get",{pagesize:"4"},function(res,success){
			if(home.loadForumInfo && res[success]){
        home.loadForumInfo(res[success].data.forumPostList);
      }else{
        console.log("您没有提供调用函数……");
      }
		})
	},
	/*
	 *  张志成  2016-3-17
	 *  请求大家都在聊模块的资讯数据
	 */ 
	getNewsMsg:function(){
		common.ajax("CMS.List.Get","post",{pagesize:"16",pageindex:"1",Requrl:news_api},function(res,success){
			if(home.loadNewsInfo && res[success]){
        home.loadNewsInfo(res[success]);
        home.getForumMsg();
      }else{
        console.log("您没有提供调用函数……");
      }
		})
	},	
	/*
	 *  张志成  2016-3-18
	 *  加载论坛数据
	 */ 
	loadForumInfo:function(accdata){
		for(var i=0; i<4; i++){
			var data = common.getDate(accdata[i].dateline);
			$(".chart-content").eq(i).append("<a href='http://bbs.m.fdc.com.cn/thread-"+accdata[i].tid+"-1-1.html' class='chart-list'>"
																	+"	<span class='chart-list-title'>"
																	+"		<b>["+accdata[i].f_name+"]</b>"
																	+"		<p>"+accdata[i].subject+"</p>"
																	+"	</span>"
																	+"	<span class='chart-list-data'>"
																	+"		<em class='list-data-browse'>"+accdata[i].replies+"</em>"
																	+"		<em class='list-data-msg'>"+accdata[i].views+"</em>"
																	+"		<p class='list-data-time'>"+data+"</p>"
																	+"	</span>"
																	+"</a>");
		}
	},
	/*
	 *  张志成  2016-3-18
	 *  加载资讯数据
	 */
	loadNewsInfo:function(accdata){
		var data,n;
		for(var i=0; i<4; i++){
			for (var j = 0; j<4; j++){
				n = i + j*4;
				data = common.getDate(accdata.data[n].published);
				$(".chart-content").eq(i).append("<a href='"+news_index+"/"+accdata.data[n].contentid+".html' class='chart-list'>"
																		+"	<span class='chart-list-title'>"
																		+"		<b>["+accdata.data[n].regionname+"]</b>"
																		+"		<p>"+accdata.data[n].title+"</p>"
																		+"	</span>"
																		+"	<span class='chart-list-data'>"
																		+"		<em class='list-data-browse'>"+accdata.data[n].pv+"</em>"
																		+"		<em class='list-data-msg'>"+accdata.data[n].comments+"</em>"
																		+"		<p class='list-data-time'>"+data+"</p>"
																		+"	</span>"
																		+"</a>");
			}
		}
	},
	/*
	 *  黄毅  2016-3-31
	 *  请求房价走势数据
	 */ 
	getTrendMsg:function(sectionId){
			common.ajax("Section.Info.Get","post",{sectionid:sectionId,pagesize:"5",pageindex:"1",Requrl:news_api},function(res,success){
				if(res[success]){
					switch(sectionId){
						case "3674": home.loadSectionInfo(res[success]);
						break;						
						case "2244": home.loadSectionSt(res[success]);
						break;
						default : home.loadSectionNd(res[success]);
					}
	      }else{
	        console.log("您没有提供调用函数……");
	      }
			})
	},
	/*
	 *  黄毅  2016-3-31
	 *  加载房价走势第一区表格数据
	 */
	loadSectionInfo:function(accdata){
		for(var i=0; i<6; i++){
			var u = accdata.data[i].url.split("=")[1];
			if(accdata.data[i].suburl=="跌"||accdata.data[i].suburl=="降"){
				accdata.data[i].suburl = "down"
			}else if(accdata.data[i].suburl=="涨"){
				accdata.data[i].suburl = "up"
			}
				$(".trend-datalist").append("<tr>"
																		+"	<td>"+accdata.data[i].title+"</td>"
																		+"	<td>"+accdata.data[i].subtitle+"</td>"
																		+"	<td>"+u+"</td>"
																		+"	<td><img src='http://img3.fdc.com.cn/m/images/icon/"+accdata.data[i].suburl+".png' alt=''>"+accdata.data[i].description+"</td>"
																		+"</tr>");
		}
	},	
	/*
	 *  黄毅  2016-4-21
	 *  加载房价走势第二区图片数据
	 */
	loadSectionSt:function(accdata){
		var s = accdata.data[0];
		$(".trend-st").append("<a href='"+news_index+"/"+s.contentid+".html'>"
																+"	<h3>"+s.title+"</h3><i class='ar ar-angle-right'></i>"
																+"	<img class='trend-img' src='"+s.thumb+"' alt=''>"
																+"	</a>");
	},
	/*
	 *  黄毅  2016-4-21
	 *  加载房价走势第三区图片数据
	 */
	loadSectionNd:function(accdata){
		var s = accdata.data[0];
		$(".trend-nd").append("<a href='"+news_index+"/"+s.contentid+".html' >"
																+"	<h3>"+s.title+"</h3><i class='ar ar-angle-right'></i>"
																+"	<img class='trend-img' src='"+s.thumb+"' alt=''>"
																+"	</a>");
	},
	/*
	 *  张志成  2016-4-1
	 *  加载首页用户人数
	 */
	getPersonNum: function(){
		common.jsonp("ucaction.inter.user.total.number","get",{Requrl:member_api},function(res,success){
      if(res[success]){
        home.peopleRoll(res[success].data);
      }else{
        console.log("您没有提供调用函数……");
      }
    }) 
	},	
	/*
	 *  黄毅 2016-4-5
	 *  请求首页活动专区和底部广告栏接口数据
	 */ 
	getAdMsg:function(){
		// $.getJSON(adver_api,{
  //       q: "select * from json where url=\"http://img3.fdc.com.cn/cms/mobileapp/add34.json\"",
  //       format: "json"
  //     }, function (data) {
		// 		if(home.loadAdInfo && data){
	 //        var d = data.query.results.json;
	 //        home.loadAdInfo(d);
	 //      }else{
	 //        console.log("您没有提供调用函数……");
	 //      }
  //     });
  //     20170614 改从阿里云读取，保持和亿房网app的数据来源为同一份
    $.ajax({
      type: "Get",
      url: 'http://www.fdc.com.cn/section/6369.html',
      data: {t: new Date().getTime()},
      dataType: "json",
      success: function(res){
        if(res){
          home.loadAdInfo(res);
        }
      },
      error: function(res){
        console.log(res.responseText);
      }
    });
	},
	/*
	 *  黄毅  2016-4-5
	 *  加载首页活动专区和底部广告栏接口数据
	 */
	loadAdInfo:function(accdata){
		$(".active-content").append("<div class='active-row'>"
															+"<a href="+accdata.ad.link+" class='active-list'>"
															+"<img src='"+accdata.ad.img+"'>"
															+"</a>   "
															+"<span class='row-line'></span>   "
															+"<a href="+accdata.ad1.link+" class='active-list'>"
															+"<img src='"+accdata.ad1.img+"'>  "
															+"</a>"
														  +"</div>"
														  +"<p class='col-line'></p>"
														  +"<div class='active-row'>    "
															+"<a href="+accdata.ad2.link+" class='active-list'>"
															+"<img src='"+accdata.ad2.img+"'>   "
															+"</a>   "
															+"<span class='row-line'></span>   "
															+"<a href="+accdata.ad3.link+" class='active-list'>"
															+"<img src='"+accdata.ad3.img+"'>   "
															+"</a>"
														  +"</div>");
		// 20170614 屏蔽底部广告位
    // $(".bottom-ad").append("<a href="+accdata.ad4.link+" class='adver-wrap'>"
		// 											+"<img src='"+accdata.ad4.img+"'>"
		// 											+"</a>");
	},
	/*
	 *  黄毅  2016-4-8
	 *  首页网友人数滚动功能
	 */
	peopleRoll:function(num){
		var a=[];
		var s=0;
		var b=[];
		var count = num + "";
		function x(count){
			for(var i=0;i<count.length;i++){
				var n=count.charAt(i);
				a.push(n);
			}
			m();
		};
		function m(){
			var k=0;
			$(".index-head h1 b").append("<span></span>");
			var p=window.setInterval(function(){
				$(".index-head h1 span").eq(s).text(k);
				if(k==a[s]){
					window.clearInterval(p);
					s++;
					if(a[s]){
						m();
					}
				}
				k++;
			},30)
		};
	x(count);
	},
  /*
   *  zzc 2016-9-16
   *  新房数据推荐
   */
  newListRecomm:function(){
    var parames;
    parames = {
      dictitemcode: "",
      dictitemsubcode: "",
      lineid: "",
      station: "",
      price: "",
      acreage: "",
      roomno: "",
      decoratetype: "",
      floor: "",
      housetype: "",
      propertyright: "",
      propertyrighttype: "",
      propertyrightyear: "",
      name: "",
      source: "",
      sort: "",
      currentPage: "1",
      rowsPerPage: "5",
      Requrl: newApi
    }
    common.jsonp("homenhapi.homepage.search","get",parames,function(res,success){
      if(res[success]){
        var accdata = res[success].data.data;
        for(var i=0; i<accdata.length; i++){
          accdata[i].publicTime = common.getDate2(accdata[i].publicTime);
        }
        $("#newlist p").text(res[success].data.total+'新盘');
        indexModel.newData(accdata);
      }else{
        console.log("您没有提供调用函数……");
      }
    }) 
  },
  /*
   *  zzc 2016-8-19
   *  二手房数据推荐
   */
  secListRecomm:function(){
    var parames;
    parames = {
      dictitemcode: "",
      dictitemsubcode: "",
      lineid: "",
      station: "",
      price: "",
      acreage: "",
      roomno: "",
      decoratetype: "",
      floor: "",
      housetype: "",
      propertyright: "",
      propertyrighttype: "",
      propertyrightyear: "",
      name: "",
      source: "",
      sort: "",
      currentPage: "1",
      rowsPerPage: "5",
      Requrl: secApi
    }
    common.jsonp("homeoldapi.restful.inter.oldhouse.getlist","get",parames,function(res,success){
      if(res[success]){
        for(var i=0; i<res[success].data.length; i++){
          res[success].data[i].publicTime = common.getDate2(res[success].data[i].publicTime);
          if(res[success].data[i].houseSpecial){
            res[success].data[i].houseSpecial = JSON.parse(res[success].data[i].houseSpecial.replace(/'/g,'"'));
          }
        }
        $("#seclist p").text(res[success].totalCount+'套')
        indexModel.secData(res[success].data);
      }else{
        console.log("您没有提供调用函数……");
      }
    }) 
  },
  /*
   *  zzc 2016-8-19
   *  租房数据推荐
   */
  reListRecomm:function(){
    var parames = {},
        url = 'http://zufang.m.fdc.com.cn/house2',
        method = 'restful_inter_houserent_pagelist_response';
    parames.Requrl = url+'-i21-j25';
    common.ajax("","get",parames,function(res,success){
      if(res[method]){
        $("#relist p").text(res[method].page.totalCount+'套');
        indexModel.reData(res[method].data);
        indexModel.paramMap(res[method].paramMap);
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
   *  zzc 2016-9-18
   *  搜索结果
   */
  searchResult: function(data){
    var _xhr;
    // 监听文本域内容变化
    $(".J-search-input").on("input",function(){
      var keyword = $(this).val();
      var successResponse = common.getSuccessMethod("homeoldapi.restful.inter.keyword.getcount");
      if(_xhr != null){
        _xhr.abort();
      }
      if(keyword){
        _xhr = $.ajax({
                url: secApi,
                type: "GET",
                dataType: 'jsonp',
                jsonp: 'uccallback',
                data: { name: keyword,method: "homeoldapi.restful.inter.keyword.getcount" },
                timeout: 5000,
                success: function(res) {
                  if(res && res[successResponse]){
                    indexModel.searchData(res[successResponse].data);
                    indexModel.keyword(encodeURIComponent(encodeURIComponent(keyword)));
                  }
                },
                error: function(res){
                  console.log("homeoldapi.restful.inter.keyword.getcount>>"+res.responseText);
                }
              });
      }else{
        indexModel.searchData([]);
      }
    })
  }
}










