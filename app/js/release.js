/**
 * 出售发布页js
 * Created by yuyu on 2017/2/14.
 */
"use strict";
var relsForm = { 
  gwUrl: "http://test.gw.fdc.com.cn/router/rest",
  homeapiUrl:"http://test.homeapi.fdc.com.cn/router/rest",
  uploadUrl: "/homebaseapi/",
  init:function(){
    relsForm.xqName();
    relsForm.getConstant();
    //区域选择
    relsForm.districtChio();
    //装修
    relsForm.dialogChio("decorateChio","decorateSlide","decorateList");
    //产权概况
    relsForm.dialogChio("propertyChio","propertySlide","propertyList");
    //房屋类型
    relsForm.dialogChio("prTypeChio","prTypeSlide","prTypeList");
    //户型
    relsForm.houseTypeChio();
    //文本框--标题
    relsForm.relsTa("houseTitleBox","titleChio");
    //描述
    relsForm.relsTa("houseDesBox","desChio");
    //配套设施
    relsForm.relsCheck1();
    //特色标签
    relsForm.relsCheck2();
    $(".black_mask").on("click",function(){
      relsForm.hideDialog();
      $(".reg-txt").remove();
      $(".leave-box").hide();
    });
    //返回不填
    $(".f-relsBtnBack").on("click",function(){
      relsForm.formShow();
    });
    //图片上传
    relsForm.uploadPic();
    //标注
    $(".rels-row .row-ctx").click(function(){
      var row = $(this).parents(".rels-row");
      if (row.data(status) == "1") {
        return false;
      };
      $(this).parents(".rels-row").attr("data-status","1");
    });
    $(".upload-box").click(function(){
      var row = $(this);
      if (row.data(status) == "1") {
        return false;
      };
      row.attr("data-status","1");
    });
    //验证格式
    relsForm.formReg();
    //发布
    relsForm.lastBtn();
  },
  //清除报错，针对小区名输入
  clearError:function(self){
    relsForm.removeRemind(self);
    var containVal = self.find(".contain-txt"),
        iptVal = self.find(".rels-ipt");
    if(containVal){
      var defValue = containVal.data("value");
      containVal.html(defValue);
      containVal.removeClass("contain-txt");
    };
    if (iptVal) {
      iptVal.val("");
    };
    if (self.find("#districtChio")) {
      var districtChio = $("#districtChio");
      districtChio.attr("data-districtValue","");
      districtChio.attr("data-districtCode","");
      districtChio.attr("data-districtSubValue","");
      districtChio.attr("data-districtSubCode",""); 
    };
    
  },
  //联想出现
  assoShow:function(){
    relsForm.relsBoxShow("xqNameBox");
    $("#xqName").val("").focus();
    $("#relsQueryUl").html("");
  },
  //表单出现
  formShow:function(){
    $("header , footer , .secondhouse-container").show();
    $(".rels-box").hide();
  },
  relsBoxShow:function(id){
    $("header , footer , .secondhouse-container").hide();
    $("#"+id).show();
  },
  //选中下拉框的值
  clickChoi:function(ele){
    var id = ele.data("id"),
        name = $.trim($("#xqName").val()),
        districtName = ele.data("district"),
        districtSubName = ele.data("districtsub");
    $("#residentId").val(id);
    $("#districtTxt").val(districtName +" "+ districtSubName);
    relsForm.formShow();
    if(name){
      $("#residentName").html(name).addClass("contain-txt");
      var districtRow = $(".f-district"),
          addrRow = $(".f-addr"),
          xqRow = $(".f-xqname")
      districtRow.hide();
      addrRow.hide();
      relsForm.removeRemind(xqRow);
      relsForm.clearError(districtRow);
      relsForm.clearError(addrRow);
      relsForm.houseSplit();
    }
  },
  xqName:function(){
    //自动联想
    $("#xqName").on("input",function(){
      relsForm.assoName("relsQueryUl", "relsQueryUl li", "xqName", "relseQueryBox");
      $("#relsBtnClear").show();
      if (!$(this).val()) {
        $("#relsBtnClear").hide();
      };
    })
    //搜索清除按钮
    $("#relsBtnClear").on("click",function(){
      $("#xqName").val("");
      $(this).hide();
      $("#relsQueryUl").html("");
    });
    $("#residentName").on("click",function(){
      relsForm.assoShow();
    });
    //搜索确定按钮
    $("#relsBtnSure").on("click",function(){
      var thisVal = $.trim($("#xqName").val()),
          districtRow = $(".f-district"),
          addrRow = $(".f-addr"),
          xqnameRow = $(".f-xqname"),
          value = $("#residentName").data("value");  
      relsForm.formShow();
      districtRow.show();
      addrRow.show();
      relsForm.clearError(districtRow);
      relsForm.clearError(addrRow);
      relsForm.clearError(xqnameRow);
      $("#residentId").val("");
      $("#districtTxt").val("");
      $("#residentName").html(thisVal || value);
      $("#relsQueryUl li").each(function(){
        var liText = $(this).find(".name").text();
        if (liText == thisVal) {
          var _ele = $(this);
          relsForm.clickChoi(_ele);
        }
      });
      if (thisVal) {
        $("#residentName").addClass("contain-txt");
      };
      relsForm.houseSplit();
    });
  },
  // 自动联想下拉框
  assoName:function(divul, divli, input, query_div){
    /*加载下拉列表
     *query_div下拉框容器的id
     *divul下拉ul的id名
     *divli下拉li
     *input输入框的id名
     */
    $("#" + divul).empty();
    var keywords = $.trim($("#" + input).val());
    if (keywords == "" || keywords == undefined || keywords == null) {
      return false;
    };
    var rep ={
          name:keywords,
          from:"12",
          method:"homeoldapi.restful.inter.keyword.getResidential",
          Requrl:relsForm.homeapiUrl
        };
    common.jsonp(rep.method,"get",rep,function (res,success) {
      if(res[success]){
        var result = res[success].data;
        if(result.length > 0){
          var html = "";
          $.each(result, function (i,ele) {
            if (!ele.address) {
              ele.address = "";
            };
            if (!ele.districtName) {
              ele.districtName = "";
            };
            if (!ele.districtSubName) {
              ele.districtSubName = "";
            };
            html += '<li data-id="' + ele.id + '" data-district="' + ele.districtName + '" data-districtsub="' + ele.districtSubName + '">'+ 
                    '<p class="name">' + ele.residentialName + '</p>' +
                    '<p class="addr">' + ele.address + '</p>' +
                    '</li>';
          })
          if (html == "") {
            $("#" + div).hide();
            $('#' + divul).html('').hide();
            $("#choice-addr").show();
          }
          else {
            $('#' + divul).html(html);
            $('#' + divul).show();
            $("#" + query_div).show();
            //选中联想值
            $('#' + divli).bind("click", function () {
              var _ele = $(this),
                  liText = _ele.find(".name").html();
              $('#' + input).val(liText);
              $("#" + divul).empty();
              $("#" + query_div).css('display', 'none');
              relsForm.clickChoi(_ele);
            });
          }
        }
      }else{
        return;
      }
    });
  },
  //清除swiper
  hideDialog:function(){
    $(".black_mask").hide();
    $(".slide-dialog").css("visibility","hidden");
    $("body").off("touchmove");
  },
  // 显示swiper
  showDialog:function(idName){
    $("#"+idName).css("visibility","visible");
    $(".black_mask").show();
    $('body').on('touchmove', function(event) {
      event.preventDefault();
    });
  },
  //swiper1-区域
  swiper1:function(){
    var initV = $("#districtList .swiper-slide").eq(0).data("key");
    relsForm.changeDissubByDis(initV);
    //区域
    var districtList = new Swiper('#districtList', {
        direction: 'vertical',
        slidesPerView : 5,
        centeredSlides : true,
        observer: true,
        onSlideChangeEnd :function(swiper){
          var id = $("#districtList .swiper-slide-active").data("key");
          relsForm.changeDissubByDis(id);
          districtSubList.slideTo(0);
        }
    });
    //片区
    var districtSubList = new Swiper('#districtSubList', {
        direction: 'vertical',
        slidesPerView : 5,
        centeredSlides : true,
        observer: true
    }); 
  },
  swiper2:function(listId){
    var listId = new Swiper('#'+listId, {
        direction: 'vertical',
        slidesPerView : 5,
        centeredSlides : true,
        observer: true
    });
  },
  //获取参数
  getConstant:function(){
    //区域
    $.ajax({
      async: false,
      type: "get",
      data:{dictItemCode:"42_01",rank:"3",v:"1000"},
      url: relsForm.gwUrl+"?method=usmaction.inter.dict.getSonItemListsByParentItemCode",
      dataType:'jsonp',
      jsonp:'yfcallback',
      success: function(res){
        var result =  res.inter_dict_getSonItemListsByParentItemCode_response.data;
        if(result){
          releaseModel.districtList(result);
        }
        relsForm.swiper1();
      }
    });
    //装修
    $.ajax({
      async: false,
      type: "get",
      data:{dictCatCode:"decoration",rank:"3",v:"1000"},
      url: relsForm.gwUrl + "?method=usmaction.inter.dict.getDictItemByDictCatCode",
      dataType:'jsonp',
      jsonp:'yfcallback',
      success: function(res){
        var result = res.inter_dict_getDictItemByDictCatCode_response.data;
        if(result){
          releaseModel.decorateList(result);
        }
      }
    });
    //产权概况
    $.ajax({
      async: false,
      type: "get",
      data:{dictCatCode:"propertyRight",rank:"3",v:"1000"},
      url: relsForm.gwUrl + "?method=usmaction.inter.dict.getDictItemByDictCatCode",
      dataType:'jsonp',
      jsonp:'yfcallback',
      success: function(res){
        var result = res.inter_dict_getDictItemByDictCatCode_response.data;
        if(result){
          // releaseModel.prAgeList(result);
          releaseModel.propertyList(result);
        }
      }
    });
    //房屋类型
    $.ajax({
      async: false,
      type: "get",
      data:{dictCatCode:"houseSourceType",rank:"3",v:"1000"},
      url: relsForm.gwUrl + "?method=usmaction.inter.dict.getDictItemByDictCatCode",
      dataType:'jsonp',
      jsonp:'yfcallback',
      success: function(res){
        var result = res.inter_dict_getDictItemByDictCatCode_response.data;
        if(result){
          releaseModel.prTypeList(result);
        }
      }
    });
    //获取配套设施标签
    $.ajax({
      async: false,
      type: "get",
      data:{dictCatCode:"housebaseservice",rank:"3",v:"1000"},
      url: relsForm.gwUrl + "?method=usmaction.inter.dict.getDictItemByDictCatCode",
      dataType:'jsonp',
      jsonp:'yfcallback',
      success: function(res){
        var result = res.inter_dict_getDictItemByDictCatCode_response.data;
        if(result){       
          releaseModel.facilitiesList(result);
        }
      }
    });
    //获取房源特色
    $.ajax({
      async: false,
      type: "get",
      data:{dictCatCode:"sourcespecial",rank:"3",v:"1000"},
      url: relsForm.gwUrl + "?method=usmaction.inter.dict.getDictItemByDictCatCode",
      dataType:'jsonp',
      jsonp:'yfcallback',
      success: function(res){
        var result = res.inter_dict_getDictItemByDictCatCode_response.data;
        if(result){          
          releaseModel.specialList(result);
        }
      }
    });
  },
  //根据地区加载片区
  changeDissubByDis : function(districtId){
    $.ajax({
      async: false,
      type: "get",
      data:{dictItemCode:districtId,rank:"4",v:"1000"},
      url: relsForm.gwUrl+"?method=usmaction.inter.dict.getSonItemListsByParentItemCode",
      dataType:'jsonp',
      jsonp:'yfcallback',
      success: function(res){
        var result = res.inter_dict_getSonItemListsByParentItemCode_response.data;
        if(result){
          result = result.reverse();
          releaseModel.districtSubList(result);
        }
      }
    });
  },
  //区域的选择
  districtChio:function(){
    $("#districtSlide .btn-sure").on("touchend",function(event){
      var district = $("#districtList .swiper-slide-active"),
          districtCode = district.data("key"),
          districtValue = district.html(),
          districtSub = $("#districtSubList .swiper-slide-active"),
          districtSubCode = districtSub.data("key"),
          districtSubValue = districtSub.html(),
          districtChio = $("#districtChio");
      districtChio.attr("data-districtValue",districtValue);
      districtChio.attr("data-districtCode",districtCode);
      districtChio.attr("data-districtSubValue",districtSubValue);
      districtChio.attr("data-districtSubCode",districtSubCode);
      districtChio.html(districtValue + " " + districtSubValue);
      relsForm.hideDialog();
      districtChio.addClass("contain-txt");
      relsForm.houseSplit();
      event.preventDefault();
    })
    $("#districtChio").on("click",function(){
      relsForm.showDialog("districtSlide");
      var ele = $(this),
          html = ele.html(),
          defValue = ele.data("value");
      //为空
      if (html == defValue) {
        relsForm.swiper1();
      }
    })
  },
  /*
   *swiper选择
   *rowChio row外围dd绑定的id
   *diaslide 弹框swiper的id
   *list content的列表id
   */
  dialogChio:function(rowChio , diaslide , list){
    $("#"+ diaslide + " .btn-sure").on("touchend",function(event){
      var active = $("#"+ list +" .swiper-slide-active"),
          activeCode = active.data("key"),
          activeValue = active.html(),
          activeChio = $("#"+rowChio),
          row = $("#"+rowChio).parent(".rels-row");
      activeChio.attr("data-key",activeCode).html(activeValue);
      relsForm.hideDialog();
      activeChio.addClass("contain-txt");
      relsForm.removeRemind(row);
      event.preventDefault();
    })
    $("#"+rowChio).on("click",function(){
      relsForm.showDialog(diaslide);
      var ele = $(this),
          html = ele.html(),
          defValue = ele.data("value");
      //为空
      if (html == defValue) {
        relsForm.swiper2(list);
      }
    })
  },
  /*
   *swiper选择--------户型
   */
  houseTypeChio:function(){
    function init(){
      relsForm.swiper2("roomList");
      relsForm.swiper2("hallList");
      relsForm.swiper2("toiletList");
    }
    init();
    $("#houseTypeSlide .btn-sure").on("touchend",function(event){
      var active1 = $("#roomList .swiper-slide-active"),
          active2 = $("#hallList .swiper-slide-active"),
          active3 = $("#toiletList .swiper-slide-active"),
          active1Value = active1.html(),
          active2Value = active2.html(),
          active3Value = active3.html(),
          activeChio = $("#houseTypeChio"),
          row = $(".f-htype");
      activeChio.html(active1Value + "室" + active2Value + "厅" + active3Value + "卫");
      relsForm.hideDialog();
      activeChio.addClass("contain-txt");
      relsForm.removeRemind(row);
      activeChio.attr("data-s",active1Value);
      activeChio.attr("data-t",active2Value);
      activeChio.attr("data-w",active3Value);
      relsForm.houseSplit();
      event.preventDefault();
    })
    $("#houseTypeChio").on("click",function(){
      relsForm.showDialog("houseTypeSlide");
      $("#houseTypeSlide").css("visibility","visible")
      var ele = $(this),
          html = ele.html(),
          defValue = ele.data("value");
      //为空
      if (html == defValue) {
        init();
      }
    })
  },
  // 文本匡
  relsTa:function(boxId , chioId){
    var taId = $("#"+boxId+" .ta-ctx"),
        chioId = $("#"+chioId),
        row = chioId.parent(".rels-row");
    chioId.on("click",function(){
      relsForm.relsBoxShow(boxId);
      var ele = $(this),
          htmlctx = ele.html(),
          defValue = ele.data("value");
      //为空
      if (htmlctx == defValue) {
        taId.val("");
        $(".f-count").html("0");
      }else{
        taId.val(htmlctx);
        var length = htmlctx.length;
        $(".f-count").html(length);
      }
    })
    $("#"+boxId+" .confirm").on("click",function(){
      var val = taId.val(),
          defValue = chioId.data("value");
      if (val) {
        chioId.html(val).addClass("contain-txt");
      }else{
        chioId.html(defValue).removeClass("contain-txt")
      }
      relsForm.formShow();
      relsForm.removeRemind(row);
    })
    taId.on("input",function(){
      var length = $(this).val().length;
      $(".f-count").html(length);
    })
  },
  //check---配套设施
  relsCheck1:function(){
    $("#supperChio").on("click",function(){
      relsForm.relsBoxShow("supportBox")
    });
    $("#supportBtn").on("click",function(){
      releaseModel.houseLabel([]);
      relsForm.formShow();
      var checkedLabel = $("#supportBox .rels-checkbox:checked"),
          ctx = "";
      //为空
      if (checkedLabel.length == "0") {
        var defValue = $("#supperChio").data("value");
        $("#supperChio").html(defValue).removeClass("contain-txt");
        releaseModel.houseLabel([]);
      }else{
        checkedLabel.each(function(){
          var curLabel = $(this).siblings(".txt");
          ctx += curLabel.html() + ",";
          releaseModel.houseLabel.push({
            id:curLabel.data('key'),
            labelDesc:$.trim(curLabel.text()),
            labelType:curLabel.data('name')
          })
        });
        $("#supperChio").html(ctx).addClass("contain-txt");
      }
    });
  },
  //check---房源特色
  relsCheck2:function(){
    $("#specialChio").on("click",function(){
      relsForm.relsBoxShow("specialBox")
    });
    $("#specialBtn").on("click",function(){
      releaseModel.specialLabel([]);
      relsForm.formShow();
      var checkedLabel = $("#specialBox .rels-checkbox:checked"),
          ctx = "";
      //为空
      if (checkedLabel.length == "0") {
        var defValue = $("#specialChio").data("value");
        $("#specialChio").html(defValue).removeClass("contain-txt");
        releaseModel.specialLabel([]);
      }else{
        checkedLabel.each(function(){
          var curLabel = $(this).siblings(".txt");
          ctx += curLabel.html() + ",";
          releaseModel.specialLabel.push({
            id:curLabel.data('key'),
            labelDesc:$.trim(curLabel.text()),
            labelType:curLabel.data('name')
          })
        });
        $("#specialChio").html(ctx).addClass("contain-txt");
      }
    });
    $("#specialBox .rels-check").on("click",function(){
      var checkedLabel = $("#specialBox .rels-checkbox:checked");
      if (checkedLabel.length == "4") {
        $("body").append('<div class="reg-txt">最多选择3个标签</div>');
        $(".black_mask").show();
        setTimeout(function(){
          $(".reg-txt").remove();
          $(".black_mask").hide();
        },2000)
        relsForm.screenError("最多选择3个标签");
        return false;
      }; 
    });
  },
  //全屏报错
  screenError:function(msg,time){
    var time = time || 2000;
    $("body").append('<div class="reg-txt">'+msg+'</div>');
    $(".black_mask").show();
    setTimeout(function(){
      $(".reg-txt").remove();
      $(".black_mask").hide();
    },time);
  },
  uploadPic:function(){
    //删除
    $("body").on("click",".upload-img .close",function(){
      $(this).parent(".upload-img").remove();
      $(".upload-input").get(0).value = '';
      var uploadNum = $("#uploadNum"),
          uploadEd = $("#uploadBox .upload-img").length;
      if (uploadEd == 0) {
        uploadNum.hide();
      };
      uploadNum.find(".num1").text(uploadEd);
      uploadNum.find(".num2").text(9-uploadEd);
    });
    //上传
    $(".upload-input").on("change",function(){
      var uploadEd = $("#uploadBox .upload-img").length,
          maxlength = parseInt(uploadEd + this.files.length);
      if (maxlength > 9) {
        relsForm.screenError("最多上传9张图片");
        return false;
      };
      for(var i=0;i<this.files.length;i++){　
        var reader = new FileReader();
        reader.readAsDataURL(this.files[i]);
        reader.onload = function(e){
          var img = '<div class="upload-img">'+
                      '<em class="close"></em>'+
                      '<img class="pic" src="'+ e.target.result +'">'+
                      '<div class="load"></div>'+
                    '</div>';
          $(".upload-btn").before(img);
        };
        reader.onloadend = function(e){
          // 图片上传接口start
          var method = "homebaseapi.restful.inter.imgupload",
              imgLength = $("#uploadBox .upload-img").length,
              targetImg =$("#uploadBox .upload-img").eq(imgLength-1),
              dataSrc = targetImg.find("img").attr("src");
          $.ajax({
            async: true,
            type: "post",
            data: {
                    method:method,
                    data:dataSrc,
                    v:"1000"
                  },
            url:relsForm.uploadUrl+method,
            success: function(res){
              var result = JSON.parse(res).restful_inter_imgupload_response;
              if(result){
                targetImg.attr("data-src",result.data);
                targetImg.find(".load").remove();
              }
            }
          });
          // 图片上传接口end
          var uploadNum = $("#uploadNum");
          uploadNum.show();
          uploadNum.find(".num1").text(imgLength);
          uploadNum.find(".num2").text(9-imgLength);
        }
      };
    });
  },
  //增加报错
  addRemind:function(rowName,msg){
    rowName.append('<div class="txt-error">'+msg+'</div>');
    rowName.addClass("reg-error");
  },
  //清除报错
  removeRemind:function(rowName){
    rowName.find(".txt-error").remove();
    rowName.removeClass("reg-error");
  },
  //限制汉字长度
  limitNum:function(value,minlength,maxlength,rowName){
    var illegalReg = /<[a-zA-Z]/;
    if (illegalReg.test(value)){
      relsForm.removeRemind(rowName);
      relsForm.addRemind(rowName,"请勿输入非法字符");
      return false;
    };
    var objLength = value.length;
    if (objLength > maxlength || objLength < minlength) {
      relsForm.removeRemind(rowName);
      relsForm.addRemind(rowName,"请输入"+minlength+"~"+maxlength+"字以内！");
      return false;
    }else{
      relsForm.removeRemind(rowName);
    }
  },
  //检查是否两位小数或整数
  checkNumDec:function(value,rowName,maxNum){
    if (value) { 
      relsForm.removeRemind(rowName);
      var NumReg = /^[0-9](\.\d{1,2})?$|^[1-9]\d+(\.\d{1,2})?$/;
      if (!NumReg.test(value)||value<=0) { 
        relsForm.addRemind(rowName,"请输入大于0的整数或两位小数"); 
        return false;
      }else if(value>=maxNum){
        relsForm.addRemind(rowName,"请输入小于"+maxNum+"的整数或两位小数"); 
        return false;
      }
    }else{
      relsForm.removeRemind(rowName);
      relsForm.addRemind(rowName,"不能为空");
    }
  },
  formReg:function(){
    //小区地址
    $("#xqAddr").blur(function(){
      var _ele = $.trim($(this).val()),
          row = $(".f-addr");
      if (!_ele) {
        relsForm.addRemind(row,"不能为空")
      }else{
        relsForm.limitNum(_ele,1,50,row);
      }
    });
    //建筑面积
    $("#xqArea").blur(function(){
      var _ele = $.trim($(this).val()),
          row = $(".f-area");
      relsForm.checkNumDec(_ele,row,100000);
      relsForm.houseSplit();
    });
    //小区售价
    $("#xqPrice").blur(function(){
      var _ele = $.trim($(this).val()),
          row = $(".f-price");
      relsForm.checkNumDec(_ele,row,100000);
      relsForm.houseSplit();
    });
    //联系人
    $("#contactName").blur(function(){
      var _ele = $.trim($(this).val()),
          row = $(this).parents(".rels-row");
      relsForm.removeRemind(row);
      if (!_ele) {
        relsForm.addRemind(row,"不能为空")
      }else{
        relsForm.limitNum(_ele,2,6,row);
      }
    });
    //手机号
    $("#contactPhone").blur(function(){
      var _ele = $.trim($(this).val()),
          row = $(this).parents(".rels-row");
      relsForm.removeRemind(row);
      if (!_ele) {
        relsForm.addRemind(row,"不能为空")
      }else{
        var reg = /^1[345789]\d{9}$/;
        if (!reg.test(_ele)) {
          relsForm.addRemind(row,"请输入正确手机号码");
        }else{
          relsForm.removeRemind(row);
        }
      };
    })
    //楼层
    $("#curFlor , #totalFlor").focus(function(){
      $(this).attr("clicked","1");
    })
    $("#curFlor , #totalFlor").on("blur",function(){
      $("#florBox .txt-error").remove();
      var _ele = $(this),
          row = $("#florBox"),
          florCurNumV = parseInt($("#curFlor").val().trim()),
          florTatalNumV = parseInt($("#totalFlor").val().trim())
      row.addClass("reg-error");
      var error1,error2,errorMain,
          numReg = /^[1-9]\d*$/,
          idName = _ele.attr("id");
      function checkflor(idName,word){
        var errorTxt,
            iptVal = $("#" + idName).val().trim();
        if (!numReg.test(iptVal) || iptVal == "") {
          errorTxt = word + "，请输入整数"
        }else if (iptVal > 100) {
          errorTxt = word + "，数值不能超过100"
        }else{
          errorTxt = "";
          row.removeClass("reg-error");
        }
        return errorTxt;
      }
      switch(idName){
        case "curFlor":
          if ($("#totalFlor").attr("clicked") == "1") {
            error2 = checkflor("totalFlor","总楼层");
          };
          error1 = checkflor("curFlor","当前所在楼层");
          break;
        case "totalFlor":
          if ($("#curFlor").attr("clicked") == "1") {
            error1 = checkflor("curFlor","当前所在楼层");
          }
          error2 = checkflor("totalFlor","总楼层");
          break;
      };
      errorMain = error1 || error2;
      if (errorMain) {
        relsForm.addRemind(row,errorMain); 
      }else if(florCurNumV > florTatalNumV){
        row.addClass("reg-error");
        relsForm.addRemind(row,"所在楼层数不能大于总楼层数");
      }
    })
  },
  canSubmit:function(){
    var flag1 = true,//是否不为空情况--输入框
        flag2 = true,//是否不为空情况--选择匡
        flag3 = true,//出现提示语的个数情况
        flag,//是否可以提交的状态
        errorSize = $("#allForm .reg-error").size();//报错边框的个数
    $("#allForm .required").each(function(){
      if (!($(this).css("display") == "none")) {
        var _ele = $(this),
          iptDom = _ele.find(".rels-ipt"),
          iptVal = $.trim(iptDom.val()),
          txtDom = _ele.find(".txt-remind"),
          txtVal = txtDom.text(),
          defVal = txtDom.data("value");
        if(!iptVal && (iptDom.length>0)){
          relsForm.removeRemind(_ele);
          relsForm.addRemind(_ele,"不能为空");
          flag1 = false;
        }
        if( (txtVal == defVal) && (txtDom.length>0)){
          relsForm.removeRemind(_ele);
          relsForm.addRemind(_ele,"不能为空");
          flag2 = false;
        }
      };
      
    });
    if (errorSize>0) {
      flag3 = false;
    }
    flag = flag1 && flag2 && flag3;
    return flag;
  },
  submitForm:function(residentialId){
    var imgSrcs = [];
    $('#uploadBox .upload-img').each(function(){
      imgSrcs.push($(this).data('src'));
    })
    var params = {
      //用户id
      userid:uc_cookie.Get("uc_userInfo") || "",
      //图片
      imgSrcs:imgSrcs,
      //小区id
      residentialId:residentialId,
      // 小区名称
      residentialName:$("#residentName").text(),
      // 区域
      district:$("#districtChio").data("districtcode"),
      // 区域描述
      districtDesc:$("#districtChio").data("districtvalue"),
      // 片区
      districtSub:$("#districtChio").data("districtsubcode"),
      // 片区描述
      districtSubDesc:$("#districtChio").data("districtsubvalue"),
      // 地址详细描述
      houseAddress:$("#xqAddr").val(),
      // 室
      room:$("#houseTypeChio").data("s"),
      // 厅
      hall:$("#houseTypeChio").data("t"),
      // 卫
      toilet:$("#houseTypeChio").data("w"),
      // 面积
      acreage:$("#xqArea").val(),
      // 总价
      totalPrice:$("#xqPrice").val(),
      // 产权概况
      prSituation:$("#propertyChio").data("key"),
      // 产权概况描述
      prSituationDesc:$("#propertyChio").text(),
      // 所在楼层
      currentFloorNum:$("#curFlor").val(),
      // 总楼层
      totalFloorNum:$("#totalFlor").val(),
      // 房源标题
      houseTitle:$("#titleChio").text(),
      // 房源类型
      houseType:$("#prTypeChio").data("key"),
      // 房源类型
      houseTypeDesc:($("#prTypeChio").data("key"))?$("#prTypeChio").text():"",
      //装修类型
      decorateType:$("#decorateChio").data("key"),
      //装修类型描述
      decorateTypeDesc:$("#decorateChio").text(),
      // 配套设施
      houseLabel:JSON.stringify(releaseModel.houseLabel()),
      // 特色标签
      houseSpecial:JSON.stringify(releaseModel.specialLabel()),
      // 详细描述
      houseDetailDesc:$("#houseDesBox .ta-ctx").val(),
      // 联系人
      contact:$.trim($("#contactName").val()),
      // 房源联系人电话号码
      contactPhone:$.trim($("#contactPhone").val()),
      //联系人是否隐藏
      contractHidden:0,
      //时间戳
      recordTime: new Date().getTime()
    };
    params.publishState = "1";
    params.publishStateDesc = "未发布";
    params.businessType = "1";
    params.businessTypeDesc = "出售";
    params.auditState = "1";
    params.auditStateDesc = "未审核";
    params.recordState = "1";
    params.recordStateDesc = "首次录入";
    params.infoFromType = "1";
    params.infoFromTypeDesc = "个人";
    params.method = "homebaseapi.restful.inter.housesource.addForPC";
    $.ajax({
      async:false,
      type: "post",
      url: relsForm.uploadUrl + params.method,
      data: params,  
      success: function(res){
        var result = JSON.parse(res)["restful_inter_housesource_addForPC_response"];
        if(result && result.data == 1){
          $(".success-box").show();
          $("#allForm").hide();         
        }else{
          relsForm.screenError("操作失败，请稍后再试");
        }
      },
      error: function(res){
        relsForm.screenError("操作失败，请稍后再试"); 
      }
    });
  },
  lastBtn:function(){
    //提交
    $("#btnRels").on("click",function(){
      var _ele = $(this);
      if (!relsForm.canSubmit()) {
        return false;
      };
      $(".loading-box").show();
      if (_ele.attr("disabled") == "disabled") {
        relsForm.screenError("请勿重复提交");
      };
      _ele.attr("disabled","disabled");
      var rep ={
        phoneNum:$.trim($("#contactPhone").val()),
        method:"homebaseapi.restful.inter.blacklist.getByPhone",
        Requrl:relsForm.homeapiUrl
      };
      common.jsonp(rep.method,"get",rep,function (res,success) {
        if (res[success] && (res[success].data == 1)) {
          relsForm.screenError("很遗憾，您的手机号码不允许发布房源信息，如有疑问，请拨打85707866联系我们的客服人员。","6000"); 
        }else{
          var residentId = $("#residentId").val();
          if (residentId) {
            relsForm.submitForm(residentId);
          }else{
            //添加未入库房源start
            $("#residentId").val("");
            var infocol = "[{'id':'12','value':'二手房'}]",
                mainId = $("#districtChio");
            var residentialReq = {
              residentialName:$("#residentName").text(),
              address:$("#xqAddr").val(),
              districtName:mainId.data("districtvalue"),
              districtSubName:mainId.data("districtsubvalue"),
              districtId:mainId.data("districtcode"),
              districtSubId:mainId.data("districtsubcode"),
              recordSource:"YF_FRONT",
              source:"个人发布",
              Requrl:relsForm.homeapiUrl,
              residentialInfocol:infocol
            }
            common.jsonp("homebaseapi.restful.inter.residentialinfo.add","get",residentialReq,function (res,success) {
              if(res[success]){
                var id = res[success].id;
                $("#residentId").val(id);
                relsForm.submitForm(id);
              } else if (res['error_response']  && res['error_response'].sub_code == 'name.exist') {
                relsForm.screenError("该小区名已存在，请在下拉框中选中该小区!");
              } else{
                relsForm.screenError("操作失败，请稍后再试");
              }
            });   
            //添加未入库房源end
          }
        }
        $(".loading-box").hide();
        _ele.attr("disabled",false);
      })
    });
    //退出
    $("#relsBack").click(function(){
      var clickStatus = $(".rels-row").data("status"),
          picStatus = $(".upload-box").data("status");
      if (clickStatus || picStatus) {
        $(".leave-box").show();
        $(".black_mask").show();
        return false;
      };
    });
    $("#btnGo").click(function(){
      window.location.href = defaultURL;
    })
    $("#btnStay , #leaveIcon").click(function(){
      $(".black_mask").hide();
      $(".leave-box").hide();
      return false;
    })
  },
  //标题拼接
  houseSplit:function(){
    //小区名
    var residentNameId = $("#residentName"),
        residentName = residentNameId.text();
    if (residentName == residentNameId.data("value")) {
      residentName = ""
    };
    //片区区域
    var districtChio = $("#districtChio"),
        chioDis = districtChio.text();
    if (chioDis == $("#districtChio").data("value")) {
      chioDis = ""
    };
    chioDis = $("#districtTxt").val() || chioDis;
    //户型
    var houseTypeChio = $("#houseTypeChio"),
        houseType = houseTypeChio.text();
    if (houseType == houseTypeChio.data("value")) {
      houseType = ""
    };
    //面积
    var xqArea = $("#xqArea").val();
    if (xqArea) {
      xqArea += "㎡";
    };
    if(chioDis || residentName || houseType || xqArea){
      var targetTit = chioDis + " " + residentName + " " + houseType + " " + xqArea;
      var row = $("#titleChio").parents(".rels-row");
      relsForm.removeRemind(row)
      $("#titleChio").text(targetTit).addClass("contain-txt");
    }
  }
}

relsForm.init();