
/**
 *论坛M端回帖、回复跳转页面相关脚本
 *zhangchang
 *zepto
 *2016.7.1
 */

"use strict";

$(function(){
  var curUrl = window.location.href,
      id_app = curUrl.split('id')[1] ? 'id'+curUrl.split('id')[1] : '',
      token = uc_cookie.Get("uc_token") ? decodeURIComponent(uc_cookie.Get("uc_token")) : id_app,
  token = token !="null" ? token : "";
  if(token == ""){
    window.location.href = uc_login;
  }
  var starFlag=false;
  var grades,source,userid;
  //获取浏览器高度
  var getheight = function(){
    var h = $(window).height();
    $(".container").css("min-height",h-50);
    $(".container").css("height","auto");
  }
  getheight();
  window.onresize = function(){
    getheight();
  }
  function IsPC(){ 
    var userAgentInfo = navigator.userAgent; 
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var iphosign =new Array("iPhone", "iPad", "iPod") ; 
    if(userAgentInfo.indexOf("iPhone")>0||userAgentInfo.indexOf("iPad")>0||userAgentInfo.indexOf("iPod")>0) {
      source="IOS";
    }else if(userAgentInfo.indexOf("SymbianOS")>0) {
      source="SymbianOS";
    }else if(userAgentInfo.indexOf("Windows Phone")>0){
      source="Windows Phone"
    }else if(userAgentInfo.indexOf("Android")>0){
      source="Android"
    }else{
      source="PC";
    }
  }
  IsPC();
  //对表情进行背景图片定位
  for(var i=0; i<$(".faces-all ul").size();i++){
    $(".faces-all ul").eq(i).find("li").each(function() {
      var n = $(".faces-all ul").eq(0).find("li").size()*i;
      var index=$(this).index()+n;
      $(this).children("i").addClass('express_icon'+index);
    });
  }  
  //当replyarea输入时
  var oldval="";
  $(".replyarea").on("input",function(){
    //var content=$(this).val().replace(/\s+/g,"");
    var content=$(this).val().trim();
    validwordlen(content);
    testSubmit();
  })
  //当replyare获得焦点
  $(".replyarea").focus(function(event) {
    $(".head").css("position","static");
    $(".height-44").hide();
  });
  $(".replyarea").blur(function(event) {
    $(".head").css("position","fixed");
    $(".height-44").show();
  });
  //校验评价内容字数
  var validwordlen=function(content){
    $(".wordsLen").text(content.length);
    if(content.length>500){
      $(".replyarea").val(oldval);
    }else{
      oldval=content;
      if(content.length>1&&content.length<10){
        $(".wordsLen").text(10-content.length);
        $(".rest1").text("还差");
        $(".rest2").text("个字");
      }else{
        $(".rest1").text("");
        $(".wordsLen").text(content.length);
        $(".rest2").text("/500");
      }
    }
  }    
  //获取图片url并拼接成字符串
  var getpic = function(){
    var picUrl = [];
    $(".imgshow img").each(function(){
      var picobj = {};
      picobj.imageurl = $(this).attr("src");
      picUrl.push(picobj);
    })
    return JSON.stringify(picUrl);
  }
  //遮罩的开启与关闭
  var mask = {
    open: function(){
      $(".loading-box").show();
      $(".com-mask").show();
    },
    close: function(){
      $(".loading-box").hide();
      $(".com-mask").hide();
    }
  }
  // var userInfo = decodeURIComponent(cookie.Get("uc_userInfo"));
  // userid : userInfo !="null" ? userInfo : '5746c6d488b95865114f9d1d';
  //回帖
  var replypost = function(){
    var myparms = {
      userid: token,
      buildingName:$("#housename").val()||'华润翡翠城',
      bid:$("#bid").val()||'579aa7b9d334e31310d4ce2b',
      apartmentId:$("#apartmentId").val()||"d61d1bec-d56c-411f-b1cc-e9f152c58bcd",
      comment_type:$("#comment_type").val()||"1",
      imgurl:getpic(),
      terminal:source,
      grade:grades,
      content:$(".replyarea").val().trim(),
      pinyin: $("#pinyin").val()
    }   
      mask.open();
      $.ajax({
        url : newHref+"/remark",
        type : "POST",
        data:myparms,
        // processData : false,
        // contentType:false,
        success: function(reponseData){
          mask.close();
          if(reponseData.success == true){
            $(".dialog-success,.shade").show();
            $(".marking-item .redStars").removeClass("class1 class2 class3 class4 class5").addClass("widrest");
            $(".replyarea").val("");
            $(".eval-grade .redStar").css("width","0");
            $(".imgshow").remove();
            $(".pictip").hide();
            $(".btn").removeClass('submit');
            $(".degree").text("");
            starFlag=false;
          }
        },
        error: function(reponseData){
          $(".dialogfail,.shade").show();
          mask.close();
        }
      })
  };
  //点击发表按钮
  $("body").on("click",".submit",function(){
    var gradeArry=new Array();
    $(".marking-item .redStars").each(function(i){
      if($(this).hasClass('class1')){
        gradeArry[i]=1;
      }else if($(this).hasClass('class2')){
        gradeArry[i]=2;
      }else if($(this).hasClass('class3')){
        gradeArry[i]=3;
      }else if($(this).hasClass('class4')){
        gradeArry[i]=4;
      }else if($(this).hasClass('class5')){
        gradeArry[i]=5;
      }    
    })
    grades={
      price:gradeArry[0] || '-1',
      district:gradeArry[1] || '-1',
      traffic:gradeArry[2] || '-1',
      mating:gradeArry[3] || '-1',
      environment:gradeArry[4] || '-1',
      total:(gradeArry[0]+gradeArry[1]+gradeArry[2]+gradeArry[3]+gradeArry[4])/5  || '-1'
    }
    replypost();
  })
  $("body").on("click",".closeimg",function(){
    $(".dialog-success,.dialogfail,.shade").hide();
  })
  //楼盘点评打分
  $(".give-grade li").click(function(){
    var index=$(this).index()+1;
    var gradeClass=$(this).parent().siblings('.degree');
    var starsAll,averageStar;
    starsAll=0;
    $(this).parent().siblings('.redStars').removeClass('class1 class2 class3 class4 class5 widrest').addClass('class'+index);
    //根据星星数量判断级别
    switch(index){
      case 1:
        gradeClass.text("较差")
        break;
      case 2:
        gradeClass.text("一般")
        break;
      case 3:
        gradeClass.text("还不错")
        break;
      case 4:
        gradeClass.text("比较好")
        break;
      case 5:
        gradeClass.text("非常完美")
        break;
    }
    
    $(".redStars").each(function(){
      //若有没有评分的则starFlag=false
      for(i=0;i<5;i++){
        if($(this).hasClass('widrest')){
          return starFlag=false;
          return false
        }
        return starFlag=true;     
      }
    })
    testStar(starsAll);
    testSubmit(); 
  })
  //户型点评打分
  $(".all-grade li").click(function(){
    var index=$(this).index()+1;
    $(this).parent().siblings('.redStar').css("width",index*20+'%');
    return starFlag=true;
    testSubmit();
  })
  //校验是否满足提交条件
  var testSubmit=function(){
    if(starFlag==true&&oldval!=""&&oldval.length>9) {
      $(".btn").addClass('submit');
    }else{
      $(".btn").removeClass('submit');
    }  
  }
  var testStar=function(starsAll){
    var averageStar;
    //叠加每个打分的分数
    for(i=0;i<5;i++){
      var seltstar=$(".redStars").eq(i);
      if(seltstar.hasClass('class1')){
        starsAll=starsAll+1;
      }else if(seltstar.hasClass('class2')){
        starsAll=starsAll+2;
      }else if(seltstar.hasClass('class3')){
        starsAll=starsAll+3;
      }else if(seltstar.hasClass('class4')){
        starsAll=starsAll+4;
      }else if(seltstar.hasClass('class5')){
        starsAll=starsAll+5;
      }
    }
    averageStar=starsAll/5*20;
    switch(averageStar){
      case 12:
        averageStar=10
        break;
      case 16:
        averageStar=12
        break;
      case 32:
        averageStar=30
        break;
      case 36:
        averageStar=33
        break;
      case 56:
        averageStar=54
        break;
      case 64:
        averageStar=65
        break;
      case 76:
        averageStar=75
        break;
      case 84:
        averageStar=86
        break;  
    }
    $(".redStar").css("width",averageStar+"%");
  }
})
var comments={
  uploadPic:function(){
    //初始化图片swiper
    var mySlideBox = new Swiper('.imgbox',{
      width:100,
      setWrapperSize: true,
      spaceBetween: 20
    });
     //激活关闭图片上传,计算图片数量
    var picbox = {
      picnum: function(){
        var picnum = $(".imgshow").length;
        if(picnum > 0){
          $(".picnum,.pictip").show();
        }else{
          $(".picnum,.pictip").hide();
        }
        $(".picnum,.pictip .selectpic").text(picnum);
        $(".pictip .unselectpic").text(9-picnum)
      }
    }
    //生成图片节点
    var addpic = function(that){
      var len=that.files.length;
      var filenum = $(".imgshow-box .imgshow").length;
      //判断文件类型是不是图片
      var ImgType = "gif|jpeg|jpg|bmp|png";
      if(that.files.length > 0){
        var ispic = true;
        for(var i = 0;i < that.files.length; i++){
          if(!RegExp("\.(" + ImgType + ")$", "i").test(that.files[i].name.toLowerCase())){
            common.showAlert("error","请选择图片");
            that.value = "";
            ispic = false;
            break;
          }
        }
        if(ispic){
          for(var j=0;j<len;j++){      
            if(len+filenum>9){
              common.showAlert("error","最多选择9张图片");
            }else{
              (function(j){
                var img = new Image(),
                div = document.createElement('div'),
                ii = document.createElement('i'),
                picdiv = document.createElement('div');
                ii.className = 'delete-pic';          
                div.className = 'swiper-slide imgshow';
                div.appendChild(img);
                div.appendChild(picdiv);
                div.appendChild(ii);
                $(".imgshowadd").before(div);
                //mySlideBox.prependSlide(div);
                mySlideBox.updateSlidesSize();
                picdiv.nextElementSibling.style.display = 'block';
                picdiv.style.backgroundImage = 'url(images/icon/lod1.gif)';
                picbox.picnum();
                lrz(that.files[j], {
                  width: 800
                })
                .then(function (rst) {
                  var  sourceSize = toFixed2(that.files[j].size / 1024),
                  resultSize = toFixed2(rst.fileLen / 1024),
                  scale = parseInt(100 - (resultSize / sourceSize * 100));                                 
                  img.src = rst.base64; 
                  picdiv.style.backgroundImage = 'url('+rst.base64+')';
                  if($(".imgshow-box .imgshow").length == 9){
                    mySlideBox.slideTo($(".imgshow-box .imgshow").length - 3);
                  }else{
                    mySlideBox.slideTo($(".imgshow-box .imgshow").length - 2);
                  }
                  return rst;          
                });      
              })(j)
            }
          }
        }          
      }
      if($(".imgshow").size()>8){
        $(".image-faces .upload").hide();
        $(".imgshowadd").hide();
        mySlideBox.updateSlidesSize();
      }    
    }
    document.querySelector('.uploadpic').addEventListener('change', function () {
      var that = this;
      addpic(that);
    });
    function toFixed2 (num) {
      return parseFloat(+num.toFixed(2));
    }
    //图片节点是动态生成的，所以删除图片要用on方法绑定在一个最开始就存在的父元素上
    $("body").on("click",".delete-pic",function(){
      $(this).parent().remove(); 
      $(".upload,.uploadpic").val("");
      $(".image-faces .upload,.imgshowadd").show();
      mySlideBox.updateSlidesSize();
      mySlideBox.slideTo($(".imgshow-box .imgshow").length - 2);
      picbox.picnum();
    })
  }
}