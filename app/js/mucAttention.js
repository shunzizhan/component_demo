
/**
* shunzizhan 20160224 
* 我的关注系列
* @type {Object}
*/

var isAttention = true;
var ucAttention={
  params:null,
  init:function(uid,uType){
    var url = window.location.href;
    url = uc_tool.transfromUrl(url);
    var attentionparams = ucAttention.attentionInfo(url);
    attentionparams.userid = uid;
    attentionparams.url = url;
    attentionparams.userType = uType;
    attentionparams.v = "2.0";
    // attentionparams.requrl="http://192.168.20.27/router/rest";
    ucAttention.params = attentionparams;
    if(attentionparams.attentionId){
      uc_tool.ajax("ucaction.user.attention.judge","Get",attentionparams,function(res,success){
        if(res[success]){
          if(res[success].data=="1"){
            isAttention = true;
            $(".uc-attention").addClass('uc-attention-check');
            // $(".uc-attention").html("<em></em>已"+attentionparams.titleword);
            $(".uc-attention").html("<em></em>");
            $(".isAttntion").html("已收藏");
            console.log("该页面已被关注……");
          }else{
            $(".uc-attention").removeClass('uc-attention-check');
            isAttention = false;
            $(".uc-attention").html("<em></em>");
            console.log("该页面未被关注……");
          }
        }else{
          console.log("ucaction》用户中心："+res.error_response.msg);
        }
      })
    }else{
      console.log("该页面不需关注……");
    }
  },
  /**
   * shunzizhan 20160222
   * @param  {[string]} url [当前页面访问的url地址]
   * @return {[obj]}     [catagoryId 【新房：0001，二手房：0002，租房：0003，论坛：0004，资讯：0005】 
   *                          title: 需要存储的一些信息]
   */
  attentionInfo:function(url){
    var type=$("#basetype").val();
    if(!type.length){
      type=url.split("//")[1].split("/")[0];
    }
    var o_infodetail={
      attentionType: "0005"
      // titleword:"关注"
    };
    switch(type){
      case "30abacadf14f4457b1e34d66062b2b03":
      //case "house.fdc.com.cn":
        o_infodetail.attentionType="0001";
        o_infodetail.attentionId = $('.head-tit').attr('id');
        o_infodetail.attentionName = $('.head-tit').text();
        o_infodetail.imgUrl = typeof ($('.detail-wrap .list-img img').attr('src')) != 'undefined' ? $('.detail-wrap .list-img img').attr('src').split("@")[0] : '';
        break;
      //case "oldhouse.fdc.com.cn":
      case "8ab4897c32df48afa33b457dd26fb9a7":
        o_infodetail.attentionType="0002";
        o_infodetail.attentionId = window.location.pathname.replace(/[^\d]/gi,'');
        o_infodetail.attentionName = $('.head-tit').text();
        o_infodetail.imgUrl = typeof ($('.detail-wrap .list-img img').attr('src')) != 'undefined' ? $('.detail-wrap .list-img img').attr('src').split("@")[0] : '';
        break;
      case "zufang.fdc.com.cn":
        catagoryId="0003";
        o_infodetail.attentionType="0003";
        o_infodetail.attentionId = window.location.pathname.replace(/[^\d]/gi,'');
        o_infodetail.attentionName = $('.head-tit').text();
        o_infodetail.imgUrl = typeof ($('.detail-wrap .list-img img').attr('src')) != 'undefined' ? $('.detail-wrap .list-img img').attr('src').split("@")[0] : '';
        break;
      case "bbs.fdc.com.cn":
      // case "test.sns.fdc.com.cn":
      case "presns.fdc.com.cn":
        var bbstype = url.split('-');
        if(bbstype[0].indexOf('/thread')>0){
          o_infodetail.attentionType="00041";
          o_infodetail.attentionId = bbstype[1];
          o_infodetail.attentionName = $.trim($('.maintitle').text());
          o_infodetail.imgUrl = typeof ($('.contenttext img').eq('0').attr('src') || $('.acpo-contain img').eq('0').attr('src')) != 'undefined' ? ($('.contenttext img').eq('0').attr('src') || $('.acpo-contain img').eq('0').attr('src')).split("@")[0] : '';
        }
        else{
          console.log('该页面不需关注……');
        }
        break;
      case "news.fdc.com.cn":
        o_infodetail.attentionType="0005";
        o_infodetail.attentionId = window.location.pathname.replace(/[^\d]/gi,'');
        o_infodetail.attentionName = $('.container-article h2').text();
        o_infodetail.imgUrl = typeof ($('.container-article img').eq(0).attr('src')) != 'undefined' ? $('.container-article img').eq(0).attr('src').split("@")[0] : '';
        break;
      default :
        break;
    }
    return o_infodetail;
  },
  snsAddattentionNum:function(param){
    uc_tool.ajax("sns.inter.user.addForumAttention", "Get", param, function(res,success){
      if(res[success]){
        $('.msg .count .follow span').text(res[success]);
        console.log('论坛关注新增》'+res[success]);
      }else{
        console.log("论坛关注失败");
      }
    })
  }
}

$(document).ready(function() {

  // //资讯添加
  // if(jQuery('.txtLaiy .uc-attention').length<1){
  //   jQuery('.txtLaiy').append('<a href="javascript:void(0)" rel="nofollow" class="uc-attention fr"><em></em>关注</a>')
  // }
  /**
   * shunzizhan 20160223
   * 1.判断cookie中是否存在用户id，如果没有
   *   1.1 调用生成匿名用户id，并将记录保存在匿名用户id下
   * 2.如果有，判断是否存在token
   *   2.1 如果没有token，则说明是上次生成的匿名用户
   *   2.1 如果有token，则是注册用户
   * @type {[type]}
   */
  var userInfo = decodeURIComponent(uc_cookie.Get("uc_userInfo"));
  userInfo = userInfo !="null" ? userInfo : "";
  var userType = 2;
  if(userInfo =="" || userInfo =="undefined"){
    uc_tool.ajax("ucaction.anonymous.create.anonymousID","Get",null,function(res,success){
      console.log(res[success])
      if(res[success]){
        uc_cookie.Set1("uc_userInfo", res[success].data.userid, null, null, null, null);
        var userType = 2;
        ucAttention.init(res[success].data.userid, userType);
      }else{
        console.log("生成匿名id错误"+res.error_response.msg)
      }
    })
  }else{
    var userType = 1;
    var token = decodeURIComponent(uc_cookie.Get("uc_token"));
    token = token !="null" ? token : "";
    if(token =="" || token =="undefined"){
      userType = 2;
    }
    ucAttention.init(userInfo, userType);
  }

  // jQuery(".uc-attention").click(function(event) {
  $("body").delegate('.uc-attention', 'click', function(){
    /* Act on the event */
    // 点击之前再判断一下当前用户是否已关注该楼盘
    // ucAttention.init(userInfo, userType);
    if(!isAttention){
      uc_tool.ajax("ucaction.user.attention.add","Get",ucAttention.params,function(res,success){
        if(res[success]){
          isAttention = true;
          console.log("ucaction》用户中心》新增关注成功");
          uc_tool.showAlert('success',"收藏成功");
          $(".uc-attention").addClass('uc-attention-check');
          //attentionparams.userType 1为注册用户 2为匿名用户
          if(ucAttention.params.attentionType=="00042"){
            var myparams = {
              ids:ucAttention.params.attentionId,
              requrl:snsurl || "http://test.sns.fdc.com.cn/snsweb/post/rest",
              jsoncallback:"jsonpsns"
            }
            ucAttention.snsAddattentionNum(myparams);
          }
        }else{
          console.log("ucaction》用户中心："+res.error_response.msg);
        }
      })
    }
  });
})
